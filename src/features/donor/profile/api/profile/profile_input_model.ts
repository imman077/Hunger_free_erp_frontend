import { z } from "zod";

const AddressInputSchema = z.object({
  line1: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
}).optional().nullable();

export const ProfileUpdateInputSchema = z.object({
  username: z.string().optional().nullable(),
  businessName: z.string().optional().nullable(),
  businessType: z.string().optional().nullable(),
  subCategory: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
  address: AddressInputSchema,
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateInputSchema>;
