import { ServiceRecords, Customer, Equipment, CustomerEquipment } from './schema';

// ============================================
// MOCK DATABASE - Simulates PostgreSQL/SQLite
// Using the "Car Registration" pattern for ownership
// ============================================

// Service Records Table
const serviceRecordsTable: ServiceRecords[] = [
  {
    service: 'SVC-011',
    type: 'Annual Service',
    id: 'SVC-011-2025-004',
    serialNb: '12345wer1234',
    manufacturer: 'Ozone',
    model: 'Rush 5',
    size: 'ML',
    status: 'PENDING',
    createdAt: new Date('2025-08-20'),
    cost: 190,
  },
  {
    service: 'PACK-001',
    type: 'Parachute repacking',
    id: 'PACK-001-2024-005',
    serialNb: 'rescue-001',
    manufacturer: 'Gin',
    model: 'Yeti',
    size: '120',
    status: 'PENDING',
    createdAt: new Date('2025-08-20'),
    cost: 90,
  },
  {
    service: 'SVC-001',
    type: 'Line Trim',
    id: 'SVC-001-2025-005',
    serialNb: 'alpha-2024',
    manufacturer: 'Advance',
    model: 'Alpha 7',
    size: '27',
    status: 'COMPLETED',
    createdAt: new Date('2025-04-20'),
    updatedAt: new Date('2025-04-25'),
    cost: 160,
  },
  {
    service: 'SVC-011',
    type: 'Annual Service',
    id: 'SVC-011-2024-004',
    serialNb: '12345wer1234',
    manufacturer: 'Ozone',
    model: 'Rush 5',
    size: 'ML',
    status: 'COMPLETED',
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2024-08-24'),
    cost: 190,
  },
  {
    service: 'REP-001',
    type: 'Line Repair',
    id: 'REP-001-2024-002',
    serialNb: '12345wer1234',
    manufacturer: 'Ozone',
    model: 'Rush 5',
    size: 'ML',
    status: 'COMPLETED',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-12'),
    cost: 45,
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

      // Get equipment they currently own (via ownership table)
      const ownedEquipmentSerialNumbers = customerEquipmentTable
        .filter((ce) => ce.customerId === customer.id && ce.ownedUntil === null)
        .map((ce) => ce.equipmentSerialNumber);

      // Get service history for their equipment
      return {
        ...customer,
        serviceHistory: serviceRecordsTable.filter((service) =>
          ownedEquipmentSerialNumbers.includes(service.serialNb),
        ),
      };
    },

    findById: (id: string): Customer | undefined => {
      const customer = customerTable.find((c) => c.id === id);
      if (!customer) return undefined;

      // Get equipment they currently own
      const ownedEquipmentSerialNumbers = customerEquipmentTable
        .filter((ce) => ce.customerId === customer.id && ce.ownedUntil === null)
        .map((ce) => ce.equipmentSerialNumber);

      return {
        ...customer,
        serviceHistory: serviceRecordsTable.filter((service) =>
          ownedEquipmentSerialNumbers.includes(service.serialNb),
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
      // Get all equipment this customer owns/owned
      const customerEquipmentSerialNumbers = customerEquipmentTable
        .filter((ce) => ce.customerId === customerId)
        .map((ce) => ce.equipmentSerialNumber);

      return serviceRecordsTable.filter((s) =>
        customerEquipmentSerialNumbers.includes(s.serialNb),
      );
    },

    findBySerialNumber: (serialNb: string): ServiceRecords[] => {
      // Returns complete service history regardless of ownership
      return serviceRecordsTable.filter((s) => s.serialNb === serialNb);
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
 * Get equipment by serial number (full equipment record with complete service history)
 */
export function getEquipmentBySerial(serialNb: string): Equipment | undefined {
  return mockDatabase.equipment.findBySerialNumber(serialNb);
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
 */
export function getEquipmentServiceHistory(serialNumber: string): ServiceRecords[] {
  return mockDatabase.serviceRecords.findBySerialNumber(serialNumber);
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
