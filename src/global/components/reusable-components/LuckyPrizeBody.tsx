import React, { useState, useEffect, useMemo } from "react";
import {
  RotateCw,
  Gift,
  MousePointerClick,
  CheckCircle2,
} from "lucide-react";
import { Modal, ModalContent, ModalBody } from "@heroui/react";
import confetti from "canvas-confetti";
import PageHeader from "./PageHeader";

export interface Prize {
  id: string | number;
  label: string;
  icon: string | React.ReactNode;
  color: string;
  isJackpot?: boolean;
  subtitle?: string;
}

interface PrizeModalProps {
  isOpen: boolean;
  prize: Prize;
  reaction: string;
  onClose: () => void;
  onViewHistory?: () => void;
}

const PrizeModal: React.FC<PrizeModalProps> = ({
  isOpen,
  prize,
  reaction: _reaction,
  onClose,
  onViewHistory,
}) => {
  const [isClaimed, setIsClaimed] = useState(false);
  const [showVideoIntro, setShowVideoIntro] = useState(true);
  const [isCardRevealed, setIsCardRevealed] = useState(false);
  const hasTriggeredRef = React.useRef(false);

  const skipVideoIntro = () => {
    if (!hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      setShowVideoIntro(false);
      setIsCardRevealed(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      hasTriggeredRef.current = false;
      setShowVideoIntro(true);
      setIsCardRevealed(false);

      // Cut video intro at exactly 5 seconds to pop up card with ZERO lag
      const timer = setTimeout(() => {
        if (!hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          setShowVideoIntro(false);
          setIsCardRevealed(true);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!prize) return null;

  const isTryAgain =
    prize.label?.toUpperCase().includes("TRY AGAIN") ||
    prize.label?.toUpperCase().includes("BETTER LUCK") ||
    prize.label?.toUpperCase().includes("NO LUCK") ||
    prize.label?.toUpperCase().includes("MISS");

  const isJackpot =
    !isTryAgain &&
    (prize.isJackpot ||
      prize.label?.toUpperCase() === "GRAND JACKPOT" ||
      prize.label?.toUpperCase() === "GRAND GRANT" ||
      prize.label?.toUpperCase() === "GRAND PRIZE" ||
      prize.label?.toUpperCase() === "MEGA BONUS");

  // Parse prize label so number and "POINTS" unit don't duplicate
  const rawLabel = prize.label || "";
  const isPointsLabel = /points?/i.test(rawLabel);
  const displayValue = isPointsLabel ? rawLabel.replace(/ points?/i, "") : rawLabel;
  const subtextLabel = isTryAgain
    ? "BETTER LUCK NEXT TIME"
    : isJackpot
    ? "GRAND JACKPOT REWARD"
    : isPointsLabel
    ? "POINTS"
    : prize.subtitle || "REWARD UNLOCKED";

  const handleCollect = () => {
    if (isTryAgain) {
      onClose();
      return;
    }
    if (isClaimed) {
      onClose();
      return;
    }
    setIsClaimed(true);

    confetti({
      particleCount: 140,
      spread: 110,
      origin: { y: 0.5 },
      colors: ["#22c55e", "#16a34a", "#34d399", "#fef08a", "#ffffff"],
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 80,
        origin: { x: 0 },
        colors: ["#22c55e", "#fbbf24", "#ffffff"],
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 80,
        origin: { x: 1 },
        colors: ["#22c55e", "#fbbf24", "#ffffff"],
      });
    }, 150);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      backdrop="blur"
      hideCloseButton
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      size="3xl"
      classNames={{
        backdrop: "bg-slate-950/85 backdrop-blur-2xl",
        base: "bg-transparent border-0 shadow-none overflow-visible max-w-2xl w-full",
        body: "p-0 overflow-visible",
        wrapper: "z-[100] items-center justify-center p-3 sm:p-6",
      }}
    >
      <ModalContent className="bg-transparent overflow-visible border-0 shadow-none">
        <ModalBody className="p-0 text-center overflow-visible relative flex flex-col items-center justify-center">
          <style>{`
            @keyframes lightBeam {
              0% { transform: translateX(-100%) rotate(25deg); opacity: 0; }
              50% { opacity: 0.8; }
              100% { transform: translateX(200%) rotate(25deg); opacity: 0; }
            }
            @keyframes mountainCurveReveal {
              0% {
                clip-path: polygon(
                  0% 100%, 25% 85%, 50% 40%, 75% 85%, 100% 100%,
                  100% 100%, 75% 100%, 50% 100%, 25% 100%, 0% 100%
                );
                opacity: 0;
                transform: scale(0.75) translateY(30px);
                filter: brightness(2.5) drop-shadow(0 0 80px #22c55e);
              }
              40% {
                clip-path: polygon(
                  0% 50%, 25% 25%, 50% 0%, 75% 25%, 100% 50%,
                  100% 100%, 75% 100%, 50% 100%, 25% 100%, 0% 100%
                );
                opacity: 0.85;
                transform: scale(1.03) translateY(-5px);
                filter: brightness(1.4);
              }
              75% {
                clip-path: polygon(
                  0% 10%, 25% 3%, 50% 0%, 75% 3%, 100% 10%,
                  100% 100%, 75% 100%, 50% 100%, 25% 100%, 0% 100%
                );
                opacity: 0.98;
                transform: scale(1.01) translateY(0);
                filter: brightness(1.1);
              }
              100% {
                clip-path: inset(0% 0% 0% 0% round 36px);
                opacity: 1;
                transform: scale(1) translateY(0);
                filter: brightness(1);
              }
            }
          `}</style>

          {/* Full Screen Intro Video Reveal Before Card (Tap to skip) */}
          {showVideoIntro && (
            <div
              onClick={skipVideoIntro}
              onTouchStart={skipVideoIntro}
              className="fixed inset-0 z-[160] bg-slate-950 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 cursor-pointer select-none transform-gpu translate-z-0"
            >
              <video
                src="/intro_for_reward.mp4"
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={skipVideoIntro}
                className="w-full h-full object-cover opacity-90 pointer-events-none transform-gpu translate-z-0 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 pointer-events-none" />

              <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-md text-[#22c55e] border border-[#22c55e]/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg animate-pulse">
                <span>Tap to skip</span>
                <span className="font-extrabold">&gt;&gt;</span>
              </div>

              <div className="absolute bottom-16 text-center text-[#22c55e] font-extrabold text-sm sm:text-base tracking-[0.25em] uppercase animate-pulse">
                {isTryAgain ? "🌿 SPIN RESULT 🌿" : "🌿 REVEALING YOUR REWARD... 🌿"}
              </div>
            </div>
          )}

          {/* Full Screen Ambient Bokeh Background Effects */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#22c55e]/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute top-12 left-10 text-3xl opacity-80 animate-[bounce_4s_infinite]">🌿</div>
            <div className="absolute top-20 right-16 text-4xl opacity-70 animate-[pulse_3s_infinite] rotate-45">🍃</div>
            <div className="absolute bottom-24 left-16 text-4xl opacity-75 animate-[spin_12s_linear_infinite]">🍃</div>
            <div className="absolute bottom-16 right-12 text-3xl opacity-80 animate-[bounce_5s_infinite] -rotate-12">🌿</div>
            <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-emerald-300 rounded-full blur-xs animate-ping" />
            <div className="absolute top-1/4 right-1/3 w-4 h-4 bg-lime-300 rounded-full blur-xs animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-emerald-200 rounded-full blur-xs animate-ping" />
            <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-[#22c55e] rounded-full blur-xs animate-pulse" />
          </div>

          {/* THE HUNGER CARD (Borderless with claim_card_reward_bg.png & Rounded Clips) */}
          <div
            className={`relative z-10 w-full max-w-xl bg-[url('/claim_card_reward_bg.png')] bg-cover bg-center bg-no-repeat border-0 rounded-[36px] p-8 sm:p-12 transition-all duration-500 overflow-hidden shadow-[0_0_70px_rgba(34,197,94,0.4)] flex flex-col items-center justify-center text-center ${
              isCardRevealed
                ? "animate-[mountainCurveReveal_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                : "opacity-0"
            } ${
              isClaimed
                ? "scale-[1.02] shadow-[0_0_90px_rgba(34,197,94,0.8)]"
                : ""
            }`}
          >
            
            {/* Sweeping Light Beam Overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div 
                className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-[#22c55e]/25 to-transparent rotate-45"
                style={{ animation: "lightBeam 3.5s infinite" }}
              />
            </div>

            {/* Top Center Glowing Double-Ring Circle Icon Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-950/90 border-2 border-[#22c55e] shadow-[0_0_35px_rgba(34,197,94,0.7)] flex items-center justify-center mb-5 relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#16a34a] to-[#15803d] flex items-center justify-center text-2xl sm:text-3xl shadow-inner border border-white/30">
                🍃
              </div>
            </div>

            {/* Header Line: — YOU WON — */}
            <div className="flex items-center gap-3 my-2 text-[#22c55e] font-black text-xs sm:text-sm tracking-[0.3em] uppercase relative z-10">
              <span className="w-8 h-[1.5px] bg-gradient-to-r from-transparent to-[#22c55e]" />
              <span>{isTryAgain ? "DRAW RESULT" : "YOU WON"}</span>
              <span className="w-8 h-[1.5px] bg-gradient-to-l from-transparent to-[#22c55e]" />
            </div>

            {/* Giant Prize Display Text (e.g. 2,000) */}
            <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tight my-2 drop-shadow-[0_0_30px_rgba(255,255,255,0.85)] relative z-10">
              {displayValue}
            </h2>

            {/* Subtext Line: 🍃 POINTS 🍃 */}
            <div className="flex items-center gap-2 text-[#22c55e] font-black text-xs sm:text-sm tracking-[0.25em] uppercase mb-8 relative z-10">
              <span>🍃</span>
              <span>{subtextLabel}</span>
              <span>🍃</span>
            </div>

            {/* Claimed Toast Banner */}
            {isClaimed && !isTryAgain && (
              <div className="mb-6 px-5 py-2 rounded-full bg-[#16a34a]/30 text-white flex items-center gap-2 text-xs font-black uppercase tracking-wider shadow-lg border border-[#22c55e]/60 animate-[bounce_0.5s_ease-in-out] relative z-10">
                <CheckCircle2 size={16} className="text-[#22c55e]" />
                <span>Successfully Added To Your Wallet!</span>
              </div>
            )}

            {/* Vibrant Hunger Green Pill Action Button INSIDE Card */}
            <button
              onClick={handleCollect}
              className={`w-full max-w-md py-4 px-8 rounded-full font-black uppercase tracking-[0.15em] text-sm sm:text-base shadow-[0_0_40px_rgba(34,197,94,0.6)] transition-all cursor-pointer flex items-center justify-center gap-3 border relative z-10 ${
                isTryAgain
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white border-amber-300/40"
                  : isClaimed
                  ? "bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-[#16a34a] text-white border-white/40 shadow-[0_0_50px_rgba(34,197,94,0.8)]"
                  : "bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-[#16a34a] hover:from-[#15803d] hover:to-[#16a34a] text-white border-white/40 active:scale-95"
              }`}
            >
              <span>
                {isTryAgain
                  ? "SPIN AGAIN"
                  : isClaimed
                  ? "✓ REWARD COLLECTED!"
                  : "COLLECT REWARD"}
              </span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-base">
                →
              </div>
            </button>

            {/* View Rewards Link below button inside card */}
            <button
              onClick={onViewHistory || onClose}
              className="mt-5 text-xs font-black uppercase tracking-widest text-[#22c55e] hover:text-white hover:underline flex items-center gap-1.5 transition-all cursor-pointer relative z-10"
            >
              VIEW REWARDS <span className="font-extrabold">&gt;</span>
            </button>

          </div>

        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface WheelProps {
  prizes: Prize[];
  rotation: number;
  isSpinning: boolean;
  onSpin: () => void;
  availableSpins?: number;
  formattedTime?: string;
}

const renderIcon = (icon: any) => {
  if (typeof icon !== "string") return icon || "🎁";
  const name = icon.toLowerCase().trim();
  if (name === "star") return "⭐";
  if (name === "gift") return "🎁";
  if (name === "zap") return "⚡";
  if (name === "cash" || name === "money") return "💰";
  if (name === "trophy") return "🏆";
  if (name === "leaf") return "🍃";
  return icon;
};

const Wheel: React.FC<WheelProps> = ({
  prizes,
  rotation,
  isSpinning,
  onSpin,
  availableSpins = 1,
  formattedTime = "12:00:00",
}) => {
  const activePrizes = useMemo(() => {
    if (prizes && prizes.length > 0) return prizes;
    return [
      { id: "1", label: "100 Points", icon: "⭐", color: "#ffffff" },
      { id: "2", label: "₹200 Voucher", icon: "🎁", color: "#f1f5f9" },
      { id: "3", label: "50 Points", icon: "⚡", color: "#ffffff" },
      { id: "4", label: "GRAND JACKPOT", icon: "🎁", color: "#22c55e", isJackpot: true },
      { id: "5", label: "Try Again", icon: "🍃", color: "#f1f5f9" },
      { id: "6", label: "500 Points", icon: "⭐", color: "#ffffff" },
      { id: "7", label: "₹500 Cash", icon: "💰", color: "#f1f5f9" },
      { id: "8", label: "20 Points", icon: "⚡", color: "#ffffff" },
    ];
  }, [prizes]);

  const numPrizes = activePrizes.length;
  const segmentAngle = 360 / numPrizes;

  const lightIndicators = useMemo(() => {
    const lights = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i * 360) / count;
      const x = 50 + 47.5 * Math.cos((Math.PI * angle) / 180);
      const y = 50 + 47.5 * Math.sin((Math.PI * angle) / 180);
      lights.push({ x, y, id: i });
    }
    return lights;
  }, []);

  return (
    <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] lg:w-[480px] lg:h-[480px] xl:w-[540px] xl:h-[540px] 2xl:w-[580px] 2xl:h-[580px]">
      {/* Outer Glow Ring */}
      <div 
        className="absolute inset-[-12px] sm:inset-[-16px] md:inset-[-20px] rounded-full opacity-60 blur-xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.4) 0%, transparent 70%)",
        }}
      />

      {/* Outer Border & Chassis */}
      <div 
        className="absolute inset-0 rounded-full border-[10px] sm:border-[14px] md:border-[18px] lg:border-[22px] shadow-[0_10px_40px_rgba(0,0,0,0.3),inset_0_2px_10px_rgba(255,255,255,0.2)] z-10 pointer-events-none overflow-hidden"
        style={{
          borderColor: "#22c55e",
          background: "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(0,0,0,0.2) 100%)",
        }}
      >
        {/* Decorative Bulbs on Chassis */}
        {lightIndicators.map((light, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-300 ${
              isSpinning
                ? i % 2 === 0
                  ? "bg-yellow-300 shadow-[0_0_10px_#fde047]"
                  : "bg-white shadow-[0_0_10px_#ffffff]"
                : "bg-amber-400 shadow-[0_0_6px_#f59e0b]"
            }`}
            style={{ left: `${light.x}%`, top: `${light.y}%` }}
          />
        ))}
      </div>

      {/* Rotating Wheel Container */}
      <div
        className="w-full h-full rounded-full overflow-hidden transition-transform cubic-bezier(0.15, 0, 0.05, 1)"
        style={{
          transform: `rotate(${rotation}deg)`,
          transitionDuration: isSpinning ? "5s" : "0s",
          border: "2px solid #ffffff",
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full bg-[var(--bg-secondary)]">
          <defs>
            <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
            </radialGradient>
          </defs>

          {activePrizes.map((prize, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;

            const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
            const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
            const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
            const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

            const isJackpot =
              prize.isJackpot ||
              prize.label?.toUpperCase() === "GRAND JACKPOT" ||
              prize.label?.toUpperCase() === "GRAND GRANT" ||
              prize.label?.toUpperCase() === "GRAND PRIZE" ||
              prize.label?.toUpperCase() === "MEGA BONUS";

            const segmentColor = isJackpot
              ? "#22c55e"
              : i % 2 === 0
                ? "#ffffff"
                : "#f1f5f9";

            return (
              <g key={prize.id || i}>
                <path
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                  fill={segmentColor}
                  stroke="#e2e8f0"
                  strokeWidth="0.15"
                />

                <g
                  transform={`rotate(${startAngle + segmentAngle / 2}, 50, 50)`}
                >
                  <text
                    x="50"
                    y="12"
                    fill={isJackpot ? "#ffffff" : "var(--text-primary)"}
                    className="font-black text-center"
                    style={{
                      fontSize: isJackpot ? "3.2px" : "3.6px",
                      fontFamily: "var(--font-primary)",
                      fontWeight: 900,
                    }}
                    textAnchor="middle"
                  >
                    {prize.label}
                  </text>

                  <text
                    x="50"
                    y="16.5"
                    fill={isJackpot ? "#ffffff" : "#22c55e"}
                    className="font-black"
                    style={{
                      fontSize: "2px",
                      fontFamily: "var(--font-primary)",
                      letterSpacing: "0.08em",
                      fontWeight: 950,
                    }}
                    opacity={isJackpot ? 0.9 : 1}
                    textAnchor="middle"
                  >
                    WIN
                  </text>

                  <g transform="translate(50, 27)">
                    {isJackpot ? (
                      <g transform="translate(-4.5, -4.5)">
                        <path
                          d="M1 3.5C0.44 3.5 0 3.94 0 4.5V7.5C0 8.05 0.44 8.5 1 8.5H9C9.56 8.5 10 8.05 10 7.5V4.5C10 3.94 9.56 3.5 9 3.5H1Z"
                          fill="#ffffff"
                        />
                        <rect
                          x="4.2"
                          y="4.5"
                          width="1.6"
                          height="2"
                          rx="0.3"
                          fill="#22c55e"
                          stroke="#ffffff"
                          strokeWidth="0.1"
                        />
                        <path
                          d="M1 1.5C0.44 1.5 0 1.94 0 2.5V4H10V2.5C10 1.94 9.56 1.5 9 1.5H1Z"
                          fill="#ffffff"
                          opacity="0.95"
                        />
                      </g>
                    ) : (
                      <text
                        fontSize="7.5"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {renderIcon(prize.icon)}
                      </text>
                    )}
                  </g>
                </g>
              </g>
            );
          })}

          <circle
            cx="50"
            cy="50"
            r="50"
            fill="url(#wheelGradient)"
            pointerEvents="none"
          />
        </svg>
      </div>

      {/* Pointer */}
      <div className="absolute top-[-22px] sm:top-[-26px] md:top-[-32px] lg:top-[-38px] xl:top-[-42px] 2xl:top-[-46px] left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
        <svg 
          className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] md:w-[44px] md:h-[44px] lg:w-[48px] lg:h-[48px] xl:w-[52px] xl:h-[52px] 2xl:w-[56px] 2xl:h-[56px]" 
          viewBox="0 0 60 60" 
          fill="none"
        >
          <path
            d="M30 55L52 15H8L30 55Z"
            fill="#22c55e"
            style={{
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.15))",
            }}
          />
          <path d="M30 55L52 15H30V55Z" fill="white" fillOpacity="0.1" />
          <circle
            cx="30"
            cy="15"
            r="4"
            fill="#ffffff"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Center Hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <button
          onClick={onSpin}
          disabled={isSpinning || availableSpins <= 0}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 2xl:w-40 2xl:h-40 rounded-full border-[6px] sm:border-[8px] md:border-[10px] lg:border-[12px] shadow-[0_20px_40px_rgba(34,197,94,0.25),inset_0_2px_8px_rgba(255,255,255,0.2)] flex items-center justify-center transition-all ${
            availableSpins <= 0 && !isSpinning
              ? "bg-slate-700 opacity-80 cursor-not-allowed border-slate-300 shadow-none"
              : "bg-[#22c55e] hover:scale-105 active:scale-95 border-white disabled:cursor-not-allowed group text-center"
          }`}
          style={{ borderColor: availableSpins <= 0 && !isSpinning ? "#cbd5e1" : "#ffffff" }}
        >
          <div className="flex flex-col items-center relative z-10 text-center px-1">
            <span className="text-white font-black text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl tracking-widest leading-none">
              {availableSpins <= 0 && !isSpinning ? "NO SPINS" : "SPIN"}
            </span>
            <span className="text-white/80 font-bold text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-[11px] 2xl:text-[12px] uppercase tracking-wider mt-1 sm:mt-1.5 whitespace-nowrap">
              {availableSpins <= 0 && !isSpinning ? `RESETS ${formattedTime}` : "Tap to Spin"}
            </span>
          </div>
          {!isSpinning && availableSpins > 0 && (
            <div className="absolute inset-[-4px] border-2 border-white/60 rounded-full animate-ping opacity-25"></div>
          )}
        </button>
      </div>
    </div>
  );
};

interface LuckyPrizeBodyProps {
  role: "DONOR" | "NGO" | "VOLUNTEER";
  prizes: Prize[];
  isSpinning: boolean;
  rotation: number;
  wonPrize: Prize | null;
  onSpin: () => void;
  onClosePrizeModal: () => void;
  backRoute: string;
  subtitle: string;
  reaction: string;
  userName?: string;
}

export const LuckyPrizeBody: React.FC<LuckyPrizeBodyProps> = ({
  role: _role,
  prizes,
  isSpinning,
  rotation,
  wonPrize,
  onSpin,
  onClosePrizeModal,
  backRoute: _backRoute,
  subtitle,
  reaction,
  userName,
}) => {
  // Time & Available Spins State
  const [availableSpins, setAvailableSpins] = useState(1);
  const [timeLeft, setTimeLeft] = useState({ hrs: 10, mins: 30, secs: 45 });
  const [isResetting, setIsResetting] = useState(false);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [userSpinHistory, setUserSpinHistory] = useState<SpinHistoryItem[]>(mockSpinHistory);

  // Countdown timer simulation with auto-reset
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { hrs: prev.hrs, mins: prev.mins - 1, secs: 59 };
        if (prev.hrs > 0) return { hrs: prev.hrs - 1, mins: 59, secs: 59 };
        
        // Timer reached 00:00:00 -> Refresh available spins automatically
        setAvailableSpins(1);
        return { hrs: 12, mins: 0, secs: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = useMemo(() => {
    const hh = String(timeLeft.hrs).padStart(2, "0");
    const mm = String(timeLeft.mins).padStart(2, "0");
    const ss = String(timeLeft.secs).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }, [timeLeft]);

  // Handle spin button click with spin deduction
  const handleSpinAction = () => {
    if (availableSpins > 0 && !isSpinning) {
      setAvailableSpins((prev) => Math.max(0, prev - 1));
      onSpin();
    }
  };

  useEffect(() => {
    if (wonPrize && !isSpinning) {
      setShowDrawModal(true);

      // Dynamically record won prize into spin history list
      const isTryAgain =
        wonPrize.label?.toUpperCase().includes("TRY AGAIN") ||
        wonPrize.label?.toUpperCase().includes("BETTER LUCK") ||
        wonPrize.label?.toUpperCase().includes("MISS");

      const newEntry: SpinHistoryItem = {
        id: String(Date.now()),
        prizeName: wonPrize.label,
        date: "Just now",
        type: isTryAgain
          ? "miss"
          : wonPrize.isJackpot || wonPrize.label.toUpperCase().includes("JACKPOT")
          ? "jackpot"
          : wonPrize.label.toUpperCase().includes("PTS") || wonPrize.label.toUpperCase().includes("POINTS")
          ? "points"
          : "voucher",
        value: wonPrize.label,
      };

      setUserSpinHistory((prev) => [newEntry, ...prev]);

      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#22c55e", "#10b981", "#34d399"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#22c55e", "#10b981", "#34d399"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [wonPrize, isSpinning]);

  const handleTimerReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      setTimeLeft({ hrs: 12, mins: 0, secs: 0 });
      setAvailableSpins(1); // Refresh spin count back to 1 free spin!
      setIsResetting(false);
    }, 800);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 text-[var(--text-primary)] bg-transparent w-full max-w-[1440px] mx-auto overflow-hidden min-h-[calc(100vh-110px)] flex flex-col justify-center gap-6 lg:gap-8">
      {/* Header Bar */}
      <PageHeader
        title="LUCKY SPIN"
        subtitle={subtitle}
        showUnderline={false}
        greenLastWord={true}
        buttonText="Spin History"
        buttonIcon={
          <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v14" strokeDasharray="3 3" />
          </svg>
        }
        buttonOnClick={() => setShowHistoryModal(true)}
        showArrow={true}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center w-full">
        {/* Left Column: Your Spins & Instructions */}
        <div className="lg:col-span-3 space-y-3 lg:space-y-4">
          {/* Your Spins Card */}
          <div className="bg-[var(--bg-primary)] p-4 rounded-sm border border-[var(--border-color)] shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-70">
                AVAILABLE SPINS
              </h3>
              <button
                onClick={handleTimerReset}
                disabled={isResetting}
                title="Refresh Free Spins"
                className={`p-1.5 rounded-sm border border-[var(--border-color)] hover:border-green-200 text-[var(--text-muted)] hover:text-green-500 hover:bg-[var(--bg-hover)] transition-all cursor-pointer ${
                  isResetting ? "animate-spin" : ""
                }`}
              >
                <RotateCw size={12} />
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
                {availableSpins}
              </span>
              <span className="text-xs font-black uppercase text-[#22c55e] tracking-wide">
                {availableSpins === 1 ? "FREE SPIN" : availableSpins > 1 ? "FREE SPINS" : "SPINS (WAIT FOR RESET)"}
              </span>
            </div>

            <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[10px]">
              <span className="text-[var(--text-muted)] font-bold flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 text-[var(--text-muted)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Resets in
              </span>
              <span className="font-black text-[#22c55e] tracking-wider text-xs">
                {formattedTime}
              </span>
            </div>
          </div>

          {/* How to Play Card */}
          <div className="bg-[var(--bg-primary)] p-4 rounded-sm border border-[var(--border-color)] shadow-sm space-y-4 text-left relative overflow-hidden">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#22c55e]">
                How to Play
              </h3>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-semibold leading-relaxed">
                Spin the wheel and claim great rewards instantly! Keep contributing to unlock more spins.
              </p>
            </div>

            <div className="relative space-y-4 pl-7">
              <div className="absolute left-[11px] top-3 bottom-3 w-[2px] border-l-2 border-dashed border-[var(--border-color)]"></div>

              {/* Step 1 */}
              <div className="flex gap-3 relative">
                <div className="absolute left-[-28px] w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-green-500/20 z-10">
                  1
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <MousePointerClick size={14} className="text-green-500" />
                    <h4 className="text-xs font-black uppercase text-[var(--text-primary)]">
                      Click SPIN
                    </h4>
                  </div>
                  <p className="text-[9px] text-[var(--text-muted)] font-bold">
                    Tap center button to start
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3 relative">
                <div className="absolute left-[-28px] w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-green-500/20 z-10">
                  2
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Gift size={14} className="text-green-500" />
                    <h4 className="text-xs font-black uppercase text-[var(--text-primary)]">
                      Win Rewards
                    </h4>
                  </div>
                  <p className="text-[9px] text-[var(--text-muted)] font-bold">
                    Watch segment highlight
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3 relative">
                <div className="absolute left-[-28px] w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-green-500/20 z-10">
                  3
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <h4 className="text-xs font-black uppercase text-[var(--text-primary)]">
                      Claim Prize
                    </h4>
                  </div>
                  <p className="text-[9px] text-[var(--text-muted)] font-bold">
                    Verify inside rewards folder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: The Wheel */}
        <div className="lg:col-span-6 flex items-center justify-center py-4">
          <div className="bg-[var(--bg-primary)]/40 backdrop-blur-sm p-4 sm:p-6 rounded-full border border-[var(--border-color)]/30 shadow-inner">
            <Wheel
              prizes={prizes}
              rotation={rotation}
              isSpinning={isSpinning}
              onSpin={handleSpinAction}
              availableSpins={availableSpins}
              formattedTime={formattedTime}
            />
          </div>
        </div>

        {/* Right Column: User Stats & Info */}
        <div className="lg:col-span-3 space-y-3 lg:space-y-4">
          {/* Recent Winners Card */}
          <div className="bg-[var(--bg-primary)] p-4 rounded-sm border border-[var(--border-color)] shadow-sm space-y-3 text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#22c55e]">
              Recent Winners
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400 flex items-center justify-center font-bold text-[10px] shrink-0 border border-orange-200 dark:border-orange-900/30">
                  SK
                </div>
                <div className="flex-1 text-[11px] min-w-0">
                  <p className="font-black text-[var(--text-primary)] truncate">Sarah K.</p>
                  <p className="text-[var(--text-muted)] font-bold mt-0.5">₹200 Voucher</p>
                </div>
                <span className="text-[8px] font-bold text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--border-color)] px-1.5 py-0.5 rounded-full shrink-0">
                  2m ago
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 border border-blue-200 dark:border-blue-900/30">
                  RM
                </div>
                <div className="flex-1 text-[11px] min-w-0">
                  <p className="font-black text-[var(--text-primary)] truncate">Rahul M.</p>
                  <p className="text-[var(--text-muted)] font-bold mt-0.5">100 Points</p>
                </div>
                <span className="text-[8px] font-bold text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--border-color)] px-1.5 py-0.5 rounded-full shrink-0">
                  5m ago
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400 flex items-center justify-center font-bold text-[10px] shrink-0 border border-teal-200 dark:border-teal-900/30">
                  PS
                </div>
                <div className="flex-1 text-[11px] min-w-0">
                  <p className="font-black text-[var(--text-primary)] truncate">Priya S.</p>
                  <p className="text-[var(--text-muted)] font-bold mt-0.5">₹500 Cash</p>
                </div>
                <span className="text-[8px] font-bold text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--border-color)] px-1.5 py-0.5 rounded-full shrink-0">
                  8m ago
                </span>
              </div>
            </div>

            {/* View All Winners Link */}
            <div className="pt-3 border-t border-[var(--border-color)] text-center mt-3">
              <button className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1.5 transition-all">
                View All Winners <span className="font-bold">&gt;</span>
              </button>
            </div>
          </div>

          {/* Win Big Banner */}
          <div className="p-4 rounded-sm bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/20 dark:to-teal-500/10 border border-emerald-500/20 dark:border-emerald-500/30 text-left flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-0.5 max-w-[65%] z-10">
              <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                WIN BIG!
              </h4>
              <p className="text-[9px] text-emerald-600 dark:text-emerald-500 font-bold leading-tight">
                Grand Jackpot is waiting for you!
              </p>
            </div>

            {/* Gift Box Graphic matching screenshot */}
            <div className="w-16 h-16 shrink-0 relative flex items-center justify-center z-10">
              <span className="text-5xl select-none animate-bounce" style={{ transform: "rotate(-10deg)" }}>
                🎁
              </span>
              <span className="text-3xl absolute -bottom-1 -left-1 select-none">
                💰
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Draw Modal Reveal */}
      <PrizeModal
        isOpen={showDrawModal}
        prize={wonPrize || prizes[0]}
        reaction={reaction}
        onClose={() => {
          onClosePrizeModal();
          setShowDrawModal(false);
        }}
        onViewHistory={() => {
          onClosePrizeModal();
          setShowDrawModal(false);
          setShowHistoryModal(true);
        }}
      />

      {/* Spin History Modal */}
      <SpinHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        userName={userName}
        historyItems={userSpinHistory}
      />
    </div>
  );
};

interface SpinHistoryItem {
  id: string;
  prizeName: string;
  date: string;
  type: "jackpot" | "points" | "cash" | "voucher" | "miss";
  value: string;
}

const mockSpinHistory: SpinHistoryItem[] = [
  { id: "1", prizeName: "Grand Grant (₹5,000)", date: "2 hours ago", type: "jackpot", value: "₹5,000" },
  { id: "2", prizeName: "100 Impact Points", date: "1 day ago", type: "points", value: "100 PTS" },
  { id: "3", prizeName: "₹200 Grocery Voucher", date: "3 days ago", type: "voucher", value: "₹200" },
  { id: "4", prizeName: "₹500 Fuel Coupon", date: "5 days ago", type: "voucher", value: "₹500" },
  { id: "5", prizeName: "50 Impact Points", date: "1 week ago", type: "points", value: "50 PTS" },
];

const SpinHistoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  historyItems?: SpinHistoryItem[];
}> = ({ isOpen, onClose, userName, historyItems = mockSpinHistory }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      backdrop="blur"
      size="md"
      hideCloseButton={true}
      classNames={{
        backdrop: "bg-slate-900/40 backdrop-blur-xl",
        base: "rounded-2xl shadow-2xl overflow-hidden border-none",
        body: "p-0",
        wrapper: "z-[100]",
      }}
      style={{
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <ModalContent>
        <ModalBody className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  <path d="M13 5v14" strokeDasharray="3 3" />
                </svg>
              </div>
              <div className="text-start">
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white leading-none">
                  Spin History
                </h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
                  {userName ? `${userName}'s past lucky spin rewards` : "Your past lucky spin rewards"}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-black p-1 hover:bg-[var(--bg-hover)] rounded-md transition-colors"
            >
              ✕
            </button>
          </div>

          {/* List */}
          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1 no-scrollbar text-start">
            {historyItems.map((item) => {
              let badgeColor = "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400";
              if (item.type === "jackpot") badgeColor = "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400";
              else if (item.type === "voucher") badgeColor = "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400";
              else if (item.type === "points") badgeColor = "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400";

              return (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-color)] bg-slate-50/50 dark:bg-slate-900/10 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-3 text-start">
                    <div className="text-2xl select-none">
                      {item.type === "jackpot" ? "🏆" : item.type === "voucher" ? "🎫" : "⭐"}
                    </div>
                    <div className="text-start">
                      <h4 className="text-sm font-black text-slate-700 dark:text-slate-200 leading-tight">
                        {item.prizeName}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                        {item.date}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${badgeColor}`}>
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LuckyPrizeBody;
