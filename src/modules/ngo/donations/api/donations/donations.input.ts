import { z } from "zod";

export const AcceptDonationInputSchema = z.union([z.string(), z.number()]);

export const SupportNeedInputSchema = z.object({
  needId: z.union([z.string(), z.number()]),
  data: z
    .object({
      quantity: z.number(),
      phone: z.string(),
    })
    .optional(),
});

export const VerifyDeliveryInputSchema = z.object({
  donationId: z.union([z.string(), z.number()]),
  otp: z.string().min(4).max(6),
});

export type AcceptDonationInput = z.infer<typeof AcceptDonationInputSchema>;
export type SupportNeedInput = z.infer<typeof SupportNeedInputSchema>;
export type VerifyDeliveryInput = z.infer<typeof VerifyDeliveryInputSchema>;
