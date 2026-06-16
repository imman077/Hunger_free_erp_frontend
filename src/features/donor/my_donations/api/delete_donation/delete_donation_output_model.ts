import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

export const deleteDonationOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    deleteDonation: z.boolean(),
  }).optional().nullable(),
});

export const deleteDonationOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const deleteDonationOutputSchemas = createSchemaBundle(
  deleteDonationOutputSchema,
  {
    dataPath: "deleteDonationApiData",
    persistenceConfig: deleteDonationOutputPersistenceConfig,
  }
);

export type DeleteDonationOutput = z.infer<typeof deleteDonationOutputSchema>;
