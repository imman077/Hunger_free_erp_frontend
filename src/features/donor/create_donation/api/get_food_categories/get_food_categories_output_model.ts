import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

export const configItemSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  sortOrder: z.number().optional().nullable(),
});

export const getFoodCategoriesOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    configItems: z.array(configItemSchema).optional().nullable(),
  }).optional().nullable(),
});

export const getFoodCategoriesOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getFoodCategoriesOutputSchemas = createSchemaBundle(
  getFoodCategoriesOutputSchema,
  {
    dataPath: "getFoodCategoriesApiData",
    persistenceConfig: getFoodCategoriesOutputPersistenceConfig,
  }
);

export type GetFoodCategoriesOutput = z.infer<typeof getFoodCategoriesOutputSchema>;
export type ConfigItem = z.infer<typeof configItemSchema>;
