import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { getPaymentMethodsInputSchema } from "./get_payment_methods_input_model";
import type { GetPaymentMethodsInput } from "./get_payment_methods_input_model";
import { getPaymentMethodsApiOutputSchema } from "./get_payment_methods_output_model";
import { getPaymentMethodsApiOutputModel } from "./get_payment_methods_store";

export const GET_USER_PAYMENT_METHODS = gql`
  query UserPaymentMethods($userId: ID!) {
    userById(userId: $userId) {
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

export async function getPaymentMethodsApi(
  input: GetPaymentMethodsInput
): Promise<any> {
  try {
    const validatedInput = getPaymentMethodsInputSchema.parse(input);
    getPaymentMethodsApiOutputModel.update({ loading: true });

    const response = await client.query({
      query: GET_USER_PAYMENT_METHODS,
      variables: {
        userId: validatedInput.userId,
      },
      fetchPolicy: "network-only",
    });

    const mappedResponse = {
      loading: false,
      data: response.data?.userById?.paymentMethods || { bankAccounts: [], upiIds: [] },
    };

    const validatedOutput = getPaymentMethodsApiOutputSchema.parse(mappedResponse);

    getPaymentMethodsApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    getPaymentMethodsApiOutputModel.update({ loading: false });
    throw err;
  }
}
