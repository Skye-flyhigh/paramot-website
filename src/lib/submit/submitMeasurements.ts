'use server';

import { z } from 'zod';
import { ensureTechnician } from '../security/workshop-auth';
import { findSessionById } from '../db/sessions';
import { prisma } from '../db/client';

const measurementBatchSchema = z.object({
  sessionId: z.string().min(1),
  phase: z.enum(['initial', 'corrected']),
  side: z.enum(['left', 'right']),
  measurements: z.array(
    z.object({
      lineRow: z.string(), // A, B, C, D, K
      position: z.coerce.number().int().positive(),
      measuredLength: z.coerce.number().positive(),
      manufacturerLength: z.coerce.number().positive().optional(),
    }),
  ),
});

export type MeasurementBatchInput = z.infer<typeof measurementBatchSchema>;

export async function saveTrimMeasurements(input: MeasurementBatchInput) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const parsed = measurementBatchSchema.safeParse(input);

  if (!parsed.success) {
    return { error: 'Invalid data', issues: parsed.error.issues };
  }

  const data = parsed.data;

  const session = await findSessionById(data.sessionId);

  if (!session || session.technician !== auth.email) {
    return { error: 'Session not found' };
  }

  // Upsert: delete existing measurements for this session/phase/side, then create new ones
  await prisma.$transaction([
    prisma.trimMeasurement.deleteMany({
      where: {
        sessionId: data.sessionId,
        phase: data.phase,
        side: data.side,
      },
    }),
    prisma.trimMeasurement.createMany({
      data: data.measurements.map((m) => ({
        sessionId: data.sessionId,
        lineRow: m.lineRow,
        position: m.position,
        side: data.side,
        phase: data.phase,
        measuredLength: m.measuredLength,
        manufacturerLength: m.manufacturerLength ?? null,
        deviation:
          m.manufacturerLength != null ? m.measuredLength - m.manufacturerLength : null,
      })),
    }),
  ]);

  return { success: true };
}
