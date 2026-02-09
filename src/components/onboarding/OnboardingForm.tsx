'use client';

import { cancelOnboarding, completeOnboarding } from '@/lib/submit/onboarding-actions';
import { OnboardingFormState, OnboardingValues } from '@/lib/validation/onboardingForm';
import Link from 'next/link';
import { useActionState, useTransition } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface OnboardingFormProps {
  userName: string;
  userEmail: string;
}

export default function OnboardingForm({ userName, userEmail }: OnboardingFormProps) {
  const [isCancelling, startCancelTransition] = useTransition();

  const [firstName, lastName] = userName.split(' ');

  const initialValues: OnboardingValues = {
    firstName: firstName || '',
    lastName: lastName || '',
    phone: '',
    terms: false,
    termsAcceptedAt: new Date(),
    privacy: false,
    privacyPolicyAcceptedAt: new Date(),
  };
  const initialState: OnboardingFormState = {
    state: initialValues,
    success: false,
    errors: {},
  };
  const [state, formAction, isPending] = useActionState(completeOnboarding, initialState);

  const handleCancel = () => {
    if (confirm('Are you sure? This will delete your account.')) {
      startCancelTransition(async () => {
        await cancelOnboarding();
      });
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="firstName"
            className="block text-sm font-medium text-sky-900 mb-1"
          >
            First Name *
          </Label>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            defaultValue={initialState.state.firstName}
            required
            disabled={isPending || isCancelling}
            className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
        <div>
          <Label
            htmlFor="lastName"
            className="block text-sm font-medium text-sky-900 mb-1"
          >
            Last Name *
          </Label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            defaultValue={initialState.state.lastName}
            required
            disabled={isPending || isCancelling}
            className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone" className="block text-sm font-medium text-sky-900 mb-1">
          Phone Number (Optional)
        </Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          placeholder="+44 7700 900000"
          defaultValue={initialState.state.phone}
          disabled={isPending || isCancelling}
          className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100"
        />
        <p className="text-sm text-sky-600 mt-1">
          We'll use this for urgent updates about your equipment
        </p>
      </div>

      {/* Email (Read-only) */}
      <div>
        <Label className="block text-sm font-medium text-sky-900 mb-1">
          Email Address
        </Label>
        <Input
          type="email"
          value={userEmail}
          readOnly
          className="w-full px-4 py-2 border border-sky-300 rounded-lg bg-gray-50 text-gray-600"
        />
      </div>

      {/* Legal Agreements */}
      <div className="space-y-4 p-6 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="font-semibold text-amber-900 mb-3">Before we continue</h3>

        <div className="flex items-start space-x-3">
          <Input
            type="checkbox"
            id="terms"
            name="terms"
            required
            disabled={isPending || isCancelling}
            defaultChecked={initialState.state.terms}
            className="mt-1 h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
          />
          <Label htmlFor="terms" className="text-sm text-gray-700 block">
            I accept the{' '}
            <Link
              href="/terms"
              target="_blank"
              className="text-sky-600 hover:underline font-medium"
            >
              Terms of Service
            </Link>
            . I understand that paraMOT will service my equipment according to
            manufacturer guidelines and industry standards.
          </Label>
        </div>

        <div className="flex items-start space-x-3 align-middle">
          <Input
            type="checkbox"
            id="privacy"
            name="privacy"
            required
            disabled={isPending || isCancelling}
            defaultChecked={initialState.state.terms}
            className="mt-1 h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
          />
          <Label htmlFor="privacy" className="text-sm text-gray-700 block">
            I accept the{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="text-sky-600 hover:underline font-medium"
            >
              Privacy Policy
            </Link>
            . I consent to paraMOT storing my personal data to provide services.
          </Label>
        </div>
      </div>

      {/* Error Message */}
      {state.errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {state.errors.general}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 w-full justify-center">
        <Button type="submit" disabled={isPending || isCancelling}>
          {isPending ? 'Setting up your account...' : 'Continue to Dashboard'}
        </Button>

        <Button
          variant={'outline'}
          type="button"
          onClick={handleCancel}
          disabled={isPending || isCancelling}
        >
          {isCancelling ? 'Processing Cancellation...' : 'Cancel and delete data'}
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        By continuing, you'll have full access to your customer portal
      </p>
    </form>
  );
}
