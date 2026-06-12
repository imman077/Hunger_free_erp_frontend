import { z } from "zod";

export const NgoDonationSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    food_category: z.string().optional().nullable(),
    quantity: z.union([z.string(), z.number()]).optional().nullable(),
    unit: z.string().optional().nullable(),
    status: z.string(),
    created_at: z.string().optional().nullable(),
    pickup_address: z.string().optional().nullable(),
    contact_phone: z.string().optional().nullable(),
  })
  .passthrough();

export type NgoDonation = z.infer<typeof NgoDonationSchema>;

export const GetMarketplaceDonationsResponseSchema = z.array(NgoDonationSchema);
export const GetAllDonationsResponseSchema = z.array(NgoDonationSchema);
export const GetMyRequestsResponseSchema = z.array(NgoDonationSchema);
export const AcceptDonationResponseSchema = NgoDonationSchema;
export const SupportNeedResponseSchema = z.any();
export const VerifyDeliveryResponseSchema = z.any();

export type GetMarketplaceDonationsResponse = z.infer<typeof GetMarketplaceDonationsResponseSchema>;
export type GetAllDonationsResponse = z.infer<typeof GetAllDonationsResponseSchema>;
export type GetMyRequestsResponse = z.infer<typeof GetMyRequestsResponseSchema>;
export type AcceptDonationResponse = z.infer<typeof AcceptDonationResponseSchema>;
