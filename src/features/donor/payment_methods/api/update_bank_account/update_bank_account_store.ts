import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  updateBankAccountApiOutputSchema,
  updateBankAccountOutputPersistenceConfig,
} from "./update_bank_account_output_model";

export const updateBankAccountApiStore = createCompleteStore(
  updateBankAccountApiOutputSchema,
  {
    name: "update_bank_account_api_storage",
    dataPath: "updateBankAccountApiData",
    persistenceConfig: updateBankAccountOutputPersistenceConfig,
  }
);

export const {
  model: updateBankAccountApiOutputModel,
  formSchema: updateBankAccountApiFormSchema,
} = updateBankAccountApiStore;

export type UpdateBankAccountApiFormData = z.infer<typeof updateBankAccountApiFormSchema>;
