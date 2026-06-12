import { create } from "zustand";
import type { Donation } from "./donations.output";

interface DonorDonationsState {
  myDonations: Donation[];
  selectedDonation: Donation | null;
  isLoading: boolean;
  error: string | null;
  setMyDonations: (donations: Donation[]) => void;
  setSelectedDonation: (donation: Donation | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDonorDonationsStore = create<DonorDonationsState>((set) => ({
  myDonations: [],
  selectedDonation: null,
  isLoading: false,
  error: null,
  setMyDonations: (myDonations) => set({ myDonations }),
  setSelectedDonation: (selectedDonation) => set({ selectedDonation }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
