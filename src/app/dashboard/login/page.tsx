import Login from '@/components/Login';
import { ensureCustomer } from '@/lib/security/auth-check';
import { ensureTechnician } from '@/lib/security/workshop-auth';
import { redirect } from 'next/navigation';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  // Technicians may not have a customer record — check first
  const techResult = await ensureTechnician();

  if (techResult.authorized) {
    redirect(callbackUrl || '/workshop');
  }

  const authResult = await ensureCustomer();

  if (authResult.authorized) {
    redirect(callbackUrl || '/dashboard');
  }

  if (authResult.session) {
    redirect('/dashboard/onboarding');
  }

  return <Login callbackUrl={callbackUrl} />;
}
