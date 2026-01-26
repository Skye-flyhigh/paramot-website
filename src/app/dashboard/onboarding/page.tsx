import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { findUserByEmail } from '@/lib/db';

import OnboardingDetailsSection from '@/components/onboarding/OnboardingDetailsSection';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import OnboardingForm from '../../../components/onboarding/OnboardingForm';

export default async function OnboardingPage() {
  const session = await auth();

  // Must be authenticated to see onboarding
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Check if they already completed onboarding
  const user = await findUserByEmail(session.user.email);

  if (user?.customer) {
    // Already completed onboarding → dashboard
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <section className="bg-white rounded-xl shadow-xl p-8">
          <OnboardingHeader />

          <OnboardingDetailsSection />

          <OnboardingForm
            userName={session.user.name || ''}
            userEmail={session.user.email}
          />
        </section>
      </div>
    </main>
  );
}
