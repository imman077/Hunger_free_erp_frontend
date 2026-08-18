import { useEffect } from "react";
import { useNgoStore } from "../../store/ngo_store";
import { ngoRewardsService } from "../api/rewards/rewards_api";

let isFetchingRewards = false;
let hasFetchedRewards = false;

export const useNgoRewards = () => {
  const { data, isLoading, error, setNgoData, setLoading, setError } =
    useNgoStore();

  useEffect(() => {
    const fetchRewardsData = async () => {
      if (isFetchingRewards || hasFetchedRewards) return;
      isFetchingRewards = true;
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
          id: r.id,
          name: String(r.name),
          amount: r.amount !== null ? r.amount : undefined,
          points: Number(r.pointsRequired ?? r.points_required ?? r.points ?? 0),
          available: Boolean(r.available),
          desc: (r.description ?? r.desc) !== null ? (r.description ?? r.desc) : undefined,
          details: r.details || [],
        });

        // Filter rewards and map to categories
        const allRewards = Array.isArray(rewardsResponse) ? rewardsResponse : [];

        const mappedRewards = {
          grants: allRewards
            .filter((r: any) => {
              const cat = String(r.category || "").toLowerCase();
              return cat === "cash" || cat === "voucher" || cat === "grant";
            })
            .map(sanitizeReward),
          mega: allRewards
            .filter((r: any) => {
              const cat = String(r.category || "").toLowerCase();
              return cat === "grants" || cat === "tours" || cat === "mega";
            })
            .map(sanitizeReward),
          social: allRewards
            .filter((r: any) => {
              const cat = String(r.category || "").toLowerCase();
              return (
                cat === "social" ||
                cat === "youth" ||
                cat === "fuel" ||
                !["cash", "voucher", "grant", "grants", "tours", "mega"].includes(cat)
              );
            })
            .map(sanitizeReward),
        };

        // Map prizes
        const mappedPrizes = prizesResponse.map((p: any, idx: number) => {
          const isJackpot = p.label.toUpperCase() === "GRAND JACKPOT" || p.prizeType === "GRANT" || p.prize_type === "GRANT";
          let color;
          if (isJackpot) {
            color = "#22c55e";
          } else {
            color = idx % 2 === 0 ? "var(--bg-secondary)" : "var(--bg-tertiary)";
          }
          return {
            id: p.id,
            label: p.label,
            icon: p.icon || "🎁",
            color: color,
            isJackpot: isJackpot,
          };
        });

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
        hasFetchedRewards = true;
      } catch (err: any) {
        console.error("Failed to fetch NGO rewards:", err);
        setError("Could not load rewards data. Please try again later.");
      } finally {
        isFetchingRewards = false;
        setLoading(false);
      }
    };

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
