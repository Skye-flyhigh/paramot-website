'use server';

import { z } from 'zod';
import { ensureTechnician } from '../security/workshop-auth';
import { findSessionById } from '../db/sessions';
import { prisma } from '../db/client';

const correctionSchema = z.object({
  sessionId: z.string().min(1),
  lineRow: z.string().min(1),
  position: z.coerce.number().int().positive(),
  side: z.enum(['left', 'right']),
  groupLabel: z.string().optional(),
  correctionType: z.enum(['loop_add', 'loop_remove', 'line_replace', 'other']),
  loopsBefore: z.coerce.number().int().nonnegative().optional(),
  loopsAfter: z.coerce.number().int().nonnegative().optional(),
  loopType: z.coerce.number().int().min(1).max(5).optional(),
  shorteningMm: z.coerce.number().optional(),
  notes: z.string().max(500).optional(),
});

export async function addCorrection(formData: FormData) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const raw = Object.fromEntries(formData);
  const parsed = correctionSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: 'Invalid data', issues: parsed.error.issues };
  }

  const data = parsed.data;

  const session = await findSessionById(data.sessionId);

  if (!session || session.technician !== auth.email) {
    return { error: 'Session not found' };
  }

  const correction = await prisma.correctionLog.create({
    data: {
      sessionId: data.sessionId,
      lineRow: data.lineRow,
      position: data.position,
      side: data.side,
      groupLabel: data.groupLabel,
      correctionType: data.correctionType,
      loopsBefore: data.loopsBefore,
      loopsAfter: data.loopsAfter,
      loopType: data.loopType,
      shorteningMm: data.shorteningMm,
      notes: data.notes,
    },
  });

  return { success: true, correction };
}

export async function deleteCorrection(correctionId: string) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const correction = await prisma.correctionLog.findUnique({
    where: { id: correctionId },
    include: { session: { select: { technician: true } } },
  });

  if (!correction || correction.session.technician !== auth.email) {
    return { error: 'Correction not found' };
  }

  await prisma.correctionLog.delete({ where: { id: correctionId } });

  return { success: true };
}
