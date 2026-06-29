import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  removeUpiApiOutputSchema,
  removeUpiOutputPersistenceConfig,
} from "./remove_upi_output_model";

export const removeUpiApiStore = createCompleteStore(
  removeUpiApiOutputSchema,
  {
    name: "remove_upi_api_storage",
    dataPath: "removeUpiApiData",
    persistenceConfig: removeUpiOutputPersistenceConfig,
  }
);

export const {
  model: removeUpiApiOutputModel,
  formSchema: removeUpiApiFormSchema,
} = removeUpiApiStore;

export type RemoveUpiApiFormData = z.infer<typeof removeUpiApiFormSchema>;
