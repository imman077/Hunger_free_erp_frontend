import { useEffect } from "react";
import PageHeader from "../../../global/components/reusable-components/PageHeader";
import { useDonorStore } from "../store/donor-store";
import { useAuthStore } from "../../../global/store/auth-store";
import { onInit, onDestroy } from "./controller/rewards_controller";
import RewardsMarketplace from "./components/RewardsMarketplace";

const DonorRewards = () => {
  const { user } = useAuthStore();
  const userId = user?.id || "6a1939fe875b850d3dd88b6b";

  useEffect(() => {
    if (userId) {
      onInit(String(userId));
    }
    return () => {
      onDestroy();
    };
  }, [userId]);

  const { data } = useDonorStore();
  const totalPoints = data.currentPoints || 0;

  return (
    <div
      className="p-6 md:p-10 min-h-screen space-y-10 max-w-[1600px] mx-auto"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <PageHeader
        title="Donor Rewards"
        subtitle="Redeem points for exclusive benefits"
        className="mb-8"
        showPointsCard={true}
        points={totalPoints}
      />

      <div className="grid grid-cols-1 gap-12">
        <RewardsMarketplace />
      </div>
    </div>
  );
};

export default DonorRewards;
