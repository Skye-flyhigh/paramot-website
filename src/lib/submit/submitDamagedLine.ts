'use server';

import { z } from 'zod';
import { ensureTechnician } from '../security/workshop-auth';
import { findSessionById } from '../db/sessions';
import { prisma } from '../db/client';

const damagedLineSchema = z.object({
  sessionId: z.string().min(1),
  side: z.enum(['left', 'right']),
  lineCode: z.string().min(1).max(10),
  notes: z.string().max(500).optional(),
});

export async function addDamagedLine(formData: FormData) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const raw = Object.fromEntries(formData);
  const parsed = damagedLineSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: 'Invalid data', issues: parsed.error.issues };
  }

  const data = parsed.data;

  const session = await findSessionById(data.sessionId);

  if (!session || session.technician !== auth.email) {
    return { error: 'Session not found' };
  }

  const line = await prisma.damagedLine.create({
    data: {
      sessionId: data.sessionId,
      side: data.side,
      lineCode: data.lineCode,
      notes: data.notes,
    },
  });

  return { success: true, line };
}

export async function deleteDamagedLine(lineId: string) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const line = await prisma.damagedLine.findUnique({
    where: { id: lineId },
    include: { session: { select: { technician: true } } },
  });

  if (!line || line.session.technician !== auth.email) {
    return { error: 'Record not found' };
  }

  await prisma.damagedLine.delete({ where: { id: lineId } });

  return { success: true };
}
