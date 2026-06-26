import { z } from "zod";

export const submitEnquiryInputSchema = z.object({
  userId: z.string().optional().nullable(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  message: z.string(),
  role: z.string().optional().nullable(),
});

export type SubmitEnquiryInput = z.infer<typeof submitEnquiryInputSchema>;
