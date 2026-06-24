import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";
import { configItemSchema } from "../get_food_categories/get_food_categories_output_model";

export const getDietaryTypesOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    configItems: z.array(configItemSchema).optional().nullable(),
  }).optional().nullable(),
});

export const getDietaryTypesOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getDietaryTypesOutputSchemas = createSchemaBundle(
  getDietaryTypesOutputSchema,
  {
    dataPath: "getDietaryTypesApiData",
    persistenceConfig: getDietaryTypesOutputPersistenceConfig,
  }
);

export type GetDietaryTypesOutput = z.infer<typeof getDietaryTypesOutputSchema>;
