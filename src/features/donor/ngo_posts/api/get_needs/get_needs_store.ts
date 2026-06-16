import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  getNeedsApiOutputSchema,
  getNeedsOutputPersistenceConfig,
} from "./get_needs_output_model";

export const getNeedsApiStore = createCompleteStore(
  getNeedsApiOutputSchema,
  {
    name: "get_needs_api_storage",
    dataPath: "getNeedsApiData",
    persistenceConfig: getNeedsOutputPersistenceConfig,
  }
);

export const {
  model: getNeedsApiOutputModel,
  formSchema: getNeedsApiFormSchema,
} = getNeedsApiStore;

export type GetNeedsApiFormData = z.infer<typeof getNeedsApiFormSchema>;
