import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

// Schema for an individual food item in the donation draft list
export const foodItemSchema = z.object({
  id: z.number(),
  foodCategory: z.string(),
  dietaryType: z.string(),
  preparationType: z.string(),
  quantity: z.string(),
  unit: z.string(),
  description: z.string(),
  expiryDate: z.string().optional(),
  expiryTime: z.string().optional(),
  foodPhoto: z.any().nullable().optional(), // File object on client
  otherCategory: z.string().optional(),
});

// Schema for logistics/pickup info
export const logisticsSchema = z.object({
  pickupAddress: z.string(),
  contactPhone: z.string(),
});

// Main Create Donation form state schema
export const createDonationDataSchema = z.object({
  loading: z.boolean().default(false),
  items: z.array(foodItemSchema).default([]),
  editingId: z.number().nullable().default(null),
  originalDonationId: z.string().nullable().default(null),
  currentItem: z.object({
    foodCategory: z.string().default(""),
    dietaryType: z.string().default("Veg"),
    preparationType: z.string().default("Restaurant"),
    quantity: z.string().default(""),
    unit: z.string().default("kg"),
    description: z.string().default(""),
    expiryDate: z.string().default(""),
    expiryTime: z.string().default(""),
    foodPhoto: z.any().nullable().default(null),
    otherCategory: z.string().default(""),
  }),
  logistics: z.object({
    pickupAddress: z.string().default(""),
    contactPhone: z.string().default(""),
  }),
});

export const createDonationPersistenceConfig = {
  loading: false,
  items: true,
  editingId: true,
  originalDonationId: true,
  currentItem: true,
  logistics: true,
};

export const createDonationSchemas = createSchemaBundle(createDonationDataSchema, {
  dataPath: "createDonationData",
  persistenceConfig: createDonationPersistenceConfig,
});

export type CreateDonationData = z.infer<typeof createDonationDataSchema>;
export type FoodItem = z.infer<typeof foodItemSchema>;
