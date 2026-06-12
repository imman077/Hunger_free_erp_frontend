import { useDashboardStore } from "../store/dashboard-store";

export const useDashboard = () => {
  const { data, fetchDashboardData, isLoading, error } = useDashboardStore();
  const { stats } = data;

  return {
    stats,
    fetchDashboardData,
    isLoading,
    error,
  };
};
