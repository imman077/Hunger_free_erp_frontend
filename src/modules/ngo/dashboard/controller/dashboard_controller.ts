import { useNgoStore } from "../../store/ngo_store";

export const useNgoDashboard = () => {
  const { data, isLoading, error } = useNgoStore();

  return {
    stats: data.stats,
    notifications: data.notifications,
    activeNeeds: data.activeNeeds,
    currentPoints: data.currentPoints,
    isLoading,
    error,
  };
};
