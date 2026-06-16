import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

export const getNeedsApiOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    needs: z.array(
      z.object({
        id: z.string(),
        ngo: z.union([z.number(), z.string()]),
        ngoName: z.string().optional().nullable(),
        itemName: z.string(),
        category: z.string(),
        quantity: z.number(),
        unit: z.string(),
        urgency: z.string(),
        requiredBy: z.string().optional().nullable(),
        image: z.string().optional().nullable(),
        distributionAddress: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        status: z.string().optional().nullable(),
        fulfilledQuantity: z.number().optional().nullable(),
        supporterIds: z.array(z.union([z.number(), z.string()])).optional().nullable(),
        supporters: z.array(
          z.object({
            id: z.string(),
            username: z.string(),
            email: z.string(),
            phone: z.string().optional().nullable(),
            donorProfile: z.object({
              businessName: z.string(),
            }).optional().nullable(),
          })
        ).optional().nullable(),
        supportersDetails: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            quantity: z.string(),
          })
        ).optional().nullable(),
        createdAt: z.string().optional().nullable(),
      })
    ),
  }).optional().nullable(),
});

export const getNeedsOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getNeedsOutputSchemas = createSchemaBundle(
  getNeedsApiOutputSchema,
  {
    dataPath: "getNeedsApiData",
    persistenceConfig: getNeedsOutputPersistenceConfig,
  }
);

export type GetNeedsApiOutput = z.infer<typeof getNeedsApiOutputSchema>;
