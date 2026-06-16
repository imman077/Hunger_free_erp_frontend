import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

export const verifyPickupApiOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    verifyPickup: z.object({
      id: z.string(),
      status: z.string(),
      timeline: z.array(
        z.object({
          status: z.string(),
          date: z.string(),
          time: z.string(),
          completed: z.boolean(),
          description: z.string().optional().nullable(),
        })
      ),
    }).optional().nullable(),
  }).optional().nullable(),
});

export const verifyPickupOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const verifyPickupOutputSchemas = createSchemaBundle(
  verifyPickupApiOutputSchema,
  {
    dataPath: "verifyPickupApiData",
    persistenceConfig: verifyPickupOutputPersistenceConfig,
  }
);

export type VerifyPickupApiOutput = z.infer<typeof verifyPickupApiOutputSchema>;
