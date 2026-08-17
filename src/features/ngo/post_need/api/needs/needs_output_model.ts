import { z } from "zod";

export const NgoNeedSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    ngo: z.union([z.string(), z.number()]).optional().nullable(),
    ngo_name: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    quantity_required: z.string().optional().nullable(),
    urgency: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    created_at: z.string().optional().nullable(),
  })
  .passthrough();

export type NgoNeed = z.infer<typeof NgoNeedSchema>;

export const PostNeedResponseSchema = NgoNeedSchema;
export const GetMyNeedsResponseSchema = z.array(NgoNeedSchema);
export const GetAllNeedsResponseSchema = z.array(NgoNeedSchema);

export type PostNeedResponse = z.infer<typeof PostNeedResponseSchema>;
export type GetMyNeedsResponse = z.infer<typeof GetMyNeedsResponseSchema>;
export type GetAllNeedsResponse = z.infer<typeof GetAllNeedsResponseSchema>;
