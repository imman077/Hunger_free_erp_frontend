import { z } from "zod";

export const updateBankAccountInputSchema = z.object({
  userId: z.string(),
  accountId: z.string(),
  input: z.object({
    bankName: z.string(),
    accountHolder: z.string(),
    accountNumber: z.string(),
    ifscCode: z.string(),
    isPrimary: z.boolean().optional().default(false),
  }),
});

export type UpdateBankAccountInput = z.infer<typeof updateBankAccountInputSchema>;
