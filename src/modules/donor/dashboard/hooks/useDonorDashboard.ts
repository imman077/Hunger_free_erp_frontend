import { useEffect, useState } from "react";
import { useDonorStore } from "../../store/donor-store";
import client from "../../../../global/api/apollo-client";
import { GET_NEEDS } from "../../donations/api/needs/needs.graphql";

export const useDonorDashboard = () => {
  const { data, isLoading, error } = useDonorStore();
  const [urgentNeedsCount, setUrgentNeedsCount] = useState(0);

  useEffect(() => {
    const fetchUrgentCount = async () => {
      try {
        const { data: graphqlData } = await client.query({
          query: GET_NEEDS,
          variables: { status: "Open" },
          fetchPolicy: "network-only"
        });
        const needs = graphqlData?.needs || [];
        const highPriorityCount = needs.filter((n: any) => n.urgency === "High" || n.urgency === "High Priority").length;
        setUrgentNeedsCount(highPriorityCount);
      } catch (err) {
        console.error("Failed to fetch urgent needs count", err);
      }
    };

    const loadData = async () => {
      await useDonorStore.getState().refreshData();
    };

    loadData();
    fetchUrgentCount();
  }, []);

  return {
    currentPoints: data.currentPoints,
    stats: data.stats,
    recentActivities: data.recentActivities,
    profile: data.profile,
    urgentNeedsCount,
    isLoading,
    error,
  };
};
