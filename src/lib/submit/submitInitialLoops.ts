'use server';

import { ensureTechnician } from '../security/workshop-auth';
import { findSessionById } from '../db/sessions';
import { prisma } from '../db/client';

interface LoopMatrix {
  [row: string]: { [group: string]: number };
}

interface SaveLoopsInput {
  sessionId: string;
  side: 'left' | 'right';
  loops: LoopMatrix;
}

export async function saveInitialLoops(input: SaveLoopsInput) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const session = await findSessionById(input.sessionId);

  if (!session || session.technician !== auth.email) {
    return { error: 'Session not found' };
  }

  const field = input.side === 'left' ? 'initialLoopsLeft' : 'initialLoopsRight';

  await prisma.serviceSession.update({
    where: { id: input.sessionId },
    data: { [field]: input.loops },
  });

  return { success: true };
}
