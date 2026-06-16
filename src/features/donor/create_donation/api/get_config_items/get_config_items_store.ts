import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  getConfigItemsOutputSchema,
  getConfigItemsOutputPersistenceConfig,
} from "./get_config_items_output_model";

export const getConfigItemsApiStore = createCompleteStore(
  getConfigItemsOutputSchema,
  {
    name: "get_config_items_api_storage",
    dataPath: "getConfigItemsApiData",
    persistenceConfig: getConfigItemsOutputPersistenceConfig,
  }
);

export const {
  model: getConfigItemsApiOutputModel,
  formSchema: getConfigItemsApiFormSchema,
} = getConfigItemsApiStore;

export type GetConfigItemsApiFormData = z.infer<typeof getConfigItemsApiFormSchema>;
