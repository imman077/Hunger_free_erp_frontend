import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  addUpiApiOutputSchema,
  addUpiOutputPersistenceConfig,
} from "./add_upi_output_model";

export const addUpiApiStore = createCompleteStore(
  addUpiApiOutputSchema,
  {
    name: "add_upi_api_storage",
    dataPath: "addUpiApiData",
    persistenceConfig: addUpiOutputPersistenceConfig,
  }
);

export const {
  model: addUpiApiOutputModel,
  formSchema: addUpiApiFormSchema,
} = addUpiApiStore;

export type AddUpiApiFormData = z.infer<typeof addUpiApiFormSchema>;
