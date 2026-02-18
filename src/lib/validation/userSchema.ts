import z from 'zod';
import { escapeHTML } from '../security/escapeHTML';

export interface User {
  name: string;
  userId?: string;
  email: string;
}

export const UserDataSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'Name is required')
      .max(100, 'Name must be less than 100 characters'),
    lastName: z
      .string()
      .min(2, 'Last name is required')
      .max(100, 'Last name must be less than 100 characters'),
    email: z.email('Invalid email address'),
    userId: z.uuid().optional(),
  })
  .transform((data) => ({
    ...data,
    firstName: escapeHTML(data.firstName),
    lastName: escapeHTML(data.lastName),
    email: escapeHTML(data.email),
  }));

export type ValidatedUserData = z.infer<typeof UserDataSchema>;
