import z from 'zod';

import { SERVICE_CODE } from '../schema';
import { escapeHTML } from '../security/escapeHTML';

export interface BookingFormData {
  serviceType: string;
  preferredDate: string;
  deliveryMethod: string;
  specialInstructions: string;
  contactMethod: string;
  equipmentId: string;
}

export interface BookingFormState {
  data: BookingFormData;
  success: boolean;
  errors: Record<string, string>;
}

/**
 * Zod schema for booking form data.
 * Sanitizes string input to prevent XSS in database/email templates.
 */
export const bookingFormSchema = z
  .object({
    serviceType: z.enum(SERVICE_CODE),
    preferredDate: z.string().nonempty(),
    deliveryMethod: z.string().nonempty(),
    specialInstructions: z.string().optional(),
    contactMethod: z.string().nonempty(),
    equipmentId: z.string().nonempty(),
  })
  .transform((v) => ({
    ...v,
    specialInstructions: v.specialInstructions
      ? escapeHTML(v.specialInstructions)
      : undefined,
  }));
