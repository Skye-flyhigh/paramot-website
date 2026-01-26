'use server';

import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth';
import { createCustomerFromOnboarding, deleteUserAccount } from '@/lib/db';
import z from 'zod';
import { onboardingDataScheme, OnboardingFormState } from '../validation/onboardingForm';

/**
 * Complete onboarding - creates Customer record with legal consent
 */
export async function completeOnboarding(
  prevState: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const session = await auth();

  if (!session?.user?.email || !session?.user?.id) {
    return {
      ...prevState,
      errors: { general: 'Unauthorized - please sign in again' },
      success: false,
    };
  }

  try {
    // Extract form data
    const extractFormData = Object.fromEntries(formData);
    const rawFormData = {
      ...extractFormData,
      termsAccepted: formData.get('terms') === 'on',
      privacyAccepted: formData.get('privacy') === 'on',
      userId: session.user.id,
    };

    // Validate required fields
    const { data, error, success } = onboardingDataScheme.safeParse(rawFormData);

    if (!success) {
      const formattedError = z.prettifyError(error) || 'Error in validating data';

      return { ...prevState, errors: { general: formattedError }, success: false };
    }

    // Create Customer with legal consent timestamps
    const now = new Date();

    await createCustomerFromOnboarding(session.user.id, {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone?.trim(),
      termsAcceptedAt: now,
      privacyPolicyAcceptedAt: now,
    });

    console.log('[Onboarding] Customer created for user:', session.user.email);

    // TODO: Send welcome email here
    // await sendWelcomeEmail(session.user.email);

    // Redirect to dashboard (onboarding complete!)
    redirect('/dashboard');
  } catch (error) {
    console.error('[Onboarding] Error:', error);

    return {
      ...prevState,
      errors: { general: 'Failed to complete onboarding. Please try again.' },
      success: false,
    };
  }
}

/**
 * Cancel onboarding - deletes User account and signs out
 */
export async function cancelOnboarding() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  try {
    console.log('[Onboarding] Cancelling for user:', session.user.email);

    // Delete User (cascades to Account and Session)
    await deleteUserAccount(session.user.id);

    // Sign out
    await signOut({ redirectTo: '/' });
  } catch (error) {
    console.error('[Onboarding] Cancel error:', error);

    return { error: 'Failed to cancel onboarding' };
  }
}
