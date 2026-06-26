import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  getProfileApiOutputSchema,
  getProfileOutputPersistenceConfig,
} from "./get_profile_output_model";

export const getProfileApiStore = createCompleteStore(
  getProfileApiOutputSchema,
  {
    name: "get_profile_api_storage",
    dataPath: "getProfileApiData",
    persistenceConfig: getProfileOutputPersistenceConfig,
  }
);

export const {
  model: getProfileApiOutputModel,
  formSchema: getProfileApiFormSchema,
} = getProfileApiStore;

export type GetProfileApiFormData = z.infer<typeof getProfileApiFormSchema>;
