import client from "../../../../global/api/apollo-client";
import { GET_NEEDS } from "../api/needs/needs_api";
import { useDonorStore } from "../../store/donor-store";
import { dashboardInputModel } from "../store/dashboard_store";

export const onInit = async () => {
  try {
    // Refresh donor details / stats
    await useDonorStore.getState().refreshData();
    
    // Fetch urgent needs count
    const { data: graphqlData } = await client.query({
      query: GET_NEEDS,
      variables: { status: "Open" },
      fetchPolicy: "network-only",
    });
    const needs = graphqlData?.needs || [];
    const highPriorityCount = needs.filter(
      (n: any) => n.urgency === "High" || n.urgency === "High Priority" || n.urgency === "URGENT"
    ).length;
    
    dashboardInputModel.update({
      urgentNeedsCount: highPriorityCount,
    });
  } catch (err) {
    console.error("Dashboard onInit error:", err);
  }
};

export const onDestroy = () => {
  dashboardInputModel.reset();
};
