import { z } from "zod";

export const cancelDonationInputSchema = z.object({
  id: z.string(),
  reason: z.string().optional().nullable(),
});

export type CancelDonationInput = z.infer<typeof cancelDonationInputSchema>;
