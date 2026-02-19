'use server';

import { z } from 'zod';
import { ensureTechnician } from '../security/workshop-auth';
import { findSessionById } from '../db/sessions';
import { prisma } from '../db/client';

const clothTestSchema = z.object({
  sessionId: z.string().min(1),
  surface: z.enum(['top', 'bottom', 'internal']),
  panelZone: z.string().optional(),
  cellId: z.string().optional(),
  porosityValue: z.coerce.number().nonnegative().optional(),
  porosityMethod: z.enum(['bettsometer', 'jdc', 'porotest']).optional(),
  tearResistance: z.coerce.number().nonnegative().optional(),
  tearResult: z.string().optional(),
  result: z.enum(['pass', 'warning', 'fail']).optional(),
  notes: z.string().max(500).optional(),
});

export async function addClothTest(formData: FormData) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const raw = Object.fromEntries(formData);
  const parsed = clothTestSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: 'Invalid data', issues: parsed.error.issues };
  }

  const data = parsed.data;

  const session = await findSessionById(data.sessionId);

  if (!session || session.technician !== auth.email) {
    return { error: 'Session not found' };
  }

  const test = await prisma.clothTest.create({
    data: {
      sessionId: data.sessionId,
      surface: data.surface,
      panelZone: data.panelZone,
      cellId: data.cellId,
      porosityValue: data.porosityValue,
      porosityMethod: data.porosityMethod,
      tearResistance: data.tearResistance,
      tearResult: data.tearResult,
      result: data.result,
      notes: data.notes,
    },
  });

  return { success: true, test };
}

export async function deleteClothTest(testId: string) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const test = await prisma.clothTest.findUnique({
    where: { id: testId },
    include: { session: { select: { technician: true } } },
  });

  if (!test || test.session.technician !== auth.email) {
    return { error: 'Test not found' };
  }

  await prisma.clothTest.delete({ where: { id: testId } });

  return { success: true };
}
