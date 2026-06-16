import { z } from "zod";

export const verifyPickupInputSchema = z.object({
  id: z.string(),
  otp: z.string(),
});

export type VerifyPickupInput = z.infer<typeof verifyPickupInputSchema>;
