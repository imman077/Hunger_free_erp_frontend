import { z } from "zod";

export const RewardConfigSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  val: z.string(),
  pts: z.number(),
  active: z.boolean(),
  tag: z.string().optional(),
  description: z.string().optional(),
  details: z
    .array(z.object({ group: z.string(), text: z.string() }))
    .optional(),
});

export type RewardConfig = z.infer<typeof RewardConfigSchema>;

export const RewardCatalogSchema = z.object({
  donor: z.array(RewardConfigSchema),
  ngo: z.array(RewardConfigSchema),
  volunteer: z.array(RewardConfigSchema),
});

export type RewardCatalog = z.infer<typeof RewardCatalogSchema>;

export const RedemptionSchema = z.object({
  id: z.string(),
  userName: z.string(),
  userType: z.enum(["Donor", "NGO", "Volunteer"]),
  rewardName: z.string(),
  pointsDeducted: z.number(),
  status: z.enum(["Pending", "Approved", "Rejected"]),
  date: z.string(),
});

export type Redemption = z.infer<typeof RedemptionSchema>;
