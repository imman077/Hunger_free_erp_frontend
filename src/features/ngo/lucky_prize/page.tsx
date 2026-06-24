"use client";

import { useEffect } from "react";
import { onInit, onDestroy } from "./controller/ngo_lucky_prize_controller";
import { LuckyPrizeBodyField } from "./components/ngo_lucky_prize_component";

export default function Ngo_lucky_prizePage() {
  useEffect(() => {
    onInit();

    return () => {
      onDestroy();
    };
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden p-0 bg-[var(--bg-secondary)]">
      <div className="flex-1 min-h-0">
        <LuckyPrizeBodyField />
      </div>
    </div>
  );
}