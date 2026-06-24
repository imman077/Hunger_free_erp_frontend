import React, { useMemo, useState } from "react";
import { useDonorStore } from "../../store/donor-store";
import { useAuthStore } from "../../../../global/store/auth-store";
import { onInit } from "../controller/rewards_controller";
import { donorRewardsService } from "../api/rewards/rewards_api";
import GlobalRewardsMarketplace from "../../../../global/components/reusable-components/GlobalRewardsMarketplace";

export const RewardsMarketplace = () => {
  const { user } = useAuthStore();
  const userId = user?.id || "6a1939fe875b850d3dd88b6b";

  const { data } = useDonorStore();
  const totalPoints = data.currentPoints || 0;
  const allRewards = data.rewards || [];

  const [pendingClaims, setPendingClaims] = useState<(string | number)[]>([]);

  const rewards = useMemo(
    () => ({
      cash: allRewards.filter((r) => r.category === "cash"),
      tours: allRewards.filter((r) => r.category === "tours"),
      youth: allRewards.filter((r) => r.category === "youth"),
    }),
    [allRewards]
  );

  const primaryBank = useMemo(() => {
    const bank = data.bankAccounts?.find((b) => b.isPrimary) || data.bankAccounts?.[0];
    return {
      bankName: bank?.bankName || "HDFC BANK",
      accountNumber: bank?.accountNumber || "**** 4590",
      isPrimary: true,
    };
  }, [data.bankAccounts]);

  const primaryUpi = useMemo(() => {
    const upi = data.upiIds?.find((u) => u.isPrimary) || data.upiIds?.[0];
    return {
      vpa: upi?.vpa || "johndoe@okaxis",
      isPrimary: true,
    };
  }, [data.upiIds]);

  const handleConfirmClaim = async (selectedReward: any, claimDetails: any) => {
    await donorRewardsService.claimReward(selectedReward.id, claimDetails);
    setPendingClaims((prev) => [...prev, selectedReward.id]);
    
    // Refresh donor points & rewards from backend
    if (userId) {
      await onInit(String(userId));
    }
  };

  return (
    <GlobalRewardsMarketplace
      role="donor"
      totalPoints={totalPoints}
      rewards={rewards}
      pendingClaims={pendingClaims}
      primaryBank={primaryBank}
      primaryUpi={primaryUpi}
      onConfirmClaim={handleConfirmClaim}
    />
  );
};

export default RewardsMarketplace;
