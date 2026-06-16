import { z } from "zod";

export const ClaimRewardInputSchema = z.object({
  rewardId: z.number(),
  claimDetails: z.any(),
});

export type ClaimRewardInput = z.infer<typeof ClaimRewardInputSchema>;
