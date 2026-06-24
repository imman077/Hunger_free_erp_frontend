import { z } from "zod";

export const MilestoneItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  desc: z.string(),
  category: z.string(),
  requirementType: z.string(),
  threshold: z.number(),
  icon: z.string(),
  active: z.boolean(),
});

export type MilestoneItem = z.infer<typeof MilestoneItemSchema>;

export const GetMilestonesResponseSchema = z.object({
  milestones: z.array(MilestoneItemSchema),
});

export type GetMilestonesResponse = z.infer<typeof GetMilestonesResponseSchema>;
