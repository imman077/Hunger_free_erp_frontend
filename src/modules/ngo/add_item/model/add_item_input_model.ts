import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const addItemDataSchema = z.object({
  formData: z.object({
    name: z.string().default(""),
    category: z.string().default("Perishable"),
    quantity: z.string().default(""),
    unit: z.string().default("kg"),
    expiryDate: z.string().default(""),
    location: z.string().default(""),
    condition: z.string().default("Excellent"),
    notes: z.string().default(""),
    otherCategory: z.string().default(""),
  }),
  isSuggestModalOpen: z.boolean().default(false),
  suggestionCategoryName: z.string().default(""),
  suggestionReason: z.string().default(""),
  isSuccess: z.boolean().default(false),
  isSubmitting: z.boolean().default(false),
});

export const addItemPersistenceConfig = {
  formData: false,
  isSuggestModalOpen: false,
  suggestionCategoryName: false,
  suggestionReason: false,
  isSuccess: false,
  isSubmitting: false,
};

export const addItemSchemas = createSchemaBundle(addItemDataSchema, {
  dataPath: "addItemData",
  persistenceConfig: addItemPersistenceConfig,
});

export type AddItemData = z.infer<typeof addItemDataSchema>;
