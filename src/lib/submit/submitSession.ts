'use server';

import { redirect } from 'next/navigation';

import { ensureTechnician } from '../security/workshop-auth';
import { createServiceSession } from '../db/sessions';
import { findGliderSizeBySpec } from '../db/reference';
import { findEquipmentById, createEquipment } from '../db/equipment';
import {
  sessionCreateSchema,
  type SessionCreateFormState,
} from '../validation/sessionSchema';

export async function submitSessionCreate(
  prevState: SessionCreateFormState,
  formData: FormData,
): Promise<SessionCreateFormState> {
  const auth = await ensureTechnician();

  if (!auth.authorized) {
    return { errors: { general: 'Not authorized' }, success: false };
  }

  const raw = Object.fromEntries(formData);

  // Handle serviceTypes as array from multiple checkboxes
  const serviceTypes = formData.getAll('serviceTypes').map(String);

  const parsed = sessionCreateSchema.safeParse({
    ...raw,
    serviceTypes,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0] as string;

      fieldErrors[key] = issue.message;
    });

    return { errors: fieldErrors, success: false };
  }

  const data = parsed.data;

  let equipmentId: string;
  let manufacturer: string;
  let model: string;
  let size: string;

  if (data.equipmentId) {
    // Existing equipment — verify it exists
    const equipment = await findEquipmentById(data.equipmentId);

    if (!equipment) {
      return { errors: { equipmentId: 'Equipment not found' }, success: false };
    }

    equipmentId = equipment.id;
    manufacturer = equipment.manufacturer;
    model = equipment.model;
    size = equipment.size;
  } else {
    // Manual entry — create equipment record
    const equipment = await createEquipment({
      serialNumber: data.serialNumber || null,
      type: data.equipmentType,
      manufacturer: data.manualManufacturer!,
      model: data.manualModel!,
      size: data.manualSize!,
    });

    equipmentId = equipment.id;
    manufacturer = equipment.manufacturer;
    model = equipment.model;
    size = equipment.size;
  }

  // Try to auto-link glider reference data
  let gliderSizeId: string | undefined;

  if (data.equipmentType === 'GLIDER') {
    const gliderSize = await findGliderSizeBySpec(manufacturer, model, size);

    if (gliderSize) {
      gliderSizeId = gliderSize.id;
    }
  }

  // Find linked service record if provided
  const serviceRecordId = data.serviceRecordId || undefined;

  const session = await createServiceSession({
    equipmentId,
    serviceRecordId,
    gliderSizeId,
    equipmentType: data.equipmentType,
    serialNumber: data.serialNumber || undefined,
    productionDate: data.productionDate || undefined,
    serviceTypes: data.serviceTypes,
    measureMethod: data.measureMethod,
    technician: auth.email,
    statedHours: data.statedHours,
    lastInspection: data.lastInspection ? new Date(data.lastInspection) : undefined,
    hoursSinceLast: data.hoursSinceLast,
    clientObservations: data.clientObservations,
  });

  redirect(`/workshop/session/${session.id}`);
}
