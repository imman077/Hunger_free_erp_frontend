import React, { useState, useEffect, useMemo } from "react";
import {
  RotateCw,
  Gift,
  Star,
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
}

interface PrizeModalProps {
  isOpen: boolean;
  prize: Prize;
  reaction: string;
  onClose: () => void;
}

const PrizeModal: React.FC<PrizeModalProps> = ({
  isOpen,
  prize,
  reaction,
  onClose,
}) => {
  const isJackpot =
    prize.isJackpot ||
    prize.label.toUpperCase() === "GRAND JACKPOT" ||
    prize.label.toUpperCase() === "GRAND GRANT" ||
    prize.label.toUpperCase() === "GRAND PRIZE" ||
    prize.label.toUpperCase() === "MEGA BONUS";

  const renderPrizeLabel = () => {
    if (prize.label.toUpperCase() === "GRAND JACKPOT") {
      return (
        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-slate-800 dark:text-white">
          GRAND <span className="text-[#22c55e]">JACKPOT</span>
        </h3>
      );
    }
    return (
      <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-slate-800 dark:text-white">
        {prize.label}
      </h3>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      backdrop="blur"
      hideCloseButton
      size="sm"
      classNames={{
        backdrop: "bg-slate-900/40 backdrop-blur-xl",
        base: "rounded-sm border shadow-2xl overflow-visible",
        body: "p-0",
        wrapper: "z-[100]",
      }}
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      <ModalContent className="bg-transparent overflow-visible">
        <ModalBody className="p-8 text-center overflow-visible relative">
          {/* Floating Circle Icon */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-[var(--bg-primary)] border-4 border-[var(--border-color)] shadow-xl flex items-center justify-center z-50">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-4xl animate-bounce">
              {prize.icon || "🎁"}
            </div>
          </div>

          {/* Spacer for Floating Icon */}
          <div className="h-10"></div>

          {/* Subtitle: DRAW RESULT */}
          <h2
            className="text-[10px] font-extrabold tracking-[0.25em] uppercase mb-1 text-emerald-600 dark:text-emerald-400"
          >
            Draw Result
          </h2>

          {/* Big Header (e.g. GRAND JACKPOT) */}
          <div className="mb-2">
            {renderPrizeLabel()}
          </div>

          {/* Divider with Star */}
          <div className="flex items-center justify-center gap-3 my-4 w-full opacity-60">
            <div className="h-[1px] bg-[var(--border-color)] flex-1"></div>
            <Star className="text-emerald-500 fill-emerald-500" size={12} />
            <div className="h-[1px] bg-[var(--border-color)] flex-1"></div>
          </div>

          {/* Congratulations & Description */}
          <div className="mb-6">
            <div className="flex items-center gap-2 justify-center mb-1 text-slate-800 dark:text-white">
              <span className="text-base text-emerald-500">🌿</span>
              <span className="text-sm font-black tracking-tight uppercase">Congratulations!</span>
              <span className="text-base text-emerald-500">🌿</span>
            </div>
            <p
              className="text-xs font-semibold px-4 italic leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              "{reaction || "You hit the Grand Jackpot!"}"
            </p>
          </div>

          {/* Inner Won Banner/Card */}
          <div className="w-full bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-sm p-4 flex items-center gap-4 mb-6 text-left shadow-inner">
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-md shadow-emerald-500/20 shrink-0">
              {prize.icon || "🎁"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black tracking-widest text-[#22c55e] uppercase leading-none mb-1.5">
                You Won
              </p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                {prize.label}
              </h4>
              <p className="text-[10px] font-bold text-[var(--text-secondary)] mt-0.5">
                {isJackpot ? "Mega Draw Reward" : "Draw Reward"}
              </p>
            </div>
          </div>

          {/* Button Actions */}
          <div className="flex flex-col items-center w-full gap-3">
            <button
              onClick={onClose}
              className="w-full py-4 bg-[#22c55e] text-white font-black uppercase tracking-[0.15em] rounded-sm hover:bg-green-600 active:scale-95 shadow-lg shadow-green-500/20 transition-all text-xs"
            >
              Collect Reward
            </button>

            <button
              onClick={onClose}
              className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 transition-all mt-1"
            >
              View Rewards <span className="font-bold">&gt;</span>
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
}

const Wheel: React.FC<WheelProps> = ({
  prizes,
  rotation,
  isSpinning,
  onSpin,
}) => {
  const numPrizes = prizes.length;
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
    <div className="relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] xl:w-[440px] xl:h-[440px] 2xl:w-[480px] 2xl:h-[480px] mx-auto select-none font-sans">
      {/* Outer Ring boundary with glowing green gradient */}
      <div
        className="absolute inset-[-10px] sm:inset-[-12px] md:inset-[-15px] lg:inset-[-18px] xl:inset-[-20px] 2xl:inset-[-22px] rounded-full border-[10px] sm:border-[12px] md:border-[15px] lg:border-[18px] xl:border-[20px] 2xl:border-[22px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-10 pointer-events-none"
        style={{
          borderColor: "#22c55e",
          boxShadow:
            "0 0 30px rgba(34, 197, 94, 0.4), inset 0 0 15px rgba(34, 197, 94, 0.3)",
        }}
      ></div>

      {/* Spinning Wheel Body */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden transition-transform cubic-bezier(0.15, 0, 0.05, 1)"
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

          {prizes.map((prize, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;

            const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
            const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
            const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
            const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

            const isJackpot =
              prize.isJackpot ||
              prize.label.toUpperCase() === "GRAND JACKPOT" ||
              prize.label.toUpperCase() === "GRAND GRANT" ||
              prize.label.toUpperCase() === "GRAND PRIZE" ||
              prize.label.toUpperCase() === "MEGA BONUS";

            const segmentColor = isJackpot
              ? "#22c55e"
              : i % 2 === 0
                ? "#ffffff"
                : "#f1f5f9";

            return (
              <g key={prize.id}>
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
                        {prize.icon}
                      </text>
                    )}
                  </g>
                </g>
              </g>
            );
          })}

          {lightIndicators.map((light) => (
            <circle
              key={light.id}
              cx={light.x}
              cy={light.y}
              r="0.8"
              fill="#fef08a"
              className={isSpinning ? "animate-pulse" : ""}
              style={{
                filter: "drop-shadow(0 0 1px #eab308)",
                animationDuration: isSpinning ? "0.3s" : "1.5s",
              }}
            />
          ))}

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
          disabled={isSpinning}
          className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 2xl:w-40 2xl:h-40 rounded-full bg-[#22c55e] border-[6px] sm:border-[8px] md:border-[10px] lg:border-[12px] shadow-[0_20px_40px_rgba(34,197,94,0.25),inset_0_2px_8px_rgba(255,255,255,0.2)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-100 disabled:cursor-not-allowed group text-center"
          style={{ borderColor: "#ffffff" }}
        >
          <div className="flex flex-col items-center relative z-10 text-center">
            <span className="text-white font-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl tracking-widest leading-none">
              SPIN
            </span>
            <span className="text-white/80 font-bold text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-[11px] 2xl:text-[12px] uppercase tracking-wider mt-1 sm:mt-1.5 whitespace-nowrap">
              Tap to Spin
            </span>
          </div>
          {!isSpinning && (
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
  // Time & Reset States
  const [timeLeft, setTimeLeft] = useState({ hrs: 10, mins: 30, secs: 45 });
  const [isResetting, setIsResetting] = useState(false);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Countdown timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { hrs: prev.hrs, mins: prev.mins - 1, secs: 59 };
        if (prev.hrs > 0) return { hrs: prev.hrs - 1, mins: 59, secs: 59 };
        return { hrs: 23, mins: 59, secs: 59 };
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

  useEffect(() => {
    if (wonPrize && !isSpinning) {
      setShowDrawModal(true);

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
                className={`p-1.5 rounded-sm border border-[var(--border-color)] hover:border-green-200 text-[var(--text-muted)] hover:text-green-500 hover:bg-[var(--bg-hover)] transition-all ${
                  isResetting ? "animate-spin" : ""
                }`}
              >
                <RotateCw size={12} />
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
                1
              </span>
              <span className="text-xs font-black uppercase text-[#22c55e] tracking-wide">
                FREE SPIN
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
              onSpin={onSpin}
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
      />

      {/* Spin History Modal */}
      <SpinHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        userName={userName}
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
}> = ({ isOpen, onClose, userName }) => {
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
            {mockSpinHistory.map((item) => {
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
