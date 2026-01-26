import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';

import { findCustomerByEmail } from './lib/db';
import { prisma } from './lib/db/client';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: 'noreply@paramot.co.uk',
    }),
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/auth/verify-request', // Magic link sent confirmation page
  },
  callbacks: {
    // PrismaAdapter creates User automatically - we just allow sign-in
    async signIn({ user }) {
      console.log('[Auth] User signed in:', user.email);

      return true;
    },

    // Attach customer data to session if onboarding completed
    async session({ session, user }) {
      if (session.user?.email) {
        const customer = await findCustomerByEmail(session.user.email);

        if (customer) {
          console.log('[Auth] Customer found for session:', customer.id);
          // Attach customer ID and onboarding status
          session.user.customerId = customer.id;
          session.user.onboardingComplete = true;
        } else {
          console.log('[Auth] No customer found - onboarding incomplete');
          session.user.onboardingComplete = false;
        }

        // Attach user ID from database
        session.user.id = user.id;
      }

      return session;
    },
  },
});
