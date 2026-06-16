import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const postNeedDataSchema = z.object({
  formData: z.object({
    itemName: z.string().default(""),
    category: z.string().default(""),
    quantity: z.string().default(""),
    unit: z.string().default("units"),
    urgency: z.string().default("medium"),
    description: z.string().default(""),
    requiredBy: z.string().default(""),
    location: z.string().default(""),
    otherCategory: z.string().default(""),
    itemImage: z.any().nullable().default(null),
  }),
  isSuggestModalOpen: z.boolean().default(false),
  suggestionReason: z.string().default(""),
  suggestionCategoryName: z.string().default(""),
  isSubmitting: z.boolean().default(false),
  isSuccess: z.boolean().default(false),
});

export const postNeedPersistenceConfig = {
  formData: false,
  isSuggestModalOpen: false,
  suggestionReason: false,
  suggestionCategoryName: false,
  isSubmitting: false,
  isSuccess: false,
};

export const postNeedSchemas = createSchemaBundle(postNeedDataSchema, {
  dataPath: "postNeedData",
  persistenceConfig: postNeedPersistenceConfig,
});

export type PostNeedData = z.infer<typeof postNeedDataSchema>;
