'use server';

import { redirect } from 'next/navigation';

import { createCustomerFromOnboarding, deleteUserAccount } from '@/lib/db';
import z from 'zod';
import { ensureAuthenticated } from '../security/auth-check';
import sendEmail, { Email } from '../services/user-mailing';
import {
  onboardingDataScheme,
  OnboardingFormState,
  OnboardingValues,
} from '../validation/onboardingForm';

/**
 * Complete onboarding - creates Customer record with legal consent
 */
export async function completeOnboarding(
  prevState: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const authResults = await ensureAuthenticated();

  if (!authResults.authenticated) {
    return {
      ...prevState,
      errors: { general: authResults.error },
      success: false,
    };
  }

  const session = authResults.session;

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

      return {
        ...prevState,
        errors: { general: formattedError },
        success: false,
      };
    }

    // Create Customer with legal consent timestamps
    const now = new Date();

    const onboardingData: OnboardingValues = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone?.trim(),
      termsAcceptedAt: now,
      privacyPolicyAcceptedAt: now,
    };

    await createCustomerFromOnboarding(session.user.id, onboardingData);

    async function sendWelcomeEmail() {
      const recipient = {
        name: onboardingData.firstName || session.user.name || '',
        email: session.user.email,
      };

      const templateVariables = {
        recipientName: onboardingData.firstName,
      };

      const content: Email = {
        to: recipient,
        subject: 'Welcome to paraMOT',
        template: 'welcome-email',
        templateVariables,
      };

      const result = await sendEmail(content);

      return result;
    }

    const welcomeEmail = await sendWelcomeEmail();

    if (!welcomeEmail.success)
      return {
        state: onboardingData,
        success: false,
        errors: { general: welcomeEmail.error || 'Error in sending confirmation email' },
      };

    // Redirect to dashboard (onboarding complete!)
    redirect('/dashboard');
  } catch (error) {
    // Re-throw Next.js redirect errors (they're not actual errors)
    // Check both message and digest for redirect errors
    if (error instanceof Error) {
      const isRedirect =
        error.message === 'NEXT_REDIRECT' ||
        ('digest' in error &&
          typeof error.digest === 'string' &&
          error.digest.startsWith('NEXT_REDIRECT'));

      if (isRedirect) {
        throw error;
      }
    }

    console.error('[Onboarding] Error:', error);

    return {
      ...prevState,
      errors: { general: 'Failed to complete onboarding. Please try again.' },
      success: false,
    };
  }
}

interface DeleteSuccess {
  success: boolean;
}

interface DeleteError {
  success: boolean;
  error: string;
}

/**
 * Cancel onboarding - deletes User account and signs out
 */
export async function cancelOnboarding(): Promise<DeleteSuccess | DeleteError> {
  const authResults = await ensureAuthenticated();

  if (!authResults.authenticated) {
    return {
      error: authResults.error,
      success: false,
    };
  }

  const session = authResults.session;

  try {
    await deleteUserAccount(session.user.id);

    // Don't call signOut() - session is already cascade-deleted
    // User will be auto-logged out on next request when cookie validation fails
    redirect('/');
  } catch (error) {
    // Re-throw Next.js redirect errors (they're not actual errors)
    // Check both message and digest for redirect errors
    if (error instanceof Error) {
      const isRedirect =
        error.message === 'NEXT_REDIRECT' ||
        ('digest' in error &&
          typeof error.digest === 'string' &&
          error.digest.startsWith('NEXT_REDIRECT'));

      if (isRedirect) {
        throw error;
      }
    }

    console.error('[Onboarding] Cancel error:', error);

    return { success: false, error: 'Failed to cancel onboarding' };
  }
}
