import z from 'zod';

import { escapeHTML } from '../security/escapeHTML';
import { SERVICE_CODE, ServiceCode } from './serviceSchema';

export const DELIVERY_METHOD = ['DROP_OFF', 'POST'] as const;
export const CONTACT_METHOD = ['EMAIL', 'PHONE', 'TEXT'] as const;

export type BookingFormData = z.infer<typeof bookingFormSchema>;

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
    serviceType: z
      .string()
      .refine((val): val is ServiceCode => SERVICE_CODE.includes(val as ServiceCode), {
        message: `Invalid service type. Must be one of: ${SERVICE_CODE.join(', ')}`,
      }),
    preferredDate: z.string().min(1, 'Preferred date is required'),
    deliveryMethod: z.enum(DELIVERY_METHOD),
    specialInstructions: z.string().optional(),
    contactMethod: z.enum(CONTACT_METHOD),
    equipmentId: z.string().min(1, 'Equipment ID is required'),
  })
  .transform((v) => ({
    ...v,
    specialInstructions: v.specialInstructions
      ? escapeHTML(v.specialInstructions)
      : undefined,
  }));
