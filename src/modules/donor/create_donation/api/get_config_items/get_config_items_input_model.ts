import { z } from "zod";

export const getConfigItemsInputSchema = z.object({
  key: z.string().optional(),
});

export type GetConfigItemsInput = z.infer<typeof getConfigItemsInputSchema>;
