import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import {
  CreateDonationApiInputSchema,
} from "./create_donation_input_model";
import type {
  CreateDonationApiInput,
} from "./create_donation_input_model";
import { createDonationApiOutputSchema } from "./create_donation_output_model";
import { createDonationApiOutputModel } from "./create_donation_store";

const CREATE_DONATION_MUTATION = gql`
  mutation CreateDonation($input: CreateDonationInput!) {
    createDonation(input: $input) {
      id
      foodType
      category
      status
      isNgoNeed
      relatedNeed
    }
  }
`;

export async function createDonationApi(
  input: CreateDonationApiInput
): Promise<any> {
  try {
    // Validate input
    const validatedInput = CreateDonationApiInputSchema.parse(input);

    createDonationApiOutputModel.update({ loading: true });

    // Execute GraphQL mutation
    const response = await client.mutate({
      mutation: CREATE_DONATION_MUTATION,
      variables: { input: validatedInput.input },
    });

    // Validate response
    const validatedOutput = createDonationApiOutputSchema.parse(response);

    // Update store
    createDonationApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    createDonationApiOutputModel.update({ loading: false });
    throw err;
  }
}
