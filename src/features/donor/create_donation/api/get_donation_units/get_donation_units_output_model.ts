import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";
import { configItemSchema } from "../get_food_categories/get_food_categories_output_model";

export const getDonationUnitsOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    configItems: z.array(configItemSchema).optional().nullable(),
  }).optional().nullable(),
});

export const getDonationUnitsOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getDonationUnitsOutputSchemas = createSchemaBundle(
  getDonationUnitsOutputSchema,
  {
    dataPath: "getDonationUnitsApiData",
    persistenceConfig: getDonationUnitsOutputPersistenceConfig,
  }
);

export type GetDonationUnitsOutput = z.infer<typeof getDonationUnitsOutputSchema>;
