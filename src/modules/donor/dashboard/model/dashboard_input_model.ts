import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const dashboardDataSchema = z.object({
  urgentNeedsCount: z.number().default(0),
});

export const dashboardPersistenceConfig = {
  urgentNeedsCount: true,
};

export const dashboardSchemas = createSchemaBundle(dashboardDataSchema, {
  dataPath: "dashboardData",
  persistenceConfig: dashboardPersistenceConfig,
});

export type DashboardData = z.infer<typeof dashboardDataSchema>;
