import { create } from "zustand";
import { DashboardDataSchema } from "./dashboard-schemas";
import type { DashboardData } from "./dashboard-schemas";
import { adminService } from "../../api/admin-service";

interface DashboardState {
  data: DashboardData;
  isLoading: boolean;
  error: string | null;

  // Actions
  setDashboardData: (data: DashboardData) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchDashboardData: () => Promise<void>;
}

const initialData: DashboardData = {
  stats: [
    { title: "Total Donations", value: "0", change: "Syncing...", changeColor: "text-slate-400" },
    { title: "Active Users", value: "0", change: "Syncing...", changeColor: "text-slate-400" },
    { title: "NGO Partners", value: "0", change: "Syncing...", changeColor: "text-slate-400" },
    { title: "Volunteers Onboarded", value: "0", change: "Syncing...", changeColor: "text-slate-400" },
  ],
  donationsChart: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      { label: "Donations", data: [0, 0, 0, 0, 0, 0, 0], backgroundColor: "#e9775a", borderColor: "#e9775a" },
      { label: "Pickups", data: [0, 0, 0, 0, 0, 0, 0], backgroundColor: "#2a9d90", borderColor: "#2a9d90" },
    ],
  },
  userGrowthChart: {
    labels: ["Donor", "NGO", "Volunteers"],
    datasets: [{ label: "Sign-ups", data: [0, 0, 0], backgroundColor: "#e75531", borderColor: "#e75531" }],
  },
};

export const useDashboardStore = create<DashboardState>((set) => ({
  data: initialData,
  isLoading: false,
  error: null,

  setDashboardData: (newData) => {
    const result = DashboardDataSchema.safeParse(newData);
    if (result.success) {
      set({ data: result.data });
    } else {
      set({ error: "Invalid data format received" });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: stats } = await adminService.getDashboardStats();
      
      set((state) => ({
        data: {
          ...state.data,
          stats: [
            { title: "Total Donations", value: stats.total_donations.toString(), change: "Live from SQL", changeColor: "text-hf-green" },
            { title: "Active Users", value: stats.total_users.toString(), change: "Total registered", changeColor: "text-hf-green" },
            { title: "NGO Partners", value: stats.pending_ngos.toString(), change: "Pending approval", changeColor: "text-amber-500" },
            { title: "Active Donors", value: stats.active_donors.toString(), change: "Active contributors", changeColor: "text-hf-green" },
          ],
        },
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
