import axiosInstance from "../../../../../global/utils/axios-instance";
import { AcceptDonationInputSchema, SupportNeedInputSchema, VerifyDeliveryInputSchema } from "./donations_input_model";
import type { AcceptDonationInput } from "./donations_input_model";
import {
  GetMarketplaceDonationsResponseSchema,
  GetAllDonationsResponseSchema,
  GetMyRequestsResponseSchema,
  AcceptDonationResponseSchema,
  SupportNeedResponseSchema,
  VerifyDeliveryResponseSchema,
} from "./donations_output_model";
import type {
  GetMarketplaceDonationsResponse,
  GetAllDonationsResponse,
  GetMyRequestsResponse,
  AcceptDonationResponse,
} from "./donations_output_model";

export const ngoDonationsService = {
  /**
   * Fetches all available donations for NGOs to claim.
   */
  getMarketplaceDonations: async (): Promise<GetMarketplaceDonationsResponse> => {
    try {
      const response = await axiosInstance.get("donations/", {
        params: {
          marketplace: "true",
        },
      });
      return GetMarketplaceDonationsResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching marketplace donations:", error);
      throw error;
    }
  },

  /**
   * Fetches all donations in the system (no filters).
   */
  getAllDonations: async (): Promise<GetAllDonationsResponse> => {
    try {
      const response = await axiosInstance.get("donations/");
      return GetAllDonationsResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching all donations:", error);
      throw error;
    }
  },

  /**
   * Fetches donations already claimed by the current NGO.
   */
  getMyRequests: async (): Promise<GetMyRequestsResponse> => {
    try {
      const response = await axiosInstance.get("donations/my_requests/");
      return GetMyRequestsResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching my requests:", error);
      throw error;
    }
  },

  /**
   * NGO accepts/claims a donation.
   */
  acceptDonation: async (donationId: AcceptDonationInput): Promise<AcceptDonationResponse> => {
    try {
      const validatedId = AcceptDonationInputSchema.parse(donationId);
      const response = await axiosInstance.post(`donations/${validatedId}/accept/`);
      return AcceptDonationResponseSchema.parse(response.data);
    } catch (error) {
      console.error(`Error accepting donation ${donationId}:`, error);
      throw error;
    }
  },

  /**
   * NGO supports/fulfills another NGO's need.
   */
  supportNeed: async (
    needId: number | string,
    data?: { quantity: number; phone: string }
  ): Promise<any> => {
    try {
      const validatedInput = SupportNeedInputSchema.parse({ needId, data });
      const response = await axiosInstance.post(`needs/${validatedInput.needId}/support/`, validatedInput.data);
      return SupportNeedResponseSchema.parse(response.data);
    } catch (error) {
      console.error(`Error supporting need ${needId}:`, error);
      throw error;
    }
  },

  /**
   * Verifies the delivery OTP to complete the donation life-cycle.
   * @param donationId The primary key of the donation.
   * @param otp The 4-digit verification code.
   */
  verifyDelivery: async (donationId: number | string, otp: string): Promise<any> => {
    try {
      const validatedInput = VerifyDeliveryInputSchema.parse({ donationId, otp });
      const response = await axiosInstance.post(
        `donations/${validatedInput.donationId}/deliver/`,
        { otp: validatedInput.otp }
      );
      return VerifyDeliveryResponseSchema.parse(response.data);
    } catch (error) {
      console.error(`Error verifying delivery for ${donationId}:`, error);
      throw error;
    }
  },
};
