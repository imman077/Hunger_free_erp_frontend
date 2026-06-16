import axiosInstance from "../../../../../global/utils/axios-instance";
import { GetNeedByIdInputSchema } from "./needs_input_model";
import type { GetNeedByIdInput } from "./needs_input_model";
import { NGONeedSchema, GetNeedsResponseSchema } from "./needs_output_model";
import type { NGONeed, GetNeedsResponse } from "./needs_output_model";

export const ngoNeedsService = {
  /**
   * Fetches all active NGO needs.
   */
  getNeeds: async (): Promise<GetNeedsResponse> => {
    try {
      const response = await axiosInstance.get("needs/", {
        params: {
          status: "Open", // Only show open requests
        },
      });
      return GetNeedsResponseSchema.parse(response.data);
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
      const response = await axiosInstance.get(`needs/${validatedId}/`);
      return NGONeedSchema.parse(response.data);
    } catch (error) {
      console.error(`Error fetching NGO need ${needId}:`, error);
      throw error;
    }
  },
};
