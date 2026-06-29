import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { removeUpiInputSchema } from "./remove_upi_input_model";
import type { RemoveUpiInput } from "./remove_upi_input_model";
import { removeUpiApiOutputSchema } from "./remove_upi_output_model";
import { removeUpiApiOutputModel } from "./remove_upi_store";

export const REMOVE_UPI_MUTATION = gql`
  mutation RemoveUPI($userId: ID!, $upiId: ID!) {
    removeUPI(userId: $userId, upiId: $upiId) {
      id
      username
      role
      paymentMethods {
        bankAccounts {
          id
          bankName
          accountHolder
          accountNumber
          ifscCode
          isPrimary
          isVerified
        }
        upiIds {
          id
          vpa
          label
          isPrimary
          isVerified
        }
      }
    }
  }
`;

export async function removeUpiApi(
  input: RemoveUpiInput
): Promise<any> {
  try {
    const validatedInput = removeUpiInputSchema.parse(input);
    removeUpiApiOutputModel.update({ loading: true });

    const response = await client.mutate({
      mutation: REMOVE_UPI_MUTATION,
      variables: {
        userId: validatedInput.userId,
        upiId: validatedInput.upiId,
      },
    });

    const mappedResponse = {
      loading: false,
      data: response.data?.removeUPI?.paymentMethods || { bankAccounts: [], upiIds: [] },
    };

    const validatedOutput = removeUpiApiOutputSchema.parse(mappedResponse);

    removeUpiApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    removeUpiApiOutputModel.update({ loading: false });
    throw err;
  }
}
