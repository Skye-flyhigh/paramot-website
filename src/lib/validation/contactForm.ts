import { z } from 'zod';
import { escapeHTML } from '../security/escapeHTML';

export const ContactDataSchema = z
  .object({
    name: z.string().min(1, 'Missing a name'),
    email: z.string().email(),
    message: z.string().min(10, 'Message is missing'),
    equipmentContext: z.string().optional(),
  })
  .transform((v) => ({
    name: escapeHTML(v.name),
    email: escapeHTML(v.email),
    message: escapeHTML(v.message),
    equipmentContext: v.equipmentContext ? escapeHTML(v.equipmentContext) : undefined,
  }));
