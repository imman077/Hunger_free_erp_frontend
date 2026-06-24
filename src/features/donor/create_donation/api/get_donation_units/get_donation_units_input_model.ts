import { z } from "zod";

export const getDonationUnitsInputSchema = z.object({
  key: z.string().optional(),
});

export type GetDonationUnitsInput = z.infer<typeof getDonationUnitsInputSchema>;
