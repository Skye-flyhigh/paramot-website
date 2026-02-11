'use client';

import { Wrench, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ServiceHistoryTable from '@/components/dashboard/ServiceHistoryTable';
import { useCustomer } from '@/contexts/CustomerContext';

export default function ServicesPage() {
  const customer = useCustomer();
  const services = customer.serviceRecords;

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-sky-900">Service History</h1>
          <p className="text-sky-600 mt-1">
            {services.length} service{services.length !== 1 ? 's' : ''} on record
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Book Service
        </Button>
      </header>

      {services.length > 0 ? (
        <ServiceHistoryTable serviceHistory={services} isOwner={true} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-12 text-center">
          <Wrench className="w-12 h-12 text-sky-300 mx-auto mb-4" />
          <p className="text-sky-600">No service history yet.</p>
          <p className="text-sky-400 text-sm mt-2">
            Book your first service to keep your equipment in top condition.
          </p>
        </div>
      )}
    </div>
  );
}
