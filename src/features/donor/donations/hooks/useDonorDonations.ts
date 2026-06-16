import { useMutation } from "@apollo/client";
import { useDonorStore } from "../../store/donor-store";
import { VERIFY_PICKUP, CANCEL_DONATION, CREATE_DONATION, DELETE_DONATION, UPDATE_VOLUNTEER_LOCATION } from "../api/donations/donations.graphql";

export const useDonorDonations = () => {
  const { data, donationStats, isLoading, error, refreshData } = useDonorStore();
  const [verifyPickupMutation] = useMutation(VERIFY_PICKUP);
  const [cancelDonationMutation] = useMutation(CANCEL_DONATION);
  const [createDonationMutation] = useMutation(CREATE_DONATION);
  const [deleteDonationMutation] = useMutation(DELETE_DONATION);
  const [updateVolunteerLocationMutation] = useMutation(UPDATE_VOLUNTEER_LOCATION);

  const handleDeleteDonation = async (donationId: string, currentStatus?: string) => {
    try {
      await deleteDonationMutation({
        variables: { id: donationId },
      });
      await refreshData(currentStatus); // Refresh the list after deletion
      return { success: true };
    } catch (error) {
      console.error("Deletion Error:", error);
      return { success: false, error };
    }
  };

  const handleVerifyPickup = async (donationId: string, otp: string, currentStatus?: string) => {
    try {
      await verifyPickupMutation({
        variables: { id: donationId, otp },
      });
      await refreshData(currentStatus); // Refresh the list after verification preserving filter
      return { success: true };
    } catch (error) {
      console.error("Verification Error:", error);
      return { success: false, error };
    }
  };

  const handleCancelDonation = async (donationId: string, reason?: string, currentStatus?: string) => {
    try {
      await cancelDonationMutation({
        variables: { id: donationId, reason },
      });
      await refreshData(currentStatus); // Refresh the list after cancellation preserving filter
      return { success: true };
    } catch (error) {
      console.error("Cancellation Error:", error);
      return { success: false, error };
    }
  };

  const handleRedonate = async (donation: any, currentStatus?: string) => {
    try {
      const input = {
        foodType: donation.foodType,
        category: donation.category,
        dietaryType: donation.dietaryType,
        preparationType: donation.preparationType,
        quantity: donation.quantity,
        ngo: null, // Reset MATCH to find a new NGO
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        pickupAddress: donation.pickupAddress || "",
        description: donation.description || "Resubmitted food donation.",
        expiryTime: donation.expiryTime || null,
        image: donation.image || null
      };

      await createDonationMutation({
        variables: { input }
      });
      await refreshData(currentStatus); // Refresh the list after creating donation preserving filter
      return { success: true };
    } catch (error) {
      console.error("Redonate Error:", error);
      return { success: false, error };
    }
  };

  const handleUpdateVolunteerLocation = async (id: string, lat: number, lng: number) => {
    try {
      await updateVolunteerLocationMutation({
        variables: { id, lat, lng }
      });
      return { success: true };
    } catch (error) {
      console.error("Update Location Error:", error);
      return { success: false, error };
    }
  };

  return {
    donationHistory: data.donationHistory,
    donationStats,
    isLoading,
    error,
    verifyPickup: handleVerifyPickup,
    cancelDonation: handleCancelDonation,
    deleteDonation: handleDeleteDonation,
    redonate: handleRedonate,
    updateVolunteerLocation: handleUpdateVolunteerLocation,
    refreshData
  };
};
