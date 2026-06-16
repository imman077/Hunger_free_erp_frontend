import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const prizeSchema = z.object({
  id: z.number(),
  label: z.string(),
  icon: z.any(),
  color: z.string(),
});

export const rewardsStateSchema = z.object({
  isSpinModalOpen: z.boolean().default(false),
  isSpinning: z.boolean().default(false),
  rotation: z.number().default(0),
  wonPrize: prizeSchema.nullable().default(null),
  isPrizeModalOpen: z.boolean().default(false),
  isClaimDrawerOpen: z.boolean().default(false),
  selectedReward: z.any().nullable().default(null),
  isSubmittingClaim: z.boolean().default(false),
  showClaimSuccess: z.boolean().default(false),
  pendingClaims: z.array(z.number()).default([]),
  selectedPayout: z.enum(["bank", "upi"]).default("bank"),
});

export const rewardsPersistenceConfig = {
  isSpinModalOpen: false,
  isSpinning: false,
  rotation: false,
  wonPrize: false,
  isPrizeModalOpen: false,
  isClaimDrawerOpen: false,
  selectedReward: false,
  isSubmittingClaim: false,
  showClaimSuccess: false,
  pendingClaims: false,
  selectedPayout: false,
};

export const rewardsSchemas = createSchemaBundle(rewardsStateSchema, {
  dataPath: "rewardsState",
  persistenceConfig: rewardsPersistenceConfig,
});

export type RewardsState = z.infer<typeof rewardsStateSchema>;
export type Prize = z.infer<typeof prizeSchema>;
