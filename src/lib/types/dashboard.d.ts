import type {
  Address,
  Communication,
  Customer,
  CustomerEquipment,
  Equipment,
  ServiceRecords,
} from '@/lib/db';

// Customer data with all relations loaded (matches ensureCustomer query)
// Flattened with email for dashboard context
export type Dashboard = Customer & {
  serviceRecords: (ServiceRecords & { equipment: Equipment })[];
  customerEquipment: (CustomerEquipment & { equipment: Equipment })[];
  address: Address | null;
  communicationPreferences: Communication | null;
  email: string;
};
