import { redirect } from 'next/navigation';

import Sidebar from '@/components/dashboard/Sidebar';
import { CustomerProvider } from '@/contexts/CustomerContext';
import { ensureCustomer } from '@/lib/security/auth-check';
import { ensureTechnician } from '@/lib/security/workshop-auth';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authResult = await ensureCustomer();

  if (!authResult.authorized) {
    redirect('/dashboard/onboarding');
  }

  // Lightweight check — reuses cached auth() call, just checks env var
  const techResult = await ensureTechnician();
  const isTechnician = techResult.authorized;

  // Flatten customer data with email
  const dashboardData = { ...authResult.customer, email: authResult.email };

  return (
    <CustomerProvider dashboardData={dashboardData}>
      <div className="flex min-h-screen bg-sky-50">
        <Sidebar isTechnician={isTechnician} />
        <main className="flex-1 min-w-0 max-w-300 mx-auto p-8">{children}</main>
      </div>
    </CustomerProvider>
  );
}
