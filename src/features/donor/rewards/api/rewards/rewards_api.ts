import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { ClaimRewardInputSchema } from "./rewards_input_model";
import {
  ClaimRewardResponseSchema,
} from "./rewards_output_model";
import { useDonorRewardsStore } from "./rewards_store";

export const GET_DONOR_REWARDS = gql`
  query GetDonorRewards($userId: ID!, $role: String!) {
    me(userId: $userId) {
      id
      gamification {
        points
      }
    }
    rewards(role: $role) {
      id
      name
      description
      pointsRequired
      category
      role
      amount
      available
    }
    prizes(role: $role) {
      id
      label
      icon
      prizeType
      value
    }
  }
`;

export const donorRewardsService = {
  getRewards: async (userId: string): Promise<any> => {
    try {
      useDonorRewardsStore.getState().setLoading(true);
      const response = await client.query({
        query: GET_DONOR_REWARDS,
        variables: {
          userId: String(userId),
          role: "DONOR",
        },
        fetchPolicy: "network-only",
      });

      const meRes = response.data?.me;
      const rewardsRes = response.data?.rewards || [];
      const prizesRes = response.data?.prizes || [];

      useDonorRewardsStore.getState().setLoading(false);
      return {
        currentPoints: meRes?.gamification?.points ?? 0,
        rewards: rewardsRes,
        prizes: prizesRes,
      };
    } catch (error: any) {
      useDonorRewardsStore.getState().setError(error.message || "Failed to load rewards");
      useDonorRewardsStore.getState().setLoading(false);
      throw error;
    }
  },

  claimReward: async (rewardId: number, claimDetails: any): Promise<any> => {
    try {
      const validatedInput = ClaimRewardInputSchema.parse({ rewardId, claimDetails });
      // In GraphQL we would use a mutation, but since the original claimed reward REST endpoint was used, we can call client.mutate or axiosInstance.
      // Wait, let's keep the axiosInstance claimReward endpoint in case the backend uses REST for claims!
      // Actually, since client.mutate or axiosInstance can be called, let's use the original implementation of claimReward.
      const axiosInstance = (await import("../../../../../global/utils/axios-instance")).default;
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
