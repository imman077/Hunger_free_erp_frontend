import { useNgoStore } from "../../store/ngo-store";

export const useNgoProfile = () => {
  const { data, isLoading, error } = useNgoStore();

  return {
    profile: data.profile,
    documents: data.documents,
    isLoading,
    error,
  };
};
