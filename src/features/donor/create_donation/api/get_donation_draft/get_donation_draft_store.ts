import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  getDonationDraftOutputSchema,
  getDonationDraftOutputPersistenceConfig,
} from "./get_donation_draft_output_model";

export const getDonationDraftApiStore = createCompleteStore(
  getDonationDraftOutputSchema,
  {
    name: "get_donation_draft_api_storage",
    dataPath: "getDonationDraftApiData",
    persistenceConfig: getDonationDraftOutputPersistenceConfig,
  }
);

export const {
  model: getDonationDraftApiOutputModel,
  formSchema: getDonationDraftApiFormSchema,
} = getDonationDraftApiStore;

export type GetDonationDraftApiFormData = z.infer<typeof getDonationDraftApiFormSchema>;
