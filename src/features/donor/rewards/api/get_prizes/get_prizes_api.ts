import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import {
  getPrizesInputSchema,
} from "./get_prizes_input_model";
import type {
  GetPrizesInput,
} from "./get_prizes_input_model";
import { getPrizesOutputSchema } from "./get_prizes_output_model";
import { getPrizesApiOutputModel } from "./get_prizes_store";

export const GET_PRIZES_QUERY = gql`
  query Prizes($role: String) {
    prizes(role: $role) {
      id
      role
      label
      prizeType
      value
      icon
      probability
      isActive
    }
  }
`;

export async function getPrizesApi(
  input: GetPrizesInput
): Promise<any> {
  try {
    const validatedInput = getPrizesInputSchema.parse(input);
    getPrizesApiOutputModel.update({ loading: true });

    const response = await client.query({
      query: GET_PRIZES_QUERY,
      variables: { role: validatedInput.role },
      fetchPolicy: "network-only",
    });

    const validatedOutput = getPrizesOutputSchema.parse(response);
    getPrizesApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });
    return validatedOutput;
  } catch (err) {
    console.error("getPrizesApi error:", err);
    getPrizesApiOutputModel.update({ loading: false });
    throw err;
  }
}
