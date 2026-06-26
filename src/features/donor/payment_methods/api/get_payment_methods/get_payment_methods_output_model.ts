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

export const paymentMethodsOutputSchema = z.object({
  bankAccounts: z.array(BankAccountSchema).optional().nullable(),
  upiIds: z.array(UPIIdSchema).optional().nullable(),
});

export const getPaymentMethodsApiOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: paymentMethodsOutputSchema.optional().nullable(),
});

export const getPaymentMethodsOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getPaymentMethodsOutputSchemas = createSchemaBundle(
  getPaymentMethodsApiOutputSchema,
  {
    dataPath: "getPaymentMethodsApiData",
    persistenceConfig: getPaymentMethodsOutputPersistenceConfig,
  }
);

export type GetPaymentMethodsApiOutput = z.infer<typeof getPaymentMethodsApiOutputSchema>;
export type BankAccountDetail = z.infer<typeof BankAccountSchema>;
export type UPIIdDetail = z.infer<typeof UPIIdSchema>;
export type PaymentMethodsOutput = z.infer<typeof paymentMethodsOutputSchema>;
