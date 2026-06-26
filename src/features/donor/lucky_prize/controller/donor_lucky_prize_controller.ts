import { getPrizesApi } from "../api/get_prizes/get_prizes_api";
import { useDonorStore } from "../../store/donor-store";

const mapIcon = (iconName: string): string => {
  const name = (iconName || "").toLowerCase();
  if (name === "star") return "⭐";
  if (name === "gift") return "🎁";
  if (name === "zap") return "⚡";
  if (name === "cash" || name === "money") return "💰";
  return iconName || "🎁";
};

export const fetchLuckyPrizes = async () => {
  const globalStore = useDonorStore.getState();
  globalStore.setLoading(true);
  try {
    const prizesRes = await getPrizesApi({ role: "DONOR" });
    const prizesList = prizesRes?.data?.prizes || [];
    
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
      prizes: mappedPrizes.length > 0 ? mappedPrizes : globalStore.data.prizes,
    });
  } catch (err) {
    console.error("Failed to load prizes:", err);
    globalStore.setError("Could not load prizes.");
  } finally {
    globalStore.setLoading(false);
  }
};

export const onInit = () => {
  fetchLuckyPrizes();
};
