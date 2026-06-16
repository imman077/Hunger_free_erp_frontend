import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const dashboardDataSchema = z.object({
  isInitialized: z.boolean().default(false),
});

export const dashboardPersistenceConfig = {
  isInitialized: true,
};

export const dashboardSchemas = createSchemaBundle(dashboardDataSchema, {
  dataPath: "dashboardData",
  persistenceConfig: dashboardPersistenceConfig,
});

export type DashboardData = z.infer<typeof dashboardDataSchema>;
