import { create } from "zustand";
import type { ImpactMetric, DonationTrend, CategoryData } from "./analytics-schemas";
import { adminService } from "../../api/admin-service";

interface AnalyticsStore {
  impactMetrics: ImpactMetric[];
  donationTrends: DonationTrend[];
  categoryData: CategoryData[];
  isLoading: boolean;

  // Actions
  fetchAnalytics: () => Promise<void>;
  setImpactMetrics: (metrics: ImpactMetric[]) => void;
  setDonationTrends: (trends: DonationTrend[]) => void;
  setCategoryData: (data: CategoryData[]) => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  impactMetrics: [],
  donationTrends: [],
  categoryData: [],
  isLoading: false,

  fetchAnalytics: async () => {
    set({ isLoading: true });
    try {
      const statsRes = await adminService.getDashboardStats();
      const stats = statsRes.data;
      
      set({
        impactMetrics: [
          { label: "Total Donations", val: stats.total_donations.toString(), trend: "Live SQL", color: "bg-[#22c55e]" },
          { label: "Active Users", val: stats.total_users.toString(), trend: "Across roles", color: "bg-emerald-500" },
          { label: "Partner NGOs", val: stats.pending_ngos.toString(), trend: "Pending Approval", color: "bg-amber-500" },
          { label: "Active Donors", val: stats.active_donors.toString(), trend: "Contributing", color: "bg-blue-500" },
        ],
        isLoading: false,
      });
    } catch (e) {
      console.error("Failed to fetch analytics", e);
      set({ isLoading: false });
    }
  },

  setImpactMetrics: (impactMetrics) => set({ impactMetrics }),
  setDonationTrends: (donationTrends) => set({ donationTrends }),
  setCategoryData: (categoryData) => set({ categoryData }),
}));
