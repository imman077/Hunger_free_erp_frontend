import { donorRewardsService } from "../api/rewards/rewards_api";
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
    const res = await donorRewardsService.getRewards(userId);
    
    const donorRewards = res.rewards.map((r: any) => ({
      id: r.id,
      category: mapCategory(r.category),
      name: r.name,
      amount: r.amount || "N/A",
      points: r.pointsRequired || 0,
      available: r.available !== false,
      desc: r.description || "",
    }));

    const mappedPrizes = res.prizes.map((p: any) => ({
      id: p.id,
      label: p.label,
      icon: mapIcon(p.icon),
      color: p.prizeType === "GRANT" ? "#22c55e" : "var(--bg-secondary)",
    }));

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
