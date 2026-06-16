import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { verifyPickupInputSchema } from "./verify_pickup_input_model";
import type { VerifyPickupInput } from "./verify_pickup_input_model";
import { verifyPickupApiOutputSchema } from "./verify_pickup_output_model";
import { verifyPickupApiOutputModel } from "./verify_pickup_store";

const VERIFY_PICKUP_MUTATION = gql`
  mutation VerifyPickup($id: ID!, $otp: String!) {
    verifyPickup(id: $id, otp: $otp) {
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

export async function verifyPickupApi(
  input: VerifyPickupInput
): Promise<any> {
  try {
    const validatedInput = verifyPickupInputSchema.parse(input);
    verifyPickupApiOutputModel.update({ loading: true });

    const response = await client.mutate({
      mutation: VERIFY_PICKUP_MUTATION,
      variables: { id: validatedInput.id, otp: validatedInput.otp },
    });

    const validatedOutput = verifyPickupApiOutputSchema.parse(response);

    verifyPickupApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    verifyPickupApiOutputModel.update({ loading: false });
    throw err;
  }
}
