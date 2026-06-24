import { z } from "zod";

export const getPointsTiersInputSchema = z.object({
  role: z.string().optional().default("DONOR"),
});

export type GetPointsTiersInput = z.infer<typeof getPointsTiersInputSchema>;
