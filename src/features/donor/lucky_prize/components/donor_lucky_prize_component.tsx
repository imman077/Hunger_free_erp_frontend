import React, { useEffect, useMemo } from "react";
import { useAuthStore } from "../../../../global/store/auth-store";
import { useDonorStore } from "../../store/donor-store";
import { rewardsInputModel } from "../../rewards/store/rewards_store";
import { handleSpin, setWonPrize } from "../../rewards/controller/rewards_controller";
import { onInit } from "../controller/donor_lucky_prize_controller";
import { LuckyPrizeBody } from "../../../../global/components/reusable-components/LuckyPrizeBody";
import type { Prize } from "../../../../global/components/reusable-components/LuckyPrizeBody";

export const LuckyPrizeBodyField = React.memo(() => {
  const { user } = useAuthStore();
  const userId = user?.id || "6a1939fe875b850d3dd88b6b";

  useEffect(() => {
    onInit();
    return () => {
      rewardsInputModel.reset();
    };
  }, []);

  const { data, isLoading } = useDonorStore();
  const prizes = (data.prizes || []) as Prize[];

  const isSpinning = rewardsInputModel.useSelector(
    (state) => state.rewardsState.isSpinning
  );
  const rotation = rewardsInputModel.useSelector(
    (state) => state.rewardsState.rotation
  );
  const wonPrize = rewardsInputModel.useSelector(
    (state) => state.rewardsState.wonPrize
  );

  const prizeReaction = useMemo(() => {
    if (!wonPrize) return "";
    if (
      wonPrize.isJackpot ||
      wonPrize.label?.toUpperCase() === "GRAND JACKPOT"
    )
      return "CONGRATULATIONS! You hit the Grand Jackpot!";
    return `Awesome! You won ${wonPrize.label}!`;
  }, [wonPrize]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin" />
        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest animate-pulse">
          Loading...
        </span>
      </div>
    );
  }

  const userName = user?.first_name || user?.username || "";

  return (
    <LuckyPrizeBody
      role="DONOR"
      prizes={prizes}
      isSpinning={isSpinning}
      rotation={rotation}
      wonPrize={wonPrize}
      onSpin={() => handleSpin(prizes)}
      onClosePrizeModal={() => setWonPrize(null)}
      backRoute="/donor/rewards"
      subtitle="Exclusive Donor Member Rewards"
      reaction={prizeReaction}
      userName={userName}
    />
  );
});

LuckyPrizeBodyField.displayName = "LuckyPrizeBodyField";
export default LuckyPrizeBodyField;

