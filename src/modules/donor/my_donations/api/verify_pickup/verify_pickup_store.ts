import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  verifyPickupApiOutputSchema,
  verifyPickupOutputPersistenceConfig,
} from "./verify_pickup_output_model";

export const verifyPickupApiStore = createCompleteStore(
  verifyPickupApiOutputSchema,
  {
    name: "verify_pickup_api_storage",
    dataPath: "verifyPickupApiData",
    persistenceConfig: verifyPickupOutputPersistenceConfig,
  }
);

export const {
  model: verifyPickupApiOutputModel,
  formSchema: verifyPickupApiFormSchema,
} = verifyPickupApiStore;

export type VerifyPickupApiFormData = z.infer<typeof verifyPickupApiFormSchema>;
