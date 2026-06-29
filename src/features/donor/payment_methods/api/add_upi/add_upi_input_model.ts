import { z } from "zod";

export const addUpiInputSchema = z.object({
  userId: z.string(),
  input: z.object({
    vpa: z.string(),
    label: z.string().optional().default(""),
    isPrimary: z.boolean().optional().default(false),
  }),
});

export type AddUpiInput = z.infer<typeof addUpiInputSchema>;
