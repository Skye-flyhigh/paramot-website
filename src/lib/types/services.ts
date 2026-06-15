// Runtime constants for Zod schemas and validation
// Types are re-exported for convenience

export const SERVICE_TYPES = [
  'strength_check',
  'trim_control',
  'canopy_repair',
  'lineset_replacement',
  'partial_replacement',
  'flight_test',
] as const;

export const MEASURE_METHODS = ['differential', 'laser'] as const;

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

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  strength_check: 'Lines Strength Check',
  trim_control: 'Trim Control',
  canopy_repair: 'Canopy Repair',
  lineset_replacement: 'Lineset Replacement',
  partial_replacement: 'Lines Partial Replacement',
  flight_test: 'Flight Test',
};

// Re-export types for convenience
export type ServiceType = (typeof SERVICE_TYPES)[number];
export type MeasureMethod = (typeof MEASURE_METHODS)[number];
export type ServiceCode = (typeof SERVICE_CODE)[number];
