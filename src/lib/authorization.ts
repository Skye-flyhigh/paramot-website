import type { Session } from 'next-auth';

import { getCustomerByEmail, getCustomerEquipment } from './mockData';

/**
 * Check if the authenticated user owns the specified equipment
 *
 * @param session - NextAuth session (null if not authenticated)
 * @param equipmentId - Equipment ID to check ownership for
 * @returns true if user owns the equipment, false otherwise
 *
 * NOTE: Currently synchronous with mock data. Will become async when using Prisma:
 * const ownership = await prisma.customerEquipment.findFirst({
 *   where: { customerId: session.user.id, equipmentId, ownedUntil: null }
 * });
 */
export function checkEquipmentOwnership(
  session: Session | null,
  equipmentId: string,
): boolean {
  if (!session?.user?.email) return false; // TODO: use auth-check.ts here

  // Get customer by session email
  const customer = getCustomerByEmail(session.user.email);

  if (!customer) return false;

  // Get equipment owned by this customer
  const ownedEquipment = getCustomerEquipment(customer.id);

  // Check if this equipment is in their list
  return ownedEquipment.some((eq) => eq.id === equipmentId);
}

/**
 * Check if the authenticated user owns equipment by serial number
 *
 * @param session - NextAuth session (null if not authenticated)
 * @param serialNumber - Equipment serial number
 * @returns true if user owns the equipment, false otherwise
 *
 * NOTE: Currently synchronous with mock data. Will become async when using Prisma.
 */
export function checkEquipmentOwnershipBySerial(
  session: Session | null,
  serialNumber: string,
): boolean {
  if (!session?.user?.email) return false; // TODO: use auth-check.ts

  // Use test email in development, real email in production
  const lookupEmail = session.user.email;

  const customer = getCustomerByEmail(lookupEmail);

  if (!customer) return false;

  const ownedEquipment = getCustomerEquipment(customer.id);

  return ownedEquipment.some((eq) => eq.serialNumber === serialNumber);
}
