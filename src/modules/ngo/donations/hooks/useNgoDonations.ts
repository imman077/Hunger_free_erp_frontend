import { useNgoStore } from "../../store/ngo-store";
import { ngoDonationsService } from "../api/donations/donations.api.ts";

export const useNgoDonations = () => {
  const { data, isLoading, error, refreshData } = useNgoStore();

  const handleVerifyDelivery = async (donationId: number | string, otp: string) => {
    try {
        await ngoDonationsService.verifyDelivery(donationId, otp);
        await refreshData();
        return { success: true };
    } catch (err: any) {
        return { 
            success: false, 
            error: err.response?.data?.error || "Invalid delivery verification code." 
        };
    }
  };

  return {
    notifications: data.notifications.filter((n) => n.type === "donation"),
    myRequests: data.myRequests || [],
    isLoading,
    error,
    verifyDelivery: handleVerifyDelivery,
    refreshData
  };
};
