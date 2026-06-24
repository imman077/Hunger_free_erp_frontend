import { z } from "zod";

export const getDietaryTypesInputSchema = z.object({
  key: z.string().optional(),
});

export type GetDietaryTypesInput = z.infer<typeof getDietaryTypesInputSchema>;
