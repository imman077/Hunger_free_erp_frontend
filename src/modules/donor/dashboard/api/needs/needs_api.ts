import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import { GetNeedByIdInputSchema } from "./needs_input_model.ts";
import type { GetNeedByIdInput } from "./needs_input_model.ts";
import { NGONeedSchema, GetNeedsResponseSchema } from "./needs_output_model.ts";
import type { NGONeed, GetNeedsResponse } from "./needs_output_model.ts";
import { useDonorDashboardNeedsStore } from "./needs_store.ts";

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

export const ngoNeedsService = {
  /**
   * Fetches all active NGO needs.
   */
  getNeeds: async (): Promise<GetNeedsResponse> => {
    try {
      const response = await client.query({
        query: GET_NEEDS,
        variables: { status: "Open" },
        fetchPolicy: "network-only",
      });
      
      const mappedNeeds = (response.data?.needs || []).map((need: any) => {
        let urgencyVal = "Medium";
        if (need.urgency) {
          if (need.urgency.toLowerCase().includes("high")) {
            urgencyVal = "High";
          } else if (need.urgency.toLowerCase().includes("medium")) {
            urgencyVal = "Medium";
          } else if (need.urgency.toLowerCase().includes("low")) {
            urgencyVal = "Low";
          } else if (need.urgency.toLowerCase().includes("urgent")) {
            urgencyVal = "High";
          }
        }

        return {
          id: need.id,
          ngo: need.ngo,
          ngo_name: need.ngoName || "Authorized NGO",
          title: need.itemName || "",
          description: need.description || "",
          category: need.category || "",
          quantity_required: `${need.quantity || 0} ${need.unit || "Units"}`,
          urgency: urgencyVal,
          status: need.status || "Open",
          created_at: need.createdAt || new Date().toISOString(),
          beneficiaries: "120 People",
          location: need.distributionAddress || "Service Zone",
          pickup_by: need.requiredBy ? new Date(need.requiredBy).toLocaleDateString() : "Flexible"
        };
      });

      const parsedNeeds = GetNeedsResponseSchema.parse(mappedNeeds);
      useDonorDashboardNeedsStore.getState().setNeeds(parsedNeeds);
      return parsedNeeds;
    } catch (error) {
      console.error("Error fetching NGO needs:", error);
      throw error;
    }
  },

  /**
   * Fetches a specific NGO need by ID.
   */
  getNeedById: async (needId: GetNeedByIdInput): Promise<NGONeed> => {
    try {
      const validatedId = GetNeedByIdInputSchema.parse(needId);
      
      const response = await client.query({
        query: gql`
          query GetNeedById($id: ID!) {
            need(id: $id) {
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
              createdAt
            }
          }
        `,
        variables: { id: validatedId },
        fetchPolicy: "network-only",
      });

      const need = response.data?.need;
      if (!need) throw new Error("Need not found");

      let urgencyVal = "Medium";
      if (need.urgency) {
        if (need.urgency.toLowerCase().includes("high")) {
          urgencyVal = "High";
        } else if (need.urgency.toLowerCase().includes("medium")) {
          urgencyVal = "Medium";
        } else if (need.urgency.toLowerCase().includes("low")) {
          urgencyVal = "Low";
        }
      }

      const mappedNeed = {
        id: need.id,
        ngo: need.ngo,
        ngo_name: need.ngoName || "Authorized NGO",
        title: need.itemName || "",
        description: need.description || "",
        category: need.category || "",
        quantity_required: `${need.quantity || 0} ${need.unit || "Units"}`,
        urgency: urgencyVal,
        status: need.status || "Open",
        created_at: need.createdAt || new Date().toISOString(),
        beneficiaries: "120 People",
        location: need.distributionAddress || "Service Zone",
        pickup_by: need.requiredBy ? new Date(need.requiredBy).toLocaleDateString() : "Flexible"
      };

      const parsedNeed = NGONeedSchema.parse(mappedNeed);
      useDonorDashboardNeedsStore.getState().setSelectedNeed(parsedNeed);
      return parsedNeed;
    } catch (error) {
      console.error(`Error fetching NGO need ${needId}:`, error);
      throw error;
    }
  },
};
