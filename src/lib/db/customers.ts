import { prisma } from './client';

/**
 * Find customer by email (OAuth login lookup)
 * Includes service history and equipment
 */
export async function findCustomerByEmail(email: string) {
  return prisma.customer.findUnique({
    where: { email },
    include: {
      serviceRecords: {
        include: {
          equipment: true, // Join equipment data
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      customerEquipment: {
        where: {
          ownedUntil: null, // Currently owned equipment only
        },
        include: {
          equipment: true,
        },
      },
      address: true,
      communicationPreferences: true,
    },
  });
}

/**
 * Find customer by ID
 * Includes service history and equipment
 */
export async function findCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      serviceRecords: {
        include: {
          equipment: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      customerEquipment: {
        where: {
          ownedUntil: null, // Currently owned
        },
        include: {
          equipment: true,
        },
      },
      address: true,
      communicationPreferences: true,
    },
  });
}

/**
 * Create a new customer (first-time OAuth signup)
 */
export async function createCustomer(data: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}) {
  return prisma.customer.create({
    data,
  });
}

/**
 * Update customer profile
 */
export async function updateCustomer(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  },
) {
  return prisma.customer.update({
    where: { id },
    data,
  });
}
