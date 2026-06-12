import { create } from "zustand";
import type { InventoryItem } from "./inventory.output";

interface NgoInventoryState {
  inventory: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  setInventory: (inventory: InventoryItem[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNgoInventoryStore = create<NgoInventoryState>((set) => ({
  inventory: [],
  isLoading: false,
  error: null,
  setInventory: (inventory) => set({ inventory }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
