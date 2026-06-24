import { create } from "zustand";
import type { NGONeed } from "../api/needs/needs_output_model";

interface DonorDashboardNeedsState {
  needs: NGONeed[];
  selectedNeed: NGONeed | null;
  isLoading: boolean;
  error: string | null;
  setNeeds: (needs: NGONeed[]) => void;
  setSelectedNeed: (need: NGONeed | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDonorDashboardNeedsStore = create<DonorDashboardNeedsState>((set) => ({
  needs: [],
  selectedNeed: null,
  isLoading: false,
  error: null,
  setNeeds: (needs) => set({ needs }),
  setSelectedNeed: (selectedNeed) => set({ selectedNeed }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
