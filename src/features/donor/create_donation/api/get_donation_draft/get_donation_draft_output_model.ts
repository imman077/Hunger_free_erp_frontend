import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

export const getDonationDraftOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    donationDraft: z.object({
      id: z.string().optional().nullable(),
      userId: z.string().optional().nullable(),
      foodType: z.string().optional().nullable(),
      category: z.string().optional().nullable(),
      dietaryType: z.string().optional().nullable(),
      preparationType: z.string().optional().nullable(),
      quantity: z.string().optional().nullable(),
      ngo: z.string().optional().nullable(),
      donor: z.string().optional().nullable(),
      date: z.string().optional().nullable(),
      pickupAddress: z.string().optional().nullable(),
      deliveryAddress: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      expiryTime: z.string().optional().nullable(),
      image: z.string().optional().nullable(),
      relatedNeed: z.string().optional().nullable(),
    }).optional().nullable(),
  }).optional().nullable(),
});

export const getDonationDraftOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getDonationDraftOutputSchemas = createSchemaBundle(
  getDonationDraftOutputSchema,
  {
    dataPath: "getDonationDraftApiData",
    persistenceConfig: getDonationDraftOutputPersistenceConfig,
  }
);

export type GetDonationDraftOutput = z.infer<typeof getDonationDraftOutputSchema>;
