import z from 'zod';
import { escapeHTML } from '../security/escapeHTML';

export interface OnboardingValues {
  firstName: string;
  lastName: string;
  phone?: string;
  terms?: boolean;
  termsAcceptedAt: Date;
  privacy?: boolean;
  privacyPolicyAcceptedAt: Date;
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
    phone: z.string().optional(),
    termsAccepted: z.literal(true, 'You need to accept paraMOT Terms of Service'),
    privacyAccepted: z.literal(true, 'You need to accept paraMOT Privacy Policy'),
    userId: z.string().nonempty().min(25).max(40),
  })
  .transform((v) => ({
    ...v,
    firstName: escapeHTML(v.firstName),
    lastName: escapeHTML(v.lastName),
    phone: v.phone ? escapeHTML(v.phone) : '',
  }));
