import axiosInstance from "../../../../global/utils/axios-instance";

export const analyticsApiService = {
  getDashboardStats: () => axiosInstance.get("/admin/dashboard/stats/"),
};

export default analyticsApiService;
