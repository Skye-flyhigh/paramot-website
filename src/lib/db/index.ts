/**
 * Database Service Layer
 * Exports all CRUD operations for use throughout the app
 *
 * Usage:
 * import { findCustomerByEmail, createServiceRecord } from '@/lib/db';
 */

// Re-export everything from module files
export * from './client';
export * from './customers';
export * from './equipment';
export * from './serviceRecords';
export * from './availability';

// Type exports for convenience
export type {
  Customer,
  Equipment,
  ServiceRecords,
  CustomerEquipment,
  DateBlock,
  Address,
  Communication,
} from '@/generated/prisma';
