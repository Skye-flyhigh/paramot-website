'use client';

import { useState } from 'react';
import { ServiceRecords, Equipment } from '@/lib/schema';
import { getStatusColor } from '@/lib/styling/services';
import BookingModal from './BookingModal';
import { Button } from '@/components/ui/button';

export default function ServiceHistoryTable({
  serviceHistory,
  equipment,
}: {
  serviceHistory: ServiceRecords[];
  equipment?: Equipment;
}) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'modify';
    selectedService?: ServiceRecords;
  }>({
    isOpen: false,
    mode: 'create',
  });

  const openModal = (mode: 'create' | 'modify', service?: ServiceRecords) => {
    setModalState({
      isOpen: true,
      mode,
      selectedService: service,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: 'create',
    });
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-sky-200 mt-8">
      <div className="p-6 border-b border-sky-100">
        <h2 className="text-xl font-bold text-sky-900">Service History</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">
                Glider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">
                Service ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100">
            {serviceHistory.map((service) => (
              <tr key={service.id} className="hover:bg-sky-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-sky-900">
                  {service.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sky-600">
                  {service.manufacturer} {service.model} {service.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sky-600">
                  {service.createdAt.toDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}
                  >
                    {service.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-sky-900">
                  {service.cost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-sky-500">
                  {service.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {service.status === 'PENDING' ? (
                    equipment ? (
                      <button
                        onClick={() => openModal('modify', service)}
                        className="text-sky-600 hover:text-sky-800 font-medium transition-colors"
                      >
                        Modify Booking →
                      </button>
                    ) : (
                      <span className="text-sky-600 hover:text-sky-800 font-medium">
                        Modify Booking →
                      </span>
                    )
                  ) : (
                    <span className="text-sky-600 hover:text-sky-800 font-medium cursor-pointer">
                      Download Report →
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Request New Service Button - only show if we have equipment context */}
      {equipment && (
        <div className="p-6 border-t border-sky-100 bg-sky-25">
          <Button
            onClick={() => openModal('create')}
            variant="default"
            size="lg"
            className="w-full"
          >
            Request New Service
          </Button>
        </div>
      )}

      {/* Booking Modal */}
      {equipment && (
        <BookingModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          mode={modalState.mode}
          equipment={equipment}
          existingBooking={modalState.selectedService}
        />
      )}
    </div>
  );
}
