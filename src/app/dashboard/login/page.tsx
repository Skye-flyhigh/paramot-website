import Login from '@/components/Login';
import { ensureCustomer } from '@/lib/security/auth-check';
import { redirect } from 'next/navigation';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const authResult = await ensureCustomer();

  if (authResult.authorized) {
    redirect(callbackUrl || '/dashboard');
  }

  if (authResult.session) {
    redirect('/dashboard/onboarding');
  }

  return <Login callbackUrl={callbackUrl} />;
}
