import { z } from "zod";

export const GetTiersInputSchema = z.object({
  // No parameters required for this query
});

export type GetTiersInput = z.infer<typeof GetTiersInputSchema>;
