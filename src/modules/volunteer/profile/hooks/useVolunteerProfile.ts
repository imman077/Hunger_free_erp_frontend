import { useVolunteerStore } from "../../store/volunteer-store";

export const useVolunteerProfile = () => {
  const { profile, isLoading, error } = useVolunteerStore();

  return {
    profile,
    isLoading,
    error,
  };
};
