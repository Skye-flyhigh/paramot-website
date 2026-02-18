'use client';

import { CreditCard } from 'lucide-react';

import { useCustomer } from '@/contexts/CustomerContext';

export default function PaymentsPage() {
  const customer = useCustomer();

  // Calculate total from completed services (placeholder logic)
  const completedServices = customer.serviceRecords.filter(
    (service) => service.status === 'COMPLETED',
  );

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-sky-900">Payments</h1>
        <p className="text-sky-600 mt-1">Manage your payment history and invoices</p>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-12 text-center">
        <CreditCard className="w-12 h-12 text-sky-300 mx-auto mb-4" />
        <p className="text-sky-600">Payment history coming soon.</p>
        <p className="text-sky-400 text-sm mt-2">
          You have {completedServices.length} completed service
          {completedServices.length !== 1 ? 's' : ''}.
        </p>
      </div>
    </div>
  );
}
