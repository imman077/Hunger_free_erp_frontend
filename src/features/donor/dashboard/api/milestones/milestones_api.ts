import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { GetMilestonesInputSchema } from "./milestones_input_model";
import type { GetMilestonesInput } from "./milestones_input_model";
import { GetMilestonesResponseSchema } from "./milestones_output_model";
import type { MilestoneItem } from "./milestones_output_model";

export const GET_DONOR_MILESTONES = gql`
  query GetDonorMilestones($category: String) {
    milestones(category: $category) {
      id
      name
      desc
      category
      requirementType
      threshold
      icon
      active
    }
  }
`;

export type { MilestoneItem };

export const milestonesService = {
  getDonorMilestones: async (input?: GetMilestonesInput): Promise<MilestoneItem[]> => {
    if (input) {
      GetMilestonesInputSchema.parse(input);
    }
    const { data } = await client.query({
      query: GET_DONOR_MILESTONES,
      variables: {
        category: input?.category || "donors",
      },
      fetchPolicy: "network-only",
    });
    const validatedData = GetMilestonesResponseSchema.parse(data);
    return validatedData.milestones;
  },
};
