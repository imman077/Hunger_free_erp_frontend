import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";
import { DonationDetailSchema } from "../../../store/donor-schemas";

export const getMyDonationsApiOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    donations: z.array(DonationDetailSchema),
    donationStats: z.object({
      totalDonations: z.number(),
      pendingCount: z.number(),
      completedCount: z.number(),
      inProgressCount: z.number(),
      totalByCategory: z.array(
        z.object({
          category: z.string(),
          count: z.number(),
        })
      ).optional().nullable(),
    }).optional().nullable(),
  }).optional().nullable(),
});

export const getMyDonationsOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getMyDonationsOutputSchemas = createSchemaBundle(
  getMyDonationsApiOutputSchema,
  {
    dataPath: "getMyDonationsApiData",
    persistenceConfig: getMyDonationsOutputPersistenceConfig,
  }
);

export type GetMyDonationsApiOutput = z.infer<typeof getMyDonationsApiOutputSchema>;
