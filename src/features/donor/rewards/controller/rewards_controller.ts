import { donorRewardsService } from "../api/rewards/rewards_api";
import { getPointsTiersApi } from "../api/get_points_tiers/get_points_tiers_api";
import { getPrizesApi } from "../api/get_prizes/get_prizes_api";
import { rewardsInputModel } from "../store/rewards_store";
import { useDonorStore } from "../../store/donor-store";

const mapCategory = (cat: string): "cash" | "tours" | "youth" => {
  const c = (cat || "").toLowerCase();
  if (c === "voucher" || c === "cash" || c === "fuel" || c === "grant") return "cash";
  if (c === "tours" || c === "travel") return "tours";
  return "youth"; // fallback
};

const mapIcon = (iconName: string): string => {
  const name = (iconName || "").toLowerCase();
  if (name === "star") return "⭐";
  if (name === "gift") return "🎁";
  if (name === "zap") return "⚡";
  if (name === "cash" || name === "money") return "💰";
  return iconName || "🎁";
};

export const onInit = async (userId: string) => {
  if (!userId) return;
  const globalStore = useDonorStore.getState();
  globalStore.setLoading(true);
  try {
    const [res, , prizesRes] = await Promise.all([
      donorRewardsService.getRewards(userId),
      getPointsTiersApi({ role: "DONOR" }),
      getPrizesApi({ role: "DONOR" }),
    ]);
    
    const donorRewards = res.rewards.map((r: any) => ({
      id: r.id,
      category: mapCategory(r.category),
      name: r.name,
      amount: r.amount || "N/A",
      points: r.pointsRequired || 0,
      available: r.available !== false,
      desc: r.description || "",
    }));

    const prizesList = prizesRes?.data?.prizes || res.prizes || [];
    const mappedPrizes = prizesList.map((p: any, idx: number) => {
      const isJackpot = p.label.toUpperCase() === "GRAND JACKPOT" || p.prizeType === "GRANT";
      let color;
      if (isJackpot) {
        color = "#22c55e";
      } else {
        color = idx % 2 === 0 ? "var(--bg-secondary)" : "var(--bg-tertiary)";
      }
      return {
        id: p.id,
        label: p.label,
        icon: mapIcon(p.icon),
        color: color,
        isJackpot: isJackpot,
      };
    });

    globalStore.setDonorData({
      ...globalStore.data,
      currentPoints: res.currentPoints,
      rewards: donorRewards,
      prizes: mappedPrizes.length > 0 ? mappedPrizes : globalStore.data.prizes,
    });
  } catch (err) {
    console.error("Failed to load rewards:", err);
    globalStore.setError("Could not load rewards data.");
  } finally {
    globalStore.setLoading(false);
  }
};

export const onDestroy = () => {
  rewardsInputModel.reset();
};

export const handleSpin = (prizes: any[]) => {
  const state = rewardsInputModel.useStore.getState().rewardsState;
  const isSpinning = state.isSpinning;
  const rotation = state.rotation;

  if (isSpinning || !prizes.length) return;

  rewardsInputModel.update({
    isSpinning: true,
    wonPrize: null,
  });

  const targetIndex = Math.floor(Math.random() * prizes.length);
  const laps = 8 + Math.floor(Math.random() * 5);
  const segmentAngle = 360 / prizes.length;

  const targetMidpoint = targetIndex * segmentAngle + segmentAngle / 2;
  const rotationRemaining = 360 - (rotation % 360);
  const stopAt = rotation + rotationRemaining + laps * 360 - targetMidpoint;

  rewardsInputModel.update({
    rotation: stopAt,
  });

  setTimeout(() => {
    rewardsInputModel.update({
      isSpinning: false,
      wonPrize: prizes[targetIndex],
    });
  }, 5000);
};

export const setWonPrize = (wonPrize: any) => {
  rewardsInputModel.update({ wonPrize });
};
