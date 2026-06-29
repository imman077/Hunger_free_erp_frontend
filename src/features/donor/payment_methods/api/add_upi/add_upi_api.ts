import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { addUpiInputSchema } from "./add_upi_input_model";
import type { AddUpiInput } from "./add_upi_input_model";
import { addUpiApiOutputSchema } from "./add_upi_output_model";
import { addUpiApiOutputModel } from "./add_upi_store";

export const ADD_UPI_MUTATION = gql`
  mutation AddUPI($input: UPIInput!, $userId: ID!) {
    addUPI(input: $input, userId: $userId) {
      id
      username
      email
      role
      avatar
      phone
      isVerified
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
      createdAt
    }
  }
`;

export async function addUpiApi(
  input: AddUpiInput
): Promise<any> {
  try {
    const validatedInput = addUpiInputSchema.parse(input);
    addUpiApiOutputModel.update({ loading: true });

    const response = await client.mutate({
      mutation: ADD_UPI_MUTATION,
      variables: {
        userId: validatedInput.userId,
        input: validatedInput.input,
      },
    });

    const mappedResponse = {
      loading: false,
      data: response.data?.addUPI?.paymentMethods || { bankAccounts: [], upiIds: [] },
    };

    const validatedOutput = addUpiApiOutputSchema.parse(mappedResponse);

    addUpiApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    addUpiApiOutputModel.update({ loading: false });
    throw err;
  }
}
