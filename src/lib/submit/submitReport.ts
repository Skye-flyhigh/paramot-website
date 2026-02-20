'use server';

import { z } from 'zod';
import { ensureTechnician } from '../security/workshop-auth';
import { findSessionById, updateSessionStatus } from '../db/sessions';
import { prisma } from '../db/client';

const reportSchema = z.object({
  sessionId: z.string().min(1),
  airworthy: z.coerce.boolean(),
  nextControlHours: z.coerce.number().nonnegative().optional(),
  nextControlMonths: z.coerce.number().nonnegative().optional(),
  technicianOpinion: z.string().max(2000).optional(),
  technicianSignature: z.string().min(1, 'Signature is required'),
  canopyRepaired: z.coerce.boolean().optional(),
  canopyRepairNotes: z.string().max(1000).optional(),
  additionalJobs: z.string().max(2000).optional(),
});

export async function submitReport(formData: FormData) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const raw = Object.fromEntries(formData);
  const parsed = reportSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0] as string;

      fieldErrors[key] = issue.message;
    });

    return { error: 'Validation failed', fieldErrors };
  }

  const data = parsed.data;

  const session = await findSessionById(data.sessionId);

  if (!session || session.technician !== auth.email) {
    return { error: 'Session not found' };
  }

  // Upsert report (one-to-one with session)
  await prisma.sessionReport.upsert({
    where: { sessionId: data.sessionId },
    create: {
      sessionId: data.sessionId,
      airworthy: data.airworthy,
      nextControlHours: data.nextControlHours,
      nextControlMonths: data.nextControlMonths,
      technicianOpinion: data.technicianOpinion,
      technicianSignature: data.technicianSignature,
      signedAt: new Date(),
      canopyRepaired: data.canopyRepaired ?? false,
      canopyRepairNotes: data.canopyRepairNotes,
      additionalJobs: data.additionalJobs,
      reportVersion: 1,
    },
    update: {
      airworthy: data.airworthy,
      nextControlHours: data.nextControlHours,
      nextControlMonths: data.nextControlMonths,
      technicianOpinion: data.technicianOpinion,
      technicianSignature: data.technicianSignature,
      signedAt: new Date(),
      canopyRepaired: data.canopyRepaired ?? false,
      canopyRepairNotes: data.canopyRepairNotes,
      additionalJobs: data.additionalJobs,
    },
  });

  // Transition session to COMPLETED
  await updateSessionStatus(data.sessionId, 'COMPLETED', auth.email);

  // If linked to a ServiceRecord, mark it as completed
  const fullSession = await prisma.serviceSession.findUnique({
    where: { id: data.sessionId },
    select: { serviceRecordId: true },
  });

  if (fullSession?.serviceRecordId) {
    await prisma.serviceRecords.update({
      where: { id: fullSession.serviceRecordId },
      data: { status: 'COMPLETED' },
    });
  }

  return { success: true };
}
