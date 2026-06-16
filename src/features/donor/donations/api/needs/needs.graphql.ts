import { gql } from "@apollo/client";

export const GET_NEEDS = gql`
  query GetNeeds($status: String) {
    needs(status: $status) {
      id
      ngo
      ngoName
      itemName
      category
      quantity
      unit
      urgency
      requiredBy
      image
      distributionAddress
      description
      status
      fulfilledQuantity
      supporterIds
      supporters {
        id
        username
        email
        phone
        donorProfile {
          businessName
        }
      }
      supportersDetails {
        id
        name
        quantity
      }
      createdAt
    }
  }
`;
