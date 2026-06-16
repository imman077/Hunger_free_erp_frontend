import axiosInstance from "../../../../../global/utils/axios-instance";
import { AcceptPickupInputSchema, MarkAsPickedUpInputSchema, MarkAsDeliveredInputSchema } from "./tasks_input_model";
import type { AcceptPickupInput } from "./tasks_input_model";
import {
  GetNearbyPickupsResponseSchema,
  AcceptPickupResponseSchema,
  GetMyTasksResponseSchema,
  MarkAsPickedUpResponseSchema,
  MarkAsDeliveredResponseSchema,
} from "./tasks_output_model";
import type { GetNearbyPickupsResponse, AcceptPickupResponse, GetMyTasksResponse } from "./tasks_output_model";

export const volunteerTasksService = {
  /**
   * Fetches donations that are accepted by an NGO but need a volunteer for pickup.
   */
  getNearbyPickups: async (): Promise<GetNearbyPickupsResponse> => {
    try {
      const response = await axiosInstance.get("donations/", {
        params: {
          status: "ACCEPTED", // NGO accepted, ready for volunteer pickup
        },
      });
      return GetNearbyPickupsResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching nearby pickups:", error);
      throw error;
    }
  },

  /**
   * Volunteer accepts a pickup task.
   */
  acceptPickup: async (donationId: AcceptPickupInput): Promise<AcceptPickupResponse> => {
    try {
      const validatedId = AcceptPickupInputSchema.parse(donationId);
      const response = await axiosInstance.post(`donations/${validatedId}/volunteer_accept/`);
      return AcceptPickupResponseSchema.parse(response.data);
    } catch (error) {
      console.error(`Error accepting pickup ${donationId}:`, error);
      throw error;
    }
  },

  /**
   * Fetches tasks currently assigned to the volunteer.
   */
  getMyTasks: async (): Promise<GetMyTasksResponse> => {
    try {
      const response = await axiosInstance.get("donations/my_tasks/");
      return GetMyTasksResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching my tasks:", error);
      throw error;
    }
  },

  /**
   * Marks a donation as picked up via OTP verification.
   */
  markAsPickedUp: async (donationId: number, otp: string): Promise<any> => {
    try {
      const validatedInput = MarkAsPickedUpInputSchema.parse({ donationId, otp });
      const response = await axiosInstance.post(
        `donations/${validatedInput.donationId}/pickup/`,
        { otp: validatedInput.otp }
      );
      return MarkAsPickedUpResponseSchema.parse(response.data);
    } catch (error) {
      console.error(`Error marking as picked up ${donationId}:`, error);
      throw error;
    }
  },

  /**
   * Marks a donation as delivered via OTP verification.
   */
  markAsDelivered: async (donationId: number, otp: string): Promise<any> => {
    try {
      const validatedInput = MarkAsDeliveredInputSchema.parse({ donationId, otp });
      const response = await axiosInstance.post(
        `donations/${validatedInput.donationId}/deliver/`,
        { otp: validatedInput.otp }
      );
      return MarkAsDeliveredResponseSchema.parse(response.data);
    } catch (error) {
      console.error(`Error marking as delivered ${donationId}:`, error);
      throw error;
    }
  },
};
