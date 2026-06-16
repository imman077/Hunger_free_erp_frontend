import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const inventoryItemSchema = z.object({
  id: z.number(),
  item_name: z.string(),
  category: z.string(),
  quantity: z.number(),
  unit: z.string(),
  location: z.string(),
  expiry_date: z.string().nullable().optional(),
  condition: z.string(),
  notes: z.string().nullable().optional(),
  status: z.string().optional(),
  urgency: z.string().optional(),
});

export const myInventoryStateSchema = z.object({
  items: z.array(inventoryItemSchema).default([]),
  isLoading: z.boolean().default(true),
  selectedRecord: inventoryItemSchema.nullable().default(null),
  isDrawerOpen: z.boolean().default(false),
  isUpdating: z.boolean().default(false),
  isEditing: z.boolean().default(false),
  editFormData: z.object({
    quantity: z.string().default(""),
    status: z.string().default("Stored"),
  }),
});

export const myInventoryPersistenceConfig = {
  items: false,
  isLoading: false,
  selectedRecord: false,
  isDrawerOpen: false,
  isUpdating: false,
  isEditing: false,
  editFormData: false,
};

export const myInventorySchemas = createSchemaBundle(myInventoryStateSchema, {
  dataPath: "myInventoryState",
  persistenceConfig: myInventoryPersistenceConfig,
});

export type MyInventoryState = z.infer<typeof myInventoryStateSchema>;
export type InventoryItem = z.infer<typeof inventoryItemSchema>;
