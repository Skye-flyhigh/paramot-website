import { z } from 'zod';
import { MEASURE_METHODS, SERVICE_TYPES } from '../types/services';

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
