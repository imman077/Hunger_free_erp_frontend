import { z } from "zod";

/**
 * Schema for individual dashboard statistic cards
 */
export const DashboardStatSchema = z.object({
  title: z.string(),
  value: z.string(),
  change: z.string(),
  changeColor: z.string(), // e.g., 'text-green-600' or 'text-red-600'
});

/**
 * Schema for a single dataset in a chart
 */
export const ChartDatasetSchema = z.object({
  label: z.string(),
  data: z.array(z.number()),
  backgroundColor: z.union([z.string(), z.array(z.string())]),
  borderColor: z.union([z.string(), z.array(z.string())]).optional(),
});

/**
 * Schema for full chart data
 */
export const ChartDataSchema = z.object({
  labels: z.array(z.string()),
  datasets: z.array(ChartDatasetSchema),
});

/**
 * Main Dashboard Data Schema
 */
export const DashboardDataSchema = z.object({
  stats: z.array(DashboardStatSchema),
  donationsChart: ChartDataSchema.optional(),
  userGrowthChart: ChartDataSchema.optional(),
});

export type DashboardStat = z.infer<typeof DashboardStatSchema>;
export type ChartDataset = z.infer<typeof ChartDatasetSchema>;
export type ChartData = z.infer<typeof ChartDataSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
