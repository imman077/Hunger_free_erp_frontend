import { z } from "zod";

export const saveDonationDraftInputSchema = z.object({
  userId: z.string(),
  input: z.object({
    foodType: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    dietaryType: z.string().optional().nullable(),
    preparationType: z.string().optional().nullable(),
    quantity: z.string().optional().nullable(),
    ngo: z.string().optional().nullable(),
    donor: z.string().optional().nullable(),
    date: z.string().optional().nullable(),
    pickupAddress: z.string().optional().nullable(),
    deliveryAddress: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    expiryTime: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    relatedNeed: z.string().optional().nullable(),
  }),
});

export type SaveDonationDraftInput = z.infer<typeof saveDonationDraftInputSchema>;
