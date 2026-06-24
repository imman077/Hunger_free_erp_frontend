import { z } from "zod";

export const ClaimRewardInputSchema = z.object({
  rewardId: z.union([z.string(), z.number()]),
  claimDetails: z.any(),
});

export type ClaimRewardInput = z.infer<typeof ClaimRewardInputSchema>;
