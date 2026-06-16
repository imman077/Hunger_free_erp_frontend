import { z } from "zod";

export const AddItemInputSchema = z
  .object({
    item_name: z.string().min(1),
    quantity: z.number().min(0),
    unit: z.string().min(1),
    category: z.string().optional(),
    expiry_date: z.string().optional().nullable(),
  })
  .passthrough();

export const UpdateItemInputSchema = z.object({
  itemId: z.number(),
  itemData: z
    .object({
      item_name: z.string().optional(),
      quantity: z.number().optional(),
      unit: z.string().optional(),
      category: z.string().optional(),
      expiry_date: z.string().optional().nullable(),
    })
    .passthrough(),
});

export const DeleteItemInputSchema = z.number();

export type AddItemInput = z.infer<typeof AddItemInputSchema>;
export type UpdateItemInput = z.infer<typeof UpdateItemInputSchema>;
export type DeleteItemInput = z.infer<typeof DeleteItemInputSchema>;
