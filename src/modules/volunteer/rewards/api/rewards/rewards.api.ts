import axiosInstance from "../../../../../global/utils/axios-instance";
import { ClaimRewardInputSchema } from "./rewards.input";
import {
  GetRewardsResponseSchema,
  GetTiersResponseSchema,
  GetLuckySpinPrizesResponseSchema,
  GetVolunteerProfileResponseSchema,
  ClaimRewardResponseSchema,
} from "./rewards.output";
import type { GetRewardsResponse, GetTiersResponse, GetLuckySpinPrizesResponse } from "./rewards.output";

export const volunteerRewardsService = {
  getRewards: async (): Promise<GetRewardsResponse> => {
    try {
      const response = await axiosInstance.get("rewards/");
      return GetRewardsResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching volunteer rewards:", error);
      throw error;
    }
  },

  getTiers: async (): Promise<GetTiersResponse> => {
    try {
      const response = await axiosInstance.get("reward-tiers/", {
        params: { role: "VOLUNTEER" },
      });
      return GetTiersResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching volunteer tiers:", error);
      throw error;
    }
  },

  getLuckySpinPrizes: async (): Promise<GetLuckySpinPrizesResponse> => {
    try {
      const response = await axiosInstance.get("lucky-spin-prizes/", {
        params: { role: "VOLUNTEER" },
      });
      return GetLuckySpinPrizesResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching volunteer lucky spin prizes:", error);
      throw error;
    }
  },

  getVolunteerProfile: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get("volunteer-profiles/me/");
      return GetVolunteerProfileResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching volunteer profile:", error);
      throw error;
    }
  },

  claimReward: async (rewardId: number, claimDetails: any): Promise<any> => {
    try {
      const validatedInput = ClaimRewardInputSchema.parse({ rewardId, claimDetails });
      const response = await axiosInstance.post("reward-claims/", {
        reward: validatedInput.rewardId,
        claim_details: validatedInput.claimDetails,
      });
      return ClaimRewardResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error claiming reward:", error);
      throw error;
    }
  },
};
