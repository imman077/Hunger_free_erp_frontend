import { z } from "zod";

export const deleteDonationInputSchema = z.object({
  id: z.string(),
});

export type DeleteDonationInput = z.infer<typeof deleteDonationInputSchema>;
