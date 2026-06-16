import axiosInstance from "../../../../../global/utils/axios-instance";
import { CreateDonationInputSchema, GetDonationByIdInputSchema, VerifyPickupInputSchema } from "./donations.input";
import type { CreateDonationInput, GetDonationByIdInput } from "./donations.input";
import { CreateDonationResponseSchema, GetMyDonationsResponseSchema, GetDonationByIdResponseSchema, VerifyPickupResponseSchema } from "./donations.output";
import type { CreateDonationResponse, GetMyDonationsResponse, GetDonationByIdResponse } from "./donations.output";

/**
 * Service to handle donation-related API calls.
 */
export const donationService = {
  /**
   * Creates a new donation with multipart data (for image uploads).
   * @param donationFormData FormData containing all fields including 'image'.
   */
  createDonation: async (donationFormData: CreateDonationInput): Promise<CreateDonationResponse> => {
    try {
      const validatedInput = CreateDonationInputSchema.parse(donationFormData);
      const response = await axiosInstance.post("donations/", validatedInput, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return CreateDonationResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error creating donation:", error);
      throw error;
    }
  },

  /**
   * Fetches the current user's donations.
   */
  getMyDonations: async (): Promise<GetMyDonationsResponse> => {
    try {
      const response = await axiosInstance.get("donations/");
      return GetMyDonationsResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
      throw error;
    }
  },

  /**
   * Fetches a specific donation by ID.
   * @param donationId The primary key of the donation.
   */
  getDonationById: async (donationId: GetDonationByIdInput): Promise<GetDonationByIdResponse> => {
    try {
      const validatedId = GetDonationByIdInputSchema.parse(donationId);
      const response = await axiosInstance.get(`donations/${validatedId}/`);
      return GetDonationByIdResponseSchema.parse(response.data);
    } catch (error) {
      console.error(`Error fetching donation ${donationId}:`, error);
      throw error;
    }
  },

  /**
   * Verifies the pickup OTP for a donation.
   * @param donationId The primary key of the donation.
   * @param otp The 4-digit verification code.
   */
  verifyPickup: async (donationId: GetDonationByIdInput, otp: string): Promise<any> => {
    try {
      const validatedInput = VerifyPickupInputSchema.parse({ donationId, otp });
      const response = await axiosInstance.post(`donations/${validatedInput.donationId}/pickup/`, { otp: validatedInput.otp });
      return VerifyPickupResponseSchema.parse(response.data);
    } catch (error) {
      console.error(`Error verifying pickup for ${donationId}:`, error);
      throw error;
    }
  },
};
