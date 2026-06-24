import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  getDietaryTypesOutputSchema,
  getDietaryTypesOutputPersistenceConfig,
} from "./get_dietary_types_output_model";

export const getDietaryTypesApiStore = createCompleteStore(
  getDietaryTypesOutputSchema,
  {
    name: "get_dietary_types_api_storage",
    dataPath: "getDietaryTypesApiData",
    persistenceConfig: getDietaryTypesOutputPersistenceConfig,
  }
);

export const {
  model: getDietaryTypesApiOutputModel,
  formSchema: getDietaryTypesApiFormSchema,
} = getDietaryTypesApiStore;

export type GetDietaryTypesApiFormData = z.infer<typeof getDietaryTypesApiFormSchema>;
