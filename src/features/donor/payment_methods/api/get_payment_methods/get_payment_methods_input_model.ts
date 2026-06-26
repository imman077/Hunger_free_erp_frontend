import { z } from "zod";

export const getPaymentMethodsInputSchema = z.object({
  userId: z.string(),
});

export type GetPaymentMethodsInput = z.infer<typeof getPaymentMethodsInputSchema>;
