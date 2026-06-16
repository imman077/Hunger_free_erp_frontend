import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const ngoPostsDataSchema = z.object({
  viewMode: z.enum(["table", "card"]).default("card"),
  searchQuery: z.string().default(""),
  categoryFilter: z.string().default("ALL"),
  selectedNeed: z.any().nullable().default(null),
  isDrawerOpen: z.boolean().default(false),
  isFulfillModalOpen: z.boolean().default(false),
  isFulfilling: z.boolean().default(false),
  fulfillForm: z.object({
    foodCategory: z.string().default(""),
    quantity: z.string().default(""),
    expiryDate: z.string().default(""),
    expiryTime: z.string().default(""),
    pickupAddress: z.string().default(""),
    contactPhone: z.string().default(""),
  }),
});

export const ngoPostsPersistenceConfig = {
  viewMode: true,
  searchQuery: false,
  categoryFilter: true,
  selectedNeed: false,
  isDrawerOpen: false,
  isFulfillModalOpen: false,
  isFulfilling: false,
  fulfillForm: true,
};

export const ngoPostsSchemas = createSchemaBundle(ngoPostsDataSchema, {
  dataPath: "ngoPostsData",
  persistenceConfig: ngoPostsPersistenceConfig,
});

export type NgoPostsData = z.infer<typeof ngoPostsDataSchema>;
