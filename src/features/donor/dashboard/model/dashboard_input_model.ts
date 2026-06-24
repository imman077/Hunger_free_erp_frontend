import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

const milestoneItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  desc: z.string(),
  category: z.string(),
  requirementType: z.string(),
  threshold: z.number(),
  icon: z.string(),
  active: z.boolean(),
});

const gamificationTierSchema = z.object({
  id: z.string(),
  name: z.string(),
  range: z.string(),
  bonus: z.string(),
  pointsRequired: z.number(),
  perks: z.string(),
  color: z.string(),
});

export const dashboardDataSchema = z.object({
  urgentNeedsCount: z.number().default(0),
  milestones: z.array(milestoneItemSchema).default([]),
  tiers: z.array(gamificationTierSchema).default([]),
});

export const dashboardPersistenceConfig = {
  urgentNeedsCount: true,
  milestones: false,
  tiers: false,
};

export const dashboardSchemas = createSchemaBundle(dashboardDataSchema, {
  dataPath: "dashboardData",
  persistenceConfig: dashboardPersistenceConfig,
});

export type DashboardData = z.infer<typeof dashboardDataSchema>;

