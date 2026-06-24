import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  getPointsTiersOutputSchema,
  getPointsTiersOutputPersistenceConfig,
} from "./get_points_tiers_output_model";

export const getPointsTiersApiStore = createCompleteStore(
  getPointsTiersOutputSchema,
  {
    name: "get_points_tiers_api_storage",
    dataPath: "getPointsTiersApiData",
    persistenceConfig: getPointsTiersOutputPersistenceConfig,
  }
);

export const {
  model: getPointsTiersApiOutputModel,
  formSchema: getPointsTiersApiFormSchema,
} = getPointsTiersApiStore;

export type GetPointsTiersApiFormData = z.infer<typeof getPointsTiersApiFormSchema>;
