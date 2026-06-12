import axiosInstance from "../../../../../global/utils/axios-instance";
import { ClaimRewardInputSchema } from "./rewards.input";
import {
  GetRewardsResponseSchema,
  GetTiersResponseSchema,
  GetLuckySpinPrizesResponseSchema,
  GetNGOProfileResponseSchema,
  ClaimRewardResponseSchema,
} from "./rewards.output";
import type { GetRewardsResponse, GetTiersResponse, GetLuckySpinPrizesResponse } from "./rewards.output";

export const ngoRewardsService = {
  /**
   * Fetches all rewards available for NGOs.
   */
  getRewards: async (): Promise<GetRewardsResponse> => {
    try {
      const response = await axiosInstance.get("rewards/");
      return GetRewardsResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching NGO rewards:", error);
      throw error;
    }
  },

  /**
   * Fetches reward tiers for NGOs.
   */
  getTiers: async (): Promise<GetTiersResponse> => {
    try {
      const response = await axiosInstance.get("reward-tiers/", {
        params: { role: "NGO" },
      });
      return GetTiersResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching NGO tiers:", error);
      throw error;
    }
  },

  /**
   * Fetches lucky spin prizes for NGOs.
   */
  getLuckySpinPrizes: async (): Promise<GetLuckySpinPrizesResponse> => {
    try {
      const response = await axiosInstance.get("lucky-spin-prizes/", {
        params: { role: "NGO" },
      });
      return GetLuckySpinPrizesResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching NGO lucky spin prizes:", error);
      throw error;
    }
  },

  /**
   * Fetches current NGO profile data including points.
   */
  getNGOProfile: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get("ngo-profiles/me/");
      return GetNGOProfileResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching NGO profile:", error);
      throw error;
    }
  },

  /**
   * Claims a reward.
   */
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
