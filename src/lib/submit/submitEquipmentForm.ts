'use server';

import z from 'zod';

import {
  checkCustomerOwnsEquipment,
  createEquipment,
  findEquipmentBySerialNumber,
  linkEquipmentToCustomer,
} from '../db';
import { ensureCustomer } from '../security/auth-check';
import {
  equipmentFormSchema,
  EquipmentPickerFormState,
  EquipmentType,
} from '../validation/equipmentSchema';

export default async function submitEquipmentForm(
  prevState: EquipmentPickerFormState,
  formData: FormData,
): Promise<EquipmentPickerFormState> {
  const authResult = await ensureCustomer();

  if (!authResult.authorized) {
    return {
      ...prevState,
      errors: { general: authResult.error },
      success: false,
    };
  }

  const rawData = Object.fromEntries(formData);

  try {
    // ✅ STEP 3: Parse and validate the form data with Zod
    const { data, error, success } = equipmentFormSchema.safeParse(rawData);

    if (!success || error) {
      const formattedError = z.prettifyError(error) || 'Error in validating data';

      return { ...prevState, errors: { general: formattedError }, success: false };
    }
    const customer = authResult.customer;
    let equipment;

    // Check if equipment already exists (by serial number)
    if (data.serialNumber) {
      const existingEquipment = await findEquipmentBySerialNumber(data.serialNumber);

      if (existingEquipment) {
        // Equipment exists - check if customer already owns it
        const alreadyOwns = await checkCustomerOwnsEquipment(
          customer.id,
          existingEquipment.id,
        );

        if (alreadyOwns) {
          return {
            formData: data,
            equipmentId: existingEquipment.id, // Already owned - use existing ID
            errors: {},
            success: true,
          };
        }

        // Link existing equipment to customer
        equipment = existingEquipment;
      }
    }

    // Create new equipment if not found
    if (!equipment) {
      equipment = await createEquipment(data);
    }

    // Link equipment to customer
    console.log('[Debug] Linking equipment:', {
      equipmentId: equipment.id,
      customerId: customer.id,
      serialNumber: equipment.serialNumber,
    });
    await linkEquipmentToCustomer(
      equipment.id,
      customer.id,
      equipment.serialNumber ?? `temp-${equipment.id}`,
    );

    return {
      formData: {
        manufacturer: data.manufacturer,
        model: data.model,
        size: data.size,
        serialNumber: equipment.serialNumber || '',
        type: data.type as EquipmentType,
      },
      equipmentId: equipment.id, // Real DB ID for booking flow
      errors: {},
      success: true,
    };
  } catch (error) {
    console.error('Error submitting equipment form:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};

      error.issues.forEach((err) => {
        const fieldName = err.path[0] as string;

        fieldErrors[fieldName] = err.message;
      });

      return {
        formData: prevState.formData,
        errors: fieldErrors,
        success: false,
      };
    }

    // Handle other errors
    return {
      ...prevState,
      errors: {
        general: 'Failed to submit equipment form',
      },
      success: false,
    };
  }
}
