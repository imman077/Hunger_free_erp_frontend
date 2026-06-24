import { z } from "zod";

export const getFoodCategoriesInputSchema = z.object({
  key: z.string().optional(),
});

export type GetFoodCategoriesInput = z.infer<typeof getFoodCategoriesInputSchema>;
