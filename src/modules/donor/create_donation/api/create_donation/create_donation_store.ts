import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  createDonationApiOutputSchema,
  createDonationOutputPersistenceConfig,
} from "./create_donation_output_model";

export const createDonationApiStore = createCompleteStore(
  createDonationApiOutputSchema,
  {
    name: "create_donation_api_storage",
    dataPath: "createDonationApiData",
    persistenceConfig: createDonationOutputPersistenceConfig,
  }
);

export const {
  model: createDonationApiOutputModel,
  formSchema: createDonationApiFormSchema,
} = createDonationApiStore;

export type CreateDonationApiFormData = z.infer<typeof createDonationApiFormSchema>;
