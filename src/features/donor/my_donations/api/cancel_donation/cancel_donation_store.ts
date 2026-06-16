import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  cancelDonationApiOutputSchema,
  cancelDonationOutputPersistenceConfig,
} from "./cancel_donation_output_model";

export const cancelDonationApiStore = createCompleteStore(
  cancelDonationApiOutputSchema,
  {
    name: "cancel_donation_api_storage",
    dataPath: "cancelDonationApiData",
    persistenceConfig: cancelDonationOutputPersistenceConfig,
  }
);

export const {
  model: cancelDonationApiOutputModel,
  formSchema: cancelDonationApiFormSchema,
} = cancelDonationApiStore;

export type CancelDonationApiFormData = z.infer<typeof cancelDonationApiFormSchema>;
