import React, { useState, useMemo } from "react";
import { useVolunteerRewards } from "../../rewards/controller/rewards_controller";
import { LuckyPrizeBody } from "../../../../global/components/reusable-components/LuckyPrizeBody";
import type { Prize } from "../../../../global/components/reusable-components/LuckyPrizeBody";

export const LuckyPrizeBodyField = React.memo(() => {
  const { prizes: storePrizes, isLoading } = useVolunteerRewards();

  // Spin the Wheel States
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  const prizes = storePrizes as Prize[];

  const handleSpin = () => {
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

  const prizeReaction = useMemo(() => {
    if (!wonPrize) return "";
    if (
      wonPrize.isJackpot ||
      wonPrize.label.toUpperCase() === "GRAND PRIZE" ||
      wonPrize.label.toUpperCase() === "GRAND JACKPOT" ||
      wonPrize.label.toUpperCase() === "MEGA BONUS"
    )
      return "Wow! You just won the Grand Prize!";
    return `Great! You won ${wonPrize.label}!`;
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

  return (
    <LuckyPrizeBody
      role="VOLUNTEER"
      prizes={prizes}
      isSpinning={isSpinning}
      rotation={rotation}
      wonPrize={wonPrize}
      onSpin={handleSpin}
      onClosePrizeModal={() => setWonPrize(null)}
      backRoute="/volunteer/rewards"
      subtitle="Exclusive Volunteer Member Rewards"
      reaction={prizeReaction}
    />
  );
});

LuckyPrizeBodyField.displayName = "LuckyPrizeBodyField";
export default LuckyPrizeBodyField;

