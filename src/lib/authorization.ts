import { prisma } from '@/lib/db';
import { Customer } from './db';
import { ensureCustomer } from './security/auth-check';

type OwnershipState = { isOwner: true } | { isOwner: false; error: string };

/**
 * Check if the authenticated user owns the specified equipment
 *
 * @param equipmentId - Equipment ID to check ownership for
 * @returns true if user owns the equipment, false otherwise
 */
export async function checkEquipmentOwnershipById(
  equipmentId: string,
): Promise<OwnershipState> {
  const authCheck = await authCheckHelperForOwnership();

  if (!authCheck.success) return { isOwner: false, error: authCheck.error };

  const ownership = await prisma.customerEquipment.findFirst({
    where: {
      customerId: authCheck.customer.id,
      equipmentId,
      ownedUntil: null,
    },
  });

  // Check if this equipment is in their list
  return ownership
    ? { isOwner: true }
    : { isOwner: false, error: 'Equipment not owned by customer' };
}

/**
 * Check if the authenticated user owns equipment by serial number
 *
 * @param serialNumber - Equipment serial number
 * @returns true if user owns the equipment, false otherwise
 */
export async function checkEquipmentOwnershipBySerial(
  serialNumber: string,
): Promise<OwnershipState> {
  const authCheck = await authCheckHelperForOwnership();

  if (!authCheck.success) return { isOwner: false, error: authCheck.error };

  const ownership = await prisma.customerEquipment.findFirst({
    where: {
      customerId: authCheck.customer.id,
      equipment: { serialNumber },
      ownedUntil: null,
    },
  });

  return ownership
    ? { isOwner: true }
    : { isOwner: false, error: 'Equipment not owned by customer' };
}

type AuthCheck =
  | { success: true; customer: Customer }
  | { success: false; error: string };
/**
 * Helper function checking the auth and making sure the customer exist
 * @returns OwnershipState | Customer
 */
async function authCheckHelperForOwnership(): Promise<AuthCheck> {
  const authResults = await ensureCustomer();

  if (!authResults.authorized) {
    return { success: false, error: authResults.error };
  }

  return { success: true, customer: authResults.customer };
}
