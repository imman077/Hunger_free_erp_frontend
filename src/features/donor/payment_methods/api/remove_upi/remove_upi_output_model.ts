import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

const BankAccountSchema = z.object({
  id: z.string().optional().nullable(),
  bankName: z.string().optional().nullable(),
  accountHolder: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  ifscCode: z.string().optional().nullable(),
  isPrimary: z.boolean().optional().nullable(),
  isVerified: z.boolean().optional().nullable(),
});

const UPIIdSchema = z.object({
  id: z.string().optional().nullable(),
  vpa: z.string().optional().nullable(),
  label: z.string().optional().nullable(),
  isPrimary: z.boolean().optional().nullable(),
  isVerified: z.boolean().optional().nullable(),
});

export const removeUpiOutputSchema = z.object({
  bankAccounts: z.array(BankAccountSchema).optional().nullable(),
  upiIds: z.array(UPIIdSchema).optional().nullable(),
});

export const removeUpiApiOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: removeUpiOutputSchema.optional().nullable(),
});

export const removeUpiOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const removeUpiOutputSchemas = createSchemaBundle(
  removeUpiApiOutputSchema,
  {
    dataPath: "removeUpiApiData",
    persistenceConfig: removeUpiOutputPersistenceConfig,
  }
);

export type RemoveUpiApiOutput = z.infer<typeof removeUpiApiOutputSchema>;
