import axiosInstance from "../../../../../global/utils/axios-instance";
import { PostNeedInputSchema } from "./needs.input";
import type { PostNeedInput } from "./needs.input";
import { PostNeedResponseSchema, GetMyNeedsResponseSchema, GetAllNeedsResponseSchema } from "./needs.output";
import type { PostNeedResponse, GetMyNeedsResponse, GetAllNeedsResponse } from "./needs.output";

export const ngoNeedsService = {
  /**
   * Posts a new NGO need.
   */
  postNeed: async (needData: FormData | PostNeedInput): Promise<PostNeedResponse> => {
    try {
      let response;
      if (needData instanceof FormData) {
        response = await axiosInstance.post("needs/", needData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        const validatedInput = PostNeedInputSchema.parse(needData);
        response = await axiosInstance.post("needs/", validatedInput);
      }
      return PostNeedResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error posting NGO need:", error);
      throw error;
    }
  },

  /**
   * Fetches all needs posted by the current NGO.
   */
  getMyNeeds: async (): Promise<GetMyNeedsResponse> => {
    try {
      const response = await axiosInstance.get("needs/");
      return GetMyNeedsResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching NGO needs:", error);
      throw error;
    }
  },

  /**
   * Fetches all needs available in the marketplace (public).
   */
  getAllNeeds: async (): Promise<GetAllNeedsResponse> => {
    try {
      const response = await axiosInstance.get("needs/", {
        params: { marketplace: "true" },
      });
      return GetAllNeedsResponseSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching all needs:", error);
      throw error;
    }
  },
};
