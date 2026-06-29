import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  addBankAccountApiOutputSchema,
  addBankAccountOutputPersistenceConfig,
} from "./add_bank_account_output_model";

export const addBankAccountApiStore = createCompleteStore(
  addBankAccountApiOutputSchema,
  {
    name: "add_bank_account_api_storage",
    dataPath: "addBankAccountApiData",
    persistenceConfig: addBankAccountOutputPersistenceConfig,
  }
);

export const {
  model: addBankAccountApiOutputModel,
  formSchema: addBankAccountApiFormSchema,
} = addBankAccountApiStore;

export type AddBankAccountApiFormData = z.infer<typeof addBankAccountApiFormSchema>;
