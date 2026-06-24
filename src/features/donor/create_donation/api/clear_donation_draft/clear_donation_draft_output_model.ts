import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

export const clearDonationDraftOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    clearDonationDraft: z.boolean().optional().nullable(),
  }).optional().nullable(),
});

export const clearDonationDraftOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const clearDonationDraftOutputSchemas = createSchemaBundle(
  clearDonationDraftOutputSchema,
  {
    dataPath: "clearDonationDraftApiData",
    persistenceConfig: clearDonationDraftOutputPersistenceConfig,
  }
);

export type ClearDonationDraftOutput = z.infer<typeof clearDonationDraftOutputSchema>;
