import { ServiceRecords } from "./schema";

// Mock service history data - centralized source of truth
export const mockServiceHistory: ServiceRecords[] = [
  {
    service: "SVC-001",
    type: "Annual Service",
    id: "SVC-001-2025-004",
    serialNb: "12345wer1234",
    manufacturer: "Ozone",
    model: "Rush 5",
    size: "ML",
    status: "Scheduled",
    createdAt: new Date("2025-08-20"),
    cost: 100,
  },
  {
    service: "PACK-001",
    type: "Parachute repacking",
    id: "PACK-001-2024-005",
    serialNb: "rescue",
    manufacturer: "Gin",
    model: "Yeti",
    size: "120",
    status: "Scheduled",
    createdAt: new Date("2025-08-20"),
    cost: 50,
  },
  {
    service: "TRIM-001",
    type: "Line Trim",
    id: "TRIM-001-2024-004",
    serialNb: "ehcruirhfqeul",
    manufacturer: "Advance",
    model: "Alpha 4",
    size: "M",
    status: "Completed",
    createdAt: new Date("2025-04-20"),
    updatedAt: new Date("2025-04-25"),
    cost: 80,
  },
  {
    service: "SVC-001",
    type: "Annual Service",
    id: "SVC-001-2024-004",
    serialNb: "12345wer1234",
    manufacturer: "Ozone",
    model: "Rush 5",
    size: "ML",
    status: "Completed",
    createdAt: new Date("2024-08-20"),
    updatedAt: new Date("2024-08-24"),
    cost: 100,
  },
];

// Equipment structure for dashboard display
export interface Equipment {
  serialNb: string;
  manufacturer: string;
  model: string;
  size: string;
  serviceHistory: string[]; // Array of service IDs
  services: ServiceRecords[]; // Full service objects
}

// Build equipment list from service history using your reduce logic
export function buildEquipmentList(
  serviceHistory: ServiceRecords[],
): Record<string, Equipment> {
  return serviceHistory.reduce(
    (acc, service) => {
      if (!acc[service.serialNb]) {
        // First time seeing this serial number - create the equipment entry
        acc[service.serialNb] = {
          serialNb: service.serialNb,
          manufacturer: service.manufacturer,
          model: service.model,
          size: service.size,
          serviceHistory: [],
          services: [],
        };
      }
      acc[service.serialNb].serviceHistory.push(service.id);
      acc[service.serialNb].services.push(service);
      return acc;
    },
    {} as Record<string, Equipment>,
  );
}

// Helper functions for dashboard pages
export function getCustomerEquipment(): Record<string, Equipment> {
  return buildEquipmentList(mockServiceHistory);
}

export function getEquipmentBySerial(serialNb: string): Equipment | undefined {
  const equipmentList = getCustomerEquipment();
  return equipmentList[serialNb];
}

export function getServiceById(serviceId: string): ServiceRecords | undefined {
  return mockServiceHistory.find((service) => service.id === serviceId);
}

export function getUpcomingServices(): ServiceRecords[] {
  return mockServiceHistory.filter((service) => service.status === "Scheduled");
}

export function getCompletedServices(): ServiceRecords[] {
  return mockServiceHistory.filter((service) => service.status === "Completed");
}

// Later, when you have APIs, you'll replace these functions:
// export async function getCustomerEquipment(customerId: string): Promise<Record<string, Equipment>> {
//   const serviceHistory = await fetchServiceHistory(customerId)
//   return buildEquipmentList(serviceHistory)
// }
