import { z } from "zod";

export const getProfileInputSchema = z.object({
  userId: z.string(),
});

export type GetProfileInput = z.infer<typeof getProfileInputSchema>;
