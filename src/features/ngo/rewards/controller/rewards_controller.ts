import { useEffect } from "react";
import { useNgoStore } from "../../store/ngo_store";
import { ngoRewardsService } from "../api/rewards/rewards_api";

export const useNgoRewards = () => {
  const { data, isLoading, error, setNgoData, setLoading, setError } =
    useNgoStore();

  useEffect(() => {
    const fetchRewardsData = async () => {
      if (isLoading) return;
      setLoading(true);
      try {
        const [
          rewardsResponse,
          tiersResponse,
          prizesResponse,
          profileResponse,
        ] = await Promise.all([
          ngoRewardsService.getRewards(),
          ngoRewardsService.getTiers(),
          ngoRewardsService.getLuckySpinPrizes(),
          ngoRewardsService.getNGOProfile(),
        ]);

        const sanitizeReward = (r: any) => ({
          id: Number(r.id),
          name: String(r.name),
          amount: r.amount !== null ? r.amount : undefined,
          points: Number(r.points_required ?? r.points),
          available: Boolean(r.available),
          desc: (r.description ?? r.desc) !== null ? (r.description ?? r.desc) : undefined,
          details: r.details || [],
        });

        // Filter rewards for NGO role and map to categories
        const ngoRewards = Array.isArray(rewardsResponse)
          ? rewardsResponse.filter((r: any) => r.role === "NGO")
          : [];

        const mappedRewards = Array.isArray(rewardsResponse)
          ? {
              grants: ngoRewards
                .filter((r: any) => r.category === "cash") // "Quick Money" maps to cash in DB
                .map(sanitizeReward),
              mega: ngoRewards
                .filter((r: any) => r.category === "grants") // "Big Funds" maps to grants in DB
                .map(sanitizeReward),
              social: ngoRewards
                .filter((r: any) => r.category === "social") // "Aid & Tools" maps to social in DB
                .map(sanitizeReward),
            }
          : {
              grants: (rewardsResponse.grants || []).map(sanitizeReward),
              mega: (rewardsResponse.mega || []).map(sanitizeReward),
              social: (rewardsResponse.social || []).map(sanitizeReward),
            };

        // Map prizes
        const mappedPrizes = prizesResponse.map((p: any) => ({
          id: p.id,
          label: p.label,
          icon: p.icon || "🎁",
          color: p.prize_type === "GRANT" ? "#22c55e" : "var(--bg-secondary)",
        }));

        // Map tiers
        const mappedTiers = tiersResponse.map((t: any) => ({
          name: t.name,
          points: `${t.min_points.toLocaleString()}${t.max_points ? "-" + t.max_points.toLocaleString() : "+"}`,
          color: t.color || "text-gray-400",
        }));

        setNgoData({
          ...data,
          currentPoints: profileResponse.donation_points || 0,
          profile: {
            ...data.profile,
            beneficiariesServed:
              parseFloat(profileResponse.beneficiaries_helped_count) || 0,
            donationsAccepted:
              Number(profileResponse.total_donations_count) || 0,
          },
          rewards: mappedRewards,
          prizes: mappedPrizes.length > 0 ? mappedPrizes : data.prizes,
          tiers: mappedTiers.length > 0 ? mappedTiers : data.tiers,
        });
      } catch (err: any) {
        console.error("Failed to fetch NGO rewards:", err);
        setError("Could not load rewards data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if data is mock or empty (optional check)
    // For now, always sync with DB on mount
    fetchRewardsData();
  }, []);

  return {
    data,
    prizes: data.prizes,
    rewards: data.rewards,
    tiers: data.tiers || [],
    currentPoints: data.currentPoints,
    isLoading,
    error,
  };
};
