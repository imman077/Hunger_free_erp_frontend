import { z } from "zod";

export const getPrizesInputSchema = z.object({
  role: z.string().optional().default("DONOR"),
});

export type GetPrizesInput = z.infer<typeof getPrizesInputSchema>;
