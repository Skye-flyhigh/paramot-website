'use server';

import { ContactFormState } from '../types/contactForm';
import { ContactDataSchema } from '../validation/contactForm';

export default async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const formValues = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };

  const validation = ContactDataSchema.safeParse(formValues);
  if (!validation.success) {
    // Convert Zod errors to our error format
    const fieldErrors: Record<string, string> = {};
    validation.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
    });

    return {
      ...prevState,
      errors: fieldErrors,
      success: false,
    };
  }

  const data = validation.data;

  try {
    console.warn('Contact form submitted:', data); // TODO: clean the console warn

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would typically handle the form submission,
    // e.g., by sending the data to a database or an email service.
    // For now, we'll just simulate success

    return {
      formData: {
        name: '',
        email: '',
        message: '',
      },
      errors: {},
      success: true,
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      ...prevState,
      errors: {
        ...prevState.errors,
        general: 'Something went wrong. Please try again later.',
      },
      success: false,
    };
  }
}
