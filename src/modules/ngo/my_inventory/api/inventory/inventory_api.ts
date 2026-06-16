import axiosInstance from "../../../../../global/utils/axios-instance";
import { AddItemInputSchema, UpdateItemInputSchema, DeleteItemInputSchema } from "./inventory_input_model";
import type { AddItemInput, DeleteItemInput } from "./inventory_input_model";
import {
  GetInventoryResponseSchema,
  AddItemResponseSchema,
  UpdateItemResponseSchema,
  DeleteItemResponseSchema,
} from "./inventory_output_model";
import type { GetInventoryResponse, AddItemResponse, UpdateItemResponse } from "./inventory_output_model";

export const ngoInventoryService = {
  /**
   * Fetches the current NGO's inventory.
   */
  getInventory: async (): Promise<GetInventoryResponse> => {
    try {
      const response = await axiosInstance.get("inventory/");
      return GetInventoryResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw error;
    }
  },

  /**
   * Adds a new item to the NGO's inventory.
   */
  addItem: async (itemData: AddItemInput): Promise<AddItemResponse> => {
    try {
      const validatedInput = AddItemInputSchema.parse(itemData);
      const response = await axiosInstance.post("inventory/", validatedInput);
      return AddItemResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error adding inventory item:", error);
      throw error;
    }
  },

  /**
   * Updates an existing inventory item.
   */
  updateItem: async (itemId: number, itemData: any): Promise<UpdateItemResponse> => {
    try {
      const validatedInput = UpdateItemInputSchema.parse({ itemId, itemData });
      const response = await axiosInstance.patch(`inventory/${validatedInput.itemId}/`, validatedInput.itemData);
      return UpdateItemResponseSchema.parse(response.data);
    } catch (error) {
      console.error(`Error updating inventory item ${itemId}:`, error);
      throw error;
    }
  },

  /**
   * Deletes an inventory item.
   */
  deleteItem: async (itemId: DeleteItemInput): Promise<any> => {
    try {
      const validatedId = DeleteItemInputSchema.parse(itemId);
      const response = await axiosInstance.delete(`inventory/${validatedId}/`);
      return DeleteItemResponseSchema.parse(response.data);
    } catch (error) {
      console.error(`Error deleting inventory item ${itemId}:`, error);
      throw error;
    }
  },
};
