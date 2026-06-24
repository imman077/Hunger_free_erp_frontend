import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import {
  getDonationDraftInputSchema,
} from "./get_donation_draft_input_model";
import type {
  GetDonationDraftInput,
} from "./get_donation_draft_input_model";
import { getDonationDraftOutputSchema } from "./get_donation_draft_output_model";
import { getDonationDraftApiOutputModel } from "./get_donation_draft_store";

export const GET_DONATION_DRAFT_QUERY = gql`
  query GetDonationDraft($userId: ID!) {
    donationDraft(userId: $userId) {
      id
      userId
      foodType
      category
      dietaryType
      preparationType
      quantity
      ngo
      donor
      date
      pickupAddress
      deliveryAddress
      description
      expiryTime
      image
      relatedNeed
    }
  }
`;

export async function getDonationDraftApi(
  input: GetDonationDraftInput
): Promise<any> {
  try {
    const validatedInput = getDonationDraftInputSchema.parse(input);
    getDonationDraftApiOutputModel.update({ loading: true });

    const response = await client.query({
      query: GET_DONATION_DRAFT_QUERY,
      variables: { userId: validatedInput.userId },
      fetchPolicy: "network-only",
    });

    const validatedOutput = getDonationDraftOutputSchema.parse(response);
    getDonationDraftApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });
    return validatedOutput;
  } catch (err) {
    getDonationDraftApiOutputModel.update({ loading: false });
    throw err;
  }
}
