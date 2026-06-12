import { create } from "zustand";
import type { Enquiry, RewardEnquiry } from "./enquiry-schemas";
import { adminService } from "../../api/admin-service";

interface EnquiryStore {
  registrations: Enquiry[];
  rewards: RewardEnquiry[];
  isLoading: boolean;

  fetchEnquiries: () => Promise<void>;
  approveRegistration: (id: string | number) => Promise<void>;
  rejectRegistration: (id: string | number) => Promise<void>;
}

export const useEnquiryStore = create<EnquiryStore>((set) => ({
  registrations: [],
  rewards: [],
  isLoading: false,

  fetchEnquiries: async () => {
    set({ isLoading: true });
    try {
      // For enquiries, we fetch pending NGOs as 'registrations'
      const [ngosRes, claimsRes] = await Promise.all([
        adminService.getNGOs(),
        adminService.getRewardClaims(),
      ]);

      set({
        registrations: ngosRes.data.filter((n: any) => n.status === 'Pending').map((n: any) => ({
          id: n.id.toString(),
          name: n.name,
          type: "NGO Registration",
          email: n.email || "N/A",
          phone: n.phone || "N/A",
          city: n.beneficiaries, // Using beneficiaries as a location placeholder if city is missing
          status: "Registration Pending",
          time: "Just now",
          priority: "high",
          appliedDate: "Pending",
          regNo: n.registration_no,
          link: "/admin/users",
        })),
        rewards: claimsRes.data.filter((c: any) => c.status === 'Approval Required').map((c: any) => ({
          id: c.id.toString(),
          name: c.reward_name,
          user: c.user_name,
          userType: "Partner",
          points: c.points_at_claim.toString(),
          status: c.status,
          time: "Recently",
          priority: "medium",
          appliedDate: c.created_at.split('T')[0],
          category: "Points",
          userPointsBalance: "N/A",
        })),
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch enquiries", error);
      set({ isLoading: false });
    }
  },

  approveRegistration: async (id) => {
    try {
      await adminService.updateNGO(Number(id), { status: 'Active' });
      set((state) => ({
        registrations: state.registrations.filter((r) => r.id !== id.toString()),
      }));
    } catch (e) { console.error(e); }
  },

  rejectRegistration: async (id) => {
    try {
      await adminService.updateNGO(Number(id), { status: 'Rejected' });
      set((state) => ({
        registrations: state.registrations.filter((r) => r.id !== id.toString()),
      }));
    } catch (e) { console.error(e); }
  },
}));
