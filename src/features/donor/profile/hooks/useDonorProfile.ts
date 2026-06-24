import { useEffect, useState } from "react";
import { useDonorStore } from "../../store/donor-store";
import { tiersService } from "../../dashboard/api/tiers/tiers_api";
import type { GamificationTier } from "../../dashboard/api/tiers/tiers_output_model";

export const useDonorProfile = () => {
  const { data, isLoading: storeLoading, error } = useDonorStore();
  const [tiers, setTiers] = useState<GamificationTier[]>([]);
  const [isLoadingTiers, setIsLoadingTiers] = useState(true);

  useEffect(() => {
    let active = true;
    tiersService.getGamificationTiers()
      .then((res) => {
        if (active) {
          setTiers(res);
          setIsLoadingTiers(false);
        }
      })
      .catch((err) => {
        console.error("Error loading tiers:", err);
        if (active) {
          setIsLoadingTiers(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return {
    profile: data.profile,
    documents: data.documents,
    bankAccounts: data.bankAccounts,
    upiIds: data.upiIds,
    currentPoints: data.currentPoints,
    tiers,
    isLoading: storeLoading || isLoadingTiers,
    error,
  };
};
