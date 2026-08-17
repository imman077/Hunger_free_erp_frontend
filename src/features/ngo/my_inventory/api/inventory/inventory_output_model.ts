import { z } from "zod";

export const InventoryItemSchema = z
  .object({
    id: z.union([z.number(), z.string()]),
    item_name: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    quantity: z.union([z.number(), z.string()]).optional().nullable(),
    unit: z.string().optional().nullable(),
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
