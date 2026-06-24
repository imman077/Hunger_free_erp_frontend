import { z } from "zod";

export const GetGamificationInputSchema = z.object({
  userId: z.union([z.string(), z.number()]),
});

export type GetGamificationInput = z.infer<typeof GetGamificationInputSchema>;
