import { useNgoStore } from "../../store/ngo-store";

export const useNgoInventory = () => {
  const { isLoading, error } = useNgoStore();

  return {
    isLoading,
    error,
  };
};
