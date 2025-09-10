import { z } from "zod";

export const ContactDataSchema = z.object({
  name: z.string().min(1, "Missing a name"),
  email: z.email(),
  message: z.string().min(10, "Message is missing"),
});
