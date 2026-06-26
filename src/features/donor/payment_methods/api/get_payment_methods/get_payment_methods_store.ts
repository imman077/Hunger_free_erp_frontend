import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  getPaymentMethodsApiOutputSchema,
  getPaymentMethodsOutputPersistenceConfig,
} from "./get_payment_methods_output_model";

export const getPaymentMethodsApiStore = createCompleteStore(
  getPaymentMethodsApiOutputSchema,
  {
    name: "get_payment_methods_api_storage",
    dataPath: "getPaymentMethodsApiData",
    persistenceConfig: getPaymentMethodsOutputPersistenceConfig,
  }
);

export const {
  model: getPaymentMethodsApiOutputModel,
  formSchema: getPaymentMethodsApiFormSchema,
} = getPaymentMethodsApiStore;

export type GetPaymentMethodsApiFormData = z.infer<typeof getPaymentMethodsApiFormSchema>;
