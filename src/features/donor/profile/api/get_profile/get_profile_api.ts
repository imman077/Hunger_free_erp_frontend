import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { getProfileInputSchema } from "./get_profile_input_model";
import type { GetProfileInput } from "./get_profile_input_model";
import { getProfileApiOutputSchema } from "./get_profile_output_model";
import { getProfileApiOutputModel } from "./get_profile_store";

export const GET_PROFILE_QUERY = gql`
  query UserById($userId: ID!) {
    userById(userId: $userId) {
      id
      username
      email
      role
      avatar
      phone
      isVerified
      donorProfile {
        businessName
        businessType
        subCategory
        verificationLevel
        registrationId
        profileCompleteness
        taxId
        legalName
        website
        entityType
        alternateContact
        address {
          line1
          city
          state
          postalCode
        }
        documents {
          name
          status
          date
          url
        }
      }
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
      gamification {
        points
        lifetimePoints
      }
      createdAt
    }
  }
`;

export async function getProfileApi(input: GetProfileInput): Promise<any> {
  try {
    const validatedInput = getProfileInputSchema.parse(input);
    getProfileApiOutputModel.update({ loading: true });

    const response = await client.query({
      query: GET_PROFILE_QUERY,
      variables: {
        userId: validatedInput.userId,
      },
      fetchPolicy: "network-only",
    });

    const mappedResponse = {
      loading: false,
      data: response.data?.userById || null,
    };

    const validatedOutput = getProfileApiOutputSchema.parse(mappedResponse);

    getProfileApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    getProfileApiOutputModel.update({ loading: false });
    throw err;
  }
}
