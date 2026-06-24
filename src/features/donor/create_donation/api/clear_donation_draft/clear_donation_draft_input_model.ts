import { z } from "zod";

export const clearDonationDraftInputSchema = z.object({
  userId: z.string(),
});

export type ClearDonationDraftInput = z.infer<typeof clearDonationDraftInputSchema>;
