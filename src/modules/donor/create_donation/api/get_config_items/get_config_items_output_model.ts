import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

export const configItemSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
});

export const getConfigItemsOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    configItems: z.array(configItemSchema).optional().nullable(),
  }).optional().nullable(),
});

export const getConfigItemsOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getConfigItemsOutputSchemas = createSchemaBundle(
  getConfigItemsOutputSchema,
  {
    dataPath: "getConfigItemsApiData",
    persistenceConfig: getConfigItemsOutputPersistenceConfig,
  }
);

export type GetConfigItemsOutput = z.infer<typeof getConfigItemsOutputSchema>;
export type ConfigItem = z.infer<typeof configItemSchema>;
