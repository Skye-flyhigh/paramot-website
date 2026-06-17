import type { CustomerWithDetails } from '@/lib/db/customers';

/** Customer data with all dashboard relations loaded + email from User table */
export type Dashboard = CustomerWithDetails & { email: string };
