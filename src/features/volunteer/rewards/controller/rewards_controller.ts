import { useEffect } from "react";
import { useVolunteerStore } from "../../store/volunteer_store";
import { volunteerRewardsService } from "../api/rewards/rewards_api";

let isFetchingVolunteerRewards = false;
let hasFetchedVolunteerRewards = false;

export const useVolunteerRewards = () => {
  const { stats, prizes, rewards, badges, isLoading, error, setStats, setLoading, setError, setRewardsData } =
    useVolunteerStore();

  useEffect(() => {
    const fetchVolunteerData = async () => {
      if (isFetchingVolunteerRewards || hasFetchedVolunteerRewards) return;
      isFetchingVolunteerRewards = true;
      setLoading(true);
      try {
        const [rewardsRes, , , profileRes] = await Promise.all([
          volunteerRewardsService.getRewards(),
          volunteerRewardsService.getTiers(),
          volunteerRewardsService.getLuckySpinPrizes(),
          volunteerRewardsService.getVolunteerProfile(),
        ]);

        const volunteerRewards = Array.isArray(rewardsRes) ? rewardsRes : [];

        const mapVolunteerCategory = (cat: string): "grants" | "mega" | "social" => {
          const c = (cat || "").toLowerCase();
          if (c === "fuel" || c === "cash" || c === "voucher") return "grants";
          if (c === "tours" || c === "travel" || c === "grants") return "mega";
          return "social";
        };

        const sanitizeReward = (r: any) => ({
          id: r?.id,
          name: r?.name || "Unnamed Reward",
          amount: r?.amount || r?.name || "N/A",
          points: Number(r?.pointsRequired ?? r?.points_required ?? r?.points ?? 0),
          available: r?.available !== false,
          desc: r?.description || r?.desc || "",
          details: Array.isArray(r?.details) ? r.details : [],
        });

        // Map rewards to categories for volunteer
        const mappedRewards = {
          grants: volunteerRewards
            .filter((r: any) => r && mapVolunteerCategory(r.category) === "grants")
            .map(sanitizeReward),
          mega: volunteerRewards
            .filter((r: any) => r && mapVolunteerCategory(r.category) === "mega")
            .map(sanitizeReward),
          social: volunteerRewards
            .filter((r: any) => r && mapVolunteerCategory(r.category) === "social")
            .map(sanitizeReward),
        };

        const currentStats = useVolunteerStore.getState().stats;
        setStats({
          ...currentStats,
          impactPoints: profileRes?.donation_points ?? profileRes?.points ?? currentStats.impactPoints,
        });

        if (setRewardsData) {
          setRewardsData(mappedRewards);
        }

        hasFetchedVolunteerRewards = true;
      } catch (err) {
        console.error("Failed to fetch volunteer rewards:", err);
        setError("Could not load rewards data.");
      } finally {
        isFetchingVolunteerRewards = false;
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
