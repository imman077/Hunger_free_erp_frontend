import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  getDonationUnitsOutputSchema,
  getDonationUnitsOutputPersistenceConfig,
} from "./get_donation_units_output_model";

export const getDonationUnitsApiStore = createCompleteStore(
  getDonationUnitsOutputSchema,
  {
    name: "get_donation_units_api_storage",
    dataPath: "getDonationUnitsApiData",
    persistenceConfig: getDonationUnitsOutputPersistenceConfig,
  }
);

export const {
  model: getDonationUnitsApiOutputModel,
  formSchema: getDonationUnitsApiFormSchema,
} = getDonationUnitsApiStore;

export type GetDonationUnitsApiFormData = z.infer<typeof getDonationUnitsApiFormSchema>;
