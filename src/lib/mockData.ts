// ============================================
// MOCK DATABASE - Simulates PostgreSQL/SQLite
// Using the "Car Registration" pattern for ownership
// ============================================

import { DateBlock } from './schema';
import { Customer } from './validation/customerSchema';
import { CustomerEquipment } from './validation/dataLinkSchema';
import { Equipment } from './validation/equipmentSchema';
import { ServiceRecords } from './validation/serviceSchema';

// Service Records Table
const serviceRecordsTable: ServiceRecords[] = [
  {
    id: 'clz1a2b3c4d5e6f7g8h9i0j1',
    bookingReference: 'SVC-011-250815-A7F2',
    customerId: 'customer-001',
    equipmentId: 'eq-001',
    serviceCode: 'SVC-011',
    status: 'PENDING',
    preferredDate: '2025-08-20',
    deliveryMethod: 'drop-off',
    contactMethod: 'email',
    specialInstructions: 'Please check A-lines carefully',
    cost: 190,
    createdAt: new Date('2025-08-15'),
    updatedAt: new Date('2025-08-15'),
  },
  {
    id: 'clz2k3l4m5n6o7p8q9r0s1t2',
    bookingReference: 'PACK-001-250818-B3D8',
    customerId: 'customer-001',
    equipmentId: 'eq-002',
    serviceCode: 'PACK-001',
    status: 'PENDING',
    preferredDate: '2025-09-01',
    deliveryMethod: 'post',
    contactMethod: 'phone',
    cost: 90,
    createdAt: new Date('2025-08-18'),
    updatedAt: new Date('2025-08-18'),
  },
  {
    id: 'clz3u4v5w6x7y8z9a0b1c2d3',
    bookingReference: 'SVC-001-250415-C9E4',
    customerId: 'customer-001',
    equipmentId: 'eq-003',
    serviceCode: 'SVC-001',
    status: 'COMPLETED',
    preferredDate: '2025-04-20',
    deliveryMethod: 'drop-off',
    contactMethod: 'email',
    cost: 160,
    actualServiceDate: new Date('2025-04-21'),
    completedBy: 'Tech-001',
    createdAt: new Date('2025-04-15'),
    updatedAt: new Date('2025-04-25'),
  },
  {
    id: 'clz4e5f6g7h8i9j0k1l2m3n4',
    bookingReference: 'SVC-011-240815-D2A9',
    customerId: 'customer-001',
    equipmentId: 'eq-001',
    serviceCode: 'SVC-011',
    status: 'COMPLETED',
    preferredDate: '2024-08-20',
    deliveryMethod: 'drop-off',
    contactMethod: 'text',
    cost: 190,
    actualServiceDate: new Date('2024-08-22'),
    completedBy: 'Tech-002',
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-08-24'),
  },
  {
    id: 'clz5o6p7q8r9s0t1u2v3w4x5',
    bookingReference: 'REP-001-240308-E5F1',
    customerId: 'customer-001',
    equipmentId: 'eq-001',
    serviceCode: 'REP-001',
    status: 'COMPLETED',
    preferredDate: '2024-03-10',
    deliveryMethod: 'drop-off',
    contactMethod: 'email',
    specialInstructions: 'Line damage from tree landing',
    cost: 45,
    actualServiceDate: new Date('2024-03-11'),
    completedBy: 'Tech-001',
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-12'),
  },
];

// Equipment Table - Independent entities (like vehicles in a registry)
const equipmentTable: Equipment[] = [
  {
    id: 'eq-001',
    serialNumber: '12345wer1234',
    type: 'glider',
    manufacturer: 'Ozone',
    model: 'Rush 5',
    size: 'ML',
    manufactureDate: new Date('2022-03-01'),
    status: 'active',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2024-08-24'),
  },
  {
    id: 'eq-002',
    serialNumber: 'rescue-001',
    type: 'reserve',
    manufacturer: 'Gin',
    model: 'Yeti',
    size: '120',
    manufactureDate: new Date('2023-01-15'),
    status: 'active',
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-08-20'),
  },
  {
    id: 'eq-003',
    serialNumber: 'alpha-2024',
    type: 'glider',
    manufacturer: 'Advance',
    model: 'Alpha 7',
    size: '27',
    manufactureDate: new Date('2023-11-01'),
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2025-04-25'),
  },
];

// Ownership Junction Table - Who owns what and when (like car registrations)
const customerEquipmentTable: CustomerEquipment[] = [
  {
    id: 'own-001',
    customerId: 'customer-001',
    equipmentId: 'eq-001',
    equipmentSerialNumber: '12345wer1234',
    ownedFrom: new Date('2023-05-15'),
    ownedUntil: null, // Currently owned
    purchaseDate: new Date('2023-05-15'),
    purchasePrice: 2800,
    notes: 'Bought new from dealer',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15'),
  },
  {
    id: 'own-002',
    customerId: 'customer-001',
    equipmentId: 'eq-002',
    equipmentSerialNumber: 'rescue-001',
    ownedFrom: new Date('2023-06-01'),
    ownedUntil: null, // Currently owned
    purchaseDate: new Date('2023-06-01'),
    purchasePrice: 850,
    notes: 'Reserve parachute',
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-06-01'),
  },
  {
    id: 'own-003',
    customerId: 'customer-001',
    equipmentId: 'eq-003',
    equipmentSerialNumber: 'alpha-2024',
    ownedFrom: new Date('2024-01-10'),
    ownedUntil: null, // Currently owned
    purchaseDate: new Date('2024-01-10'),
    purchasePrice: 3200,
    notes: 'Second-hand from club member',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
];

// Date Blocks Table - Manual unavailability set by admin
const dateBlocksTable: DateBlock[] = [
  {
    id: 'block-001',
    startDate: '2026-12-24',
    endDate: '2026-12-26',
    reason: 'Christmas closure',
    type: 'holiday',
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'block-002',
    startDate: '2026-01-01',
    endDate: '2026-01-01',
    reason: "New Year's Day",
    type: 'holiday',
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'block-003',
    startDate: '2026-02-15',
    endDate: '2026-02-15',
    reason: 'Workshop equipment maintenance',
    type: 'maintenance',
    createdAt: new Date('2026-01-10'),
  },
];

// Customer Table
const customerTable: Customer[] = [
  {
    id: 'customer-001',
    email: 'skye@paramot.co.uk',
    name: 'Skye',
    phone: '+44 7700 900000',
    address: '123 Flight Path, Bristol, BS1 1AA',
    createdAt: new Date('2023-05-01'),
    updatedAt: new Date('2025-04-25'),
    serviceHistory: serviceRecordsTable.filter(
      (s) =>
        s.serialNb === '12345wer1234' ||
        s.serialNb === 'rescue-001' ||
        s.serialNb === 'alpha-2024',
    ),
    communicationPreferences: {},
  },
];

// ============================================
// DATABASE QUERY FUNCTIONS (Simulates Prisma/SQL)
// ============================================

export const mockDatabase = {
  // Customer queries
  customer: {
    findByEmail: (email: string): Customer | undefined => {
      const customer = customerTable.find((c) => c.email === email);

      if (!customer) return undefined;

      // Get service history for this customer
      return {
        ...customer,
        serviceHistory: serviceRecordsTable.filter(
          (service) => service.customerId === customer.id,
        ),
      };
    },

    findById: (id: string): Customer | undefined => {
      const customer = customerTable.find((c) => c.id === id);

      if (!customer) return undefined;

      // Get service history for this customer
      return {
        ...customer,
        serviceHistory: serviceRecordsTable.filter(
          (service) => service.customerId === customer.id,
        ),
      };
    },
  },

  // Equipment queries
  equipment: {
    findByCustomerId: (customerId: string): Equipment[] => {
      // Get currently owned equipment via ownership table
      const ownerships = customerEquipmentTable.filter(
        (ce) => ce.customerId === customerId && ce.ownedUntil === null,
      );

      return ownerships
        .map((own) => equipmentTable.find((eq) => eq.id === own.equipmentId))
        .filter((eq): eq is Equipment => eq !== undefined);
    },

    findPreviouslyOwnedByCustomerId: (customerId: string): Equipment[] => {
      // Get previously owned equipment (ownedUntil is set)
      const ownerships = customerEquipmentTable.filter(
        (ce) => ce.customerId === customerId && ce.ownedUntil !== null,
      );

      return ownerships
        .map((own) => equipmentTable.find((eq) => eq.id === own.equipmentId))
        .filter((eq): eq is Equipment => eq !== undefined);
    },

    findById: (id: string): Equipment | undefined => {
      return equipmentTable.find((eq) => eq.id === id);
    },

    findBySerialNumber: (serialNumber: string): Equipment | undefined => {
      return equipmentTable.find((eq) => eq.serialNumber === serialNumber);
    },

    getCurrentOwner: (serialNumber: string): Customer | undefined => {
      const ownership = customerEquipmentTable.find(
        (ce) => ce.equipmentSerialNumber === serialNumber && ce.ownedUntil === null,
      );

      if (!ownership) return undefined;

      return customerTable.find((c) => c.id === ownership.customerId);
    },
  },

  // Ownership queries
  ownership: {
    findByCustomerId: (customerId: string): CustomerEquipment[] => {
      return customerEquipmentTable.filter((ce) => ce.customerId === customerId);
    },

    findCurrentByCustomerId: (customerId: string): CustomerEquipment[] => {
      return customerEquipmentTable.filter(
        (ce) => ce.customerId === customerId && ce.ownedUntil === null,
      );
    },

    transferOwnership: (
      serialNumber: string,
      newCustomerId: string,
      transferDate: Date,
    ): void => {
      // Find current ownership
      const currentOwnership = customerEquipmentTable.find(
        (ce) => ce.equipmentSerialNumber === serialNumber && ce.ownedUntil === null,
      );

      if (currentOwnership) {
        // End current ownership
        currentOwnership.ownedUntil = transferDate;
        currentOwnership.updatedAt = new Date();

        // Create new ownership record
        const equipment = equipmentTable.find((eq) => eq.serialNumber === serialNumber);

        if (equipment) {
          customerEquipmentTable.push({
            id: `own-${Date.now()}`,
            customerId: newCustomerId,
            equipmentId: equipment.id,
            equipmentSerialNumber: serialNumber,
            ownedFrom: transferDate,
            ownedUntil: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    },
  },

  // Service record queries
  serviceRecords: {
    findById: (id: string): ServiceRecords | undefined => {
      return serviceRecordsTable.find((s) => s.id === id);
    },

    findByCustomerId: (customerId: string): ServiceRecords[] => {
      return serviceRecordsTable.filter((s) => s.customerId === customerId);
    },

    findByEquipmentId: (equipmentId: string): ServiceRecords[] => {
      // Returns complete service history for equipment regardless of ownership
      return serviceRecordsTable.filter((s) => s.equipmentId === equipmentId);
    },

    findByStatus: (status: string): ServiceRecords[] => {
      return serviceRecordsTable.filter((s) => s.status === status);
    },
  },
};

// ============================================
// QUERY HELPERS (Dashboard API)
// ============================================

export const mockServiceHistory = serviceRecordsTable;

/**
 * Simulates looking up customer by OAuth email
 * In production: await prisma.customer.findUnique({ where: { email } })
 */
export function getCustomerByEmail(email: string): Customer | undefined {
  return mockDatabase.customer.findByEmail(email);
}

/**
 * Get all equipment currently owned by a customer
 */
export function getCustomerEquipment(customerId?: string): Equipment[] {
  const id = customerId || 'customer-001';

  return mockDatabase.equipment.findByCustomerId(id);
}

/**
 * Get equipment by our own equipment id (full equipment record with complete service history)
 */
export function getEquipmentById(field: string): Equipment | undefined {
  return mockDatabase.equipment.findById(field);
}

/**
 * Get equipment by manufacturer serial number (full equipment record with complete service history)
 * @param serial Serial Number of the equipment
 * @returns
 */
export function getEquipmentBySerialNumber(serial: string): Equipment | undefined {
  return mockDatabase.equipment.findBySerialNumber(serial);
}

/**
 * Get single service record by ID
 */
export function getServiceById(serviceId: string): ServiceRecords | undefined {
  return mockDatabase.serviceRecords.findById(serviceId);
}

/**
 * Get all upcoming/scheduled services for a customer
 */
export function getUpcomingServices(customerId?: string): ServiceRecords[] {
  const id = customerId || 'customer-001';

  return mockDatabase.serviceRecords
    .findByCustomerId(id)
    .filter((s) => s.status === 'PENDING');
}

/**
 * Get all completed services for a customer
 */
export function getCompletedServices(customerId?: string): ServiceRecords[] {
  const id = customerId || 'customer-001';

  return mockDatabase.serviceRecords
    .findByCustomerId(id)
    .filter((s) => s.status === 'COMPLETED');
}

/**
 * Get complete service history for a piece of equipment (regardless of ownership)
 * @param serialNumber - Equipment serial number (public identifier)
 */
export function getEquipmentServiceHistory(serialNumber: string): ServiceRecords[] {
  // Look up equipment by serial number first
  const equipment = mockDatabase.equipment.findBySerialNumber(serialNumber);

  if (!equipment) return [];

  // Then get service records by equipment ID
  return mockDatabase.serviceRecords.findByEquipmentId(equipment.id);
}

/**
 * Create a new service record (booking)
 * In production this would be: await prisma.serviceRecords.create({ data })
 */
export function createServiceRecord(
  data: Omit<ServiceRecords, 'id' | 'bookingReference' | 'createdAt' | 'updatedAt'>,
): ServiceRecords {
  // Generate CUID-like ID for mock data (in production, Prisma auto-generates)
  const mockCuid = `clz${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;

  // Generate customer-facing booking reference
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 0x10000)
    .toString(16)
    .toUpperCase()
    .padStart(4, '0');
  const bookingReference = `${data.serviceCode}-${year}${month}${day}-${random}`;

  const newRecord: ServiceRecords = {
    ...data,
    id: mockCuid,
    bookingReference,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  serviceRecordsTable.push(newRecord);

  return newRecord;
}

/**
 * Get all date blocks (manual unavailability)
 */
export function getDateBlocks(): DateBlock[] {
  return dateBlocksTable;
}

/**
 * Get bookings for a specific date
 */
export function getBookingsForDate(date: string): ServiceRecords[] {
  return serviceRecordsTable.filter(
    (s) => s.preferredDate === date && s.status === 'PENDING',
  );
}

// ============================================
// FUTURE: Real Database Integration
// ============================================
// When you add a real database, replace mockDatabase with:
//
// export async function getCustomerByEmail(email: string) {
//   return await prisma.customer.findUnique({
//     where: { email },
//     include: { equipment: true, serviceHistory: true }
//   })
// }
//
// The dashboard code won't need to change - just swap the import!
