import { z } from "zod";

export const getDonationByIdInputSchema = z.object({
  id: z.string(),
});

export type GetDonationByIdInput = z.infer<typeof getDonationByIdInputSchema>;
