import { z } from "zod";

export const RewardItemSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    amount: z.string().optional().nullable(),
    desc: z.string().optional().nullable(),
    points: z.number(),
    available: z.boolean(),
    category: z.string().optional().nullable(),
  })
  .passthrough();

export const RewardTierSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string(),
  points: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export const SpinPrizeSchema = z.object({
  id: z.number(),
  label: z.string(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export type RewardItem = z.infer<typeof RewardItemSchema>;
export type RewardTier = z.infer<typeof RewardTierSchema>;
export type SpinPrize = z.infer<typeof SpinPrizeSchema>;

export const GetRewardsResponseSchema = z.union([
  z.array(RewardItemSchema),
  z.object({
    grants: z.array(RewardItemSchema),
    mega: z.array(RewardItemSchema),
    social: z.array(RewardItemSchema),
  }),
]);
export const GetTiersResponseSchema = z.array(RewardTierSchema);
export const GetLuckySpinPrizesResponseSchema = z.array(SpinPrizeSchema);
export const GetNGOProfileResponseSchema = z.any();
export const ClaimRewardResponseSchema = z.any();

export type GetRewardsResponse = z.infer<typeof GetRewardsResponseSchema>;
export type GetTiersResponse = z.infer<typeof GetTiersResponseSchema>;
export type GetLuckySpinPrizesResponse = z.infer<typeof GetLuckySpinPrizesResponseSchema>;
