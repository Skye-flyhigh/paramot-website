'use server';

import { EquipmentPickerFormState } from '@/components/dashboard/EquipmentPicker';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { EquipmentType } from '../schema';
import { auth } from '@/auth';
import { getCustomerByEmail } from '../mockData';

// Define the schema for equipment form validation
const equipmentFormSchema = zfd.formData({
  manufacturer: zfd.text(z.string().min(1, 'Manufacturer is required')),
  model: zfd.text(z.string().min(1, 'Model is required')),
  size: zfd.text(z.string().min(1, 'Size is required').max(3, 'Size too long')),
  type: zfd.text(z.string().min(1, 'Type is required')),
  serialNumber: zfd.text(z.string().optional()),

  // Examples of other zfd types you can use:
  // checkbox: zfd.checkbox(), // boolean from checkbox
  // number: zfd.numeric(z.number().positive()), // converts string to number
  // date: zfd.text(z.string().datetime()), // validate date strings
  // file: zfd.file(z.instanceof(File)), // file uploads
  // repeatable: zfd.repeatable(), // arrays from multiple inputs with same name
});

export default async function submitEquipmentForm(
  prevState: EquipmentPickerFormState,
  data: FormData,
): Promise<EquipmentPickerFormState> {
  // ✅ STEP 1: Authentication check - verify user is logged in
  // Equipment is added through customer dashboard, so must be authenticated
  const session = await auth();
  if (!session?.user?.email) {
    return {
      formData: prevState.formData,
      errors: {
        general: '🔒 Unauthorized: You must be logged in to add equipment',
      },
      success: false,
    };
  }

  // ✅ STEP 2: Verify customer exists
  const customer = getCustomerByEmail(session.user.email);
  if (!customer) {
    return {
      formData: prevState.formData,
      errors: {
        general: '❌ Customer account not found',
      },
      success: false,
    };
  }

  try {
    // ✅ STEP 3: Parse and validate the form data with Zod
    const validatedData = equipmentFormSchema.parse(data);

    console.warn('✅ Validated equipment data:', validatedData); //TODO: clean the console warn

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
