'use server';

import z from 'zod';

import {
  equipmentFormSchema,
  EquipmentPickerFormState,
  EquipmentType,
} from '../validation/equipmentSchema';
import { ensureCustomer } from '../security/auth-check';

export default async function submitEquipmentForm(
  prevState: EquipmentPickerFormState,
  data: FormData,
): Promise<EquipmentPickerFormState> {
  const authResult = await ensureCustomer();

  if (!authResult.authorized) {
    return {
      ...prevState,
      errors: { general: authResult.error },
      success: false,
    };
  }

  try {
    // ✅ STEP 3: Parse and validate the form data with Zod
    const validatedData = equipmentFormSchema.parse(data);

    console.warn('✅ Validated equipment data:', validatedData); //TODO: clean the console warn

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Check database first for existence of the equipment
    // TODO: 💾 Save to database and link to customer
    // const newEquipment = await prisma.equipment.create({
    //   data: {
    //     manufacturer: validatedData.manufacturer,
    //     model: validatedData.model,
    //     size: validatedData.size,
    //     type: validatedData.type as EquipmentType,
    //     serialNumber: validatedData.serialNumber || `AUTO-${Date.now()}`,
    //     status: 'active',
    //   }
    // });
    //
    // // Link equipment to customer
    // await prisma.customerEquipment.create({
    //   data: {
    //     customerId: customer.id, // ← From authenticated session!
    //     equipmentId: newEquipment.id,
    //     ownedSince: new Date(),
    //     ownedUntil: null, // Still owns it
    //   }
    // });

    return {
      formData: {
        manufacturer: validatedData.manufacturer,
        model: validatedData.model,
        size: validatedData.size,
        serialNumber: validatedData.serialNumber || '',
        type: validatedData.type as EquipmentType,
      },
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
        formData: {
          manufacturer: (data.get('manufacturer') as string) || '',
          model: (data.get('model') as string) || '',
          size: (data.get('size') as string) || '',
          serialNumber: (data.get('serialNumber') as string) || '',
          type: (data.get('type') as EquipmentType) || 'glider',
        },
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
