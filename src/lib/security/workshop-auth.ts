import { Session } from 'next-auth';
import { ensureAuthenticated } from './auth-check';

/**
 * Workshop authorization — technician access control.
 * Checks user email against WORKSHOP_TECHNICIAN_EMAILS allowlist.
 */

interface TechnicianResult {
  authorized: true;
  session: Session;
  email: string;
}

interface TechnicianError {
  authorized: false;
  error: string;
}

/**
 * Checks if the current user is an authorized technician.
 * @returns Session with email, or error
 */
export async function ensureTechnician(): Promise<TechnicianResult | TechnicianError> {
  const authResult = await ensureAuthenticated();

  if (!authResult.authenticated) {
    return { authorized: false, error: authResult.error };
  }

  const email = authResult.session.user.email;

  if (!email) {
    return { authorized: false, error: 'No email on session' };
  }

  const allowedEmails =
    process.env.WORKSHOP_TECHNICIAN_EMAILS?.split(',').map((e) =>
      e.trim().toLowerCase(),
    ) ?? [];

  if (!allowedEmails.includes(email.toLowerCase())) {
    return { authorized: false, error: 'Not authorized for workshop access' };
  }

  return {
    authorized: true,
    session: authResult.session,
    email,
  };
}
