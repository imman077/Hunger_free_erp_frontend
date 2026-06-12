import { useCallback } from "react";
import { useConfigStore } from "../store/config-store";
import { toast } from "sonner";
import type { SystemConfig, ConfigItem } from "../store/config-schemas";

export const useConfig = () => {
  const { config, addItem, updateItem, deleteItem } = useConfigStore();

  const handleAddItem = useCallback(
    (section: keyof SystemConfig, item: Omit<ConfigItem, "id">) => {
      addItem(section, item);
      toast.success("New configuration item added!");
    },
    [addItem],
  );

  const handleUpdateItem = useCallback(
    (section: keyof SystemConfig, id: number, updates: Partial<ConfigItem>) => {
      updateItem(section, id, updates);
      toast.success("Configuration updated successfully.");
    },
    [updateItem],
  );

  const handleDeleteItem = useCallback(
    (section: keyof SystemConfig, id: number) => {
      deleteItem(section, id);
      toast.success("Configuration item deleted.");
    },
    [deleteItem],
  );

  return {
    config,
    actions: {
      addItem: handleAddItem,
      updateItem: handleUpdateItem,
      deleteItem: handleDeleteItem,
    },
  };
};
