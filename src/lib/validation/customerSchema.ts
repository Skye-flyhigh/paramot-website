import { z } from 'zod';

import { escapeHTML } from '../security/escapeHTML';

export interface Customer {
  id: string; // OAuth email or generated ID
  firstName: string;
  lastName: string;
  phone: string | null; // optional contact info
  userId: string;
  addressId: string | null; // for service collection/delivery
  createdAt: Date;
  updatedAt: Date;
  communicationPreferencesId?: string | null;
  termsAcceptedAt: Date;
  privacyPolicyAcceptedAt: Date;
}

export interface CustomerFormState {
  data: Customer;
  errors: string | null;
  success: boolean;
}

/**
 * Zod schema for customer details validation
 * Sanitizes all string inputs to prevent XSS in database/email templates
 */
export const CustomerDataSchema = z
  .object({
    firstName: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    lastName: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number too short').max(20, 'Phone number too long'),
    address: z.string().min(5, 'Address is required').max(500, 'Address too long'),
  })
  .transform((v) => ({
    firstName: escapeHTML(v.firstName),
    lastName: escapeHTML(v.lastName),
    email: escapeHTML(v.email),
    phone: escapeHTML(v.phone),
    address: escapeHTML(v.address),
  }));

export type ValidatedCustomerData = z.infer<typeof CustomerDataSchema>;
