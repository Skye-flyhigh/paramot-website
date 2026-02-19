import { z } from 'zod';

export const SERVICE_TYPES = [
  'strength_check',
  'trim_control',
  'canopy_repair',
  'lineset_replacement',
  'partial_replacement',
  'flight_test',
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  strength_check: 'Lines Strength Check',
  trim_control: 'Trim Control',
  canopy_repair: 'Canopy Repair',
  lineset_replacement: 'Lineset Replacement',
  partial_replacement: 'Lines Partial Replacement',
  flight_test: 'Flight Test',
};

export const MEASURE_METHODS = ['differential', 'laser'] as const;

export const sessionCreateSchema = z
  .object({
    // Either equipmentId (existing) or manual fields
    equipmentId: z.string().optional(),
    equipmentType: z.enum(['GLIDER', 'RESERVE', 'HARNESS']),

    // Manual entry fields (used when no equipmentId)
    manualManufacturer: z.string().optional(),
    manualModel: z.string().optional(),
    manualSize: z.string().optional(),

    serviceRecordId: z.string().optional(),
    serialNumber: z.string().optional(),
    productionDate: z.string().optional(),
    serviceTypes: z.array(z.enum(SERVICE_TYPES)).default([]),
    measureMethod: z.enum(MEASURE_METHODS).default('differential'),
    statedHours: z.coerce.number().nonnegative().optional(),
    lastInspection: z.string().optional(),
    hoursSinceLast: z.coerce.number().nonnegative().optional(),
    clientObservations: z.string().max(2000).optional(),
  })
  .refine(
    (data) => {
      // Must have either existing equipment or manual entry
      if (data.equipmentId) return true;

      return data.manualManufacturer && data.manualModel && data.manualSize;
    },
    {
      message: 'Either select existing equipment or enter manufacturer, model, and size',
      path: ['equipmentId'],
    },
  );

export type SessionCreateInput = z.infer<typeof sessionCreateSchema>;

export interface SessionCreateFormState {
  errors: Record<string, string>;
  success: boolean;
  sessionId?: string;
}
