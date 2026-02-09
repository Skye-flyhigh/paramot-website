import { OnboardingValues } from '../validation/onboardingForm';
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
  data: OnboardingValues,
) {
  // Use transaction with session variable to bypass RLS during onboarding
  // Set app.onboarding_mode = true so INSERT policy allows creation
  return await prisma.$transaction(async (tx) => {
    // Set session variable to signal onboarding mode
    await tx.$executeRaw`SELECT set_config('app.onboarding_mode', 'true', TRUE)`;

    // Create customer with bypassed RLS
    const result = await tx.$queryRaw<{ id: string }[]>`
      WITH new_customer AS (
        INSERT INTO "Customer" ("id", "userId", "firstName", "lastName", "phone", "termsAcceptedAt", "privacyPolicyAcceptedAt", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(),
          ${userId},
          ${data.firstName},
          ${data.lastName},
          ${data.phone || null},
          ${data.termsAcceptedAt},
          ${data.privacyPolicyAcceptedAt},
          NOW(),
          NOW()
        )
        RETURNING id
      )
      UPDATE "User"
      SET "customerId" = (SELECT id FROM new_customer)
      WHERE "id" = ${userId}
      RETURNING "customerId" as id
    `;

    return { id: result[0].id };
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
