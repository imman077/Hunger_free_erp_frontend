import axiosInstance from "../../../../../global/utils/axios-instance";
import { ProfileUpdateInputSchema } from "./profile_input_model";
import type { ProfileUpdateInput } from "./profile_input_model";
import { ProfileDetailSchema } from "./profile_output_model";
import type { ProfileDetail } from "./profile_output_model";
import { useDonorProfileStore } from "./profile_store";
import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";

export const donorProfileService = {
  getProfile: async (userId: string): Promise<ProfileDetail> => {
    try {
      useDonorProfileStore.getState().setLoading(true);
      const response = await client.query({
        query: gql`
          query UserById($userId: ID!) {
            userById(userId: $userId) {
              id
              username
              email
              role
              avatar
              phone
              isVerified
              donorProfile {
                businessName
                businessType
                subCategory
                verificationLevel
                registrationId
                profileCompleteness
                taxId
                address {
                  line1
                  city
                  state
                  postalCode
                }
                documents {
                  name
                  status
                  date
                  url
                }
              }
              paymentMethods {
                bankAccounts {
                  id
                  bankName
                  accountHolder
                  accountNumber
                  ifscCode
                  isPrimary
                  isVerified
                }
                upiIds {
                  id
                  vpa
                  label
                  isPrimary
                  isVerified
                }
              }
              ngoProfile {
                name
                registrationId
                category
                managingDirector
                taxId
                currentTier
                stats {
                  totalDonations
                  beneficiariesHelped
                  activeNeeds
                }
              }
              volunteerProfile {
                zone
                skills
                rating
                tasksCompleted
                vehicleType
                status
              }
              gamification {
                points
                lifetimePoints
                badges {
                  name
                  earnedAt
                }
                pointsHistory {
                  points
                  reason
                  createdAt
                }
              }
              createdAt
            }
          }
        `,
        variables: { userId },
        fetchPolicy: "network-only",
      });
      const userDetail = ProfileDetailSchema.parse(response.data?.userById);
      
      useDonorProfileStore.getState().setProfile(userDetail);
      useDonorProfileStore.getState().setLoading(false);
      return userDetail;
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
