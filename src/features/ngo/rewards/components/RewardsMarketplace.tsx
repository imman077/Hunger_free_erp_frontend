import { useMemo, useState } from "react";
import { useNgoRewards } from "../controller/rewards_controller";
import GlobalRewardsMarketplace from "../../../../global/components/reusable-components/GlobalRewardsMarketplace";

export const RewardsMarketplace = () => {
  const { rewards: storeRewards, currentPoints, isLoading } = useNgoRewards();
  const totalPoints = currentPoints || 0;

  const [pendingClaims, setPendingClaims] = useState<(string | number)[]>([]);

  const rewards = useMemo(() => ({
    cash: storeRewards?.grants || [],
    tours: storeRewards?.mega || [],
    youth: storeRewards?.social || [],
  }), [storeRewards]);

  const handleConfirmClaim = async (selectedReward: any, _claimDetails: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPendingClaims((prev) => [...prev, selectedReward.id]);
  };

  if (isLoading) return null;

  return (
    <GlobalRewardsMarketplace
      role="ngo"
      totalPoints={totalPoints}
      rewards={rewards}
      pendingClaims={pendingClaims}
      onConfirmClaim={handleConfirmClaim}
    />
  );
};

export default RewardsMarketplace;
