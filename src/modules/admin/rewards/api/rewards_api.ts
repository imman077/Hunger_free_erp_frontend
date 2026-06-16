import axiosInstance from "../../../../global/utils/axios-instance";

export const rewardsApiService = {
  getRewards: () => axiosInstance.get("/admin/rewards/"),
  getRewardClaims: () => axiosInstance.get("/admin/reward-claims/"),
  updateRewardClaim: (id: number, data: any) => axiosInstance.patch(`/admin/reward-claims/${id}/`, data),
};

export default rewardsApiService;
