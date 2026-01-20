import { generateBookingReference } from '../helper/id-generator';
import { prisma } from './client';

/**
 * Find service record by booking reference (customer-facing ID)
 */
export async function findServiceByBookingReference(bookingReference: string) {
  return prisma.serviceRecords.findUnique({
    where: { bookingReference },
    include: {
      customer: true,
      equipment: true,
    },
  });
}

/**
 * Find service record by internal ID
 */
export async function findServiceById(id: string) {
  return prisma.serviceRecords.findUnique({
    where: { id },
    include: {
      customer: true,
      equipment: true,
    },
  });
}

/**
 * Get all service records for a customer
 */
export async function findServicesByCustomerId(customerId: string) {
  return prisma.serviceRecords.findMany({
    where: { customerId },
    include: {
      equipment: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get upcoming/pending services for a customer
 */
export async function findUpcomingServices(customerId: string) {
  return prisma.serviceRecords.findMany({
    where: {
      customerId,
      status: 'PENDING',
    },
    include: {
      equipment: true,
    },
    orderBy: {
      preferredDate: 'asc',
    },
  });
}

/**
 * Get completed services for a customer
 */
export async function findCompletedServices(customerId: string) {
  return prisma.serviceRecords.findMany({
    where: {
      customerId,
      status: 'COMPLETED',
    },
    include: {
      equipment: true,
    },
    orderBy: {
      actualServiceDate: 'desc',
    },
  });
}

/**
 * Get service history for a piece of equipment (by ID)
 */
export async function findServicesByEquipmentId(equipmentId: string) {
  return prisma.serviceRecords.findMany({
    where: { equipmentId },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get bookings for a specific date (for availability checking)
 */
export async function findBookingsForDate(date: string) {
  return prisma.serviceRecords.findMany({
    where: {
      preferredDate: date,
      status: 'PENDING',
    },
  });
}

/**
 * Create a new service record (booking)
 */
export async function createServiceRecord(data: {
  customerId: string;
  equipmentId: string;
  serviceCode: string;
  preferredDate: string;
  deliveryMethod: 'DROP_OFF' | 'POST';
  contactMethod: 'EMAIL' | 'PHONE' | 'TEXT';
  specialInstructions?: string;
  cost: number;
}) {
  // Generate customer-facing booking reference
  const bookingReference = generateBookingReference(data.serviceCode);

  return prisma.serviceRecords.create({
    data: {
      ...data,
      bookingReference,
    },
    include: {
      customer: true,
      equipment: true,
    },
  });
}

/**
 * Update service record (change date, delivery method, etc.)
 */
export async function updateServiceRecord(
  id: string,
  data: {
    preferredDate?: string;
    deliveryMethod?: 'DROP_OFF' | 'POST';
    contactMethod?: 'EMAIL' | 'PHONE' | 'TEXT';
    specialInstructions?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    actualServiceDate?: Date;
    completedBy?: string;
    notes?: string;
  },
) {
  return prisma.serviceRecords.update({
    where: { id },
    data,
    include: {
      customer: true,
      equipment: true,
    },
  });
}

/**
 * Cancel a booking
 */
export async function cancelServiceRecord(id: string) {
  return prisma.serviceRecords.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });
}
