import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  removeBankAccountApiOutputSchema,
  removeBankAccountOutputPersistenceConfig,
} from "./remove_bank_account_output_model";

export const removeBankAccountApiStore = createCompleteStore(
  removeBankAccountApiOutputSchema,
  {
    name: "remove_bank_account_api_storage",
    dataPath: "removeBankAccountApiData",
    persistenceConfig: removeBankAccountOutputPersistenceConfig,
  }
);

export const {
  model: removeBankAccountApiOutputModel,
  formSchema: removeBankAccountApiFormSchema,
} = removeBankAccountApiStore;

export type RemoveBankAccountApiFormData = z.infer<typeof removeBankAccountApiFormSchema>;
