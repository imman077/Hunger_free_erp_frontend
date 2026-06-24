import { z } from "zod";

export const getPreparationTypesInputSchema = z.object({
  key: z.string().optional(),
});

export type GetPreparationTypesInput = z.infer<typeof getPreparationTypesInputSchema>;
