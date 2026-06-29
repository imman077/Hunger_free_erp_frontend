import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { removeBankAccountInputSchema } from "./remove_bank_account_input_model";
import type { RemoveBankAccountInput } from "./remove_bank_account_input_model";
import { removeBankAccountApiOutputSchema } from "./remove_bank_account_output_model";
import { removeBankAccountApiOutputModel } from "./remove_bank_account_store";

export const REMOVE_BANK_ACCOUNT_MUTATION = gql`
  mutation RemoveBankAccount($userId: ID!, $accountId: ID!) {
    removeBankAccount(userId: $userId, accountId: $accountId) {
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

export async function removeBankAccountApi(
  input: RemoveBankAccountInput
): Promise<any> {
  try {
    const validatedInput = removeBankAccountInputSchema.parse(input);
    removeBankAccountApiOutputModel.update({ loading: true });

    const response = await client.mutate({
      mutation: REMOVE_BANK_ACCOUNT_MUTATION,
      variables: {
        userId: validatedInput.userId,
        accountId: validatedInput.accountId,
      },
    });

    const mappedResponse = {
      loading: false,
      data: response.data?.removeBankAccount?.paymentMethods || { bankAccounts: [], upiIds: [] },
    };

    const validatedOutput = removeBankAccountApiOutputSchema.parse(mappedResponse);

    removeBankAccountApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    removeBankAccountApiOutputModel.update({ loading: false });
    throw err;
  }
}
