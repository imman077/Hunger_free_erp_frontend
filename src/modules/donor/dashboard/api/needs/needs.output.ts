import { z } from "zod";

export const NGONeedSchema = z.object({
  id: z.union([z.string(), z.number()]),
  ngo: z.union([z.string(), z.number()]),
  ngo_name: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  quantity_required: z.string(),
  urgency: z.enum(["Low", "Medium", "High"]),
  status: z.string(),
  created_at: z.string(),
  beneficiaries: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  pickup_by: z.string().optional().nullable(),
});

export type NGONeed = z.infer<typeof NGONeedSchema>;

export const GetNeedsResponseSchema = z.array(NGONeedSchema);
export type GetNeedsResponse = z.infer<typeof GetNeedsResponseSchema>;
