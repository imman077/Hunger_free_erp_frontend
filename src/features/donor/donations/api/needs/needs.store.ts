import { create } from "zustand";
import type { Need } from "./needs.output";

interface DonorNeedsState {
  needs: Need[];
  selectedNeed: Need | null;
  isLoading: boolean;
  error: string | null;
  setNeeds: (needs: Need[]) => void;
  setSelectedNeed: (need: Need | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDonorNeedsStore = create<DonorNeedsState>((set) => ({
  needs: [],
  selectedNeed: null,
  isLoading: false,
  error: null,
  setNeeds: (needs) => set({ needs }),
  setSelectedNeed: (selectedNeed) => set({ selectedNeed }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
