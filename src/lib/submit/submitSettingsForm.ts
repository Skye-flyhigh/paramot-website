'use server';

// Types for the settings form
export interface SettingsFormData {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  county: string;
  postcode: string;
}

export interface SettingsFormErrors {
  general?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  street?: string;
  city?: string;
  postcode?: string;
}

export interface SettingsFormState {
  formData?: SettingsFormData;
  errors?: SettingsFormErrors;
  success: boolean;
}

export default async function submitSettingsForm(
  prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  // TODO: Implement
  // 1. Get authenticated customer (use ensureCustomer or similar)
  // 2. Validate form data with Zod
  // 3. Update Customer record (firstName, lastName, phone)
  // 4. Upsert Address record (create if doesn't exist, update if does)
  // 5. Return success or errors

  const data: SettingsFormData = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    phone: formData.get('phone') as string,
    street: formData.get('street') as string,
    city: formData.get('city') as string,
    county: formData.get('county') as string,
    postcode: formData.get('postcode') as string,
  };

  console.log('Settings form submitted:', data);

  // Placeholder - replace with actual implementation
  return {
    formData: data,
    errors: {},
    success: true,
  };
}
