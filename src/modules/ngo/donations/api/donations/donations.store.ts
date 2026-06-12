import { create } from "zustand";
import type { NgoDonation } from "./donations.output";

interface NgoDonationsState {
  marketplaceDonations: NgoDonation[];
  myRequests: NgoDonation[];
  isLoading: boolean;
  error: string | null;
  setMarketplaceDonations: (donations: NgoDonation[]) => void;
  setMyRequests: (requests: NgoDonation[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNgoDonationsStore = create<NgoDonationsState>((set) => ({
  marketplaceDonations: [],
  myRequests: [],
  isLoading: false,
  error: null,
  setMarketplaceDonations: (marketplaceDonations) => set({ marketplaceDonations }),
  setMyRequests: (myRequests) => set({ myRequests }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
