import { z } from "zod";

export const NgoNeedSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    ngo: z.union([z.string(), z.number()]).optional(),
    ngo_name: z.string().optional(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    quantity_required: z.string(),
    urgency: z.enum(["Low", "Medium", "High"]),
    status: z.string(),
    created_at: z.string(),
  })
  .passthrough();

export type NgoNeed = z.infer<typeof NgoNeedSchema>;

export const PostNeedResponseSchema = NgoNeedSchema;
export const GetMyNeedsResponseSchema = z.array(NgoNeedSchema);
export const GetAllNeedsResponseSchema = z.array(NgoNeedSchema);

export type PostNeedResponse = z.infer<typeof PostNeedResponseSchema>;
export type GetMyNeedsResponse = z.infer<typeof GetMyNeedsResponseSchema>;
export type GetAllNeedsResponse = z.infer<typeof GetAllNeedsResponseSchema>;
