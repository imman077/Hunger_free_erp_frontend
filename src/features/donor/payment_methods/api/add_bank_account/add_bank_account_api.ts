import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { addBankAccountInputSchema } from "./add_bank_account_input_model";
import type { AddBankAccountInput } from "./add_bank_account_input_model";
import { addBankAccountApiOutputSchema } from "./add_bank_account_output_model";
import { addBankAccountApiOutputModel } from "./add_bank_account_store";

export const ADD_BANK_ACCOUNT_MUTATION = gql`
  mutation AddBankAccount($input: BankAccountInput!, $userId: ID!) {
    addBankAccount(input: $input, userId: $userId) {
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

export async function addBankAccountApi(
  input: AddBankAccountInput
): Promise<any> {
  try {
    const validatedInput = addBankAccountInputSchema.parse(input);
    addBankAccountApiOutputModel.update({ loading: true });

    const response = await client.mutate({
      mutation: ADD_BANK_ACCOUNT_MUTATION,
      variables: {
        userId: validatedInput.userId,
        input: validatedInput.input,
      },
    });

    const mappedResponse = {
      loading: false,
      data: response.data?.addBankAccount?.paymentMethods || { bankAccounts: [], upiIds: [] },
    };

    const validatedOutput = addBankAccountApiOutputSchema.parse(mappedResponse);

    addBankAccountApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    addBankAccountApiOutputModel.update({ loading: false });
    throw err;
  }
}
