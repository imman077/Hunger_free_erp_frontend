"use client";

import { z } from "zod";
import { createSchemaBundle } from "@/core/utility";

export const volunteerBenefitsDataSchema = z.object({
  loading: z.boolean().optional(),
});

export const volunteerBenefitsPersistenceConfig = {
  loading: false,
};

export const volunteerBenefitsSchemas = createSchemaBundle(
  volunteerBenefitsDataSchema,
  {
    dataPath: "volunteerBenefitsData",
    persistenceConfig: volunteerBenefitsPersistenceConfig,
  },
);

export type volunteerBenefitsData = z.infer<typeof volunteerBenefitsDataSchema>;
