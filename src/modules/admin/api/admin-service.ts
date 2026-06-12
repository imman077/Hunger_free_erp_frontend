import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://192.168.29.108:8000/api";

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the Bearer token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-storage"); // Standard zustand storage name
    if (token) {
      try {
        const parsed = JSON.parse(token);
        const accessToken = parsed.state.accessToken;
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (e) {
        console.error("Failed to parse auth token", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const adminService = {
  // Users
  getUsers: () => adminApi.get("/admin/users/"),
  
  // Donors
  getDonors: () => adminApi.get("/admin/donors/"),
  updateDonor: (id: number, data: any) => adminApi.patch(`/admin/donors/${id}/`, data),
  
  // NGOs
  getNGOs: () => adminApi.get("/admin/ngos/"),
  updateNGO: (id: number, data: any) => adminApi.patch(`/admin/ngos/${id}/`, data),
  
  // Volunteers
  getVolunteers: () => adminApi.get("/admin/volunteers/"),
  updateVolunteer: (id: number, data: any) => adminApi.patch(`/admin/volunteers/${id}/`, data),
  
  // Donations
  getDonations: () => adminApi.get("/admin/donations/"),
  updateDonation: (id: number, data: any) => adminApi.patch(`/admin/donations/${id}/`, data),
  
  // Dashboard Stats
  getDashboardStats: () => adminApi.get("/admin/dashboard/stats/"),

  // Rewards
  getRewards: () => adminApi.get("/admin/rewards/"),
  getRewardClaims: () => adminApi.get("/admin/reward-claims/"),
  updateRewardClaim: (id: number, data: any) => adminApi.patch(`/admin/reward-claims/${id}/`, data),

  // Config
  getConfig: (key: string) => adminApi.get(`/admin/config/${key}/`),
  updateConfig: (key: string, data: any) => adminApi.put(`/admin/config/${key}/`, data),
  createConfig: (data: any) => adminApi.post(`/admin/config/`, data),
};

export default adminService;
