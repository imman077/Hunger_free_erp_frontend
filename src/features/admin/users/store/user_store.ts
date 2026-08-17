import { create } from "zustand";
import type { UserData, Donor, Ngo, Volunteer, UserItem } from "../model/user_schemas";
import adminService from "../api/users_api";

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

const DEFAULT_VOLUNTEERS: Volunteer[] = [
  {
    id: 101,
    name: "John V",
    email: "john.v@hungerfree.org",
    phone: "+91 98765 43210",
    emergencyPhone: "+91 98765 00001",
    address: "Block 4, Anna Nagar West, Chennai, Tamil Nadu - 600040",
    zone: "North",
    volunteerAreas: ["Anna Nagar", "Ambattur", "T Nagar"],
    tasksCompleted: 48,
    totalTasks: 50,
    missedTasks: 2,
    rating: "4.8",
    status: "available",
    onLeave: false,
    vehicle: "Bike (TN 01 AB 1234)",
    license: "DL-TN012022001928",
    createdDate: "Jan 12, 2026",
    verificationStatus: "Verified",
    lastActive: "10 mins ago",
    lastAssignment: "Hot Meal Delivery to Helping Hands NGO Shelter",
    allowedTaskTypes: ["Food Delivery", "Bulk Pickup", "Distribution"],
    fuelEligibility: true,
    isSuspended: false,
  },
  {
    id: 102,
    name: "Priya Sharma",
    email: "priya.s@hungerfree.org",
    phone: "+91 98123 45678",
    emergencyPhone: "+91 98123 99999",
    address: "22, Beach Road, Velachery, Chennai, Tamil Nadu - 600042",
    zone: "South",
    volunteerAreas: ["Velachery", "Adyar", "Mylapore"],
    tasksCompleted: 32,
    totalTasks: 35,
    missedTasks: 3,
    rating: "4.9",
    status: "busy",
    onLeave: false,
    vehicle: "Scooter (TN 07 CD 5678)",
    license: "DL-TN072023004411",
    createdDate: "Feb 05, 2026",
    verificationStatus: "Verified",
    lastActive: "In Transit",
    lastAssignment: "Packaged Ration Pickup from Star Hotel Pantry",
    allowedTaskTypes: ["Food Delivery", "Packaging", "Event Support"],
    fuelEligibility: true,
    isSuspended: false,
  },
  {
    id: 103,
    name: "Karthik Raja",
    email: "karthik.r@hungerfree.org",
    phone: "+91 97890 12345",
    emergencyPhone: "+91 97890 88888",
    address: "15, Circular Road, Nungambakkam, Chennai, Tamil Nadu - 600034",
    zone: "Central",
    volunteerAreas: ["Nungambakkam", "Porur"],
    tasksCompleted: 14,
    totalTasks: 16,
    missedTasks: 2,
    rating: "4.6",
    status: "on-leave",
    onLeave: true,
    vehicle: "Four-Wheeler Van (TN 09 EF 9012)",
    license: "DL-TN092021008822",
    createdDate: "Mar 01, 2026",
    verificationStatus: "Pending",
    lastActive: "2 days ago",
    lastAssignment: "Bulk Ration Dispatch to Care Foundation Shelter",
    allowedTaskTypes: ["Bulk Pickup", "Transport"],
    fuelEligibility: false,
    isSuspended: false,
  },
];

const emptyData: UserData = {
  donors: [],
  ngos: [],
  volunteers: DEFAULT_VOLUNTEERS,
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
          volunteers:
            volunteersRes.data && volunteersRes.data.length > 0
              ? volunteersRes.data.map((v: any) => ({
                  id: v.id,
                  name: v.name || v.username || `Volunteer #${v.id}`,
                  zone: v.zone || "North",
                  volunteerAreas: v.volunteer_areas || ["Anna Nagar"],
                  tasksCompleted: v.tasks_completed || 0,
                  totalTasks: v.tasks_completed || 0,
                  missedTasks: 0,
                  rating: (v.rating || "4.8").toString(),
                  status: v.status || "available",
                  onLeave: v.status === "on-leave",
                  email: v.email || "volunteer@hungerfree.org",
                  phone: v.phone || "+91 98765 43210",
                  emergencyPhone: v.emergencyPhone || "+91 98765 00001",
                  address: v.address || "Main Zone Office",
                  vehicle: v.vehicle || "Bike",
                  license: v.license || "DL-TN012022001928",
                  createdDate: v.createdDate || "Jan 2026",
                  verificationStatus: v.verification_status || "Verified",
                  lastActive: v.lastActive || "Recently",
                  lastAssignment: v.lastAssignment || "Food Delivery",
                  allowedTaskTypes: v.allowedTaskTypes || ["Food Delivery"],
                  fuelEligibility: true,
                  isSuspended: false,
                }))
              : DEFAULT_VOLUNTEERS,
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
