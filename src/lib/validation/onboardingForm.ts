import z from 'zod';
import { escapeHTML } from '../security/escapeHTML';

export interface OnboardingValues {
  firstName?: string;
  lastName?: string;
  userEmail: string;
  phone?: string;
  terms: boolean;
  privacy: boolean;
}

export interface OnboardingFormState {
  state: OnboardingValues;
  success: boolean;
  errors: Record<string, string>;
}

export const onboardingDataScheme = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    userEmail: z.email().nonempty(),
    phone: z.string().optional(),
    terms: z.boolean(),
    privacy: z.boolean(),
    userId: z.cuid2().nonempty().startsWith('c').min(25).max(31),
  })
  .transform((v) => ({
    ...v,
    firstName: escapeHTML(v.firstName),
    lastName: escapeHTML(v.lastName),
    userEmail: escapeHTML(v.userEmail),
    phone: v.phone ? escapeHTML(v.phone) : '',
  }));
