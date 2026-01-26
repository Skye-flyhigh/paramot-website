import { prisma } from './client';

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Find customer by email (dashboard lookup)
 * NOTE: Email is in User table, joins to Customer
 */
export async function findCustomerByEmail(email: string) {
  // Find user by email, then get their linked customer
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      customer: {
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
      },
    },
  });

  // Return the customer data (with email added for backward compatibility)
  if (!user?.customer) return null;

  return {
    ...user.customer,
    email: user.email, // Add email from User table for backward compatibility
  };
}

/**
 * Find customer by ID
 * Includes service history and equipment
 */
export async function findCustomerById(id: string) {
  return await prisma.customer.findUnique({
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

// ============================================
// CREATE OPERATION (Onboarding only!)
// ============================================

/**
 * Create customer from onboarding flow
 * ONLY path to customer creation - requires legal consent
 *
 * @param userId - Existing User ID (created by NextAuth during OAuth)
 * @param data - Customer data including legal consent timestamps
 */
export async function createCustomerFromOnboarding(
  userId: string,
  data: {
    firstName: string;
    lastName: string;
    phone?: string;
    termsAcceptedAt: Date;
    privacyPolicyAcceptedAt: Date;
  },
) {
  return await prisma.customer.create({
    data: {
      ...data,
      userId, // Link to existing User
    },
  });
}

// ============================================
// UPDATE OPERATIONS
// ============================================

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
  return await prisma.customer.update({
    where: { id },
    data,
  });
}

// ============================================
// DELETE OPERATION (GDPR compliance)
// ============================================

/**
 * Delete customer record
 * NOTE: This does NOT delete the User - use deleteUserAccount() for full deletion
 *
 * Use case: Customer wants to remove business data but keep auth account
 */
export async function deleteCustomer(customerId: string) {
  return await prisma.customer.delete({
    where: { id: customerId },
  });
}
