import { z } from "zod";
import { createCompleteStore } from "../../../../core/utility";
import {
  createDonationDataSchema,
  createDonationPersistenceConfig,
} from "../model/create_donation_input_model";

export const createDonationStore = createCompleteStore(createDonationDataSchema, {
  name: "create_donation_storage",
  dataPath: "createDonationData",
  persistenceConfig: createDonationPersistenceConfig,
});

export const {
  model: createDonationInputModel,
  formSchema: createDonationFormSchema,
} = createDonationStore;

export type CreateDonationFormData = z.infer<typeof createDonationFormSchema>;
