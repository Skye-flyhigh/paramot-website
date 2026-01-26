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
        // Include all fields - UI will conditionally render sensitive data based on ownership
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
  serialNumber: string;
  type: 'GLIDER' | 'RESERVE' | 'HARNESS';
  manufacturer: string;
  model: string;
  size: string;
  manufactureDate?: Date;
}) {
  return await prisma.equipment.create({
    data,
  });
}
