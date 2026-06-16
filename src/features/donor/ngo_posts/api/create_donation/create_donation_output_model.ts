import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

export const createDonationApiOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    createDonation: z.object({
      id: z.string(),
      foodType: z.string(),
      category: z.string(),
      status: z.string(),
      isNgoNeed: z.boolean().optional().nullable(),
      relatedNeed: z.string().optional().nullable(),
    }).optional().nullable(),
  }).optional().nullable(),
});

export const createDonationOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const createDonationOutputSchemas = createSchemaBundle(
  createDonationApiOutputSchema,
  {
    dataPath: "createDonationApiData",
    persistenceConfig: createDonationOutputPersistenceConfig,
  }
);

export type CreateDonationApiOutput = z.infer<typeof createDonationApiOutputSchema>;
