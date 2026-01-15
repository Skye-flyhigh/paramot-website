import { Resend } from 'resend';

export interface Email {
  from?: string;
  to: Recipient;
  subject: string;
  message?: string; // Optional - use this OR template
  template?: string; // Resend dashboard template ID
  templateVariables?: Record<string, unknown>; // Variables for dashboard template
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

interface Recipient {
  name: string;
  email: string;
}

interface EmailResponse {
  statusCode: number;
  data: Email;
  success: boolean;
  error?: string | null;
}

export default async function sendEmail({
  from = 'paraMOT <hello@paramot.co.uk>',
  to,
  subject,
  message,
  template,
  templateVariables,
  replyTo = 'paraMOT <hello@paramot.co.uk>',
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
          html: message!,
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
