import { z } from "zod";

export const CreateDonationApiInputSchema = z.object({
  input: z.object({
    foodType: z.string(),
    category: z.string(),
    dietaryType: z.string(),
    preparationType: z.string(),
    quantity: z.string(),
    ngo: z.string().nullable().optional(),
    donor: z.string().nullable().optional(),
    date: z.string(),
    pickupAddress: z.string(),
    description: z.string(),
    expiryTime: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    relatedNeed: z.string().nullable().optional(),
  }),
});

export type CreateDonationApiInput = z.infer<typeof CreateDonationApiInputSchema>;
