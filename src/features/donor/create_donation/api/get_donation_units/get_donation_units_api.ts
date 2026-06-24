import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import {
  getDonationUnitsInputSchema,
} from "./get_donation_units_input_model";
import type {
  GetDonationUnitsInput,
} from "./get_donation_units_input_model";
import { getDonationUnitsOutputSchema } from "./get_donation_units_output_model";
import { getDonationUnitsApiOutputModel } from "./get_donation_units_store";

export const GET_DONATION_UNITS_QUERY = gql`
  query ConfigItems($key: String) {
    configItems(key: $key) {
      id
      key
      name
      description
      color
      isActive
      sortOrder
    }
  }
`;

export async function getDonationUnitsApi(
  input: GetDonationUnitsInput
): Promise<any> {
  try {
    const validatedInput = getDonationUnitsInputSchema.parse(input);
    getDonationUnitsApiOutputModel.update({ loading: true });

    const response = await client.query({
      query: GET_DONATION_UNITS_QUERY,
      variables: { key: validatedInput.key },
      fetchPolicy: "network-only",
    });

    const validatedOutput = getDonationUnitsOutputSchema.parse(response);
    getDonationUnitsApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });
    return validatedOutput;
  } catch (err) {
    getDonationUnitsApiOutputModel.update({ loading: false });
    throw err;
  }
}
