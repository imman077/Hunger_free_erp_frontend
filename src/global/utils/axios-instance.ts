import axios from "axios";
import { useAuthStore } from "../store/auth-store";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/", // Adjust based on your dev server
});

// Request interceptor to add the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Session expired. Please login again.");
      // Auto logout on 401
      useAuthStore.getState().logout();
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
