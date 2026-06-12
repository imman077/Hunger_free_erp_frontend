import { create } from "zustand";
import type { Donation, Volunteer, DonationStats } from "./donation-schemas";
import { adminService } from "../../api/admin-service";

interface DonationState {
  donations: Donation[];
  volunteers: Volunteer[];
  stats: DonationStats[];
  isLoading: boolean;

  // Actions
  fetchDonations: () => Promise<void>;
  setDonations: (donations: Donation[]) => void;
  updateDonation: (id: string, updates: Partial<Donation>) => void;
  setStats: (stats: DonationStats[]) => void;
}

export const useDonationStore = create<DonationState>((set) => ({
  donations: [],
  volunteers: [],
  stats: [],
  isLoading: false,

  fetchDonations: async () => {
    set({ isLoading: true });
    try {
      const [donationsRes, volunteersRes] = await Promise.all([
        adminService.getDonations(),
        adminService.getVolunteers(),
      ]);

      set({
        donations: donationsRes.data.map((d: any) => ({
          id: d.id.toString(),
          donor: d.donor_name,
          foodType: d.food_type,
          quantity: d.quantity,
          pickupTime: d.pickup_time,
          status: d.status,
          assignedVolunteer: d.assigned_volunteer ? d.volunteer_name : null,
        })),
        volunteers: volunteersRes.data.map((v: any) => ({
          id: v.id.toString(),
          name: v.user_name || "Unknown",
          rating: v.rating.toString(),
          vehicle: v.vehicle,
          distance: "Calculating...",
          tasks: v.tasks_completed,
        })),
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch donations", error);
      set({ isLoading: false });
    }
  },

  setDonations: (donations) => set({ donations }),

  updateDonation: (id, updates) =>
    set((state) => ({
      donations: state.donations.map((d) =>
        d.id === id ? { ...d, ...updates } : d,
      ),
    })),

  setStats: (stats) => set({ stats }),
}));
