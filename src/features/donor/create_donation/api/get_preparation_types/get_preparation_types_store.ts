import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  getPreparationTypesOutputSchema,
  getPreparationTypesOutputPersistenceConfig,
} from "./get_preparation_types_output_model";

export const getPreparationTypesApiStore = createCompleteStore(
  getPreparationTypesOutputSchema,
  {
    name: "get_preparation_types_api_storage",
    dataPath: "getPreparationTypesApiData",
    persistenceConfig: getPreparationTypesOutputPersistenceConfig,
  }
);

export const {
  model: getPreparationTypesApiOutputModel,
  formSchema: getPreparationTypesApiFormSchema,
} = getPreparationTypesApiStore;

export type GetPreparationTypesApiFormData = z.infer<typeof getPreparationTypesApiFormSchema>;
