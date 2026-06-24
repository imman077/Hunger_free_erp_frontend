import { create } from "zustand";
import { DonorDataSchema } from "./donor-schemas";
import type { DonorData } from "./donor-schemas";
import client from "../../../global/api/apollo-client";
import { GET_MY_DONATIONS_QUERY as GET_MY_DONATIONS } from "../my_donations/api/get_my_donations/get_my_donations_api";
import { initialData } from "./donor-mock-data";

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
  data: initialData,
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
    try {
      const { data } = await client.query<{ donations: any[], donationStats: any }>({
        query: GET_MY_DONATIONS,
        variables: {
          ...(status ? { status: status === 'Active' ? 'PENDING' : status.toUpperCase() } : {}),
          ...(sortOrder ? { sortOrder: sortOrder === 'Newest First' ? 'NEWEST_FIRST' : 'OLDEST_FIRST' } : {})
        },
        fetchPolicy: 'network-only' // Ensure we get fresh data
      });
      
      set((state) => ({
        data: {
          ...state.data,
          donationHistory: data.donations.map((d: any) => ({
            ...d,
            // Map MongoDB _id or id to number if needed by schema
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
