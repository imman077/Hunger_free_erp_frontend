import { create } from "zustand";
import type { SystemConfig, ConfigItem } from "./config-schemas";
import { adminService } from "../../api/admin-service";

interface ConfigStore {
  config: SystemConfig;
  isLoading: boolean;

  // Actions
  fetchConfig: () => Promise<void>;
  addItem: (
    section: keyof SystemConfig,
    item: Omit<ConfigItem, "id">,
  ) => Promise<void>;
  updateItem: (
    section: keyof SystemConfig,
    id: number,
    updates: Partial<ConfigItem>,
  ) => Promise<void>;
  deleteItem: (section: keyof SystemConfig, id: number) => Promise<void>;
}

const INITIAL_CONFIG: SystemConfig = {
  foodCategories: [],
  donationStatuses: [],
  userStatuses: [],
  ngoTypes: [],
  volunteerSkills: [],
};

export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: INITIAL_CONFIG,
  isLoading: false,

  fetchConfig: async () => {
    set({ isLoading: true });
    try {
      // Fetch each section from backend. If it doesn't exist, it will use defaults or empty
      const sections: (keyof SystemConfig)[] = [
        "foodCategories",
        "donationStatuses",
        "userStatuses",
        "ngoTypes",
        "volunteerSkills",
      ];
      const newConfig = { ...get().config };

      await Promise.all(
        sections.map(async (key) => {
          try {
            const res = await adminService.getConfig(key);
            newConfig[key] = res.data.value;
          } catch (e) {
            // If not found, we could seed it later
            console.warn(`Config ${key} not found on server.`);
          }
        }),
      );

      set({ config: newConfig, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  addItem: async (section, item) => {
    const currentItems = get().config[section];
    const maxId = Math.max(...currentItems.map((i) => i.id), 0);
    const newItem = { ...item, id: maxId + 1 };
    const updatedItems = [...currentItems, newItem];

    try {
      await adminService.updateConfig(section, {
        key: section,
        value: updatedItems,
      });
      set((state) => ({
        config: { ...state.config, [section]: updatedItems },
      }));
    } catch (e) {
      // If config doesn't exist, create it
      await adminService.createConfig({ key: section, value: updatedItems });
      set((state) => ({
        config: { ...state.config, [section]: updatedItems },
      }));
    }
  },

  updateItem: async (section, id, updates) => {
    const updatedItems = get().config[section].map((item) =>
      item.id === id ? { ...item, ...updates } : item,
    );
    await adminService.updateConfig(section, {
      key: section,
      value: updatedItems,
    });
    set((state) => ({ config: { ...state.config, [section]: updatedItems } }));
  },

  deleteItem: async (section, id) => {
    const updatedItems = get().config[section].filter((item) => item.id !== id);
    await adminService.updateConfig(section, {
      key: section,
      value: updatedItems,
    });
    set((state) => ({ config: { ...state.config, [section]: updatedItems } }));
  },
}));
