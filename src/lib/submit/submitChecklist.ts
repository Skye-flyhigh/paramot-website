'use server';

import { ensureTechnician } from '../security/workshop-auth';
import { prisma } from '../db/client';

export async function toggleChecklistStep(stepId: string, completed: boolean) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  // Verify the step belongs to a session owned by this technician
  const step = await prisma.serviceChecklist.findUnique({
    where: { id: stepId },
    include: { session: { select: { technician: true } } },
  });

  if (!step || step.session.technician !== auth.email) {
    return { error: 'Step not found' };
  }

  await prisma.serviceChecklist.update({
    where: { id: stepId },
    data: {
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  return { success: true };
}

export async function updateChecklistNotes(stepId: string, notes: string) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const step = await prisma.serviceChecklist.findUnique({
    where: { id: stepId },
    include: { session: { select: { technician: true } } },
  });

  if (!step || step.session.technician !== auth.email) {
    return { error: 'Step not found' };
  }

  await prisma.serviceChecklist.update({
    where: { id: stepId },
    data: { notes },
  });

  return { success: true };
}
