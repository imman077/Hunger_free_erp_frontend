import { z } from "zod";

export const getDonationDraftInputSchema = z.object({
  userId: z.string(),
});

export type GetDonationDraftInput = z.infer<typeof getDonationDraftInputSchema>;
