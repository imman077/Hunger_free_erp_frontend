"use client";

import { z } from "zod";
import {
  donorPaymentMethodsDataSchema,
  donorPaymentMethodsPersistenceConfig,
} from "../model/donor_payment_methods_input_model";
import { createCompleteStore } from "../../../../core/utility";

export const donorPaymentMethodsStore = createCompleteStore(
  donorPaymentMethodsDataSchema,
  {
    name: "donor_payment_methods_storage",
    dataPath: "donorPaymentMethodsData",
    persistenceConfig: donorPaymentMethodsPersistenceConfig,
  },
);

export const {
  model: donorPaymentMethodsInputModel,
  formSchema: donorPaymentMethodsFormSchema,
} = donorPaymentMethodsStore;

export type donorPaymentMethodsFormData = z.infer<typeof donorPaymentMethodsFormSchema>;
