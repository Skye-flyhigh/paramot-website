/**
 * User operations (authentication layer)
 *
 * IMPORTANT: Users are created automatically by NextAuth PrismaAdapter during OAuth sign-in.
 * This file provides READ and DELETE operations only.
 * DO NOT add createUser() - that's handled by NextAuth.
 */
import { prisma } from './client';

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Find user by email (for onboarding checks)
 * Includes linked customer to check onboarding status
 */
export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      customer: true, // Check if they completed onboarding
    },
  });
}

/**
 * Find user by ID
 * Includes linked customer
 */
export async function findUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      customer: true,
    },
  });
}

// ============================================
// DELETE OPERATION (GDPR compliance)
// ============================================

/**
 * Delete user account (onboarding cancellation, GDPR "right to be forgotten")
 * Cascades to Account, Session, and Customer (if linked)
 *
 * Use cases:
 * - User cancels during onboarding
 * - Customer requests account deletion (GDPR)
 */
export async function deleteUserAccount(userId: string) {
  return await prisma.user.delete({
    where: { id: userId },
  });
}
