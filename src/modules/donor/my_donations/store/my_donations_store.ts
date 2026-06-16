import { z } from "zod";
import { createCompleteStore } from "../../../../core/utility";
import {
  myDonationsDataSchema,
  myDonationsPersistenceConfig,
} from "../model/my_donations_model";

export const myDonationsStore = createCompleteStore(myDonationsDataSchema, {
  name: "my_donations_storage",
  dataPath: "myDonationsData",
  persistenceConfig: myDonationsPersistenceConfig,
});

export const {
  model: myDonationsInputModel,
  formSchema: myDonationsFormSchema,
} = myDonationsStore;

export type MyDonationsFormData = z.infer<typeof myDonationsFormSchema>;
