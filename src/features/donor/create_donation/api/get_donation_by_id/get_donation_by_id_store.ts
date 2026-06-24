import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  getDonationByIdOutputSchema,
  getDonationByIdOutputPersistenceConfig,
} from "./get_donation_by_id_output_model";

export const getDonationByIdApiStore = createCompleteStore(
  getDonationByIdOutputSchema,
  {
    name: "get_donation_by_id_api_storage",
    dataPath: "getDonationByIdApiData",
    persistenceConfig: getDonationByIdOutputPersistenceConfig,
  }
);

export const {
  model: getDonationByIdApiOutputModel,
  formSchema: getDonationByIdApiFormSchema,
} = getDonationByIdApiStore;

export type GetDonationByIdApiFormData = z.infer<typeof getDonationByIdApiFormSchema>;
