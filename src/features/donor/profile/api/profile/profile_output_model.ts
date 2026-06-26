import { z } from "zod";

export const ProfileDetailSchema = z.object({
  businessName: z.string(),
  businessType: z.string(),
  registrationId: z.string(),
  taxId: z.string(),
  legalName: z.string().optional().default(''),
  website: z.string().optional().default(''),
  entityType: z.string().optional().default(''),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  alternateContact: z.string().optional().default(''),
  address: z.object({
    line1: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional().default({}),
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
