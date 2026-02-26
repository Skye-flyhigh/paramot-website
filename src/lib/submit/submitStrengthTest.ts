'use server';

import { z } from 'zod';
import { ensureTechnician } from '../security/workshop-auth';
import { findSessionById } from '../db/sessions';
import { prisma } from '../db/client';

const strengthTestSchema = z.object({
  sessionId: z.string().min(1),
  lineId: z.string().min(1),
  lineRow: z.string().min(1).max(2),
  cascadeLevel: z.coerce.number().int().min(1).max(5),
  side: z.enum(['left', 'right']),
  testType: z.enum(['non_destructive', 'destructive']),
  loadApplied: z.coerce.number().nonnegative(),
  result: z.enum(['pass', 'fail', 'warning']),
  measuredStrength: z.coerce.number().nonnegative().optional(),
  percentRemaining: z.coerce.number().optional(),
  notes: z.string().max(500).optional(),
});

export async function addStrengthTest(formData: FormData) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const raw = Object.fromEntries(formData);
  const parsed = strengthTestSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: 'Invalid data', issues: parsed.error.issues };
  }

  const data = parsed.data;

  const session = await findSessionById(data.sessionId);

  if (!session || session.technician !== auth.email) {
    return { error: 'Session not found' };
  }

  const test = await prisma.strengthTest.create({
    data: {
      sessionId: data.sessionId,
      lineId: data.lineId,
      lineRow: data.lineRow,
      cascadeLevel: data.cascadeLevel,
      side: data.side,
      testType: data.testType,
      loadApplied: data.loadApplied,
      result: data.result,
      measuredStrength: data.measuredStrength,
      percentRemaining: data.percentRemaining,
      notes: data.notes,
    },
  });

  return { success: true, test };
}

export async function deleteStrengthTest(testId: string) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const test = await prisma.strengthTest.findUnique({
    where: { id: testId },
    include: { session: { select: { technician: true } } },
  });

  if (!test || test.session.technician !== auth.email) {
    return { error: 'Test not found' };
  }

  await prisma.strengthTest.delete({ where: { id: testId } });

  return { success: true };
}

/**
 * Find previous strength tests for the same equipment (history from other sessions).
 */
export async function findPreviousStrengthTests(
  equipmentId: string,
  currentSessionId: string,
) {
  return prisma.strengthTest.findMany({
    where: {
      session: {
        equipmentId,
        id: { not: currentSessionId },
        status: 'COMPLETED',
      },
    },
    select: {
      lineId: true,
      side: true,
      testType: true,
      result: true,
      loadApplied: true,
      measuredStrength: true,
      percentRemaining: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
