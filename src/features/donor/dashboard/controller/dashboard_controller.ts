import client from "../../../../global/api/apollo-client";
import { GET_NEEDS } from "../api/needs/needs_api";
import { useDonorStore } from "../../store/donor-store";
import { dashboardInputModel } from "../store/dashboard_store";
import { gamificationService } from "../api/gamification/gamification_api";
import { useAuthStore } from "../../../../global/store/auth-store";
import { milestonesService } from "../api/milestones/milestones_api";
import { tiersService } from "../api/tiers/tiers_api";

export const onInit = async () => {
  try {
    // Fetch urgent needs, milestones, and gamification tiers in parallel
    const [needsResponse, milestonesData, tiersData] = await Promise.all([
      client.query({
        query: GET_NEEDS,
        variables: { status: "Open" },
        fetchPolicy: "network-only",
      }),
      milestonesService.getDonorMilestones(),
      tiersService.getGamificationTiers(),
    ]);

    const needs = needsResponse.data?.needs || [];
    const highPriorityCount = needs.filter(
      (n: any) => n.urgency === "High" || n.urgency === "High Priority" || n.urgency === "URGENT"
    ).length;

    dashboardInputModel.update({
      urgentNeedsCount: highPriorityCount,
      milestones: milestonesData,
      tiers: tiersData,
    });

    // Refresh donor details / stats
    await useDonorStore.getState().refreshData();

    // Fetch gamification points
    const user = useAuthStore.getState().user;
    if (user?.id) {
      await gamificationService.getUserPoints({ userId: user.id });
    }
  } catch (err) {
    console.error("Dashboard onInit error:", err);
  }
};

export const onDestroy = () => {
  dashboardInputModel.reset();
};

