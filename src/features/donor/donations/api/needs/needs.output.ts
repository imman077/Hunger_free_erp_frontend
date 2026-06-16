import { z } from "zod";

export const SupporterUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  donorProfile: z.object({
    businessName: z.string().optional().nullable(),
  }).optional().nullable(),
});

export const NeedSchema = z.object({
  id: z.union([z.string(), z.number()]),
  ngo: z.union([z.string(), z.number()]),
  ngoName: z.string().optional().nullable(),
  itemName: z.string(),
  category: z.string(),
  quantity: z.number().optional().nullable(),
  unit: z.string().optional().nullable(),
  urgency: z.string().optional().nullable(),
  requiredBy: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  distributionAddress: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  fulfilledQuantity: z.number().optional().nullable(),
  supporterIds: z.array(z.string()).optional().nullable(),
  supporters: z.array(SupporterUserSchema).optional().nullable(),
  createdAt: z.string().optional().nullable(),
}).passthrough();

export type Need = z.infer<typeof NeedSchema>;

export const GetNeedsResponseSchema = z.array(NeedSchema);
export type GetNeedsResponse = z.infer<typeof GetNeedsResponseSchema>;
