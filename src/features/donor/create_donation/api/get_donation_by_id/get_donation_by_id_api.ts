import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import {
  getDonationByIdInputSchema,
} from "./get_donation_by_id_input_model";
import type {
  GetDonationByIdInput,
} from "./get_donation_by_id_input_model";
import { getDonationByIdOutputSchema } from "./get_donation_by_id_output_model";
import { getDonationByIdApiOutputModel } from "./get_donation_by_id_store";

export const GET_DONATION_BY_ID_QUERY = gql`
  query GetDonationById($id: ID!) {
    donationById(id: $id) {
      id
      foodType
      category
      dietaryType
      preparationType
      quantity
      ngo
      donor
      date
      status
      pickupAddress
      deliveryAddress
      description
      expiryTime
      volunteer {
        name
        phone
        rating
      }
      image
      volunteerLocation {
        lat
        lng
      }
      pickupCoords {
        lat
        lng
      }
      deliveryCoords {
        lat
        lng
      }
      timeline {
        status
        date
        time
        completed
        description
      }
      isNgoNeed
      relatedNeed
      createdAt
    }
  }
`;

export async function getDonationByIdApi(
  input: GetDonationByIdInput
): Promise<any> {
  try {
    const validatedInput = getDonationByIdInputSchema.parse(input);
    getDonationByIdApiOutputModel.update({ loading: true });

    const response = await client.query({
      query: GET_DONATION_BY_ID_QUERY,
      variables: { id: validatedInput.id },
      fetchPolicy: "network-only",
    });

    const validatedOutput = getDonationByIdOutputSchema.parse(response);
    getDonationByIdApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });
    return validatedOutput;
  } catch (err) {
    getDonationByIdApiOutputModel.update({ loading: false });
    throw err;
  }
}
