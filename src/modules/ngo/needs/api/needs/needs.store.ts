import { create } from "zustand";
import type { NgoNeed } from "./needs.output";

interface NgoNeedsState {
  myNeeds: NgoNeed[];
  allNeeds: NgoNeed[];
  isLoading: boolean;
  error: string | null;
  setMyNeeds: (needs: NgoNeed[]) => void;
  setAllNeeds: (needs: NgoNeed[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNgoNeedsStore = create<NgoNeedsState>((set) => ({
  myNeeds: [],
  allNeeds: [],
  isLoading: false,
  error: null,
  setMyNeeds: (myNeeds) => set({ myNeeds }),
  setAllNeeds: (allNeeds) => set({ allNeeds }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
