import { create } from "zustand";
import { DonorDataSchema } from "./donor-schemas";
import type { DonorData } from "./donor-schemas";
import client from "../../../global/api/apollo-client";
import { GET_MY_DONATIONS_QUERY as GET_MY_DONATIONS } from "../my_donations/api/get_my_donations/get_my_donations_api";
import axiosInstance from "../../../global/utils/axios-instance";

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
  refreshDashboard: () => Promise<void>;
  refreshDocuments: () => Promise<void>;
  refreshPrizes: () => Promise<void>;
  refreshRewards: () => Promise<void>;
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

  refreshDashboard: async () => {
    try {
      const res = await axiosInstance.get("donor-profiles/me/dashboard/");
      const { currentPoints, stats, recentActivities, donationStats } = res.data;
      set((state) => ({
        data: { ...state.data, currentPoints: currentPoints || 0, stats: stats || [], recentActivities: recentActivities || [] },
        donationStats: donationStats || state.donationStats
      }));
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    }
  },

  refreshDocuments: async () => {
    try {
      const res = await axiosInstance.get("donor-profiles/me/documents/");
      set((state) => ({ data: { ...state.data, documents: res.data || [] } }));
    } catch (err) {
      console.error("Documents fetch failed:", err);
    }
  },

  refreshPrizes: async () => {
    try {
      const res = await axiosInstance.get("lucky-spin-prizes/?role=DONOR");
      const prizes = (res.data || []).map((p: any) => ({
        id: p.id || p._id,
        label: p.label || p.name,
        icon: p.icon || '🎁',
        color: p.color || 'var(--bg-secondary)'
      }));
      set((state) => ({ data: { ...state.data, prizes } }));
    } catch (err) {
      console.error("Prizes fetch failed:", err);
    }
  },

  refreshRewards: async () => {
    try {
      const res = await axiosInstance.get("rewards/?role=DONOR");
      const rewards = (res.data || []).map((r: any) => ({
        id: r.id || r._id,
        name: r.name,
        amount: r.amount || null,
        desc: r.description || r.desc || null,
        points: r.pointsRequired || r.points || 0,
        available: r.available !== false,
        category: r.category || 'cash'
      }));
      set((state) => ({ data: { ...state.data, rewards } }));
    } catch (err) {
      console.error("Rewards fetch failed:", err);
    }
  },

  refreshData: async (status?: string, sortOrder?: string) => {
    set({ isLoading: true });
    try {
      const { data } = await client.query<{ donations: any[], donationStats: any }>({
        query: GET_MY_DONATIONS,
        variables: {
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
