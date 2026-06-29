import { useEffect } from "react";
import { useVolunteerStore } from "../../store/volunteer_store";
import { volunteerRewardsService } from "../../rewards/api/rewards/rewards_api";

export const useVolunteerProfile = () => {
  const { profile, isLoading, error, setProfile, setLoading, setError } = useVolunteerStore();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await volunteerRewardsService.getVolunteerProfile();
        setProfile({
          fullName: data.name || profile.fullName,
          email: data.email || profile.email,
          phone: data.phone || profile.phone,
          location: data.zone || profile.location,
          memberSince: profile.memberSince,
          verificationStatus: profile.verificationStatus,
          vehicleType: data.vehicleType || profile.vehicleType,
          licenseNumber: profile.licenseNumber,
          bankName: data.bankName || null,
          accountNumber: data.accountNumber || null,
          upiId: data.upiId || null,
        });
      } catch (err: any) {
        console.error("Failed to fetch volunteer profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return {
    profile,
    isLoading,
    error,
  };
};
