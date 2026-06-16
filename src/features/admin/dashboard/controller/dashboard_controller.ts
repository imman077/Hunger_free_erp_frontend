import { useDashboardStore } from "../store/dashboard_store";

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

export const onInit = () => {
  useDashboardStore.getState().fetchDashboardData();
};

export const onDestroy = () => {
  useDashboardStore.getState().setError(null);
};
