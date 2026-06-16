import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

export const cancelDonationApiOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    cancelDonation: z.object({
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

export const cancelDonationOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const cancelDonationOutputSchemas = createSchemaBundle(
  cancelDonationApiOutputSchema,
  {
    dataPath: "cancelDonationApiData",
    persistenceConfig: cancelDonationOutputPersistenceConfig,
  }
);

export type CancelDonationApiOutput = z.infer<typeof cancelDonationApiOutputSchema>;
