import type { Customer } from '@/lib/schema';

import { auth } from '@/auth';
import { getCustomerByEmail } from '@/lib/mockData';

/**
 * Authentication result with session email
 */
interface AuthResult {
  authenticated: true;
  email: string;
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
    email: session.user.email,
  };
}

/**
 * Authorization result with customer data
 */
interface AuthzResult {
  authorized: true;
  customer: Customer;
}

interface AuthzError {
  authorized: false;
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

  const customer = getCustomerByEmail(
    process.env.NODE_ENV === 'development' ? 'skye@paramot.co.uk' : authResult.email,
  );

  if (!customer) {
    return {
      authorized: false,
      error: '❌ Customer not found',
    };
  }

  return {
    authorized: true,
    customer,
  };
}
