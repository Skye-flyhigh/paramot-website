'use client';

import { DashboardCTA } from '@/components/dashboard/DashboardCTA';
import ServiceHistoryTable from '@/components/dashboard/ServiceHistoryTable';
import ServiceTable from '@/components/dashboard/ServiceTable';
import { useCustomer } from '@/contexts/CustomerContext';

export default function DashboardHome() {
  const customer = useCustomer();

  return (
    <div id="dashboard-home">
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

      {/* Service Records */}
      <section className="mt-6">
        {customer.serviceRecords.length > 0 ? (
          <>
            <ServiceTable />
            <ServiceHistoryTable
              serviceHistory={customer.serviceRecords}
              isOwner={true}
            />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-12 text-center">
            <p className="text-sky-600">No service history found.</p>
            <p className="text-sky-400 text-sm mt-2">
              Book your first service to get started!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
