import axiosInstance from "../../../../../global/utils/axios-instance";
import { GetNeedByIdInputSchema } from "./needs.input";
import type { GetNeedByIdInput } from "./needs.input";
import { NeedSchema, GetNeedsResponseSchema } from "./needs.output";
import type { Need, GetNeedsResponse } from "./needs.output";

export const needsService = {
  /**
   * Fetches all active NGO needs via REST.
   */
  getNeeds: async (): Promise<GetNeedsResponse> => {
    try {
      const response = await axiosInstance.get("needs/", {
        params: {
          status: "Open",
        },
      });
      return GetNeedsResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching NGO needs via REST:", error);
      throw error;
    }
  },

  /**
   * Fetches a specific NGO need by ID via REST.
   */
  getNeedById: async (needId: GetNeedByIdInput): Promise<Need> => {
    try {
      const validatedId = GetNeedByIdInputSchema.parse(needId);
      const response = await axiosInstance.get(`needs/${validatedId}/`);
      return NeedSchema.parse(response.data);
    } catch (error) {
      console.error(`Error fetching NGO need ${needId} via REST:`, error);
      throw error;
    }
  },
};
