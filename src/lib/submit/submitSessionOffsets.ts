'use server';

import { z } from 'zod';
import { ensureTechnician } from '../security/workshop-auth';
import { findSessionById } from '../db/sessions';
import { prisma } from '../db/client';

const offsetsSchema = z.object({
  sessionId: z.string().min(1),
  gliderOffset: z.coerce.number().optional(),
  brakeOffset: z.coerce.number().optional(),
});

export async function saveSessionOffsets(formData: FormData) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return { error: 'Not authorized' };

  const raw = Object.fromEntries(formData);
  const parsed = offsetsSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: 'Invalid data' };
  }

  const data = parsed.data;

  const session = await findSessionById(data.sessionId);

  if (!session || session.technician !== auth.email) {
    return { error: 'Session not found' };
  }

  await prisma.serviceSession.update({
    where: { id: data.sessionId },
    data: {
      gliderOffset: data.gliderOffset ?? null,
      brakeOffset: data.brakeOffset ?? null,
    },
  });

  return { success: true };
}
