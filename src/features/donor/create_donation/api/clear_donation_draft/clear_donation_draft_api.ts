import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import {
  clearDonationDraftInputSchema,
} from "./clear_donation_draft_input_model";
import type {
  ClearDonationDraftInput,
} from "./clear_donation_draft_input_model";
import { clearDonationDraftOutputSchema } from "./clear_donation_draft_output_model";
import { clearDonationDraftApiOutputModel } from "./clear_donation_draft_store";

export const CLEAR_DONATION_DRAFT_MUTATION = gql`
  mutation ClearDonationDraft($userId: ID!) {
    clearDonationDraft(userId: $userId)
  }
`;

export async function clearDonationDraftApi(
  input: ClearDonationDraftInput
): Promise<any> {
  try {
    const validatedInput = clearDonationDraftInputSchema.parse(input);
    clearDonationDraftApiOutputModel.update({ loading: true });

    const response = await client.mutate({
      mutation: CLEAR_DONATION_DRAFT_MUTATION,
      variables: { userId: validatedInput.userId },
    });

    const validatedOutput = clearDonationDraftOutputSchema.parse(response);
    clearDonationDraftApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });
    return validatedOutput;
  } catch (err) {
    clearDonationDraftApiOutputModel.update({ loading: false });
    throw err;
  }
}
