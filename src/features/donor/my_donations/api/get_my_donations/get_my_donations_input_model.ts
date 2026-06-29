import { z } from "zod";

export const getMyDonationsInputSchema = z.object({
  status: z.string().optional().nullable(),
  sortOrder: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  search: z.string().optional().nullable(),
});

export type GetMyDonationsInput = z.infer<typeof getMyDonationsInputSchema>;
