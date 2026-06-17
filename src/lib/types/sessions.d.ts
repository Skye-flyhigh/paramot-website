import type { EquipmentType, ServiceStatus, SessionStatus } from '@/generated/prisma';

// =============================================================================
// BASE TYPES - Shared building blocks
// =============================================================================

/** Minimal equipment info for list views */
export type SessionEquipment = {
  manufacturer: string;
  model: string;
  size: string;
};

/** Full equipment record */
export type SessionEquipmentFull = SessionEquipment & {
  id: string;
  serialNumber: string | null;
  type: EquipmentType;
};

/** Customer name from ownership join */
export type SessionCustomer = {
  firstName: string;
  lastName: string;
};

/** Booking reference from service record */
export type SessionBooking = {
  bookingReference: string;
  serviceCode: string;
};

/** Booking with status for full session (ServiceRecords uses ServiceStatus enum) */
export type SessionBookingFull = SessionBooking & {
  id: string;
  status: ServiceStatus; // PENDING | IN_PROGRESS | COMPLETED | CANCELLED
};

/** Glider reference data (manufacturer + model + size) */
export type SessionGliderRef = {
  id: string;
  sizeLabel: string;
  minWeight: number;
  maxWeight: number;
  wingArea: number | null;
  gliderModel: {
    id: string;
    name: string;
    certificationClass: string | null;
    manufacturer: {
      id: string;
      name: string;
    };
  };
};

// =============================================================================
// CHILD RECORDS - Workshop data types
// =============================================================================

export type SessionChecklistItem = {
  id: string;
  serviceType: string;
  stepNumber: number;
  description: string;
  completed: boolean;
  completedAt: Date | null;
  notes: string | null;
};

export type SessionDiagnosis = {
  id: string;
  linesetCondition: string | null;
  risersCondition: string | null;
  canopyCondition: string | null;
  clothCondition: string | null;
  linesetNotes: string | null;
  risersNotes: string | null;
  canopyNotes: string | null;
  clothNotes: string | null;
  generalNotes: string | null;
};

export type SessionClothTest = {
  id: string;
  surface: string;
  panelZone: string | null;
  cellId: string | null;
  porosityValue: number | null;
  porosityMethod: string | null;
  tearResistance: number | null;
  tearResult: string | null;
  result: string | null;
  notes: string | null;
  createdAt: Date;
};

export type SessionTrimMeasurement = {
  id: string;
  lineRow: string;
  position: number;
  side: string;
  phase: string;
  measuredLength: number;
  manufacturerLength: number | null;
  deviation: number | null;
  notes: string | null;
};

export type SessionCorrection = {
  id: string;
  lineRow: string;
  position: number;
  side: string;
  groupLabel: string | null;
  correctionType: string;
  loopsBefore: number | null;
  loopsAfter: number | null;
  loopType: number | null;
  shorteningMm: number | null;
  notes: string | null;
};

export type SessionStrengthTest = {
  id: string;
  lineId: string;
  lineRow: string;
  cascadeLevel: number;
  side: string;
  testType: string;
  loadApplied: number;
  result: string;
  measuredStrength: number | null;
  percentRemaining: number | null;
  notes: string | null;
};

export type SessionDamagedLine = {
  id: string;
  side: string;
  lineCode: string;
  notes: string | null;
};

export type SessionCanopyDamage = {
  id: string;
  surface: string;
  cellNumber: string | null;
  notes: string | null;
};

export type SessionReport = {
  id: string;
  airworthy: boolean;
  nextControlHours: number | null;
  nextControlMonths: number | null;
  technicianOpinion: string | null;
  technicianSignature: string | null;
  signedAt: Date | null;
  canopyRepaired: boolean;
  canopyRepairNotes: string | null;
  additionalJobs: string | null;
};

export type SessionVersion = {
  id: string;
  versionNumber: number;
  status: string;
  snapshot: unknown;
  createdAt: Date;
};

export interface CreateSessionInput {
  equipmentId: string;
  serviceRecordId?: string;
  gliderSizeId?: string;
  equipmentType: EquipmentType;
  serialNumber?: string;
  productionDate?: string;
  serviceTypes?: string[];
  measureMethod?: string;
  technician: string;
  statedHours?: number;
  lastInspection?: Date;
  hoursSinceLast?: number;
  clientObservations?: string;
}

// =============================================================================
// COMPOSED TYPES - Full session shapes
// =============================================================================

/**
 * Session for dashboard list view with progress counts
 * Returned by findAllSessionsByTechnician()
 */
export type SessionsWithRelations = {
  id: string;
  status: SessionStatus;
  equipmentType: EquipmentType;
  serialNumber: string | null;
  startedAt: Date;
  equipment:
    | (SessionEquipment & {
        customerEquipment: { customer: SessionCustomer[] }[];
      })
    | null;
  serviceRecord: SessionBooking | null;
  _count: {
    checklist: number;
    clothTests: number;
    trimMeasurements: number;
    corrections: number;
    strengthTests: number;
  };
};

/**
 * Full session with all child data (session hub / report view)
 * Returned by findSessionWithFullData()
 */
export type SessionWithFullData = {
  // Core session fields
  id: string;
  status: SessionStatus;
  equipmentType: EquipmentType;
  serialNumber: string | null;
  productionDate: string | null;
  measureMethod: string;
  serviceTypes: unknown; // JSON - cast as string[] when used
  technician: string;
  statedHours: number | null;
  lastInspection: Date | null;
  hoursSinceLast: number | null;
  clientObservations: string | null;
  startedAt: Date;
  completedAt: Date | null;

  // Relations
  equipment: SessionEquipmentFull;
  serviceRecord: SessionBookingFull | null;
  gliderSize: SessionGliderRef | null;

  // Child records
  checklist: SessionChecklistItem[];
  diagnosis: SessionDiagnosis | null;
  clothTests: SessionClothTest[];
  trimMeasurements: SessionTrimMeasurement[];
  corrections: SessionCorrection[];
  strengthTests: SessionStrengthTest[];
  damagedLines: SessionDamagedLine[];
  canopyDamages: SessionCanopyDamage[];
  report: SessionReport | null;
  versions: SessionVersion[];
};

// =============================================================================
// PARTIAL TYPES - For specific use cases
// =============================================================================

/**
 * Minimal session for auth checks (findSessionById)
 * Only reads ServiceSession + Equipment (no RLS tables)
 */
export type SessionMinimal = {
  id: string;
  technician: string;
  status: SessionStatus;
  equipmentType: EquipmentType;
  serialNumber: string | null;
  equipment: {
    manufacturer: string;
    model: string;
    size: string;
    serialNumber: string | null;
  };
};

/**
 * Session for customer-facing report view
 * Stripped of internal data (no session ID exposed)
 */
export type SessionCustomerReport = {
  session: {
    id: string;
    equipment: SessionEquipmentFull;
    report: SessionReport | null;
    checklist: SessionChecklistItem[];
    diagnosis: SessionDiagnosis | null;
    clothTests: SessionClothTest[];
    trimMeasurements: SessionTrimMeasurement[];
    corrections: SessionCorrection[];
    strengthTests: SessionStrengthTest[];
    gliderSize: SessionGliderRef | null;
  };
  bookingReference: string;
};

/**
 * Pending booking without a session yet
 * Used for "Start session" quick action
 */
export type PendingBooking = {
  id: string;
  bookingReference: string;
  serviceCode: string;
  status: ServiceStatus;
  preferredDate: string;
  equipment: SessionEquipment & { id: string; serialNumber: string | null };
  customer: {
    firstName: string;
    lastName: string;
  } | null;
};
