'use server';

import z from 'zod';
import { BUSINESS } from '../metadata.const';
import sendEmail, { Email } from '../services/user-mailing';
import { ContactDataSchema, ContactFormState } from '../validation/contactForm';

export default async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (!formData)
    return { ...prevState, errors: { general: 'Missing data' }, success: false };

  const rawFormData = Object.fromEntries(formData);

  //Zod validation and HTML sanitation
  const { data, success, error } = ContactDataSchema.safeParse(rawFormData);

  if (!success) {
    const fieldErrors = z.prettifyError(error) || 'Error in validating data';

    return {
      ...prevState,
      errors: { general: fieldErrors },
      success: false,
    };
  }

  try {
    // Define the subject of the request

    let emailSubject;

    switch (data.variant) {
      case 'contact':
        emailSubject = 'New contact request';
        break;
      case 'feedback':
        emailSubject = 'New feedback';
        break;
      case 'equipment':
        emailSubject = data.equipmentContext
          ? `New equipment request - ${data.equipmentContext}`
          : 'New equipment request';
        break;
      default:
        emailSubject = 'New customer request';
        break;
    }

    const requestMessage: string = `
    ${data.name} (${data.email}) sent you a ${data.variant === 'feedback' ? 'feedback' : 'request'}:<br>
    ${data.equipmentContext ? `Concerned equipment: ${data.equipmentContext}` : ''}<br>
  <strong>Message</strong>: <br>
  ${data.message}
    `;

    // Send email to the business
    const emailRequest: Email = {
      to: { name: 'paraMOT Team', email: BUSINESS.email },
      subject: emailSubject,
      message: requestMessage,
      replyTo: data.email,
    };

    const request = await sendEmail(emailRequest);

    if (!request.success)
      return {
        formData: data,
        success: false,
        errors: { general: "Email services weren't available" },
      };

    // Send confirmation to user
    const confirmationMessage: string = `
    Summary of your ${data.variant === 'feedback' ? 'feedback' : 'request'}${data.equipmentContext ? ` about ${data.equipmentContext}` : ''}:
<br>
<br>
    <strong>Message</strong>: <br>
    ${data.message}
    `;

    const confirmationEmail: Email = {
      to: { name: data.name, email: data.email },
      subject: `Your ${data.variant === 'feedback' ? 'feedback' : 'request'} as been successfully sent to paraMOT team`,
      template: 'contact-form',
      templateVariables: { recipientName: data.name, message: confirmationMessage },
    };

    await sendEmail(confirmationEmail);

    return {
      ...prevState,
      success: true,
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);

    return {
      formData: data,
      errors: {
        ...prevState.errors,
        general: 'Something went wrong. Please try again later.',
      },
      success: false,
    };
  }
}
