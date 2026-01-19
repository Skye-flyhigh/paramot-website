'use client';

import type { Equipment } from '@/lib/validation/equipmentSchema';

import { Button } from '@/components/ui/button';
import { useBookingModal } from '@/hooks/useBookingModal';
import { getEquipmentById } from '@/lib/mockData';
import { getStatusColor } from '@/lib/styling/services';

import { getServicesList } from '@/lib/schema';
import { ServiceRecords } from '@/lib/validation/serviceSchema';
import BookingModal from './BookingModal';

export default function ServiceHistoryTable({
  serviceHistory,
  equipment,
  isOwner = false, // ← Add ownership flag
}: {
  serviceHistory: ServiceRecords[];
  equipment?: Equipment;
  isOwner?: boolean;
}) {
  const { modalState, openModal, closeModal } = useBookingModal();
  const servicesList = getServicesList();

  // Helper to get equipment for a service record
  const getEquipmentForService = (service: ServiceRecords): Equipment | undefined => {
    // If equipment prop provided (single equipment view), use that
    if (equipment && equipment.id === service.equipmentId) return equipment;

    // Otherwise look it up
    return getEquipmentById(service.equipmentId);
  };

  // Helper to get service title from code
  const getServiceTitle = (serviceCode: string): string => {
    const service = servicesList.find((s) => s.code === serviceCode);

    return service?.title || serviceCode;
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-sky-200 mt-8"
      id="service-history-table"
    >
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
              {isOwner && (
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">
                  Cost
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">
                Service ID
              </th>
              {isOwner && (
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100">
            {serviceHistory.map((service) => {
              const serviceEquipment = getEquipmentForService(service);

              return (
                <tr key={service.id} className="hover:bg-sky-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-sky-900">
                    {getServiceTitle(service.serviceCode)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sky-600">
                    {serviceEquipment
                      ? `${serviceEquipment.manufacturer} ${serviceEquipment.model} ${serviceEquipment.size}`
                      : 'Unknown Equipment'}
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
                  {isOwner && (
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-sky-900 before:content-['£']">
                      {service.cost}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-sky-500">
                    {service.id}
                  </td>
                  {isOwner && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {service.status === 'PENDING' ? (
                        <Button
                          onClick={() => openModal('booking', service)}
                          variant="link"
                          size="sm"
                          className="text-sky-600 hover:text-sky-800 font-medium transition-colors cursor-pointer"
                        >
                          Modify Booking →
                        </Button>
                      ) : (
                        <Button
                          className="text-sky-600 hover:text-sky-800 font-medium transition-colors cursor-pointer"
                          variant="link"
                          size="sm"
                        >
                          Download Report →
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Request New Service Button - only show if owner */}
      {isOwner && equipment && (
        <div className="p-6 border-t border-sky-100 bg-sky-25">
          <Button
            onClick={() => openModal('booking')}
            variant="default"
            size="lg"
            className="w-full"
          >
            Request New Service
          </Button>
        </div>
      )}

      {/* Booking Modal - only for owners */}
      {isOwner && equipment && (
        <BookingModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          equipment={equipment}
          existingBooking={modalState.selectedService}
        />
      )}
    </div>
  );
}
