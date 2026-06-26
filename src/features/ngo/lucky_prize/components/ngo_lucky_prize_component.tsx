import React, { useState, useMemo } from "react";
import { useNgoRewards } from "../../rewards/controller/rewards_controller";
import { LuckyPrizeBody } from "../../../../global/components/reusable-components/LuckyPrizeBody";
import type { Prize } from "../../../../global/components/reusable-components/LuckyPrizeBody";

export const LuckyPrizeBodyField = React.memo(() => {
  const { prizes: storePrizes, isLoading } = useNgoRewards();

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
      wonPrize.label?.toUpperCase() === "GRAND GRANT" ||
      wonPrize.label?.toUpperCase() === "GRAND JACKPOT"
    )
      return "UNBELIEVABLE! Your NGO just secured the highest honor!";
    return `Incredible! ${wonPrize.label} has been added to your grant pool!`;
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
      role="NGO"
      prizes={prizes}
      isSpinning={isSpinning}
      rotation={rotation}
      wonPrize={wonPrize}
      onSpin={handleSpin}
      onClosePrizeModal={() => setWonPrize(null)}
      backRoute="/ngo/rewards"
      subtitle="Exclusive NGO Member Rewards"
      reaction={prizeReaction}
    />
  );
});

LuckyPrizeBodyField.displayName = "LuckyPrizeBodyField";
export default LuckyPrizeBodyField;
