import { create } from "zustand";
import type { UserData, Donor, Ngo, Volunteer, UserItem } from "./user-schemas";
import { adminService } from "../../api/admin-service";

interface UserState {
  data: UserData;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUserData: (data: Partial<UserData>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchUsers: () => Promise<void>;

  // Specific Entity Actions
  updateDonor: (donor: Donor) => void;
  updateNgo: (ngo: Ngo) => void;
  updateVolunteer: (volunteer: Volunteer) => void;
  updateUserItem: (user: UserItem) => void;
}

const emptyData: UserData = {
  donors: [],
  ngos: [],
  volunteers: [],
  users: [],
};

export const useUserStore = create<UserState>((set) => ({
  data: emptyData,
  isLoading: false,
  error: null,

  setUserData: (newData) => {
    set((state) => {
      const updatedData = { ...state.data, ...newData };
      return { data: updatedData };
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const [usersRes, donorsRes, ngosRes, volunteersRes] = await Promise.all([
        adminService.getUsers(),
        adminService.getDonors(),
        adminService.getNGOs(),
        adminService.getVolunteers(),
      ]);

      set({
        data: {
          users: usersRes.data.map((u: any) => ({
            id: u.id,
            name: u.username,
            role: u.profile?.role || "DONOR",
            status: "Active", // Backend to provide status later
            date: u.profile?.created_at || "",
            userId: `USR-${u.id.toString().padStart(5, '0')}`,
            joinedDate: u.profile?.created_at || "",
            lastLogin: u.profile?.last_login_at || "",
            lastLoginTime: "",
            totalPoints: u.donor_profile?.points || 0,
            email: u.email,
            phone: u.profile?.phone || "",
            address: u.profile?.address || "",
            organization: u.donor_profile?.business_name || u.ngo_profile?.name || "",
            location: u.profile?.address || "",
            badges: [],
            donationsMade: 0,
            itemsDonated: 0,
            avgRating: u.volunteer_profile?.rating || 0,
            recentActivity: [],
            miniTimeline: [],
          })),
          donors: donorsRes.data.map((d: any) => ({
            id: d.id,
            businessName: d.business_name,
            type: d.business_type,
            totalDonations: parseFloat(d.total_donations),
            points: d.points,
            status: d.status,
            contactPerson: d.contact_person,
            email: "", // User relation to be explored if needed
            phone: "",
            address: "",
            donationHistory: [],
          })),
          ngos: ngosRes.data.map((n: any) => ({
            id: n.id,
            name: n.name,
            registrationNo: n.registration_no,
            serviceAreas: n.service_areas,
            beneficiaries: n.beneficiaries,
            status: n.status,
            email: "",
            phone: "",
            address: "",
            volunteers: [],
          })),
          volunteers: volunteersRes.data.map((v: any) => ({
            id: v.id,
            name: "", // Fetch from user profile
            zone: v.zone,
            volunteerAreas: v.volunteer_areas,
            tasksCompleted: v.tasks_completed,
            totalTasks: v.tasks_completed, // Placeholder
            missedTasks: 0,
            rating: v.rating.toString(),
            status: v.status,
            onLeave: v.status === "on-leave",
            email: "",
            phone: "",
            emergencyPhone: "",
            address: "",
            vehicle: v.vehicle,
            license: "",
            createdDate: "",
            verificationStatus: v.verification_status,
            lastActive: "",
            lastAssignment: "",
            allowedTaskTypes: [],
            fuelEligibility: true,
            isSuspended: false,
          })),
        },
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateDonor: (updatedDonor) => {
    set((state) => ({
      data: {
        ...state.data,
        donors: state.data.donors.map((d) =>
          d.id === updatedDonor.id ? updatedDonor : d,
        ),
      },
    }));
  },

  updateNgo: (updatedNgo) => {
    set((state) => ({
      data: {
        ...state.data,
        ngos: state.data.ngos.map((n) =>
          n.id === updatedNgo.id ? updatedNgo : n,
        ),
      },
    }));
  },

  updateVolunteer: (updatedVolunteer) => {
    set((state) => ({
      data: {
        ...state.data,
        volunteers: state.data.volunteers.map((v) =>
          v.id === updatedVolunteer.id ? updatedVolunteer : v,
        ),
      },
    }));
  },

  updateUserItem: (updatedUser) => {
    set((state) => ({
      data: {
        ...state.data,
        users: state.data.users.map((u) =>
          u.id === updatedUser.id ? updatedUser : u,
        ),
      },
    }));
  },
}));
