import { useState, useEffect } from "react";
import { useDonorStore } from "../../store/donor-store";
import { gql } from "@apollo/client";
import client from "../../../../global/api/apollo-client";
import { useAuthStore } from "../../../../global/contexts/auth-store";

export const GET_DONOR_REWARDS = gql`
  query GetDonorRewards($userId: ID!, $role: String!) {
    me(userId: $userId) {
      id
      gamification {
        points
      }
    }
    rewards(role: $role) {
      id
      name
      description
      pointsRequired
      category
      role
      amount
      available
    }
    prizes(role: $role) {
      id
      label
      icon
      prizeType
      value
    }
  }
`;

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

export const useDonorRewards = () => {
  const { data, isLoading, error, setDonorData, setLoading, setError } = useDonorStore();
  const { user } = useAuthStore();
  const userId = user?.id;

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchDonorData = async () => {
      setLoading(true);
      try {
        const { data: gqlData } = await client.query({
          query: GET_DONOR_REWARDS,
          variables: {
            userId: String(userId),
            role: "DONOR",
          },
          fetchPolicy: "network-only",
        });

        const meRes = gqlData.me;
        const rewardsRes = gqlData.rewards || [];
        const prizesRes = gqlData.prizes || [];

        const currentPoints = meRes?.gamification?.points ?? 0;

        const donorRewards = rewardsRes.map((r: any) => ({
          id: r.id,
          category: mapCategory(r.category),
          name: r.name,
          amount: r.amount || "N/A",
          points: r.pointsRequired || 0,
          available: r.available !== false,
          desc: r.description || "",
        }));

        const mappedPrizes = prizesRes.map((p: any) => ({
          id: p.id,
          label: p.label,
          icon: mapIcon(p.icon),
          color: p.prizeType === "GRANT" ? "#22c55e" : "var(--bg-secondary)",
        }));

        setDonorData({
          ...data,
          currentPoints,
          rewards: donorRewards,
          prizes: mappedPrizes.length > 0 ? mappedPrizes : data.prizes,
        });
      } catch (err) {
        console.error("Failed to fetch donor rewards:", err);
        setError("Could not load rewards data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonorData();
  }, [userId]);

  const handleSpin = (prizes: any[]) => {
    if (isSpinning || !prizes.length) return;
    setIsSpinning(true);
    setWonPrize(null);

    const targetIndex = Math.floor(Math.random() * prizes.length);
    const laps = 8 + Math.floor(Math.random() * 5);
    const segmentAngle = 360 / prizes.length;

    const targetMidpoint = targetIndex * segmentAngle + segmentAngle / 2;
    const rotationRemaining = 360 - (rotation % 360);
    const stopAt = rotation + rotationRemaining + laps * 360 - targetMidpoint;

    setRotation(stopAt);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(prizes[targetIndex]);
    }, 5000);
  };

  return {
    currentPoints: data.currentPoints,
    prizes: data.prizes,
    rewards: data.rewards,
    isSpinning,
    rotation,
    wonPrize,
    setWonPrize,
    handleSpin,
    isLoading,
    error,
  };
};
