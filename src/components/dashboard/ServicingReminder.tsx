'use client';

import { useCustomer } from '@/contexts/CustomerContext';
import { EquipmentType } from '@/lib/validation/equipmentSchema';
import { AlertTriangle, Calendar, CheckCircle } from 'lucide-react';

// Service intervals in months
const SERVICE_INTERVALS = {
  GLIDER: 24, // 2 years
  RESERVE: 12, // 1 year
  HARNESS: null, // No regular service required
} as const;

type ServiceStatus = 'overdue' | 'due-soon' | 'ok';

interface EquipmentServiceInfo {
  equipmentId: string;
  name: string;
  type: 'GLIDER' | 'RESERVE' | 'HARNESS';
  lastServiceDate: Date | null;
  nextServiceDue: Date | null;
  status: ServiceStatus;
  daysUntilDue: number | null;
}

/**
 * Calculate service status for a piece of equipment
 * TODO(human): Implement the logic to determine service status
 */
function calculateServiceStatus(
  equipmentType: EquipmentType[number],
  lastServiceDate: Date | null,
): { nextServiceDue: Date | null; status: ServiceStatus; daysUntilDue: number | null } {
  // TODO(human): Implement this function
  // 1. If equipment type has no service interval (HARNESS), return { nextServiceDue: null, status: 'ok', daysUntilDue: null }
  // 2. If no last service date, consider it overdue
  // 3. Calculate nextServiceDue by adding the interval months to lastServiceDate
  // 4. Calculate daysUntilDue (can be negative if overdue)
  // 5. Determine status: 'overdue' if past due, 'due-soon' if within 30 days, 'ok' otherwise

  return { nextServiceDue: null, status: 'ok', daysUntilDue: null };
}

export default function ServicingReminder() {
  const customer = useCustomer();

  // Build service info for each piece of equipment
  const equipmentServiceInfo: EquipmentServiceInfo[] = customer.customerEquipment
    .filter((ce) => ce.ownedUntil === null) // Only currently owned equipment
    .map((ce) => {
      const equipment = ce.equipment;

      // Find the most recent COMPLETED service for this equipment
      const lastService = customer.serviceRecords
        .filter((sr) => sr.equipmentId === equipment.id && sr.status === 'COMPLETED')
        .sort((a, b) => {
          const dateA = a.actualServiceDate ? new Date(a.actualServiceDate).getTime() : 0;
          const dateB = b.actualServiceDate ? new Date(b.actualServiceDate).getTime() : 0;

          return dateB - dateA;
        })[0];

      const lastServiceDate = lastService?.actualServiceDate
        ? new Date(lastService.actualServiceDate)
        : null;

      const { nextServiceDue, status, daysUntilDue } = calculateServiceStatus(
        equipment.type.toLowerCase(),
        lastServiceDate,
      );

      return {
        equipmentId: equipment.id,
        name: `${equipment.manufacturer} ${equipment.model}`,
        type: equipment.type,
        lastServiceDate,
        nextServiceDue,
        status,
        daysUntilDue,
      };
    })
    // Filter out equipment with no service requirements and sort by urgency
    .filter((info) => SERVICE_INTERVALS[info.type] !== null)
    .sort((a, b) => (a.daysUntilDue ?? 999) - (b.daysUntilDue ?? 999));

  if (equipmentServiceInfo.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-6 my-10">
      <h2 className="text-lg font-semibold text-sky-900 mb-4">Service Reminders</h2>

      <div className="space-y-3">
        {equipmentServiceInfo.map((info) => (
          <div
            key={info.equipmentId}
            className={`flex items-center justify-between p-3 rounded-lg ${
              info.status === 'overdue'
                ? 'bg-red-50 border border-red-200'
                : info.status === 'due-soon'
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-green-50 border border-green-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {info.status === 'overdue' ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : info.status === 'due-soon' ? (
                <Calendar className="w-5 h-5 text-amber-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <div>
                <p className="font-medium text-sky-900">{info.name}</p>
                <p className="text-sm text-sky-600">{info.type}</p>
              </div>
            </div>

            <div className="text-right">
              {info.status === 'overdue' ? (
                <p className="text-sm font-medium text-red-600">
                  Overdue by {Math.abs(info.daysUntilDue ?? 0)} days
                </p>
              ) : info.status === 'due-soon' ? (
                <p className="text-sm font-medium text-amber-600">
                  Due in {info.daysUntilDue} days
                </p>
              ) : (
                <p className="text-sm text-green-600">Due in {info.daysUntilDue} days</p>
              )}
              {info.nextServiceDue && (
                <p className="text-xs text-sky-500">
                  {info.nextServiceDue.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
