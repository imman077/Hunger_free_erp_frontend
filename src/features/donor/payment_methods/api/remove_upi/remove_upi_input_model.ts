import { z } from "zod";

export const removeUpiInputSchema = z.object({
  userId: z.string(),
  upiId: z.string(),
});

export type RemoveUpiInput = z.infer<typeof removeUpiInputSchema>;
