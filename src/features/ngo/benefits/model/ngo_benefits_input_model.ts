"use client";

import { z } from "zod";
import { createSchemaBundle } from "@/core/utility";

export const ngoBenefitsDataSchema = z.object({
  loading: z.boolean().optional(),
});

export const ngoBenefitsPersistenceConfig = {
  loading: false,
};

export const ngoBenefitsSchemas = createSchemaBundle(
  ngoBenefitsDataSchema,
  {
    dataPath: "ngoBenefitsData",
    persistenceConfig: ngoBenefitsPersistenceConfig,
  },
);

export type ngoBenefitsData = z.infer<typeof ngoBenefitsDataSchema>;
