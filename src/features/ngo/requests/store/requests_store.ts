import { z } from "zod";
import { createCompleteStore } from "../../../../core/utility";
import {
  requestsStateSchema,
  requestsPersistenceConfig,
} from "../model/requests_model";

export const requestsStore = createCompleteStore(requestsStateSchema, {
  name: "ngo_requests_storage",
  dataPath: "requestsState",
  persistenceConfig: requestsPersistenceConfig,
});

export const {
  model: requestsInputModel,
  formSchema: requestsFormSchema,
} = requestsStore;

export type RequestsFormData = z.infer<typeof requestsFormSchema>;
