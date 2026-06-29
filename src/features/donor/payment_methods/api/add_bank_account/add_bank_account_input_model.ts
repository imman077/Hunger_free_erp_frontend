import { z } from "zod";

export const addBankAccountInputSchema = z.object({
  userId: z.string(),
  input: z.object({
    bankName: z.string(),
    accountHolder: z.string(),
    accountNumber: z.string(),
    ifscCode: z.string(),
    isPrimary: z.boolean().optional().default(false),
  }),
});

export type AddBankAccountInput = z.infer<typeof addBankAccountInputSchema>;
