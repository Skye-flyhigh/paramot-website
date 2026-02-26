'use server';

import { z } from 'zod';
import { ensureTechnician } from '../security/workshop-auth';
import { findSessionById } from '../db/sessions';
import { prisma } from '../db/client';

const canopyDamageSchema = z.object({
  sessionId: z.string().min(1),
  surface: z.enum(['top', 'bottom', 'internal']),
  cellNumber: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
});

export async function addCanopyDamage(formData: FormData) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const raw = Object.fromEntries(formData);
  const parsed = canopyDamageSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: 'Invalid data', issues: parsed.error.issues };
  }

  const data = parsed.data;

  const session = await findSessionById(data.sessionId);

  if (!session || session.technician !== auth.email) {
    return { error: 'Session not found' };
  }

  const damage = await prisma.canopyDamage.create({
    data: {
      sessionId: data.sessionId,
      surface: data.surface,
      cellNumber: data.cellNumber,
      notes: data.notes,
    },
  });

  return { success: true, damage };
}

export async function deleteCanopyDamage(damageId: string) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const damage = await prisma.canopyDamage.findUnique({
    where: { id: damageId },
    include: { session: { select: { technician: true } } },
  });

  if (!damage || damage.session.technician !== auth.email) {
    return { error: 'Record not found' };
  }

  await prisma.canopyDamage.delete({ where: { id: damageId } });

  return { success: true };
}
