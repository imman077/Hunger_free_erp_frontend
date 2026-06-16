import { z } from "zod";

export const ProfileUpdateInputSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateInputSchema>;
