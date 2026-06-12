/**
 * Sample_sample_screen Input Model
 * Defines data schema and security rules for sample_sample_screen feature
 */
"use client";

import { z } from "zod";

import { createSchemaBundle } from "@/core/utility";

// Define nested schemas for complex objects (internal use only)

// Define the main sample_sample_screen data schema with persistence flags
export const sampleSampleScreenDataSchema = z.object({
  loading: z.boolean().optional(),
  sample_screenTable: z.string().optional(),
  newSampleScreen: z.string().optional(),
  pageNo: z.number().int().optional(),
  pageSize: z.number().int().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  categoriesList: z.array(z.any()).optional(),
  statusesList: z.array(z.any()).optional(),
});

// Define persistence configuration for each field
export const sampleSampleScreenPersistenceConfig = {
  loading: false,
  sample_screenTable: true,
  newSampleScreen: true,
  pageNo: false,
  pageSize: false,
  status: false,
  category: false,
  search: false,
  categoriesList: false,
  statusesList: false,
};

// Create complete schema bundle with auto-generated persistence, meta, and model schemas
export const sampleSampleScreenSchemas = createSchemaBundle(
  sampleSampleScreenDataSchema,
  {
    dataPath: "sampleSampleScreenData",
    persistenceConfig: sampleSampleScreenPersistenceConfig,
  },
);

// Export types for TypeScript usage (only used types)
export type sampleSampleScreenData = z.infer<typeof sampleSampleScreenDataSchema>;
