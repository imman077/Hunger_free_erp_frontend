import { useVolunteerStore } from "../../store/volunteer-store";

export const useVolunteerDashboard = () => {
  const { stats, activities, tasks, isLoading, error } = useVolunteerStore();

  return {
    stats: [
      {
        title: "Deliveries",
        value: stats.deliveries.toString(),
        change: `+${stats.thisMonthDeliveries} this month`,
        color: "#22c55e",
      },
      {
        title: "My Points",
        value: stats.impactPoints.toLocaleString(),
        change: "Active Contributor",
        color: "#22c55e",
      },
      {
        title: "My Forest",
        value: stats.treesPlanted.toString(),
        change: "Trees Planted",
        color: "#22c55e",
      },
      {
        title: "Wallet",
        value: `₹${stats.totalEarnings}`,
        change: `Available: ₹${stats.walletBalance}`,
        color: "#22c55e",
      },
    ],
    recentTasks: tasks,
    activities,
    currentPoints: stats.impactPoints,
    isLoading,
    error,
  };
};
