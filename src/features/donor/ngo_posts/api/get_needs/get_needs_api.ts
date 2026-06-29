import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { getNeedsInputSchema } from "./get_needs_input_model";
import type { GetNeedsInput } from "./get_needs_input_model";
import { getNeedsApiOutputSchema } from "./get_needs_output_model";
import { getNeedsApiOutputModel } from "./get_needs_store";

const GET_NEEDS_QUERY = gql`
  query GetNeeds($status: String, $search: String, $urgency: Urgency) {
    needs(status: $status, search: $search, urgency: $urgency) {
      id
      ngo
      ngoName
      itemName
      category
      quantity
      unit
      urgency
      requiredBy
      image
      distributionAddress
      description
      status
      fulfilledQuantity
      supporterIds
      supporters {
        id
        username
        email
        phone
        donorProfile {
          businessName
        }
      }
      supportersDetails {
        id
        name
        quantity
      }
      createdAt
    }
  }
`;

export async function getNeedsApi(
  input: GetNeedsInput
): Promise<any> {
  try {
    const validatedInput = getNeedsInputSchema.parse(input);
    getNeedsApiOutputModel.update({ loading: true });

    const response = await client.query({
      query: GET_NEEDS_QUERY,
      variables: {
        status: validatedInput.status,
        ...(validatedInput.search ? { search: validatedInput.search } : {}),
        ...(validatedInput.urgency ? { urgency: validatedInput.urgency } : {}),
      },
      fetchPolicy: "network-only",
    });

    const validatedOutput = getNeedsApiOutputSchema.parse(response);

    getNeedsApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    getNeedsApiOutputModel.update({ loading: false });
    throw err;
  }
}
