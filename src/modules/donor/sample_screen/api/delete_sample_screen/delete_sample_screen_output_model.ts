/**
 * DeleteSampleScreen API Output Model
 * Defines data schema and security rules for delete_sample_screen_api_output API
 */
"use client";

import { z } from "zod";

import { createSchemaBundle } from "@/core/utility";

export const deleteSampleScreenOutputDataSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    Archive_SampleScreen: z.boolean().optional(),
  }),
});

export const deleteSampleScreenOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const deleteSampleScreenOutputSchemas = createSchemaBundle(
  deleteSampleScreenOutputDataSchema,
  {
    dataPath: "deleteSampleScreenOutputData",
    persistenceConfig: deleteSampleScreenOutputPersistenceConfig,
  },
);

export type deleteSampleScreenOutputData = z.infer<
  typeof deleteSampleScreenOutputDataSchema
>;
