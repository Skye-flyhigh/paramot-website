import { redirect } from 'next/navigation';

import Sidebar from '@/components/dashboard/Sidebar';
import { CustomerProvider } from '@/contexts/CustomerContext';
import { ensureCustomer } from '@/lib/security/auth-check';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authResult = await ensureCustomer();

  if (!authResult.authorized) {
    redirect('/dashboard/onboarding');
  }

  // Flatten customer data with email
  const dashboardData = { ...authResult.customer, email: authResult.email };

  return (
    <CustomerProvider dashboardData={dashboardData}>
      <div className="flex min-h-screen bg-sky-50">
        {authResult.authorized && <Sidebar />}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </CustomerProvider>
  );
}
