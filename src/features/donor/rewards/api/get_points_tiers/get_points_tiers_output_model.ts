import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

export const pointsTierSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  minPoints: z.number(),
  maxPoints: z.number().nullable().optional(),
  color: z.string().optional().nullable(),
  benefits: z.array(z.string()).default([]),
  isActive: z.boolean().optional().nullable(),
});

export const getPointsTiersOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    pointsTiers: z.array(pointsTierSchema).optional().nullable(),
  }).optional().nullable(),
});

export const getPointsTiersOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getPointsTiersOutputSchemas = createSchemaBundle(
  getPointsTiersOutputSchema,
  {
    dataPath: "getPointsTiersApiData",
    persistenceConfig: getPointsTiersOutputPersistenceConfig,
  }
);

export type GetPointsTiersOutput = z.infer<typeof getPointsTiersOutputSchema>;
export type PointsTier = z.infer<typeof pointsTierSchema>;
