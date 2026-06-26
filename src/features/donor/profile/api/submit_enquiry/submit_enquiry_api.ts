import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { submitEnquiryInputSchema } from "./submit_enquiry_input_model";
import type { SubmitEnquiryInput } from "./submit_enquiry_input_model";
import { submitEnquiryApiOutputSchema } from "./submit_enquiry_output_model";
import { submitEnquiryApiOutputModel } from "./submit_enquiry_store";

export const SUBMIT_ENQUIRY_MUTATION = gql`
  mutation SubmitEnquiry($input: EnquiryInput!) {
    submitEnquiry(input: $input) {
      id
      userId
      name
      email
      phone
      subject
      message
      role
      status
      createdAt
    }
  }
`;

export async function submitEnquiryApi(
  input: SubmitEnquiryInput
): Promise<any> {
  try {
    const validatedInput = submitEnquiryInputSchema.parse(input);
    submitEnquiryApiOutputModel.update({ loading: true });

    const response = await client.mutate({
      mutation: SUBMIT_ENQUIRY_MUTATION,
      variables: {
        input: validatedInput,
      },
    });

    const mappedResponse = {
      loading: false,
      data: response.data?.submitEnquiry || null,
    };

    const validatedOutput = submitEnquiryApiOutputSchema.parse(mappedResponse);

    submitEnquiryApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    submitEnquiryApiOutputModel.update({ loading: false });
    throw err;
  }
}
