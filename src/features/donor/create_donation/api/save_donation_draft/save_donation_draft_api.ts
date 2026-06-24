import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import {
  saveDonationDraftInputSchema,
} from "./save_donation_draft_input_model";
import type {
  SaveDonationDraftInput,
} from "./save_donation_draft_input_model";
import { saveDonationDraftOutputSchema } from "./save_donation_draft_output_model";
import { saveDonationDraftApiOutputModel } from "./save_donation_draft_store";

export const SAVE_DONATION_DRAFT_MUTATION = gql`
  mutation SaveDonationDraft($userId: ID!, $input: DonationDraftInput!) {
    saveDonationDraft(userId: $userId, input: $input) {
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

export async function saveDonationDraftApi(
  input: SaveDonationDraftInput
): Promise<any> {
  try {
    const validatedInput = saveDonationDraftInputSchema.parse(input);
    saveDonationDraftApiOutputModel.update({ loading: true });

    const response = await client.mutate({
      mutation: SAVE_DONATION_DRAFT_MUTATION,
      variables: {
        userId: validatedInput.userId,
        input: validatedInput.input,
      },
    });

    const validatedOutput = saveDonationDraftOutputSchema.parse(response);
    saveDonationDraftApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });
    return validatedOutput;
  } catch (err) {
    saveDonationDraftApiOutputModel.update({ loading: false });
    throw err;
  }
}
