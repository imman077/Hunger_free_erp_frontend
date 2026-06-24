import { z } from "zod";

export const GetMilestonesInputSchema = z.object({
  category: z.string().optional(),
});

export type GetMilestonesInput = z.infer<typeof GetMilestonesInputSchema>;
