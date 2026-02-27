import { z } from 'zod';

import { escapeHTML } from '../security/escapeHTML';

const VARIANT = ['contact', 'feedback', 'equipment'] as const;

export type ContactFormData = z.infer<typeof ContactDataSchema>;

export type ContactFormVariant = (typeof VARIANT)[number];

export interface ContactFormState {
  formData: ContactFormData;
  errors: Record<string, string>;
  success: boolean;
}

/**
 * Zod schema for customer details validation
 * Sanitizes all string inputs to prevent XSS in database/email templates
 */
export const ContactDataSchema = z
  .object({
    name: z.string().min(1, 'Missing a name'),
    email: z.email(),
    message: z.string().min(10, 'Message is missing'),
    equipmentContext: z.string().optional(),
    variant: z.enum(VARIANT),
    title: z.string().max(0, 'Spam detected'), // Honeypot input
  })
  .transform((v) => ({
    ...v,
    name: escapeHTML(v.name),
    message: escapeHTML(v.message),
    equipmentContext: v.equipmentContext ? escapeHTML(v.equipmentContext) : undefined,
  }));
