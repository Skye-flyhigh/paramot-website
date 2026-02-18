'use client';

import Link from 'next/link';

import { useCustomer } from '@/contexts/CustomerContext';
import { getServicesList } from '@/lib/schema';

import { Equipment, EquipmentType } from '@/generated/prisma';
import StatsCards from './StatsCards';

export default function ServiceTable() {
  const customer = useCustomer();

  // Filter service records from customer data (already loaded with relations)
  const upcomingServices = customer.serviceRecords.filter((s) => s.status === 'PENDING');
  const completedServices = customer.serviceRecords.filter(
    (s) => s.status === 'COMPLETED',
  );
  const equipmentList: Equipment[] = customer.customerEquipment.map((e) => {
    const equipment = {
      ...e.equipment,
      type: e.equipment.type.toLocaleLowerCase() as EquipmentType,
      status: e.equipment.status.toLocaleLowerCase() as Equipment['status'],
    };

    return equipment;
  });
  const servicesList = getServicesList();

  // Helper to get service title from code
  const getServiceTitle = (serviceCode: string): string => {
    const service = servicesList.find((s) => s.code === serviceCode);

    return service?.title || serviceCode;
  };

  return (
    <>
      {/* Stats Cards */}
      <StatsCards
        upcomingServices={upcomingServices}
        completedServices={completedServices}
        equipmentList={equipmentList}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Services */}
        <div
          className="bg-white rounded-lg shadow-sm border border-sky-200"
          id="upcoming-services"
        >
          <div className="p-6 border-b border-sky-100">
            <h2 className="text-xl font-bold text-sky-900">Upcoming Services</h2>
          </div>
          <div className="p-6">
            {upcomingServices.length > 0 ? (
              <div className="space-y-4">
                {upcomingServices.map((service) => (
                  <div
                    key={service.id}
                    className="border border-green-200 rounded-lg p-4 bg-green-50"
                  >
                    <Link
                      href={
                        service.equipment
                          ? `/equipment/${service.equipment.serialNumber}`
                          : '#'
                      }
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-sky-900">
                            {getServiceTitle(service.serviceCode)}
                          </h3>
                          <p className="text-sky-600">
                            {service.equipment
                              ? `${service.equipment.manufacturer} ${service.equipment.model} ${service.equipment.size}`
                              : 'Unknown Equipment'}
                          </p>
                          <p className="text-sm text-sky-500 mt-1">
                            Booking Ref: {service.bookingReference}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            {service.status}
                          </span>
                          <p className="text-sm text-sky-600 mt-1">
                            {service.preferredDate}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sky-600 text-center py-8">
                No upcoming services scheduled
              </p>
            )}
          </div>
        </div>

        {/* Active equipment */}
        <div
          className="bg-white rounded-lg shadow-sm border border-sky-200"
          id="equipment-list"
        >
          <div className="p-6 border-b border-sky-100">
            <h2 className="text-xl font-bold text-sky-900">Your Equipment</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {Object.values(equipmentList).map((equipment) => (
                <div
                  key={equipment.id}
                  className="flex items-center justify-between p-3 bg-sky-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="bg-sky-100 rounded-lg p-2">
                      <svg
                        className="w-5 h-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 11V9a1 1 0 011-1h8a1 1 0 011 1v6M7 15l5-3 5 3"
                        />
                      </svg>
                    </div>
                    <span className="ml-3 font-medium text-sky-900">
                      {equipment.manufacturer} {equipment.model} {equipment.size}
                    </span>
                  </div>
                  <Link
                    href={`/dashboard/equipment`}
                    className="text-sky-600 hover:text-sky-800 font-medium text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
