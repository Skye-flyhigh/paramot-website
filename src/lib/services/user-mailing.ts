import { Resend } from 'resend';
import { BUSINESS } from '../metadata.const';

interface Recipient {
  name: string;
  email: string;
}

// Template-specific variable types
interface BookingConfirmationVariables {
  recipientName: string;
  bookingReference: string;
  serviceTitle: string;
  serviceDescription: string;
  equipmentName: string;
  bookingDate: string;
  price: string | number;
}

interface ContactFormVariables {
  recipientName: string;
  message: string;
}

interface NoMessageVariables {
  recipientName: string;
}

// Base email fields (common to all emails)
interface BaseEmail {
  from?: string;
  to: Recipient;
  subject: string;
  attachments?: string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  headers?: object;
  sendAt?: Date;
  tags?: string[];
  metadata?: object;
  id?: string;
}

// Discriminated union: template determines which variables are required
type TemplatedEmail =
  | (BaseEmail & {
      template: 'booking-confirmation';
      templateVariables: BookingConfirmationVariables;
      message?: never;
    })
  | (BaseEmail & {
      template: 'contact-form';
      templateVariables: ContactFormVariables;
      message?: never;
    })
  | (BaseEmail & {
      template: 'welcome-email';
      templateVariables: NoMessageVariables;
      message?: never;
    });

// Plain HTML email (no template)
type PlainEmail = BaseEmail & {
  message: string;
  template?: never;
  templateVariables?: never;
};

// Union of all email types
export type Email = TemplatedEmail | PlainEmail;

interface EmailResponse {
  statusCode: number;
  data: Partial<BaseEmail> & {
    message?: string;
    template?: string;
    templateVariables?: Record<string, unknown>;
    id?: string;
  };
  success: boolean;
  error?: string | null;
}

/**
 * `sendEmail` is a TypeScript function that sends an email using an email provider service called Resend.
 * @param Email
 * @returns EmailResponse
 */
export default async function sendEmail({
  from = `paraMOT <${BUSINESS.email}>`,
  to,
  subject,
  message,
  template,
  templateVariables,
  replyTo = `paraMOT <${BUSINESS.email}>`,
  attachments = [],
  cc = [],
  bcc = [],
  headers = {},
  sendAt,
  tags = [],
  metadata = {},
}: Email): Promise<EmailResponse> {
  // Validate API key exists (server misconfiguration)
  if (!process.env.RESEND_API_KEY) {
    console.error('🚨 RESEND_API_KEY not configured');

    return {
      statusCode: 500,
      data: {
        from,
        to,
        subject,
        message,
        template,
        attachments,
        cc,
        bcc,
        replyTo,
        headers,
        sendAt,
        tags,
        metadata,
      },
      success: false,
      error: 'Email service not configured',
    };
  }

  // Validate: must provide either message OR template
  if (!message && !template) {
    console.error('🚨 Must provide either message (HTML) or template (dashboard ID)');

    return {
      statusCode: 400,
      data: {
        from,
        to,
        subject,
        message,
        template,
        attachments,
        cc,
        bcc,
        replyTo,
        headers,
        sendAt,
        tags,
        metadata,
      },
      success: false,
      error: 'Must provide either message or template',
    };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send with template or raw HTML
    const { data, error } = template
      ? await resend.emails.send({
          from,
          to: [to.email],
          subject,
          replyTo,
          template: {
            id: template,
            ...(templateVariables && { variables: templateVariables }),
          },
        } as never) // Template types aren't exported properly from Resend SDK
      : await resend.emails.send({
          from,
          to: [to.email],
          subject,
          replyTo,
          html: message || '',
        });

    // Resend returns { data: {...}, error: null } on success
    // or { data: null, error: {...} } on failure
    if (error) {
      console.error('Resend API error:', error);

      // Determine if it's a client error (bad email) or server error
      const isClientError =
        error.message?.includes('invalid') || error.message?.includes('malformed');

      return {
        statusCode: isClientError ? 400 : 500,
        data: {
          from,
          to,
          subject,
          message,
          template,
          attachments,
          cc,
          bcc,
          replyTo,
          headers,
          sendAt,
          tags,
          metadata,
        },
        success: false,
        error: isClientError ? error.message : 'Failed to send email', // Don't expose internal errors
      };
    }

    return {
      statusCode: 200,
      data: {
        from,
        to,
        subject,
        message,
        template,
        attachments,
        cc,
        bcc,
        replyTo,
        headers,
        sendAt,
        tags,
        metadata,
        id: data?.id, // Store for tracking/debugging
      },
      success: true,
      error: null,
    };
  } catch (error: unknown) {
    // Type narrowing for TypeScript
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    console.error('Unexpected error in sendContactEmail:', {
      error: errorMessage,
      to,
      subject,
    });

    // Network errors, timeouts, etc.
    return {
      statusCode: 500,
      data: {
        from,
        to,
        subject,
        message,
        template,
        attachments,
        cc,
        bcc,
        replyTo,
        headers,
        sendAt,
        tags,
        metadata,
      },
      success: false,
      error: 'Email service temporarily unavailable',
    };
  }
}
