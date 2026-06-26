import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  getPrizesOutputSchema,
  getPrizesOutputPersistenceConfig,
} from "./get_prizes_output_model";

export const getPrizesApiStore = createCompleteStore(
  getPrizesOutputSchema,
  {
    name: "get_prizes_api_storage",
    dataPath: "getPrizesApiData",
    persistenceConfig: getPrizesOutputPersistenceConfig,
  }
);

export const {
  model: getPrizesApiOutputModel,
  formSchema: getPrizesApiFormSchema,
} = getPrizesApiStore;

export type GetPrizesApiFormData = z.infer<typeof getPrizesApiFormSchema>;
