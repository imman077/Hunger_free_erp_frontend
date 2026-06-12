import { z } from "zod";

export const PostNeedInputSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    quantity_required: z.string().min(1),
    urgency: z.enum(["Low", "Medium", "High"]),
  })
  .passthrough();

export type PostNeedInput = z.infer<typeof PostNeedInputSchema>;
