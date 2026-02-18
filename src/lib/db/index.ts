/**
 * Database Service Layer
 * Exports all CRUD operations for use throughout the app
 *
 * Usage:
 * import { findCustomerByEmail, createServiceRecord } from '@/lib/db';
 */

// Re-export everything from module files
export * from './availability';
export * from './client';
export * from './customers';
export * from './equipment';
export * from './serviceRecords';
export * from './users';

// Type exports for convenience
export type {
  Address,
  Communication,
  Customer,
  CustomerEquipment,
  DateBlock,
  Equipment,
  ServiceRecords,
  ServiceStatus,
} from '@/generated/prisma';
