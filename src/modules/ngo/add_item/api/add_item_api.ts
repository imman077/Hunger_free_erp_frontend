import { ngoInventoryService } from "../../my_inventory/api/inventory/inventory_api";
import type { AddItemInput } from "../../my_inventory/api/inventory/inventory_input_model";
import type { AddItemResponse } from "../../my_inventory/api/inventory/inventory_output_model";

export const addItemApi = async (itemData: AddItemInput): Promise<AddItemResponse> => {
  return ngoInventoryService.addItem(itemData);
};
