import { auth } from "@/auth";
import { Customer } from "@/lib/schema";
import { redirect } from "next/navigation";
import {
  getCustomerByEmail,
  mockDatabase,
} from "@/lib/mockData";
import ServiceHistoryTable from "@/components/dashboard/ServiceHistoryTable";
import ServiceTable from "@/components/dashboard/ServiceTable";
import { DashboardCTA } from "@/components/dashboard/DashboardCTA";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Look up customer by OAuth email (simulating DB query)
  // TODO: Replace with real Prisma query when database is ready:
  // const customer = await prisma.customer.findUnique({
  //   where: { email: session.user.email },
  //   include: { equipment: true, serviceRecords: true }
  // })
  let customerData = getCustomerByEmail(session.user.email || "skye@paramot.co.uk");

  // First time user? Would create their record here
  if (!customerData) {
    // TODO: create a component form for first time users to get relevant data (name, phone, address, etc.)
    // For now, use OAuth data as fallback
    customerData = {
      id: session.user.id || "temp-id",
      email: session.user.email || "guest@example.com",
      name: session.user.name || "Guest",
      phone: "",
      address: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      serviceHistory: [],
    };
  }

  return (
    <div className="min-h-screen bg-sky-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-sm border border-sky-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-sky-900">
                Welcome back, {customerData.name}
              </h1>
              <p className="text-sky-600 mt-1">Customer Portal</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-sky-600">Customer ID</p>
              <p className="font-mono text-sky-800">{customerData.email}</p>
            </div>
          </div>
          <DashboardCTA />
          {/* TODO: add settings button and contact details edition through a modal */}
        </header>

          {/* Dashboard CTA */}
          <main className="mt-6">
          
          {
            customerData.serviceHistory.length > 0
              ? (
              <>
                <ServiceTable customer={customerData} />
                <ServiceHistoryTable serviceHistory={customerData.serviceHistory} />
              </>
              )
              : (<p className="text-sky-600">No service history found.</p>)
          }
    </main>
      </div>
    </div>
  );
}
