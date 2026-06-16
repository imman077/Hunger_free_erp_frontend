import axiosInstance from "../../../../global/utils/axios-instance";

export const enquiriesApiService = {
  getNGOs: () => axiosInstance.get("/admin/ngos/"),
  updateNGO: (id: number, data: any) => axiosInstance.patch(`/admin/ngos/${id}/`, data),
  getRewardClaims: () => axiosInstance.get("/admin/reward-claims/"),
  updateRewardClaim: (id: number, data: any) => axiosInstance.patch(`/admin/reward-claims/${id}/`, data),
};

export default enquiriesApiService;
