import { z } from "zod";

export const ProfileDetailSchema = z.object({
  businessName: z.string(),
  businessType: z.string(),
  registrationId: z.string(),
  taxId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  memberSince: z.string(),
  verificationLevel: z.string(),
  completion: z.number(),
  bankName: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  upiId: z.string().optional().nullable(),
  branch: z.string().optional().nullable(),
});

export type ProfileDetail = z.infer<typeof ProfileDetailSchema>;
