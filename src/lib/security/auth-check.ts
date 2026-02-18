import { auth } from '@/auth';
import type { Dashboard } from '@/lib/types/dashboard';
import { Session } from 'next-auth';

/**
 * Authentication result with session email
 */
interface AuthResult {
  authenticated: true;
  session: Session;
}

interface AuthError {
  authenticated: false;
  error: string;
}

/**
 * Checks if user is authenticated
 * @returns User email or error message
 */
export async function ensureAuthenticated(): Promise<AuthResult | AuthError> {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      authenticated: false,
      error: '🔒 Unauthorized: You must be logged in',
    };
  }

  return {
    authenticated: true,
    session: session,
  };
}

/**
 * Authorization result with customer data
 * Note: customer here is CustomerWithRelations (before email is added)
 */
interface AuthzResult {
  authorized: true;
  customer: Omit<Dashboard, 'email'>;
  email: string;
}

interface AuthzError {
  authorized: false;
  session?: Session;
  error: string;
}

/**
 * Checks authentication + verifies customer exists
 * @returns Customer object or error message
 */
export async function ensureCustomer(): Promise<AuthzResult | AuthzError> {
  const authResult = await ensureAuthenticated();

  if (!authResult.authenticated) {
    return {
      authorized: false,
      error: authResult.error,
    };
  }

  const session = authResult.session;

  // Check if user has completed onboarding (User table has no RLS)
  if (!session.user.customerId || !session.user.onboardingComplete) {
    return {
      authorized: false,
      session,
      error: '❌ Customer not found - onboarding incomplete',
    };
  }

  // Get full customer data using RLS client
  const { createCustomerClient } = await import('../db/rls');
  const customerDb = createCustomerClient(session.user.customerId);

  const customer = await customerDb.customer.findUnique({
    where: { id: session.user.customerId },
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

  if (!customer) {
    return {
      authorized: false,
      session,
      error: '❌ Customer record not found',
    };
  }

  return {
    authorized: true,
    customer,
    email: session.user.email,
  };
}
