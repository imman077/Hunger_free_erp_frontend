import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { GetTiersInputSchema } from "./tiers_input_model";
import type { GetTiersInput } from "./tiers_input_model";
import { GetTiersResponseSchema } from "./tiers_output_model";
import type { GamificationTier } from "./tiers_output_model";

export const GET_GAMIFICATION_TIERS = gql`
  query GamificationTiers {
    gamificationTiers {
      id
      name
      range
      bonus
      pointsRequired
      perks
      color
    }
  }
`;

export type { GamificationTier };

export const tiersService = {
  getGamificationTiers: async (input?: GetTiersInput): Promise<GamificationTier[]> => {
    if (input) {
      GetTiersInputSchema.parse(input);
    }
    const { data } = await client.query({
      query: GET_GAMIFICATION_TIERS,
      fetchPolicy: "network-only",
    });
    const validatedData = GetTiersResponseSchema.parse(data);
    return validatedData.gamificationTiers;
  },
};
