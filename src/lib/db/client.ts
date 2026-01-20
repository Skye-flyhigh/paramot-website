import { PrismaClient } from '@/generated/prisma';

// Prevent multiple instances of Prisma Client in development
// In production: one instance per deployment
// In development: Next.js hot-reload can create multiple instances → connection pool exhaustion

declare global {
  var prisma: PrismaClient | undefined;
}

// Singleton pattern: Prevents connection pool exhaustion during development hot-reloads
export const prisma =
  process.env.NODE_ENV === 'production'
    ? new PrismaClient() // Production: new instance (deployed once)
    : (globalThis.prisma ?? (globalThis.prisma = new PrismaClient())); // Dev: reuse global instance

// Nullish coalescing (??) checks if globalThis.prisma is null/undefined
// If it exists, use it; otherwise create new client and store in globalThis.prisma
