'use server';

import { ensureTechnician } from '../security/workshop-auth';
import { findSessionById } from '../db/sessions';
import { prisma } from '../db/client';

const CONDITION_SCALE = [
  'excellent',
  'good',
  'average',
  'used',
  'worn_out',
  'not_checked',
] as const;

type ConditionRating = (typeof CONDITION_SCALE)[number];

interface DiagnosisInput {
  sessionId: string;
  linesetCondition?: ConditionRating;
  risersCondition?: ConditionRating;
  canopyCondition?: ConditionRating;
  clothCondition?: ConditionRating;
  linesetNotes?: string;
  risersNotes?: string;
  canopyNotes?: string;
  clothNotes?: string;
  generalNotes?: string;
}

export async function saveDiagnosis(input: DiagnosisInput) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const session = await findSessionById(input.sessionId);

  if (!session || session.technician !== auth.email) {
    return { error: 'Session not found' };
  }

  // Upsert diagnosis (one-to-one with session)
  const diagnosis = await prisma.visualDiagnosis.upsert({
    where: { sessionId: input.sessionId },
    create: {
      sessionId: input.sessionId,
      linesetCondition: input.linesetCondition,
      risersCondition: input.risersCondition,
      canopyCondition: input.canopyCondition,
      clothCondition: input.clothCondition,
      linesetNotes: input.linesetNotes,
      risersNotes: input.risersNotes,
      canopyNotes: input.canopyNotes,
      clothNotes: input.clothNotes,
      generalNotes: input.generalNotes,
    },
    update: {
      linesetCondition: input.linesetCondition,
      risersCondition: input.risersCondition,
      canopyCondition: input.canopyCondition,
      clothCondition: input.clothCondition,
      linesetNotes: input.linesetNotes,
      risersNotes: input.risersNotes,
      canopyNotes: input.canopyNotes,
      clothNotes: input.clothNotes,
      generalNotes: input.generalNotes,
    },
  });

  // Transition session from CREATED → IN_PROGRESS on first diagnosis save
  if (session.status === 'CREATED') {
    await prisma.serviceSession.update({
      where: { id: input.sessionId },
      data: { status: 'IN_PROGRESS' },
    });
  }

  return { success: true, diagnosis };
}
