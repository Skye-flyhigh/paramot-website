import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getCustomerByEmail } from '@/lib/mockData';
import ServiceHistoryTable from '@/components/dashboard/ServiceHistoryTable';
import ServiceTable from '@/components/dashboard/ServiceTable';
import { DashboardCTA } from '@/components/dashboard/DashboardCTA';
import { CustomerProvider } from '@/contexts/CustomerContext';

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Look up customer by OAuth email (simulating DB query)
  // TODO: Replace with real Prisma query when database is ready:
  // const customer = await prisma.customer.findUnique({
  //   where: { email: session.user.email },
  //   include: { equipment: true, serviceRecords: true }
  // })

  // Use test email in development, real email in production
  const lookupEmail =
    process.env.NODE_ENV === 'development'
      ? 'skye@paramot.co.uk' // Test data for local development
      : session.user.email || 'guest@example.com';

  let customerData = getCustomerByEmail(lookupEmail);

  // First time user? Would create their record here
  if (!customerData) {
    // TODO: create a component form for first time users to get relevant data (name, phone, address, etc.)
    // For now, use OAuth data as fallback
    customerData = {
      id: session.user.id || 'temp-id',
      email: lookupEmail,
      name: session.user.name || 'Guest',
      phone: '',
      address: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      serviceHistory: [],
    };
  }

  return (
    <CustomerProvider customer={customerData}>
      <main className="min-h-screen bg-sky-50 py-8" id="dashboard">
        <div className="max-w-6xl mx-auto px-4" id="dashboard-content">
          {/* Header */}
          <header className="bg-white rounded-lg shadow-sm border border-sky-200 p-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-sky-900">
                Welcome back, {customerData.name}
              </h1>
              <p className="text-sky-600 mt-1">Customer Portal</p>
            </div>

            <DashboardCTA />
          </header>

          <section className="mt-6" id="dashboard-content">
            {customerData.serviceHistory.length > 0 ? (
              <>
                <ServiceTable />
                <ServiceHistoryTable
                  serviceHistory={customerData.serviceHistory}
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
