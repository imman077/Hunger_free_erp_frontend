import { toast } from "sonner";
import { myInventoryInputModel } from "../store/my_inventory_store";
import { ngoInventoryService } from "../api/inventory/inventory_api";
import type { InventoryItem } from "../model/my_inventory_model";

export const fetchInventory = async () => {
  myInventoryInputModel.update({ isLoading: true });
  try {
    const data = await ngoInventoryService.getInventory();
    const mapped = (Array.isArray(data) ? data : []).map((item: any) => ({
      ...item,
      item_name: item.item_name || item.itemName || item.name || item.title || "Inventory Item",
      status: item.status || "Stored",
      urgency: item.urgency || "Normal",
      condition: item.condition || item.itemCondition || "Excellent",
      location: item.location || item.storageLocation || "Main Storage",
      expiry_date: item.expiry_date || (item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null),
      added_on: item.createdAt || item.created_at
        ? new Date(item.createdAt || item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date(item.createdAt || item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : "Apr 12, 2025 • 02:32 PM",
    }));
    myInventoryInputModel.update({ items: mapped });
  } catch (error) {
    toast.error("Failed to load inventory");
  } finally {
    myInventoryInputModel.update({ isLoading: false });
  }
};

export const handleViewDetails = (record: InventoryItem) => {
  myInventoryInputModel.update({
    selectedRecord: record,
    editFormData: {
      quantity: String(record.quantity),
      status: record.status || "Stored",
    },
    isEditing: false,
    isDrawerOpen: true,
  });
};

export const handleUpdateStock = async () => {
  const state = myInventoryInputModel.useStore.getState().myInventoryState;
  const { selectedRecord, editFormData } = state;
  if (!selectedRecord) return;

  myInventoryInputModel.update({ isUpdating: true });
  try {
    await ngoInventoryService.updateItem(selectedRecord.id, {
      quantity: parseFloat(editFormData.quantity) || 0,
      status: editFormData.status,
    });
    toast.success("Stock Updated", {
      description: `${selectedRecord.item_name} levels have been updated.`,
    });
    myInventoryInputModel.update({ isDrawerOpen: false });
    await fetchInventory();
  } catch (error) {
    toast.error("Failed to update stock");
  } finally {
    myInventoryInputModel.update({ isUpdating: false });
  }
};

export const setEditFormDataValue = (name: string, value: any) => {
  const state = myInventoryInputModel.useStore.getState().myInventoryState;
  myInventoryInputModel.update({
    editFormData: {
      ...state.editFormData,
      [name]: value,
    },
  });
};

export const setIsEditing = (isEditing: boolean) => {
  myInventoryInputModel.update({ isEditing });
};

export const setIsDrawerOpen = (isDrawerOpen: boolean) => {
  myInventoryInputModel.update({ isDrawerOpen });
};

export const handleDeleteItem = (itemId: string | number, itemName: string) => {
  myInventoryInputModel.update({
    isDeleteModalOpen: true,
    deleteItemId: itemId,
    deleteItemName: itemName,
  });
};

export const confirmDelete = async () => {
  const state = myInventoryInputModel.useStore.getState().myInventoryState;
  const itemId = state.deleteItemId;
  const itemName = state.deleteItemName;
  if (!itemId) return;

  try {
    await ngoInventoryService.deleteItem(itemId);
    toast.success("Item Deleted", {
      description: `${itemName} has been removed from inventory.`,
    });
    await fetchInventory();
  } catch (error) {
    toast.error("Failed to delete item");
  } finally {
    myInventoryInputModel.update({
      isDeleteModalOpen: false,
      deleteItemId: null,
      deleteItemName: "",
    });
  }
};

export const onDestroy = () => {
  myInventoryInputModel.reset();
};
