import { prisma } from './client';

/**
 * Find equipment by serial number (public lookup for equipment pages)
 * Includes full service history (regardless of current owner)
 *
 * Note: Cost is included but should only be shown to equipment owner in UI
 */
export async function findEquipmentBySerialNumber(serialNumber: string) {
  return await prisma.equipment.findUnique({
    where: { serialNumber },
    include: {
      serviceRecords: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          bookingReference: true,
          serviceCode: true,
          status: true,
          preferredDate: true,
          actualServiceDate: true,
          createdAt: true,
          updatedAt: true,
          // DO NOT include customer info (PII protection)
          // DO NOT include cost (commercially sensitive)
        },
      },
      // Workshop sessions — only completed ones are public
      serviceSessions: {
        where: { status: 'COMPLETED' },
        orderBy: { completedAt: 'desc' },
        select: {
          id: true,
          equipmentType: true,
          serviceTypes: true,
          statedHours: true,
          startedAt: true,
          completedAt: true,
          report: {
            select: {
              airworthy: true,
              nextControlHours: true,
              nextControlMonths: true,
              technicianOpinion: true,
              signedAt: true,
            },
          },
          clothTests: {
            select: {
              surface: true,
              porosityValue: true,
              porosityMethod: true,
              tearResistance: true,
              result: true,
            },
          },
          corrections: {
            select: {
              lineRow: true,
              position: true,
              correctionType: true,
            },
          },
          // NO technician email, NO customer data
        },
      },
    },
  });
}

/**
 * Find equipment by internal ID
 */
export async function findEquipmentById(id: string) {
  return await prisma.equipment.findUnique({
    where: { id },
    include: {
      serviceRecords: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
}

/**
 * Get all equipment currently owned by a customer
 */
export async function findEquipmentByCustomerId(customerId: string) {
  const ownerships = await prisma.customerEquipment.findMany({
    where: {
      customerId,
      ownedUntil: null, // Currently owned
    },
    include: {
      equipment: true,
    },
  });

  return ownerships.map((ownership) => ownership.equipment);
}

/**
 * Get equipment previously owned by a customer
 */
export async function findPreviousEquipmentByCustomerId(customerId: string) {
  const ownerships = await prisma.customerEquipment.findMany({
    where: {
      customerId,
      ownedUntil: { not: null }, // Previously owned
    },
    include: {
      equipment: true,
    },
    orderBy: {
      ownedUntil: 'desc',
    },
  });

  return ownerships.map((ownership) => ownership.equipment);
}

/**
 * Get current owner of equipment by serial number
 */
export async function findCurrentOwnerBySerialNumber(serialNumber: string) {
  const ownership = await prisma.customerEquipment.findFirst({
    where: {
      equipmentSerialNumber: serialNumber,
      ownedUntil: null,
    },
    include: {
      customer: true,
    },
  });

  return ownership?.customer;
}

/**
 * Create new equipment
 */
export async function createEquipment(data: {
  serialNumber: string | null;
  type: 'GLIDER' | 'RESERVE' | 'HARNESS';
  manufacturer: string;
  model: string;
  size: string;
  manufactureDate?: Date;
}) {
  return await prisma.equipment.create({
    data: {
      ...data,
      serialNumber: data.serialNumber ?? `temp-${Date.now()}`,
    },
  });
}

/**
 * Link equipment to a customer (ownership record)
 * Creates a CustomerEquipment junction record
 */
export async function linkEquipmentToCustomer(
  equipmentId: string,
  customerId: string,
  equipmentSerialNumber: string,
) {
  return await prisma.customerEquipment.create({
    data: {
      customerId,
      equipmentId,
      equipmentSerialNumber,
      ownedFrom: new Date(),
      ownedUntil: null, // Currently owns it
    },
  });
}

/**
 * Check if customer already owns this equipment
 */
export async function checkCustomerOwnsEquipment(
  customerId: string,
  equipmentId: string,
): Promise<boolean> {
  const ownership = await prisma.customerEquipment.findFirst({
    where: {
      customerId,
      equipmentId,
      ownedUntil: null, // Currently owned
    },
  });

  return !!ownership;
}
