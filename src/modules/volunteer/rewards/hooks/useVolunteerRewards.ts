import { useEffect } from "react";
import { useVolunteerStore } from "../../store/volunteer-store";
import { volunteerRewardsService } from "../api/rewards/rewards.api";

export const useVolunteerRewards = () => {
  const { stats, prizes, rewards, badges, isLoading, error, setStats, setLoading, setError, setRewardsData } =
    useVolunteerStore();

  useEffect(() => {
    const fetchVolunteerData = async () => {
      setLoading(true);
      try {
        const [rewardsRes, , , profileRes] = await Promise.all([
          volunteerRewardsService.getRewards(),
          volunteerRewardsService.getTiers(),
          volunteerRewardsService.getLuckySpinPrizes(),
          volunteerRewardsService.getVolunteerProfile(),
        ]);

        const volunteerRewards = Array.isArray(rewardsRes) ? rewardsRes.filter((r: any) => r && r.role === "VOLUNTEER") : [];

        // Map rewards to categories for volunteer
        const mappedRewards = {
          grants: volunteerRewards
            .filter((r: any) => r && r.category === "cash")
            .map((r: any) => ({
              id: r?.id,
              name: r?.name || "Unnamed Reward",
              amount: r?.amount || r?.name || "N/A",
              points: r?.points_required || 0,
              available: !!r?.available,
              desc: r?.description || "",
            })),
          mega: volunteerRewards
            .filter((r: any) => r && r.category === "grants")
            .map((r: any) => ({
              id: r?.id,
              name: r?.name || "Unnamed Reward",
              amount: r?.amount || r?.name || "N/A",
              points: r?.points_required || 0,
              available: !!r?.available,
              desc: r?.description || "",
            })),
          social: volunteerRewards
            .filter((r: any) => r && r.category === "social")
            .map((r: any) => ({
              id: r?.id,
              name: r?.name || "Unnamed Reward",
              points: r?.points_required || 0,
              available: !!r?.available,
              desc: r?.description || "",
              details: Array.isArray(r?.details) ? r.details : [],
            })),
        };

        setStats({
          ...stats,
          impactPoints: profileRes?.donation_points || 0,
        });

        // We need a setRewardsData action in the store or just use setVolunteerData pattern
        // For now I'll just use what's available or add an action
        if (setRewardsData) {
           setRewardsData(mappedRewards);
        }

      } catch (err) {
        console.error("Failed to fetch volunteer rewards:", err);
        setError("Could not load rewards data.");
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerData();
  }, []);

  return {
    currentPoints: stats.impactPoints,
    prizes,
    rewards,
    badges,
    isLoading,
    error,
  };
};
