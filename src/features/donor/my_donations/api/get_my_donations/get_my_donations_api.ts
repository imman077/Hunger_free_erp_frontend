import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { getMyDonationsInputSchema } from "./get_my_donations_input_model";
import type { GetMyDonationsInput } from "./get_my_donations_input_model";
import { getMyDonationsApiOutputSchema } from "./get_my_donations_output_model";
import { getMyDonationsApiOutputModel } from "./get_my_donations_store";

export const GET_MY_DONATIONS_QUERY = gql`
  query GetMyDonations($userId: String, $status: String, $sortOrder: String, $search: String) {
    donations(userId: $userId, status: $status, sortOrder: $sortOrder, search: $search) {
      id
      foodType
      category
      dietaryType
      preparationType
      quantity
      ngo
      date
      status
      pickupAddress
      deliveryAddress
      description
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
      donor
      expiryTime
      createdAt
    }
    donationStats {
      totalDonations
      pendingCount
      completedCount
      inProgressCount
      totalByCategory {
        category
        count
      }
    }
  }
`;

export async function getMyDonationsApi(
  input: GetMyDonationsInput
): Promise<any> {
  try {
    const validatedInput = getMyDonationsInputSchema.parse(input);
    getMyDonationsApiOutputModel.update({ loading: true });

    // Execute query
    const response = await client.query({
      query: GET_MY_DONATIONS_QUERY,
      variables: {
        ...(validatedInput.userId ? { userId: validatedInput.userId } : {}),
        ...(validatedInput.status && validatedInput.status !== "Assigned"
          ? { status: validatedInput.status === "Active" ? "PENDING" : validatedInput.status.toUpperCase() }
          : {}),
        ...(validatedInput.sortOrder
          ? { sortOrder: validatedInput.sortOrder === "Newest First" ? "NEWEST_FIRST" : "OLDEST_FIRST" }
          : {}),
        ...(validatedInput.search ? { search: validatedInput.search } : {}),
      },
      fetchPolicy: "network-only",
    });

    const validatedOutput = getMyDonationsApiOutputSchema.parse(response);

    getMyDonationsApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });

    return validatedOutput;
  } catch (err) {
    getMyDonationsApiOutputModel.update({ loading: false });
    throw err;
  }
}
