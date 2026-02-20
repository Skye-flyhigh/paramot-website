'use server';

import { z } from 'zod';
import { ensureTechnician } from '../security/workshop-auth';
import { findSessionById } from '../db/sessions';
import { prisma } from '../db/client';
import { autoClothResult } from '../workshop/cloth-calculations';

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

  // Auto-compute result from measurements if not explicitly provided
  const computedResult =
    data.result ??
    autoClothResult(
      data.porosityValue ?? null,
      data.porosityMethod ?? null,
      data.tearResistance ?? null,
    );

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
      result: computedResult,
      notes: data.notes,
    },
  });

  return { success: true, test };
}

/**
 * Initialize 4 default test point skeletons (cells 2, 4, 6, 8 on top surface).
 * Only works when session has zero existing cloth tests.
 */
export async function initDefaultClothTests(sessionId: string) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const session = await findSessionById(sessionId);

  if (!session || session.technician !== auth.email) {
    return { error: 'Session not found' };
  }

  const existing = await prisma.clothTest.count({ where: { sessionId } });

  if (existing > 0) {
    return { error: 'Tests already exist for this session' };
  }

  const defaults = [2, 4, 6, 8].map((cell) => ({
    sessionId,
    surface: 'top',
    cellId: String(cell),
  }));

  await prisma.clothTest.createMany({ data: defaults });

  const created = await prisma.clothTest.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
  });

  return { success: true, tests: created };
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
