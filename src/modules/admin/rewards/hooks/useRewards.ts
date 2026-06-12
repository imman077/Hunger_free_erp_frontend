import { useCallback } from "react";
import { useRewardsStore } from "../store/rewards-store";
import { toast } from "sonner";
import type { RewardConfig, RewardCatalog } from "../store/rewards-schemas";

export const useRewards = () => {
  const {
    catalog,
    redemptions,
    addReward,
    updateReward,
    toggleRewardActive,
    deleteReward,
    approveRedemption,
    rejectRedemption,
  } = useRewardsStore();

  const handleAddReward = useCallback(
    (category: keyof RewardCatalog, reward: RewardConfig) => {
      addReward(category, reward);
      toast.success(`Successfully added ${reward.name} to ${category} catalog`);
    },
    [addReward],
  );

  const handleUpdateReward = useCallback(
    (
      category: keyof RewardCatalog,
      id: string | number,
      updates: Partial<RewardConfig>,
    ) => {
      updateReward(category, id, updates);
      toast.success(`Successfully updated reward.`);
    },
    [updateReward],
  );

  const handleToggleActive = useCallback(
    (category: keyof RewardCatalog, id: string | number) => {
      const item = catalog[category].find((i) => i.id === id);
      toggleRewardActive(category, id);
      toast.success(`${item?.name} ${!item?.active ? "enabled" : "disabled"}`);
    },
    [catalog, toggleRewardActive],
  );

  const handleDeleteReward = useCallback(
    (category: keyof RewardCatalog, id: string | number) => {
      const item = catalog[category].find((i) => i.id === id);
      deleteReward(category, id);
      toast.success(`Deleted "${item?.name}" from catalog`);
    },
    [catalog, deleteReward],
  );

  const handleApproveRedemption = useCallback(
    (id: string) => {
      approveRedemption(id);
      toast.success("Redemption request approved.");
    },
    [approveRedemption],
  );

  const handleRejectRedemption = useCallback(
    (id: string) => {
      rejectRedemption(id);
      toast.error("Redemption request rejected.");
    },
    [rejectRedemption],
  );

  return {
    catalog,
    redemptions,
    actions: {
      addReward: handleAddReward,
      updateReward: handleUpdateReward,
      toggleActive: handleToggleActive,
      deleteReward: handleDeleteReward,
      approveRedemption: handleApproveRedemption,
      rejectRedemption: handleRejectRedemption,
    },
  };
};
