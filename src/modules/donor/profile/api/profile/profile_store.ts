import { create } from "zustand";
import type { ProfileDetail } from "./profile_output_model";

interface DonorProfileState {
  profile: ProfileDetail | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: ProfileDetail) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDonorProfileStore = create<DonorProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
