import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  saveDonationDraftOutputSchema,
  saveDonationDraftOutputPersistenceConfig,
} from "./save_donation_draft_output_model";

export const saveDonationDraftApiStore = createCompleteStore(
  saveDonationDraftOutputSchema,
  {
    name: "save_donation_draft_api_storage",
    dataPath: "saveDonationDraftApiData",
    persistenceConfig: saveDonationDraftOutputPersistenceConfig,
  }
);

export const {
  model: saveDonationDraftApiOutputModel,
  formSchema: saveDonationDraftApiFormSchema,
} = saveDonationDraftApiStore;

export type SaveDonationDraftApiFormData = z.infer<typeof saveDonationDraftApiFormSchema>;
