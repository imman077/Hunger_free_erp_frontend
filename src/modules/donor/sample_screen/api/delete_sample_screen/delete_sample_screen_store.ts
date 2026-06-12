/**
 * DeleteSampleScreen Store
 * Simplified store with only used exports
 */
"use client";

import { z } from "zod";

import {
  deleteSampleScreenOutputDataSchema,
  deleteSampleScreenOutputPersistenceConfig,
} from "./delete_sample_screen_output_model";

import { createCompleteStore } from "@/core/utility";

export const deleteSampleScreenStore = createCompleteStore(
  deleteSampleScreenOutputDataSchema,
  {
    name: "delete_sample_screen_storage",
    dataPath: "deleteSampleScreenData",
    persistenceConfig: deleteSampleScreenOutputPersistenceConfig,
  },
);

export const {
  model: deleteSampleScreenOutputModel,
  formSchema: deleteSampleScreenFormSchema,
} = deleteSampleScreenStore;

export type deleteSampleScreenFormData = z.infer<typeof deleteSampleScreenFormSchema>;
