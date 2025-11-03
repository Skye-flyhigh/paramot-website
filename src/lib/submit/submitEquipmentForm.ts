'use server';

import { EquipmentPickerFormState } from '@/components/dashboard/EquipmentPicker';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

// Define the schema for equipment form validation
const equipmentFormSchema = zfd.formData({
  manufacturer: zfd.text(z.string().min(1, 'Manufacturer is required')),
  model: zfd.text(z.string().min(1, 'Model is required')),
  size: zfd.text(z.string().min(1, 'Size is required').max(10, 'Size too long')),
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
  try {
    // Parse and validate the form data with Zod
    const validatedData = equipmentFormSchema.parse(data);

    console.log('✅ Validated equipment data:', validatedData);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Save to database
    // await mockDatabase.equipment.create(validatedData);

    return {
      formData: {
        manufacturer: '',
        model: '',
        size: '',
        serialNumber: '',
      },
      errors: {},
      success: true,
    };
  } catch (error) {
    console.error('Error submitting equipment form:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};

      error.errors.forEach((err) => {
        const fieldName = err.path[0] as string;
        fieldErrors[fieldName] = err.message;
      });

      return {
        formData: {
          manufacturer: (data.get('manufacturer') as string) || '',
          model: (data.get('model') as string) || '',
          size: (data.get('size') as string) || '',
          serialNumber: (data.get('serialNumber') as string) || '',
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
