import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';

import { createCustomerFromOnboarding } from './lib/db';
import { prisma } from './lib/db/client';
import sendEmail from './lib/services/user-mailing';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: any[] = [
  Google,
  Resend({
    apiKey: process.env.RESEND_API_KEY!,
    from: 'noreply@paramot.co.uk',
    // Custom magic link email using your existing email service
    sendVerificationRequest: async ({ identifier: email, url }) => {
      const { host } = new URL(url);

      const result = await sendEmail({
        to: { name: email.split('@')[0], email },
        subject: `Sign in to ${host}`,
        message: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button {
                  display: inline-block;
                  background: #0ea5e9;
                  color: white;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: 600;
                }
                .footer { margin-top: 40px; color: #6b7280; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1 style="color: #0c4a6e;">Sign in to paraMOT</h1>
                <p>Click the button below to sign in to your account:</p>
                <p>
                  <a href="${url}" class="button">Sign in</a>
                </p>
                <p style="color: #6b7280; font-size: 14px;">
                  This link will expire in 24 hours and can only be used once.
                </p>
                <div class="footer">
                  <p>If you didn't request this email, you can safely ignore it.</p>
                  <p>— The paraMOT Team</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to send verification email');
      }
    },
  }),
];

// Dev-only: Add test account provider
if (process.env.NODE_ENV === 'development') {
  providers.push(
    Credentials({
      name: 'Test Account',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'test@dev.local' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;

        console.log('[Dev Auth] Attempting login with:', email);

        if (!email) return null;

        // Find or create test user
        let user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true, customerId: true },
        });

        console.log('[Dev Auth] User lookup result:', user);

        if (!user) {
          console.log('[Dev Auth] Creating new user...');
          user = await prisma.user.create({
            data: {
              email,
              emailVerified: new Date(), // Auto-verify dev accounts
            },
            select: { id: true, email: true, name: true, customerId: true },
          });

          console.log('[Dev Auth] User created:', user.id);

          // Also create customer record for test user
          const customer = await createCustomerFromOnboarding(user.id, {
            firstName: 'Test',
            lastName: 'Developer',
            phone: '07700900000',
            termsAcceptedAt: new Date(),
            privacyPolicyAcceptedAt: new Date(),
          });

          console.log('[Dev Auth] Customer created:', customer.id);

          // Re-fetch user to get updated customerId
          user = await prisma.user.findUnique({
            where: { id: user.id },
            select: { id: true, email: true, name: true, customerId: true },
          });

          console.log('[Dev Auth] User after customer creation:', user);
        } else {
          console.log('[Dev Auth] Existing user found, customerId:', user.customerId);
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: '/login',
    verifyRequest: '/auth/verify-request', // Magic link sent confirmation page
  },
  callbacks: {
    // PrismaAdapter creates User automatically - we just allow sign-in
    signIn({ user }) {
      console.log('[Auth] User signed in:', user.email);

      return true;
    },

    // Attach customer data to session if onboarding completed
    async session({ session, user }) {
      console.log('[Auth Session Callback] user:', user);

      if (session.user?.email) {
        // Check if User has a linked Customer (avoid RLS issues by not querying Customer table)
        // User table has no RLS, so this query always succeeds
        const userWithCustomer = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true, customerId: true, email: true },
        });

        console.log('[Auth Session Callback] DB query result:', userWithCustomer);

        if (userWithCustomer?.customerId) {
          console.log('[Auth] Customer found for session:', userWithCustomer.customerId);
          // Attach customer ID and onboarding status
          session.user.customerId = userWithCustomer.customerId;
          session.user.onboardingComplete = true;
        } else {
          console.log('[Auth] No customer found - onboarding incomplete');
          session.user.onboardingComplete = false;
          // Don't redirect here! Set flag and redirect in proxy.ts
        }

        // Attach user ID from database
        session.user.id = user.id;
      }

      return session;
    },
  },
});
