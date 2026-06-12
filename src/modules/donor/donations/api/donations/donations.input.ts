import { z } from "zod";

export const CreateDonationInputSchema = z.any(); // FormData
export const GetDonationByIdInputSchema = z.union([z.string(), z.number()]);
export const VerifyPickupInputSchema = z.object({
  donationId: z.union([z.string(), z.number()]),
  otp: z.string().min(4).max(6),
});

export type CreateDonationInput = FormData;
export type GetDonationByIdInput = z.infer<typeof GetDonationByIdInputSchema>;
export type VerifyPickupInput = z.infer<typeof VerifyPickupInputSchema>;
