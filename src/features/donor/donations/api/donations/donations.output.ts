import { z } from "zod";

export const DonationSchema = z.object({
  id: z.union([z.string(), z.number()]),
  food_category: z.string().optional().nullable(),
  quantity: z.union([z.string(), z.number()]).optional().nullable(),
  unit: z.string().optional().nullable(),
  status: z.string(),
  created_at: z.string().optional().nullable(),
  pickup_address: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  isNgoNeed: z.boolean().optional().nullable(),
  relatedNeed: z.string().optional().nullable(),
}).passthrough();

export type Donation = z.infer<typeof DonationSchema>;

export const CreateDonationResponseSchema = DonationSchema;
export const GetMyDonationsResponseSchema = z.array(DonationSchema);
export const GetDonationByIdResponseSchema = DonationSchema;
export const VerifyPickupResponseSchema = z.any();

export type CreateDonationResponse = z.infer<typeof CreateDonationResponseSchema>;
export type GetMyDonationsResponse = z.infer<typeof GetMyDonationsResponseSchema>;
export type GetDonationByIdResponse = z.infer<typeof GetDonationByIdResponseSchema>;
