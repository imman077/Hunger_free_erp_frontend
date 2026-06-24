import { z } from "zod";

export const GetGamificationResponseSchema = z.object({
  me: z.object({
    id: z.string(),
    gamification: z.object({
      points: z.number().default(0),
    }).nullable().optional(),
  }).nullable().optional(),
});

export type GetGamificationResponse = z.infer<typeof GetGamificationResponseSchema>;
