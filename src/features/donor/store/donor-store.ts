import { create } from "zustand";
import { DonorDataSchema } from "./donor-schemas";
import type { DonorData } from "./donor-schemas";
import client from "../../../global/api/apollo-client";
import { GET_MY_DONATIONS_QUERY as GET_MY_DONATIONS } from "../my_donations/api/get_my_donations/get_my_donations_api";
import axiosInstance from "../../../global/utils/axios-instance";
import { useAuthStore } from "../../../global/store/auth-store";

// Empty baseline (no mock data at all — APIs fill this in)
const emptyData: DonorData = {
  currentPoints: 0,
  stats: [],
  recentActivities: [],
  donationHistory: [],
  profile: {
    businessName: '',
    businessType: '',
    registrationId: '',
    taxId: '',
    name: '',
    email: '',
    phone: '',
    location: '',
    memberSince: '',
    verificationLevel: '',
    completion: 0,
    bankName: null,
    accountNumber: null,
    upiId: null,
    branch: null,
    legalName: '',
    website: '',
    entityType: '',
    alternateContact: '',
    address: { line1: '', city: '', state: '', postalCode: '', country: '' }
  },
  documents: [],
  prizes: [],
  rewards: [],
  bankAccounts: [],
  upiIds: [],
};

interface DonorState {
  data: DonorData;
  donationStats: {
    totalDonations: number;
    pendingCount: number;
    completedCount: number;
    inProgressCount: number;
  };
  isLoading: boolean;
  error: string | null;
  redonatePayload: any | null;

  // Actions
  setDonorData: (data: DonorData) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  refreshData: (status?: string, sortOrder?: string) => Promise<void>;
  setRedonatePayload: (payload: any | null) => void;
}

export const useDonorStore = create<DonorState>((set) => ({
  data: emptyData,
  donationStats: {
    totalDonations: 0,
    pendingCount: 0,
    completedCount: 0,
    inProgressCount: 0,
  },
  isLoading: false,
  error: null,
  redonatePayload: null,

  setDonorData: (newData) => {
    const result = DonorDataSchema.safeParse(newData);
    if (result.success) {
      set({ data: result.data });
    } else {
      console.error("Donor store validation failed:", result.error);
      set({ error: "Invalid data format received" });
    }
  },

  setRedonatePayload: (payload) => set({ redonatePayload: payload }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  refreshData: async (status?: string, sortOrder?: string) => {
    set({ isLoading: true });
    const user = useAuthStore.getState().user;
    const userId = user?.id ? String(user.id) : null;
    try {
      const { data } = await client.query<{ donations: any[], donationStats: any }>({
        query: GET_MY_DONATIONS,
        variables: {
          ...(userId ? { userId } : {}),
          ...(status ? { status: status === 'Active' ? 'PENDING' : status.toUpperCase() } : {}),
          ...(sortOrder ? { sortOrder: sortOrder === 'Newest First' ? 'NEWEST_FIRST' : 'OLDEST_FIRST' } : {})
        },
        fetchPolicy: 'network-only'
      });

      set((state) => ({
        data: {
          ...state.data,
          donationHistory: data.donations.map((d: any) => ({
            ...d,
            id: isNaN(Number(d.id)) ? d.id : Number(d.id)
          }))
        },
        donationStats: data.donationStats || state.donationStats,
        isLoading: false
      }));
    } catch (err) {
      console.error("GraphQL Error:", err);
      set({ error: "Failed to sync with server", isLoading: false });
    }
  }
}));
