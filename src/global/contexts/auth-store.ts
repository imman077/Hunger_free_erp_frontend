import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserProfile {
  role: "ADMIN" | "DONOR" | "NGO" | "VOLUNTEER";
  phone: string | null;
  address: string | null;
}

interface User {
  id: number | string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: UserProfile;
  donor_profile?: {
    total_donations: number;
    reliability_score: number;
  };
  ngo_profile?: {
    name: string;
    registration_id: string;
    contact_number: string;
  };
  volunteer_profile?: {
    availability_status: string;
    total_deliveries: number;
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("auth-storage"); // Clear persistence
      },

      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "auth-storage", // Key in localStorage
    }
  )
);
