import 'next-auth';

declare module 'next-auth' {
  /**
   * Extend the built-in session.user type
   */
  interface User {
    customerId?: string;
    onboardingComplete?: boolean;
  }

  interface Session {
    user: User & {
      id: string;
      email: string;
      name?: string;
      image?: string;
    };
  }
}
