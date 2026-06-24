import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import {
  getPointsTiersInputSchema,
} from "./get_points_tiers_input_model";
import type {
  GetPointsTiersInput,
} from "./get_points_tiers_input_model";
import { getPointsTiersOutputSchema } from "./get_points_tiers_output_model";
import { getPointsTiersApiOutputModel } from "./get_points_tiers_store";

export const GET_POINTS_TIERS_QUERY = gql`
  query PointsTiers($role: String) {
    pointsTiers(role: $role) {
      id
      name
      role
      minPoints
      maxPoints
      color
      benefits
      isActive
    }
  }
`;

export async function getPointsTiersApi(
  input: GetPointsTiersInput
): Promise<any> {
  try {
    const validatedInput = getPointsTiersInputSchema.parse(input);
    getPointsTiersApiOutputModel.update({ loading: true });

    const response = await client.query({
      query: GET_POINTS_TIERS_QUERY,
      variables: { role: validatedInput.role },
      fetchPolicy: "network-only",
    });

    const validatedOutput = getPointsTiersOutputSchema.parse(response);
    getPointsTiersApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });
    return validatedOutput;
  } catch (err) {
    console.error("getPointsTiersApi error:", err);
    getPointsTiersApiOutputModel.update({ loading: false });
    throw err;
  }
}
