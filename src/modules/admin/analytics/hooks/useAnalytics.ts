import { useAnalyticsStore } from "../store/analytics-store";

export const useAnalytics = () => {
  const { impactMetrics, donationTrends, categoryData, fetchAnalytics, isLoading } = useAnalyticsStore();

  return {
    impactMetrics,
    donationTrends,
    categoryData,
    fetchAnalytics,
    isLoading,
    totalDonations: impactMetrics.find((m) => m.label === "Total Donations")?.val || "0",
    totalNGOs: impactMetrics.find((m) => m.label === "Partner NGOs")?.val || "0",
    totalActiveUsers: impactMetrics.find((m) => m.label === "Active Users")?.val || "0",
  };
};
