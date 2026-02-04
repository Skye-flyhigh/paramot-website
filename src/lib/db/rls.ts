import { prisma } from './client';

/**
 * Creates a Prisma client with customer-scoped RLS context
 *
 * Sets PostgreSQL session variable `app.customer_id` for RLS policies
 * Use this for customer-facing operations (dashboard, bookings, etc.)
 *
 * @param customerId - The authenticated customer's ID from ensureCustomer()
 * @returns Extended Prisma client with customer context
 */
export function createCustomerClient(customerId: string) {
  return prisma.$extends({
    name: 'customer-rls',
    query: {
      async $allOperations({ args, query }) {
        // Set session variable + run query in transaction
        // TRUE parameter makes setting LOCAL (lasts only for this transaction)
        const [, result] = await prisma.$transaction([
          prisma.$executeRaw`SELECT set_config('app.customer_id', ${customerId}::text, TRUE)`,
          query(args),
        ]);

        return result;
      },
    },
  });
}

/**
 * Creates a Prisma client with mechanic-scoped RLS context
 *
 * Sets PostgreSQL session variable `app.mechanic_id` for RLS policies
 * Use this for workbench app operations (creating service records, etc.)
 *
 * @param mechanicId - The authenticated mechanic's user ID
 * @returns Extended Prisma client with mechanic context
 */
export function createMechanicClient(mechanicId: string) {
  return prisma.$extends({
    name: 'mechanic-rls',
    query: {
      async $allOperations({ args, query }) {
        // Set session variable + run query in transaction
        // TRUE parameter makes setting LOCAL (lasts only for this transaction)
        const [, result] = await prisma.$transaction([
          prisma.$executeRaw`SELECT set_config('app.mechanic_id', ${mechanicId}::text, TRUE)`,
          query(args),
        ]);

        return result;
      },
    },
  });
}

// ============================================
// USAGE EXAMPLES
// ============================================

// Customer Portal (Next.js app)
// import { createCustomerClient } from '@/lib/db/rls';
// import { ensureCustomer } from '@/lib/security/auth-check';
//
// export async function getMyBookings() {
//   const authResult = await ensureCustomer();
//   if (!authResult.authorized) throw new Error(authResult.error);
//
//   const customerDb = createCustomerClient(authResult.customer.id);
//   const bookings = await customerDb.booking.findMany();
//
//   return bookings; // RLS ensures only this customer's bookings returned
// }

// Workbench App
// import { createMechanicClient } from '@/lib/db/rls';
//
// export async function createServiceRecord(data: ServiceRecordInput) {
//   const session = await auth();
//   if (!session?.user?.id) throw new Error('Unauthorized');
//
//   const mechanicDb = createMechanicClient(session.user.id);
//   const record = await mechanicDb.serviceRecord.create({ data });
//
//   return record; // RLS policy checks mechanic role permissions
// }
