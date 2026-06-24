import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  clearDonationDraftOutputSchema,
  clearDonationDraftOutputPersistenceConfig,
} from "./clear_donation_draft_output_model";

export const clearDonationDraftApiStore = createCompleteStore(
  clearDonationDraftOutputSchema,
  {
    name: "clear_donation_draft_api_storage",
    dataPath: "clearDonationDraftApiData",
    persistenceConfig: clearDonationDraftOutputPersistenceConfig,
  }
);

export const {
  model: clearDonationDraftApiOutputModel,
  formSchema: clearDonationDraftApiFormSchema,
} = clearDonationDraftApiStore;

export type ClearDonationDraftApiFormData = z.infer<typeof clearDonationDraftApiFormSchema>;
