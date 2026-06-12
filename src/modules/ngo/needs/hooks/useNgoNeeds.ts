import { useNgoStore } from "../../store/ngo-store";

export const useNgoNeeds = () => {
  const { data, isLoading, error } = useNgoStore();

  return {
    activeNeeds: data.activeNeeds,
    isLoading,
    error,
  };
};
