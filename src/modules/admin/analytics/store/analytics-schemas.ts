import { z } from "zod";

export const ImpactMetricSchema = z.object({
  label: z.string(),
  val: z.string(),
  trend: z.string(),
  color: z.string(),
});

export const DonationTrendSchema = z.object({
  day: z.string(),
  donations: z.number(),
  distributed: z.number(),
});

export const CategoryDataSchema = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string(),
});

export type ImpactMetric = z.infer<typeof ImpactMetricSchema>;
export type DonationTrend = z.infer<typeof DonationTrendSchema>;
export type CategoryData = z.infer<typeof CategoryDataSchema>;
