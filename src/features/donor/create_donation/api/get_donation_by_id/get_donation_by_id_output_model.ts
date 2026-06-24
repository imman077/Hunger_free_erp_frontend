import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

export const getDonationByIdOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    donationById: z.object({
      id: z.string().optional().nullable(),
      foodType: z.string().optional().nullable(),
      category: z.string().optional().nullable(),
      dietaryType: z.string().optional().nullable(),
      preparationType: z.string().optional().nullable(),
      quantity: z.string().optional().nullable(),
      ngo: z.string().optional().nullable(),
      donor: z.string().optional().nullable(),
      date: z.string().optional().nullable(),
      status: z.string().optional().nullable(),
      pickupAddress: z.string().optional().nullable(),
      deliveryAddress: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      expiryTime: z.string().optional().nullable(),
      volunteer: z.object({
        name: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        rating: z.number().optional().nullable(),
      }).optional().nullable(),
      image: z.string().optional().nullable(),
      volunteerLocation: z.object({
        lat: z.number().optional().nullable(),
        lng: z.number().optional().nullable(),
      }).optional().nullable(),
      pickupCoords: z.object({
        lat: z.number().optional().nullable(),
        lng: z.number().optional().nullable(),
      }).optional().nullable(),
      deliveryCoords: z.object({
        lat: z.number().optional().nullable(),
        lng: z.number().optional().nullable(),
      }).optional().nullable(),
      timeline: z.array(z.object({
        status: z.string().optional().nullable(),
        date: z.string().optional().nullable(),
        time: z.string().optional().nullable(),
        completed: z.boolean().optional().nullable(),
        description: z.string().optional().nullable(),
      })).optional().nullable(),
      isNgoNeed: z.boolean().optional().nullable(),
      relatedNeed: z.string().optional().nullable(),
      createdAt: z.string().optional().nullable(),
    }).optional().nullable(),
  }).optional().nullable(),
});

export const getDonationByIdOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getDonationByIdOutputSchemas = createSchemaBundle(
  getDonationByIdOutputSchema,
  {
    dataPath: "getDonationByIdApiData",
    persistenceConfig: getDonationByIdOutputPersistenceConfig,
  }
);

export type GetDonationByIdOutput = z.infer<typeof getDonationByIdOutputSchema>;
