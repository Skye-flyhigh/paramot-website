export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormState {
  formData: ContactFormData;
  errors: Record<string, string>;
  success: boolean;
}
