import { z } from "zod";

export const GamificationTierSchema = z.object({
  id: z.string(),
  name: z.string(),
  range: z.string(),
  bonus: z.string(),
  pointsRequired: z.number(),
  perks: z.string(),
  color: z.string(),
});

export type GamificationTier = z.infer<typeof GamificationTierSchema>;

export const GetTiersResponseSchema = z.object({
  gamificationTiers: z.array(GamificationTierSchema),
});

export type GetTiersResponse = z.infer<typeof GetTiersResponseSchema>;
