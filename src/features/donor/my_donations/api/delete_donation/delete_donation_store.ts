import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  deleteDonationOutputSchema,
  deleteDonationOutputPersistenceConfig,
} from "./delete_donation_output_model";

export const deleteDonationApiStore = createCompleteStore(
  deleteDonationOutputSchema,
  {
    name: "my_donations_delete_donation_api_storage",
    dataPath: "deleteDonationApiData",
    persistenceConfig: deleteDonationOutputPersistenceConfig,
  }
);

export const {
  model: deleteDonationApiOutputModel,
  formSchema: deleteDonationApiFormSchema,
} = deleteDonationApiStore;

export type DeleteDonationApiFormData = z.infer<typeof deleteDonationApiFormSchema>;
