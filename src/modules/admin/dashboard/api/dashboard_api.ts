import axiosInstance from "../../../../global/utils/axios-instance";

export const dashboardApiService = {
  getDashboardStats: () => axiosInstance.get("/admin/dashboard/stats/"),
};

export default dashboardApiService;
