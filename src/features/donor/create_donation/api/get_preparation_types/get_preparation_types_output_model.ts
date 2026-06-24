import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";
import { configItemSchema } from "../get_food_categories/get_food_categories_output_model";

export const getPreparationTypesOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    configItems: z.array(configItemSchema).optional().nullable(),
  }).optional().nullable(),
});

export const getPreparationTypesOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getPreparationTypesOutputSchemas = createSchemaBundle(
  getPreparationTypesOutputSchema,
  {
    dataPath: "getPreparationTypesApiData",
    persistenceConfig: getPreparationTypesOutputPersistenceConfig,
  }
);

export type GetPreparationTypesOutput = z.infer<typeof getPreparationTypesOutputSchema>;
