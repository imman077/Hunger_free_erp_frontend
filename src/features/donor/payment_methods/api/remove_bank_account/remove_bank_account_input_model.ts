import { z } from "zod";

export const removeBankAccountInputSchema = z.object({
  userId: z.string(),
  accountId: z.string(),
});

export type RemoveBankAccountInput = z.infer<typeof removeBankAccountInputSchema>;
