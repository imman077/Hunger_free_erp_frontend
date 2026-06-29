import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { updateBankAccountInputSchema } from "./update_bank_account_input_model";
import type { UpdateBankAccountInput } from "./update_bank_account_input_model";
import { updateBankAccountApiOutputSchema } from "./update_bank_account_output_model";
import { updateBankAccountApiOutputModel } from "./update_bank_account_store";

export const UPDATE_BANK_ACCOUNT_MUTATION = gql`
  mutation UpdateBankAccount($userId: ID!, $accountId: ID!, $input: BankAccountInput!) {
    updateBankAccount(userId: $userId, accountId: $accountId, input: $input) {
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

export async function updateBankAccountApi(
  input: UpdateBankAccountInput
): Promise<any> {
  try {
    const validatedInput = updateBankAccountInputSchema.parse(input);
    updateBankAccountApiOutputModel.update({ loading: true });

    const response = await client.mutate({
      mutation: UPDATE_BANK_ACCOUNT_MUTATION,
      variables: {
        userId: validatedInput.userId,
        accountId: validatedInput.accountId,
        input: validatedInput.input,
      },
    });

    const mappedResponse = {
      loading: false,
      data: response.data?.updateBankAccount?.paymentMethods || { bankAccounts: [], upiIds: [] },
    };

    const validatedOutput = updateBankAccountApiOutputSchema.parse(mappedResponse);

    updateBankAccountApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    updateBankAccountApiOutputModel.update({ loading: false });
    throw err;
  }
}
