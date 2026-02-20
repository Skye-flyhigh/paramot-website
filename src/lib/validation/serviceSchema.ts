export interface ServiceChecks {
  trim?: boolean;
  cloth?: boolean;
  porosity?: boolean;
  betsometer?: boolean;
  line?: boolean;
}

export interface ServicesType {
  icon: string; // Icon name as string (mapped to component in ServiceCard)
  title: string;
  description: string;
  code: ServiceCode;
  cost: number | string;
  available: boolean;
  checks?: ServiceChecks;
  gridGroup?: string; // Groups solo/tandem pairs for comparison grid (e.g. "visual-check")
  gridLabel?: string; // Display name in grid column header (e.g. "Visual Check")
  variant?: 'solo' | 'tandem'; // Which variant within a grid group
}

export const SERVICE_CODE = [
  'SVC-001',
  'SVC-002',
  'SVC-003',
  'SVC-004',
  'SVC-011',
  'SVC-012',
  'SVC-031',
  'PACK-001',
  'PACK-002',
  'REP-001',
] as const;
export type ServiceCode = (typeof SERVICE_CODE)[number];

export const SERVICE_STATUSES = [
  'PENDING',
  'IN_PROGRESS',
  'AWAITING',
  'COMPLETED',
  'CANCELLED',
] as const;
export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export interface ServiceRecords {
  // Identifiers
  id: string; // Internal database ID (CUID)
  bookingReference: string; // Customer-facing reference for invoices: "SVC-001-260512-3F5D"

  // Foreign Keys (joining table)
  customerId: string; // Who booked this service
  equipmentId: string; // What equipment is being serviced

  // Service details
  serviceCode: ServiceCode; // What type of service (SVC-001, PACK-001, etc.)
  status: ServiceStatus; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED

  // Booking details (from customer form)
  preferredDate: string; // Customer's preferred service date
  deliveryMethod: 'drop-off' | 'post'; // How they'll send equipment
  contactMethod: 'email' | 'phone' | 'text'; // Preferred contact
  specialInstructions?: string; // Customer notes (optional)

  // Business/operational data
  cost: number; // Price in £ (calculated from serviceCode + discounts)
  actualServiceDate?: Date; // When service was actually performed (null until completed)
  completedBy?: string; // Technician who completed the service

  // Timestamps
  createdAt: Date; // When booking was created
  updatedAt?: Date; // Last modification
}
