"use client";

import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const donorPaymentMethodsDataSchema = z.object({
  loading: z.boolean().optional(),
});

export const donorPaymentMethodsPersistenceConfig = {
  loading: false,
};

export const donorPaymentMethodsSchemas = createSchemaBundle(
  donorPaymentMethodsDataSchema,
  {
    dataPath: "donorPaymentMethodsData",
    persistenceConfig: donorPaymentMethodsPersistenceConfig,
  },
);

export type donorPaymentMethodsData = z.infer<typeof donorPaymentMethodsDataSchema>;
