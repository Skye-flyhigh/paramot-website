'use client';

import { Package, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCustomer } from '@/contexts/CustomerContext';

export default function EquipmentPage() {
  const customer = useCustomer();
  const equipment = customer.customerEquipment;

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-sky-900">My Equipment</h1>
          <p className="text-sky-600 mt-1">
            {equipment.length} item{equipment.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </header>

      {equipment.length > 0 ? (
        <div className="grid gap-4">
          {equipment.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-sky-200 p-6 flex items-center gap-4"
            >
              <div className="p-3 bg-sky-100 rounded-lg">
                <Package className="w-6 h-6 text-sky-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sky-900">
                  {item.equipment.manufacturer} {item.equipment.model}
                </h3>
                <p className="text-sm text-sky-500">
                  {item.equipment.type} · Size {item.equipment.size} · Serial:{' '}
                  {item.equipment.serialNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-sky-500">
                  Owned since {new Date(item.ownedFrom).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-12 text-center">
          <Package className="w-12 h-12 text-sky-300 mx-auto mb-4" />
          <p className="text-sky-600">No equipment registered yet.</p>
          <p className="text-sky-400 text-sm mt-2">
            Add your paragliding gear to track service history.
          </p>
        </div>
      )}
    </div>
  );
}
