import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { GetGamificationInputSchema } from "./gamification_input_model";
import type { GetGamificationInput } from "./gamification_input_model";
import { GetGamificationResponseSchema } from "./gamification_output_model";
import { useDonorStore } from "../../../store/donor-store";

export const GET_USER_POINTS = gql`
  query GetUserPoints($userId: ID!) {
    me(userId: $userId) {
      id
      gamification {
        points
      }
    }
  }
`;

export const gamificationService = {
  getUserPoints: async (input: GetGamificationInput): Promise<number> => {
    try {
      const validatedInput = GetGamificationInputSchema.parse(input);
      
      const response = await client.query({
        query: GET_USER_POINTS,
        variables: { userId: String(validatedInput.userId) },
        fetchPolicy: "network-only",
      });

      const validatedOutput = GetGamificationResponseSchema.parse(response.data);
      const points = validatedOutput.me?.gamification?.points ?? 0;
      
      // Update the global store
      const currentData = useDonorStore.getState().data;
      useDonorStore.getState().setDonorData({
        ...currentData,
        currentPoints: points,
      });

      return points;
    } catch (error) {
      console.error("Error fetching user points:", error);
      throw error;
    }
  },
};
