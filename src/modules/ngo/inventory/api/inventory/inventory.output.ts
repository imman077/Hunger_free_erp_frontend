import { z } from "zod";

export const InventoryItemSchema = z
  .object({
    id: z.number(),
    item_name: z.string(),
    quantity: z.number(),
    unit: z.string(),
    category: z.string().optional().nullable(),
    expiry_date: z.string().optional().nullable(),
  })
  .passthrough();

export type InventoryItem = z.infer<typeof InventoryItemSchema>;

export const GetInventoryResponseSchema = z.array(InventoryItemSchema);
export const AddItemResponseSchema = InventoryItemSchema;
export const UpdateItemResponseSchema = InventoryItemSchema;
export const DeleteItemResponseSchema = z.any();

export type GetInventoryResponse = z.infer<typeof GetInventoryResponseSchema>;
export type AddItemResponse = z.infer<typeof AddItemResponseSchema>;
export type UpdateItemResponse = z.infer<typeof UpdateItemResponseSchema>;
