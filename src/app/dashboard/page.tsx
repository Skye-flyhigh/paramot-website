import { redirect } from 'next/navigation';

import { DashboardCTA } from '@/components/dashboard/DashboardCTA';
import ServiceHistoryTable from '@/components/dashboard/ServiceHistoryTable';
import ServiceTable from '@/components/dashboard/ServiceTable';
import { CustomerProvider } from '@/contexts/CustomerContext';
import { ensureCustomer } from '@/lib/security/auth-check';

export default async function Dashboard() {
  const authResult = await ensureCustomer();

  if (!authResult.authorized) {
    // Already completed onboarding → dashboard
    redirect('/dashboard/onboarding');
  }

  const customer = authResult.customer;

  return (
    <CustomerProvider customer={customer}>
      <main className="min-h-screen bg-sky-50 py-8" id="dashboard">
        <div className="max-w-6xl mx-auto px-4" id="dashboard-content">
          {/* Header */}
          <header className="bg-white rounded-lg shadow-sm border border-sky-200 p-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-sky-900">
                Welcome back, {customer.firstName}
              </h1>
              <p className="text-sky-600 mt-1">Customer Portal</p>
            </div>

            <DashboardCTA />
          </header>

          <section className="mt-6" id="dashboard-content">
            {customer.serviceRecords.length > 0 ? (
              <>
                <ServiceTable />
                <ServiceHistoryTable
                  serviceHistory={customer.serviceRecords}
                  isOwner={true}
                />
              </>
            ) : (
              <p className="text-sky-600 text-center pt-5">No service history found.</p>
            )}
          </section>
        </div>
      </main>
    </CustomerProvider>
  );
}
