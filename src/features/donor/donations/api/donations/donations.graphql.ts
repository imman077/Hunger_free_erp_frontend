import { gql } from "@apollo/client";

export const GET_MY_DONATIONS = gql`
  query GetMyDonations($status: String, $sortOrder: String) {
    donations(status: $status, sortOrder: $sortOrder) {
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

export const VERIFY_PICKUP = gql`
  mutation VerifyPickup($id: ID!, $otp: String!) {
    verifyPickup(id: $id, otp: $otp) {
      id
      status
      timeline {
        status
        date
        time
        completed
        description
      }
    }
  }
`;

export const CREATE_DONATION = gql`
  mutation CreateDonation($input: CreateDonationInput!) {
    createDonation(input: $input) {
      id
      foodType
      category
      status
      isNgoNeed
      relatedNeed
    }
  }
`;

export const GET_CONFIG_ITEMS = gql`
  query GetConfigItems($key: String) {
    configItems(key: $key) {
      id
      key
      name
      description
    }
  }
`;

export const CANCEL_DONATION = gql`
  mutation CancelDonation($id: ID!, $reason: String) {
    cancelDonation(id: $id, reason: $reason) {
      id
      status
      timeline {
        status
        date
        time
        completed
        description
      }
    }
  }
`;

export const DELETE_DONATION = gql`
  mutation DeleteDonation($id: ID!) {
    deleteDonation(id: $id)
  }
`;

export const UPDATE_VOLUNTEER_LOCATION = gql`
  mutation UpdateVolunteerLocation($id: ID!, $lat: Float!, $lng: Float!) {
    updateVolunteerLocation(id: $id, lat: $lat, lng: $lng) {
      id
      volunteerLocation {
        lat
        lng
      }
    }
  }
`;
