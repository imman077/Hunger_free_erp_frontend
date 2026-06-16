import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { deleteDonationInputSchema } from "./delete_donation_input_model";
import type { DeleteDonationInput } from "./delete_donation_input_model";
import { deleteDonationOutputSchema } from "./delete_donation_output_model";
import { deleteDonationApiOutputModel } from "./delete_donation_store";

const DELETE_DONATION_MUTATION = gql`
  mutation DeleteDonation($id: ID!) {
    deleteDonation(id: $id)
  }
`;

export async function deleteDonationApi(
  input: DeleteDonationInput
): Promise<any> {
  try {
    const validatedInput = deleteDonationInputSchema.parse(input);
    deleteDonationApiOutputModel.update({ loading: true });

    const response = await client.mutate({
      mutation: DELETE_DONATION_MUTATION,
      variables: { id: validatedInput.id },
    });

    const validatedOutput = deleteDonationOutputSchema.parse(response);

    deleteDonationApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    deleteDonationApiOutputModel.update({ loading: false });
    throw err;
  }
}
