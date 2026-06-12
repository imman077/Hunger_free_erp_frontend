/**
 * GetSampleScreen API Output Model
 * Defines data schema and security rules for get_sample_screen_api_output API
 */
"use client";

import { z } from "zod";

import { createSchemaBundle } from "@/core/utility";

export const getSampleScreenOutputDataSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    Get_SampleScreen: z.object({
      items: z
        .array(
          z.object({
            _id: z.string().optional(),
            SAMPLE_SCREEN_CODE: z.string().optional(),
            TOTAL: z.number().int().optional(),
            CATEGORY: z.string().optional(),
            DESCRIPTION: z.string().optional(),
            STATUS: z.string().optional(),
            CATEGORY_DETAILS: z
              .object({
                CODE: z.string().optional(),
                DESC: z.string().nullable().optional(),
              })
              .nullable()
              .optional(),
            STATUS_DETAILS: z
              .object({
                CODE: z.string().optional(),
                DESC: z.string().nullable().optional(),
              })
              .nullable()
              .optional(),
          }),
        )
        .optional(),
      pageInfo: z.object({
        totalItems: z.number().int().optional(),
        totalPages: z.number().int().optional(),
        currentPage: z.number().int().optional(),
        pageSize: z.number().int().optional(),
        hasNextPage: z.boolean().optional(),
        hasPreviousPage: z.boolean().optional(),
      }),
    }),
  }),
});

export const getSampleScreenOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getSampleScreenOutputSchemas = createSchemaBundle(
  getSampleScreenOutputDataSchema,
  {
    dataPath: "getSampleScreenOutputData",
    persistenceConfig: getSampleScreenOutputPersistenceConfig,
  },
);

export type getSampleScreenOutputData = z.infer<typeof getSampleScreenOutputDataSchema>;
