import { create } from "zustand";
import type { RewardConfig, Redemption, RewardCatalog } from "./rewards-schemas";
import { adminService } from "../../api/admin-service";

interface RewardsStore {
  catalog: RewardCatalog;
  redemptions: Redemption[];
  isLoading: boolean;

  // Actions
  fetchRewards: () => Promise<void>;
  addReward: (category: keyof RewardCatalog, reward: RewardConfig) => void;
  updateReward: (category: keyof RewardCatalog, id: string | number, updates: Partial<RewardConfig>) => void;
  toggleRewardActive: (category: keyof RewardCatalog, id: string | number) => void;
  deleteReward: (category: keyof RewardCatalog, id: string | number) => void;
  approveRedemption: (id: string | number) => Promise<void>;
  rejectRedemption: (id: string | number) => Promise<void>;
}

export const useRewardsStore = create<RewardsStore>((set) => ({
  catalog: { donor: [], ngo: [], volunteer: [] },
  redemptions: [],
  isLoading: false,

  fetchRewards: async () => {
    set({ isLoading: true });
    try {
      const [rewardsRes, claimsRes] = await Promise.all([
        adminService.getRewards(),
        adminService.getRewardClaims(),
      ]);

      const rewards = rewardsRes.data;
      const catalog: RewardCatalog = {
        donor: rewards.filter((r: any) => r.category.toLowerCase() === 'donor').map((r: any) => ({
          id: r.id, name: r.name, val: r.description, pts: r.points_required, active: r.status === 'Active', tag: r.category
        })),
        ngo: rewards.filter((r: any) => r.category.toLowerCase() === 'ngo').map((r: any) => ({
          id: r.id, name: r.name, val: r.description, pts: r.points_required, active: r.status === 'Active', tag: r.category
        })),
        volunteer: rewards.filter((r: any) => r.category.toLowerCase() === 'volunteer').map((r: any) => ({
          id: r.id, name: r.name, val: r.description, pts: r.points_required, active: r.status === 'Active', tag: r.category
        })),
      };

      set({
        catalog,
        redemptions: claimsRes.data.map((c: any) => ({
          id: c.id.toString(),
          userName: c.user_name,
          userType: "User", // Role info to be enhanced
          rewardName: c.reward_name,
          pointsDeducted: c.points_at_claim,
          status: c.status,
          date: c.created_at.split('T')[0],
        })),
        isLoading: false
      });
    } catch (error) {
      console.error("Failed to fetch rewards", error);
      set({ isLoading: false });
    }
  },

  addReward: (category, reward) =>
    set((state) => ({ catalog: { ...state.catalog, [category]: [...state.catalog[category], reward] } })),

  updateReward: (category, id, updates) =>
    set((state) => ({
      catalog: { ...state.catalog, [category]: state.catalog[category].map((r) => r.id === id ? { ...r, ...updates } : r) },
    })),

  toggleRewardActive: (category, id) =>
    set((state) => ({
      catalog: { ...state.catalog, [category]: state.catalog[category].map((r) => r.id === id ? { ...r, active: !r.active } : r) },
    })),

  deleteReward: (category, id) =>
    set((state) => ({
      catalog: { ...state.catalog, [category]: state.catalog[category].filter((r) => r.id !== id) },
    })),

  approveRedemption: async (id) => {
    try {
      await adminService.updateRewardClaim(Number(id), { status: 'Approved' });
      set((state) => ({
        redemptions: state.redemptions.map((r) => r.id === id.toString() ? { ...r, status: "Approved" } : r),
      }));
    } catch (e) { console.error(e); }
  },

  rejectRedemption: async (id) => {
    try {
      await adminService.updateRewardClaim(Number(id), { status: 'Rejected' });
      set((state) => ({
        redemptions: state.redemptions.map((r) => r.id === id.toString() ? { ...r, status: "Rejected" } : r),
      }));
    } catch (e) { console.error(e); }
  },
}));
