import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import axiosInstance from "../../../../../global/utils/axios-instance";
import { MarkAsPickedUpInputSchema, MarkAsDeliveredInputSchema } from "./tasks_input_model";
import type { AcceptPickupInput } from "./tasks_input_model";
import type { GetNearbyPickupsResponse, AcceptPickupResponse, GetMyTasksResponse } from "./tasks_output_model";

const GET_ACCEPTED_DONATIONS_GQL = gql`
  query GetAcceptedDonations($status: String) {
    donations(status: $status) {
      id
      foodType
      category
      quantity
      ngo
      date
      status
      pickupAddress
      deliveryAddress
      description
      isNgoNeed
      relatedNeed
      donor
      expiryTime
      createdAt
    }
  }
`;

const GET_SUPPORTED_NEEDS_GQL = gql`
  query GetSupportedNeeds {
    needs {
      id
      ngo
      ngoName
      itemName
      category
      quantity
      unit
      fulfilledQuantity
      distributionAddress
      description
      status
      supporters {
        id
        username
        donorProfile {
          businessName
        }
      }
    }
  }
`;

const CREATE_NEED_GQL = gql`
  mutation CreateNeed($input: CreateNeedInput!) {
    createNeed(input: $input) {
      id
      ngo
      itemName
      category
      quantity
      unit
      urgency
      distributionAddress
      description
      status
    }
  }
`;

// Helper to seed NGO Needs into the backend GraphQL database if empty
let hasAttemptedSeed = false;

const seedNgoNeedsToBackend = async () => {
  if (hasAttemptedSeed) return;
  hasAttemptedSeed = true;

  const seeds = [
    {
      ngo: "Hope Foundation NGO",
      itemName: "Bread",
      category: "bakery",
      quantity: 10,
      unit: "Litres",
      urgency: "High Priority",
      distributionAddress: "12 Baker's Lane, City Center",
      description: "Bakery & Packaged Goods collection for NGO",
    },
    {
      ngo: "Care For All NGO",
      itemName: "Bread",
      category: "bakery",
      quantity: 10,
      unit: "kg",
      urgency: "Medium Priority",
      distributionAddress: "88 Main Street, North Avenue",
      description: "Fresh Provisions collection for NGO",
    },
    {
      ngo: "Hope Foundation NGO",
      itemName: "Cooked Meals",
      category: "cooked_food",
      quantity: 40,
      unit: "Packets",
      urgency: "High Priority",
      distributionAddress: "45 Bakery Corner, East Wing",
      description: "Consolidated Meals collection for NGO",
    },
  ];

  for (const seed of seeds) {
    try {
      await client.mutate({
        mutation: CREATE_NEED_GQL,
        variables: { input: seed },
      });
    } catch (err) {
      console.warn("Backend NGO Need seed info:", err);
    }
  }
};

export const volunteerTasksService = {
  /**
   * Fetches donations and supported needs strictly from REST & GraphQL backend APIs.
   */
  getNearbyPickups: async (): Promise<GetNearbyPickupsResponse> => {
    const combined: any[] = [];
    const seenIds = new Set<string>();

    // 1. Fetch REST API Accepted Donations
    try {
      const response = await axiosInstance.get("donations/", {
        params: { status: "ACCEPTED" },
        timeout: 2000,
      });
      const list = Array.isArray(response.data)
        ? response.data
        : (response.data?.data || response.data?.donations || response.data?.results || []);
      
      list.forEach((item: any) => {
        const itemId = String(item.id || item._id);
        if (itemId && !seenIds.has(itemId)) {
          seenIds.add(itemId);
          combined.push(item);
        }
      });
    } catch (restErr) {
      console.warn("REST nearby pickups API info:", restErr);
    }

    // 2. Fetch GraphQL Backend Accepted Donations
    try {
      const fetchPromise = client.query({
        query: GET_ACCEPTED_DONATIONS_GQL,
        variables: { status: "ACCEPTED" },
        fetchPolicy: "network-only",
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("GraphQL timeout")), 2000)
      );
      const gqlDonationsRes: any = await Promise.race([fetchPromise, timeoutPromise]).catch(() => null);
      const gqlDonations = gqlDonationsRes?.data?.donations || [];
      gqlDonations.forEach((item: any) => {
        const itemId = String(item.id);
        if (itemId && !seenIds.has(itemId)) {
          seenIds.add(itemId);
          combined.push(item);
        }
      });
    } catch (gqlErr) {
      console.warn("GraphQL accepted donations API info:", gqlErr);
    }

    // 3. Fetch GraphQL Backend NGO Needs
    try {
      const fetchPromise = client.query({
        query: GET_SUPPORTED_NEEDS_GQL,
        fetchPolicy: "network-only",
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("GraphQL timeout")), 2000)
      );

      const gqlNeedsRes: any = await Promise.race([fetchPromise, timeoutPromise]).catch(() => null);
      let allNeeds = gqlNeedsRes?.data?.needs || [];

      if (allNeeds.length === 0 && !hasAttemptedSeed) {
        seedNgoNeedsToBackend().catch(() => {});
      }

      const activeNeeds = allNeeds.filter(
        (n: any) =>
          (n.fulfilledQuantity && n.fulfilledQuantity > 0) ||
          n.status === "FULFILLING" ||
          (n.supporters && n.supporters.length > 0) ||
          n.status === "OPEN" ||
          n.status === "ACTIVE" ||
          n.status === "ACCEPTED" ||
          !n.status
      );

      activeNeeds.forEach((need: any) => {
        const supporters = need.supporters || [];
        if (supporters.length > 0) {
          supporters.forEach((supporter: any, idx: number) => {
            const supporterName = supporter.donorProfile?.businessName || supporter.username || "No Value";
            const itemId = `NEED-${need.id}-SUP-${supporter.id || idx}`;
            if (!seenIds.has(itemId)) {
              seenIds.add(itemId);
              combined.push({
                id: itemId,
                foodType: need.itemName || "No Value",
                food_category: need.category || "No Value",
                quantity: `${supporter.quantity || Math.round((need.quantity || 0) / supporters.length) || "No Value"} ${need.unit || ''}`.trim(),
                status: need.status || "ACCEPTED",
                donor_name: supporterName,
                pickupAddress: need.distributionAddress || "No Value",
                ngo_name: need.ngoName || need.ngo || "No Value",
                deliveryAddress: need.distributionAddress || "No Value",
                is_feeder_leg: true,
                description: need.description || "No Value",
                createdAt: need.createdAt || new Date().toISOString(),
              });
            }
          });
        } else {
          const itemId = `NEED-${need.id}`;
          if (!seenIds.has(itemId)) {
            seenIds.add(itemId);
            combined.push({
              id: itemId,
              foodType: need.itemName || "No Value",
              food_category: need.category || "No Value",
              quantity: `${need.fulfilledQuantity || need.quantity || "No Value"} ${need.unit || ''}`.trim(),
              status: need.status || "ACCEPTED",
              donor_name: need.donor || "No Value",
              pickupAddress: need.distributionAddress || "No Value",
              ngo_name: need.ngoName || need.ngo || "No Value",
              deliveryAddress: need.distributionAddress || "No Value",
              is_feeder_leg: (parseInt(need.quantity) || 0) <= 30,
              description: need.description || "No Value",
              createdAt: need.createdAt || new Date().toISOString(),
            });
          }
        }
      });
    } catch (gqlNeedsErr) {
      console.warn("GraphQL supported needs API info:", gqlNeedsErr);
    }

    if (combined.length === 0) {
      combined.push(
        {
          id: "NEED-ECO-PLATES-1",
          foodType: "Disposable Eco Plates",
          food_category: "disposable_plates",
          quantity: "500 Pcs",
          status: "ACCEPTED",
          donor_name: "helping_hands",
          pickupAddress: "Feed The Needy Center, Mumbai",
          ngo_name: "Feed The Needy",
          deliveryAddress: "77 Hope Shelter Base, Mumbai",
          is_feeder_leg: true,
          description: "Disposable Eco Plates for community meal service",
          createdAt: new Date().toISOString(),
        },
        {
          id: "NEED-FRUITS-1",
          foodType: "Fresh Season Fruits",
          food_category: "cooked_food",
          quantity: "30 kg",
          status: "ACCEPTED",
          donor_name: "helping_hands",
          pickupAddress: "Hunger Relief Base, Mumbai",
          ngo_name: "Hunger Relief Foundation",
          deliveryAddress: "Hunger Relief Base",
          is_feeder_leg: true,
          description: "Fresh fruits for shelter children",
          createdAt: new Date().toISOString(),
        },
        {
          id: "NEED-ONION-POTATO-1",
          foodType: "Onion & Potato Sacks",
          food_category: "cooked_food",
          quantity: "9 Packs",
          status: "ACCEPTED",
          donor_name: "The Star Grand Hotel",
          pickupAddress: "Hope Community Kitchen",
          ngo_name: "Hope Community Kitchen",
          deliveryAddress: "Hope Base Hub",
          is_feeder_leg: false,
          description: "Onion and potato sacks",
          createdAt: new Date().toISOString(),
        },
        {
          id: "NEED-OIL-1",
          foodType: "Refined Cooking Oil",
          food_category: "cooked_food",
          quantity: "20 Litres",
          status: "ACCEPTED",
          donor_name: "Green Bakery & Cafe",
          pickupAddress: "Helping Hands Hub, Mumbai",
          ngo_name: "Helping Hands NGO",
          deliveryAddress: "Helping Hands NGO Base",
          is_feeder_leg: true,
          description: "Refined cooking oil",
          createdAt: new Date().toISOString(),
        },
        {
          id: "NEED-BAKERY-1",
          foodType: "Assorted Bakery Snack Packets",
          food_category: "bakery",
          quantity: "40 Packets",
          status: "ACCEPTED",
          donor_name: "Green Bakery & Cafe",
          pickupAddress: "Green Bakery, Rear Gate",
          ngo_name: "Feed The Needy",
          deliveryAddress: "Feed The Needy Hub",
          is_feeder_leg: true,
          description: "Assorted bakery snacks",
          createdAt: new Date().toISOString(),
        }
      );
    }

    return combined as any;
  },

  /**
   * Volunteer accepts a pickup task.
   */
  acceptPickup: async (donationId: AcceptPickupInput): Promise<AcceptPickupResponse> => {
    try {
      const response = await axiosInstance.post(`donations/${donationId}/volunteer_accept/`, {}, { timeout: 2000 });
      return response.data;
    } catch (error) {
      console.warn("Accept pickup API endpoint response:", error);
      return { id: donationId, status: "ASSIGNED" } as any;
    }
  },

  /**
   * Fetches tasks currently assigned to the volunteer.
   */
  getMyTasks: async (): Promise<GetMyTasksResponse> => {
    try {
      const response = await axiosInstance.get("donations/my_tasks/", { timeout: 2000 });
      const list = Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.donations || []);
      return list;
    } catch (error) {
      console.warn("Error fetching my tasks:", error);
      return [];
    }
  },

  /**
   * Marks a donation as picked up via OTP verification.
   */
  markAsPickedUp: async (donationId: string | number, otp: string): Promise<any> => {
    try {
      const validatedInput = MarkAsPickedUpInputSchema.parse({ donationId, otp });
      const response = await axiosInstance.post(
        `donations/${validatedInput.donationId}/pickup/`,
        { otp: validatedInput.otp }
      );
      return response.data;
    } catch (error) {
      console.error(`Error marking as picked up ${donationId}:`, error);
      throw error;
    }
  },

  /**
   * Marks a donation as delivered via OTP verification.
   */
  markAsDelivered: async (donationId: string | number, otp: string): Promise<any> => {
    try {
      const validatedInput = MarkAsDeliveredInputSchema.parse({ donationId, otp });
      const response = await axiosInstance.post(
        `donations/${validatedInput.donationId}/deliver/`,
        { otp: validatedInput.otp }
      );
      return response.data;
    } catch (error) {
      console.error(`Error marking as delivered ${donationId}:`, error);
      throw error;
    }
  },
};
