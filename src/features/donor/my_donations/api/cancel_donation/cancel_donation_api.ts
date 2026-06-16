import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { cancelDonationInputSchema } from "./cancel_donation_input_model";
import type { CancelDonationInput } from "./cancel_donation_input_model";
import { cancelDonationApiOutputSchema } from "./cancel_donation_output_model";
import { cancelDonationApiOutputModel } from "./cancel_donation_store";

const CANCEL_DONATION_MUTATION = gql`
  mutation CancelDonation($id: ID!, $reason: String) {
    cancelDonation(id: $id, reason: $reason) {
      id
      status
      timeline {
        status
        date
        time
        completed
        description
      }
    }
  }
`;

export async function cancelDonationApi(
  input: CancelDonationInput
): Promise<any> {
  try {
    const validatedInput = cancelDonationInputSchema.parse(input);
    cancelDonationApiOutputModel.update({ loading: true });

    const response = await client.mutate({
      mutation: CANCEL_DONATION_MUTATION,
      variables: { id: validatedInput.id, reason: validatedInput.reason },
    });

    const validatedOutput = cancelDonationApiOutputSchema.parse(response);

    cancelDonationApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    cancelDonationApiOutputModel.update({ loading: false });
    throw err;
  }
}
