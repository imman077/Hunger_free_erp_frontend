import { z } from "zod";

export const AcceptPickupInputSchema = z.number();

export const MarkAsPickedUpInputSchema = z.object({
  donationId: z.number(),
  otp: z.string().min(4).max(6),
});

export const MarkAsDeliveredInputSchema = z.object({
  donationId: z.number(),
  otp: z.string().min(4).max(6),
});

export type AcceptPickupInput = z.infer<typeof AcceptPickupInputSchema>;
export type MarkAsPickedUpInput = z.infer<typeof MarkAsPickedUpInputSchema>;
export type MarkAsDeliveredInput = z.infer<typeof MarkAsDeliveredInputSchema>;
