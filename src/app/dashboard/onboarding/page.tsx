import { notFound, redirect } from 'next/navigation';

import OnboardingDetailsSection from '@/components/onboarding/OnboardingDetailsSection';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { ensureCustomer } from '@/lib/security/auth-check';
import OnboardingForm from '../../../components/onboarding/OnboardingForm';

export default async function OnboardingPage() {
  const authResult = await ensureCustomer();

  if (authResult.authorized) {
    // Already completed onboarding → dashboard
    redirect('/dashboard');
  }

  // If not authorized, we should have a session from the auth check
  if (!authResult.session) {
    redirect('/dashboard/login');
  }

  const session = authResult.session;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <section className="bg-white rounded-xl shadow-xl p-8">
          <OnboardingHeader />

          <OnboardingDetailsSection />

          <OnboardingForm
            userName={session.user.name || ''}
            userEmail={session.user.email || ''}
          />
        </section>
      </div>
    </main>
  );
}
