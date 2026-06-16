import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  getMyDonationsApiOutputSchema,
  getMyDonationsOutputPersistenceConfig,
} from "./get_my_donations_output_model";

export const getMyDonationsApiStore = createCompleteStore(
  getMyDonationsApiOutputSchema,
  {
    name: "get_my_donations_api_storage",
    dataPath: "getMyDonationsApiData",
    persistenceConfig: getMyDonationsOutputPersistenceConfig,
  }
);

export const {
  model: getMyDonationsApiOutputModel,
  formSchema: getMyDonationsApiFormSchema,
} = getMyDonationsApiStore;

export type GetMyDonationsApiFormData = z.infer<typeof getMyDonationsApiFormSchema>;
