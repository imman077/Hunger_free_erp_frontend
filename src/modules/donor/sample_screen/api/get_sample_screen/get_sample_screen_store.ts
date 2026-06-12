/**
 * GetSampleScreen Store
 * Simplified store with only used exports
 */
"use client";

import { z } from "zod";

import {
  getSampleScreenOutputDataSchema,
  getSampleScreenOutputPersistenceConfig,
} from "./get_sample_screen_output_model";

import { createCompleteStore } from "@/core/utility";

export const getSampleScreenStore = createCompleteStore(
  getSampleScreenOutputDataSchema,
  {
    name: "get_sample_screen_storage",
    dataPath: "getSampleScreenData",
    persistenceConfig: getSampleScreenOutputPersistenceConfig,
  },
);

export const {
  model: getSampleScreenOutputModel,
  formSchema: getSampleScreenFormSchema,
} = getSampleScreenStore;

export type getSampleScreenFormData = z.infer<typeof getSampleScreenFormSchema>;
