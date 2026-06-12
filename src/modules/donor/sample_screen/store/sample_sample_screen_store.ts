/**
 * Sample_sample_screen Store
 * Simplified store with only used exports
 */
"use client";

import { z } from "zod";

import {
  sampleSampleScreenDataSchema,
  sampleSampleScreenPersistenceConfig,
} from "../model/sample_sample_screen_input_model";

import { createCompleteStore } from "@/core/utility";

// Create complete store with data schema and persistence configuration
export const sampleSampleScreenStore = createCompleteStore(
  sampleSampleScreenDataSchema,
  {
    name: "sample_sample_screen_storage",
    dataPath: "sampleSampleScreenData",
    persistenceConfig: sampleSampleScreenPersistenceConfig,
  },
);

// Extract only the used exports from the store object:
export const {
  model: sampleSampleScreenInputModel,
  formSchema: sampleSampleScreenFormSchema,
} = sampleSampleScreenStore;

// Export only the used type definitions
export type sampleSampleScreenFormData = z.infer<typeof sampleSampleScreenFormSchema>;
