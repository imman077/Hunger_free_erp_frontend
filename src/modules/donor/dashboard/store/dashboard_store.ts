import { z } from "zod";
import { createCompleteStore } from "../../../../core/utility";
import {
  dashboardDataSchema,
  dashboardPersistenceConfig,
} from "../model/dashboard_input_model";

export const dashboardStore = createCompleteStore(dashboardDataSchema, {
  name: "dashboard_storage",
  dataPath: "dashboardData",
  persistenceConfig: dashboardPersistenceConfig,
});

export const {
  model: dashboardInputModel,
  formSchema: dashboardFormSchema,
} = dashboardStore;

export type DashboardFormData = z.infer<typeof dashboardFormSchema>;
