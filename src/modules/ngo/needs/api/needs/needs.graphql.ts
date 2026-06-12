import { gql } from "@apollo/client";

export const CREATE_NEED = gql`
  mutation CreateNeed($input: CreateNeedInput!) {
    createNeed(input: $input) {
      id
      ngo
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
      createdAt
    }
  }
`;
