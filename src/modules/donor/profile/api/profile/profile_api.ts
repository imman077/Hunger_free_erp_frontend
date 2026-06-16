import axiosInstance from "../../../../../global/utils/axios-instance";
import { ProfileUpdateInputSchema } from "./profile_input_model";
import type { ProfileUpdateInput } from "./profile_input_model";
import { ProfileDetailSchema } from "./profile_output_model";
import type { ProfileDetail } from "./profile_output_model";
import { useDonorProfileStore } from "./profile_store";

export const donorProfileService = {
  getProfile: async (): Promise<ProfileDetail> => {
    try {
      useDonorProfileStore.getState().setLoading(true);
      const response = await axiosInstance.get("donor-profiles/me/");
      const parsedProfile = ProfileDetailSchema.parse(response.data);
      useDonorProfileStore.getState().setProfile(parsedProfile);
      useDonorProfileStore.getState().setLoading(false);
      return parsedProfile;
    } catch (error: any) {
      useDonorProfileStore.getState().setError(error.message || "Failed to load profile");
      useDonorProfileStore.getState().setLoading(false);
      throw error;
    }
  },

  updateProfile: async (input: ProfileUpdateInput): Promise<any> => {
    try {
      const validatedInput = ProfileUpdateInputSchema.parse(input);
      const response = await axiosInstance.patch("donor-profiles/me/", validatedInput);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
};
