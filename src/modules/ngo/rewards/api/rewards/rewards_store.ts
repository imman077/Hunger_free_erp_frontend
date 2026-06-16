import { create } from "zustand";
import type { GetRewardsResponse, RewardTier, SpinPrize } from "./rewards_output_model";

interface NgoRewardsState {
  rewards: GetRewardsResponse | null;
  tiers: RewardTier[];
  spinPrizes: SpinPrize[];
  profile: any;
  isLoading: boolean;
  error: string | null;
  setRewards: (rewards: GetRewardsResponse) => void;
  setTiers: (tiers: RewardTier[]) => void;
  setSpinPrizes: (spinPrizes: SpinPrize[]) => void;
  setProfile: (profile: any) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNgoRewardsStore = create<NgoRewardsState>((set) => ({
  rewards: null,
  tiers: [],
  spinPrizes: [],
  profile: null,
  isLoading: false,
  error: null,
  setRewards: (rewards) => set({ rewards }),
  setTiers: (tiers) => set({ tiers }),
  setSpinPrizes: (spinPrizes) => set({ spinPrizes }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
