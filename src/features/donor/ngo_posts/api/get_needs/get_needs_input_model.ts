import { z } from "zod";

export const getNeedsInputSchema = z.object({
  status: z.string().optional().nullable(),
  search: z.string().optional().nullable(),
  urgency: z.string().optional().nullable(),
});

export type GetNeedsInput = z.infer<typeof getNeedsInputSchema>;
