import Login from '@/components/Login';
import { ensureCustomer } from '@/lib/security/auth-check';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const authResult = await ensureCustomer();

  if (authResult.authorized) {
    // Already completed onboarding → dashboard
    redirect('/dashboard');
  }

  // Not authorized - either no session or no customer record
  // If they have a session but no customer, send to onboarding
  if (authResult.session) {
    redirect('/dashboard/onboarding');
  }

  // No session at all - show login form
  return <Login />;
}
