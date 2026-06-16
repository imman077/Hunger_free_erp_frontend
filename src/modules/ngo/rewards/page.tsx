import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  TrendingUp,
  Lock,
  ChevronRight,
  Zap,
  Info,
  Check as CheckIcon,
  Building2,
  QrCode,
  Target,
  Handshake,
  Trophy,
  Crown,
  Diamond,
  Users,
  Package,
} from "lucide-react";
import { Modal, ModalContent, ModalBody, Tooltip } from "@heroui/react";
import ResuableDrawer from "../../../global/components/resuable-components/drawer";

export interface Prize {
  id: number;
  label: string;
  icon: string | React.ReactNode;
  color: string;
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
        base: "border rounded-sm",
        body: "p-0",
        wrapper: "z-[100]",
      }}
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      <ModalContent>
        <ModalBody className="p-10 text-center">
          <div className="mb-6 flex justify-center">
            <div
              className="w-24 h-24 rounded-sm flex items-center justify-center text-5xl border"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              {prize.icon}
            </div>
          </div>

          <h2
            className="text-[10px] font-black tracking-[0.5em] uppercase mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Draw Result
          </h2>

          <div className="mb-10">
            <h3
              className={`text-4xl font-black mb-3 tracking-tighter uppercase ${prize.label === "GRAND GRANT" ? "text-[#22c55e]" : ""}`}
              style={{
                color:
                  prize.label === "GRAND GRANT"
                    ? undefined
                    : "var(--text-primary)",
              }}
            >
              {prize.label}
            </h3>
            <p
              className="font-medium px-4 leading-relaxed italic"
              style={{ color: "var(--text-muted)" }}
            >
              "{reaction}"
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-5 bg-[#22c55e] text-white font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#1da850] transition-all active:scale-95"
          >
            Collect
          </button>
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

  return (
    <div className="relative w-[280px] h-[280px] md:w-[440px] md:h-[440px] mx-auto select-none font-sans">
      <div
        className="absolute inset-[-12px] md:inset-[-16px] rounded-full border-[12px] md:border-[20px] shadow-[0_45px_90px_-20px_rgba(0,0,0,0.5)] z-10 pointer-events-none"
        style={{ borderColor: "var(--bg-secondary)" }}
      />
      <div
        className="absolute inset-[-12px] md:inset-[-16px] rounded-full border-[2px] z-11 pointer-events-none opacity-20"
        style={{ borderColor: "var(--text-primary)" }}
      />

      <div
        className="relative w-full h-full rounded-full overflow-hidden transition-transform cubic-bezier(0.15, 0, 0.05, 1)"
        style={{
          transform: `rotate(${rotation}deg)`,
          transitionDuration: isSpinning ? "5s" : "0s",
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
            </radialGradient>
          </defs>

          {prizes.map((prize, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;

            const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
            const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
            const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
            const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

            const isJackpot = prize.label === "GRAND GRANT";

            return (
              <g key={prize.id}>
                <path
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                  fill={prize.color}
                  stroke="rgba(0,0,0,0.05)"
                  strokeWidth="0.1"
                />

                <g
                  transform={`rotate(${startAngle + segmentAngle / 2}, 50, 50)`}
                >
                  <text
                    x="50"
                    y="11"
                    fill={isJackpot ? "#ffffff" : "var(--text-primary)"}
                    className="font-black"
                    style={{
                      fontSize: isJackpot ? "3.2px" : "4.8px",
                      fontFamily: "var(--font-primary)",
                      letterSpacing: "-0.01em",
                    }}
                    textAnchor="middle"
                  >
                    {prize.label}
                  </text>

                  <text
                    x="50"
                    y="15"
                    fill={isJackpot ? "#ffffff" : "#22c55e"}
                    className="font-black"
                    style={{
                      fontSize: "2.5px",
                      fontFamily: "var(--font-primary)",
                      letterSpacing: "0.1em",
                    }}
                    opacity={isJackpot ? 0.8 : 1}
                    textAnchor="middle"
                  >
                    WIN
                  </text>

                  <g transform="translate(50, 26)">
                    {isJackpot ? (
                      <g transform="translate(-5, -5)">
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
                      </g>
                    ) : (
                      <text
                        fontSize="8.5"
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

          <circle
            cx="50"
            cy="50"
            r="50"
            fill="url(#wheelGradient)"
            pointerEvents="none"
          />
        </svg>
      </div>

      <div className="absolute top-[-26px] md:top-[-34px] left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-2xl">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path
            d="M30 54L52 12H8L30 54Z"
            fill="var(--bg-secondary)"
            style={{ stroke: "var(--border-color)", strokeWidth: "0.5px" }}
          />
          <circle
            cx="30"
            cy="12"
            r="3"
            fill="#22c55e"
            className="animate-pulse"
          />
        </svg>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <button
          onClick={onSpin}
          disabled={isSpinning}
          className="relative w-20 h-20 md:w-36 md:h-36 rounded-full bg-[#22c55e] border-[6px] md:border-[10px] shadow-[0_35px_70px_rgba(34,197,94,0.3),inset_0_2px_10px_rgba(255,255,255,0.2)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-100 disabled:cursor-not-allowed group text-center"
          style={{ borderColor: "var(--bg-primary)" }}
        >
          <div className="flex flex-col items-center relative z-10">
            <span className="text-white font-black text-sm md:text-2xl tracking-[0.2em] leading-none group-hover:scale-110 transition-transform text-center">
              SPIN
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

import { useNgoRewards } from "./controller/rewards_controller";

const NGORewards = () => {
  const navigate = useNavigate();
  const {
    data,
    prizes: storePrizes,
    rewards: storeRewards,
    tiers,
    currentPoints,
    isLoading,
  } = useNgoRewards();

  const userStats = useMemo(() => {
    const currentTierObj = tiers.slice().reverse().find(t => {
      const minPoints = parseInt(t.points.split(/[+-]/)[0].replace(/,/g, ''));
      return currentPoints >= minPoints;
    }) || tiers[0] || { name: "Beginner", points: "0" };

    const currentIndex = tiers.findIndex(t => t.name === currentTierObj.name);
    const nextTierObj = tiers[currentIndex + 1] || null;
    
    let pointsToNext = 0;
    if (nextTierObj) {
      const nextMinPoints = parseInt(nextTierObj.points.split(/[+-]/)[0].replace(/,/g, ''));
      pointsToNext = nextMinPoints - currentPoints;
    }

    return {
      totalPoints: currentPoints,
      currentTier: currentTierObj.name,
      nextTier: nextTierObj ? nextTierObj.name : "Max Tier",
      pointsToNextTier: pointsToNext > 0 ? pointsToNext : 0,
      beneficiariesServed: data.profile.beneficiariesServed || 0,
      donationsAccepted: data.profile.donationsAccepted || 0,
      treesPlanted: 150,
    };
  }, [currentPoints, tiers, data.profile.beneficiariesServed, data.profile.donationsAccepted]);

  // --- Spin the Wheel Logic ---
  const [isSpinModalOpen, setIsSpinModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);

  const prizes: Prize[] = storePrizes;

  const handleSpin = () => {
    if (isSpinning) return;
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
      const prize = prizes[targetIndex];
      setWonPrize(prize);
      
      // Close the wheel modal first for a clean sequence
      setIsSpinModalOpen(false);
      
      // Wait for wheel modal exit animation to finish before showing the win
      setTimeout(() => {
        setIsPrizeModalOpen(true);
      }, 500); 
    }, 5000);
  };

  const prizeReaction = useMemo(() => {
    if (!wonPrize) return "";
    if (wonPrize.label === "GRAND GRANT")
      return "UNBELIEVABLE! Your NGO just secured the highest honor!";
    return `Incredible! ${wonPrize.label} has been added to your grant pool!`;
  }, [wonPrize]);

  // Tiers come from hook now

  const rewards = storeRewards;

  // --- Claim Logic ---
  const [isClaimDrawerOpen, setIsClaimDrawerOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);
  const [pendingClaims, setPendingClaims] = useState<number[]>([]);
  const [selectedPayout, setSelectedPayout] = useState<"bank" | "upi">("bank");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getCurrentTierIndex = () => {
    if (!tiers || tiers.length === 0) return -1;
    return tiers.findIndex((t) => t.name === userStats.currentTier);
  };

  const getTierIcon = (name: string, size: number, color: string) => {
    const iconName = name.toLowerCase();
    if (iconName.includes("beginner")) return <Target size={size} className={color} />;
    if (iconName.includes("bronze")) return <Handshake size={size} className={color} />;
    if (iconName.includes("silver")) return <Zap size={size} className={color} />;
    if (iconName.includes("gold")) return <Trophy size={size} className={color} />;
    if (iconName.includes("platinum")) return <Crown size={size} className={color} />;
    if (iconName.includes("diamond")) return <Diamond size={size} className={color} />;
    if (iconName.includes("legend")) return <Star size={size} className={color} fill="currentColor" />;
    return <Star size={size} className={color} />;
  };

  // Mock Primary Payment Methods for NGO
  const primaryBank = {
    bankName: "HDFC BANK",
    accountNumber: "**** 8824",
    isPrimary: true,
  };

  const primaryUpi = {
    vpa: "charity@okaxis",
    isPrimary: true,
  };

  const handleClaim = (reward: any) => {
    if (pendingClaims.includes(reward.id)) return;
    setSelectedReward(reward);
    setIsClaimDrawerOpen(true);
  };

  const confirmClaim = () => {
    setIsSubmittingClaim(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingClaim(false);
      setShowClaimSuccess(true);
      setPendingClaims([...pendingClaims, selectedReward.id]);

      // Close drawer after showing animation
      setTimeout(() => {
        setIsClaimDrawerOpen(false);
        setShowClaimSuccess(false);
        setSelectedReward(null);
      }, 3000);
    }, 2000);
  };

  return (
    <div
      className="p-6 md:p-10 min-h-screen space-y-10 max-w-[1600px] mx-auto"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Spin Modal */}
      <Modal
        isOpen={isSpinModalOpen}
        onOpenChange={setIsSpinModalOpen}
        placement="center"
        backdrop="blur"
        size="full"
        classNames={{
          backdrop: "bg-slate-950/40 backdrop-blur-2xl",
          base: "bg-transparent shadow-none",
          wrapper: "z-[100]",
          body: "p-0",
          closeButton:
            "z-[110] bg-white/10 hover:bg-white/20 text-white rounded-full m-4 right-4 left-auto",
        }}
      >
        <ModalContent>
          <ModalBody>
            <div className="flex flex-col items-center justify-center min-h-[500px] md:min-h-[600px] py-10">
              <div className="mb-10 text-center z-20">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  Lucky Spin
                </h2>
                <p className="text-[11px] font-black text-white/70 uppercase tracking-[0.4em] drop-shadow-md">
                  Exclusive NGO Member Rewards
                </p>
              </div>
              <Wheel
                prizes={prizes}
                rotation={rotation}
                isSpinning={isSpinning}
                onSpin={handleSpin}
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Prize Reveal Overlay */}
      {wonPrize && (
        <PrizeModal
          isOpen={isPrizeModalOpen}
          prize={wonPrize}
          reaction={prizeReaction}
          onClose={() => setIsPrizeModalOpen(false)}
        />
      )}
      {/* Page Heading & Right-side Cards */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-1.5 text-left">
          <h1
            className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none"
            style={{ color: "var(--text-primary)" }}
          >
            NGO Grants & Rewards
          </h1>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#22c55e]">
            Redeem points for exclusive benefits
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Manage Payout Methods Button */}
          {/* <button
            onClick={() => navigate("/ngo/profile/payments")}
            className="flex items-center gap-3.5 border p-4 rounded-sm transition-all group"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className="w-11 h-11 border group-hover:bg-[#22c55e] group-hover:text-white flex items-center justify-center rounded-sm transition-all"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <Building2 size={20} />
            </div>
            <div className="text-start">
              <p
                className="text-[9px] font-black uppercase tracking-widest mb-1 group-hover:opacity-80 transition-opacity"
                style={{ color: "var(--text-muted)" }}
              >
                Payout Vault
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs font-black uppercase tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  Manage Methods
                </span>
                <ExternalLink
                  size={10}
                  className="opacity-30 group-hover:text-[#22c55e] group-hover:opacity-100 transition-all"
                />
              </div>
            </div>
          </button> */}

          {/* Impact Points Card */}
          <div
            className="flex items-center gap-3.5 border p-4 rounded-sm text-left"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className="w-11 h-11 border flex items-center justify-center rounded-sm"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.08)",
                borderColor: "rgba(34, 197, 94, 0.2)",
              }}
            >
              <TrendingUp className="text-[#22c55e]" size={22} />
            </div>
            <div className="text-start">
              <p
                className="text-[9px] font-black uppercase tracking-widest mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Impact Points
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-xl font-black tabular-nums leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  {userStats.totalPoints.toLocaleString()}
                </span>
                <span className="text-[9px] font-black text-[#22c55e] uppercase">
                  Points
                </span>
              </div>
            </div>
          </div>

          {/* Beneficiaries Card */}
          <div
            className="flex items-center gap-3.5 border p-4 rounded-sm text-left"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className="w-11 h-11 border flex items-center justify-center rounded-sm text-blue-500"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.08)",
                borderColor: "rgba(59, 130, 246, 0.2)",
              }}
            >
              <Users size={22} />
            </div>
            <div className="text-start">
              <p
                className="text-[9px] font-black uppercase tracking-widest mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                People Served
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-xl font-black tabular-nums leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  {userStats.beneficiariesServed.toLocaleString()}
                </span>
                <span className="text-[9px] font-black text-blue-500 uppercase">
                  Impact
                </span>
              </div>
            </div>
          </div>

          {/* Donations Card */}
          <div
            className="flex items-center gap-3.5 border p-4 rounded-sm text-left"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className="w-11 h-11 border flex items-center justify-center rounded-sm text-orange-500"
              style={{
                backgroundColor: "rgba(249, 115, 22, 0.08)",
                borderColor: "rgba(249, 115, 22, 0.2)",
              }}
            >
              <Package size={22} />
            </div>
            <div className="text-start">
              <p
                className="text-[9px] font-black uppercase tracking-widest mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Rescues
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-xl font-black tabular-nums leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  {userStats.donationsAccepted.toLocaleString()}
                </span>
                <span className="text-[9px] font-black text-orange-500 uppercase">
                  Donations
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Tier Progression & Quarterly Challenge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section
          className="lg:col-span-3 border p-8 md:p-10 rounded-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="space-y-1 mb-8 text-left">
            <h2
              className="text-2xl font-black uppercase tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Loyalty Tiers
            </h2>
            <p
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Track your progress through the ecosystem
            </p>
          </div>

          <div className="relative mb-6">
            {/* Background Line (Gray) */}
            <div
              className="absolute top-[32px] left-[7.14%] h-[1px] -translate-y-1/2 z-0 hidden lg:block"
              style={{ 
                backgroundColor: "var(--border-color)",
                width: tiers.length > 1 
                  ? `${(Math.min(tiers.length, 7) - 1) * 14.28}%` 
                  : "0%"
              }}
            />

            {/* Active Progress Line (Green) */}
            <div
              className="absolute top-[32px] left-[7.14%] h-[1.5px] -translate-y-1/2 z-0 hidden lg:block transition-all duration-700 ease-in-out"
              style={{
                backgroundColor: "#22c55e",
                width: tiers.length > 1 
                  ? `${(Math.min(getCurrentTierIndex(), 6)) * 14.28}%` 
                  : "0%",
                boxShadow: "0 0 10px rgba(34, 197, 94, 0.2)"
              }}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 relative z-10">
              {tiers.map((tier: any, idx: number) => {
                const isCurrent = tier.name === userStats.currentTier;
                const isPast = idx < getCurrentTierIndex();

                return (
                  <div key={tier.name} className="flex flex-col items-center">
                    <div className="h-16 flex items-center justify-center mb-3">
                      <div
                        className={`relative flex items-center justify-center border transition-all duration-500 rounded-sm ${
                          isCurrent
                            ? "bg-[#22c55e] border-white z-20 w-16 h-16 outline outline-4 outline-offset-4 outline-[#22c55e]"
                            : "w-12 h-12"
                        } ${
                          isPast
                            ? "border-[#22c55e]"
                            : ""
                        }`}
                        style={{
                          backgroundColor: isCurrent 
                            ? undefined 
                            : isPast 
                              ? "var(--bg-primary)" 
                              : "var(--bg-secondary)",
                          borderColor:
                            !isCurrent && !isPast
                              ? "var(--border-color)"
                              : undefined,
                        }}
                      >
                        {/* Status Badge in top right corner */}
                        {isPast ? (
                          <div className="absolute -top-2 -right-2 bg-[#22c55e] border-2 border-white rounded-full w-5 h-5 flex items-center justify-center z-30 shadow-sm ring-2 ring-emerald-500/5">
                            <CheckIcon className="text-white" size={10} strokeWidth={4} />
                          </div>
                        ) : !isCurrent ? (
                          <div className="absolute -top-2 -right-2 bg-slate-100 border-2 border-white rounded-full w-5 h-5 flex items-center justify-center z-30 shadow-sm">
                            <Lock className="text-slate-600" size={10} strokeWidth={2.5} />
                          </div>
                        ) : null}

                        {isCurrent ? (
                          <Star
                            className="text-white"
                            size={28}
                            fill="currentColor"
                          />
                        ) : (
                          getTierIcon(
                            tier.name, 
                            20, 
                            isPast ? "text-[#22c55e]" : "text-black dark:text-zinc-400 opacity-40"
                          )
                        )}
                      </div>
                    </div>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest`}
                      style={{
                        color: isCurrent ? "#22c55e" : "var(--text-muted)",
                      }}
                    >
                      {tier.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row items-center justify-between p-6 rounded-sm border border-dashed mt-8"
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.03)",
              borderColor: "rgba(34, 197, 94, 0.2)",
            }}
          >
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div
                className="p-3 rounded-sm border"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "rgba(34, 197, 94, 0.2)",
                }}
              >
                <Zap className="text-[#22c55e]" size={20} />
              </div>
              <div className="text-start">
                <p
                  className="text-xs font-black uppercase tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  Current Status: {userStats.currentTier}
                </p>
                <p
                  className="text-[11px] font-semibold italic leading-none mt-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Only {userStats.pointsToNextTier.toLocaleString()} points away
                  from unlocking Carbon Titan grants!
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("benefits")}
              className="px-8 py-3 bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-widest rounded-sm hover:bg-[#1da850] transition-all flex items-center gap-2.5 active:scale-95"
            >
              View Benefits <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* Vertical Quarterly Challenge Card */}
        <div
          className="lg:col-span-1 border rounded-sm flex flex-col items-center justify-between relative overflow-hidden text-center"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl -mr-16 -mt-16 opacity-[0.05]" />

          <div className="relative z-10 w-full space-y-1 pt-8 md:pt-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#22c55e]">
              Grand Draw
            </p>
            <h3
              className="text-2xl font-black tracking-tight uppercase leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              Q1 2025
            </h3>
          </div>

          <div
            className="relative z-10 py-8 border-y w-full"
            style={{ borderColor: "var(--border-color)" }}
          >
            <p
              className="text-4xl font-black tabular-nums tracking-tighter"
              style={{ color: "var(--text-primary)" }}
            >
              {storePrizes.find(p => p.label.includes("GRANT"))?.label.split("WIN")[0] || "₹2,50,000"}
            </p>
            <p
              className="text-[10px] font-black uppercase mt-2 tracking-[0.3em]"
              style={{ color: "var(--text-muted)" }}
            >
              {storePrizes.find(p => p.label.includes("GRANT"))?.label || "Special Grant"}
            </p>
          </div>

          <div className="p-8 md:p-10 w-full">
            <button
              onClick={() => setIsSpinModalOpen(true)}
              className="relative z-10 w-full py-4 bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#1da850] transition-all active:scale-95 shadow-lg shadow-emerald-500/10 text-center flex justify-center"
            >
              Enter Draw
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Grant Distribution Center */}
        <section className="space-y-12">
          <div className="space-y-2 text-left">
            <h3
              className="text-3xl md:text-5xl font-black tracking-tighter uppercase"
              style={{ color: "var(--text-primary)" }}
            >
              Redeem Your Points
            </h3>
            <p className="text-[11px] font-black text-[#22c55e] uppercase tracking-[0.5em]">
              Use your points to get money for your NGO
            </p>
          </div>

          {/* Available Grants Section */}
          <div className="space-y-6">
            <div className="space-y-1 text-left">
              <h4
                className="text-[11px] font-black uppercase tracking-[0.3em] leading-none"
                style={{ color: "var(--text-muted)" }}
              >
                Quick Money
              </h4>
              <p className="text-[10px] font-black text-[#22c55e] uppercase tracking-widest">
                Small funds for your daily work
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.grants.map((g) => (
                <div
                  key={g.id}
                  className="border p-6 flex items-center justify-between group hover:border-[#22c55e]/30 transition-all rounded-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="text-start">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-2xl font-black tabular-nums leading-none"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {g.amount}
                      </span>
                      <span
                        className="text-[9px] font-black uppercase px-2 py-0.5 rounded-sm border"
                        style={{
                          backgroundColor: "rgba(34, 197, 94, 0.08)",
                          borderColor: "rgba(34, 197, 94, 0.2)",
                          color: "#22c55e",
                        }}
                      >
                        Grant
                      </span>
                    </div>
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {g.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span
                      className="text-[10px] font-black mb-1 uppercase tabular-nums"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {g.points.toLocaleString()} PTS
                    </span>
                    {pendingClaims.includes(g.id) ? (
                      <div
                        className="px-4 py-2 text-[8px] font-black uppercase tracking-wider rounded-sm border cursor-default flex items-center gap-1.5 translate-y-[-2px]"
                        style={{
                          backgroundColor: "rgba(34, 197, 94, 0.08)",
                          borderColor: "rgba(34, 197, 94, 0.2)",
                          color: "#22c55e",
                        }}
                      >
                        <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" />
                        In Review
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaim(g)}
                        className="px-6 py-2 bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-widest rounded-sm group-hover:bg-[#1da850] transition-all"
                      >
                        CLAIM
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mega Grants Section */}
          <div className="space-y-6">
            <div className="space-y-1 text-left">
              <h4
                className="text-[11px] font-black uppercase tracking-[0.3em] leading-none"
                style={{ color: "var(--text-muted)" }}
              >
                Big Funds
              </h4>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                Large grants to help you grow
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.mega.map((m) => (
                <div
                  key={m.id}
                  className={`p-6 border rounded-sm flex items-center justify-between group hover:border-[#22c55e]/30 transition-all ${
                    !m.available ? "opacity-60 grayscale" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="text-start">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-xl font-black uppercase tracking-tight leading-none"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {m.amount || m.name}
                      </span>
                      {m.available && (
                        <span className="text-[8px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
                          Premium
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {m.name === m.amount ? "High Impact Fund" : m.name}
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <span
                      className="text-[10px] font-black mb-1 uppercase tabular-nums"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {m.points.toLocaleString()} PTS
                    </span>
                    {m.available ? (
                      pendingClaims.includes(m.id) ? (
                        <div
                          className="px-4 py-2 text-[8px] font-black uppercase tracking-wider rounded-sm border cursor-default flex items-center gap-1.5 translate-y-[-2px]"
                          style={{
                            backgroundColor: "rgba(34, 197, 94, 0.08)",
                            borderColor: "rgba(34, 197, 94, 0.2)",
                            color: "#22c55e",
                          }}
                        >
                          <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" />
                          In Review
                        </div>
                      ) : (
                        <button
                          onClick={() => handleClaim(m)}
                          className="px-6 py-2 bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-widest rounded-sm group-hover:bg-[#1da850] transition-all"
                        >
                          CLAIM
                        </button>
                      )
                    ) : (
                      <div
                        className="px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm border"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                          color: "var(--text-muted)",
                          opacity: 0.5,
                        }}
                      >
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Programs Section */}
          <div className="space-y-6">
            <div className="space-y-1 text-left">
              <h4
                className="text-[11px] font-black uppercase tracking-[0.3em] leading-none"
                style={{ color: "var(--text-muted)" }}
              >
                Aid & Tools
              </h4>
              <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">
                Technology and aid for people
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.social.map((s) => (
                <div
                  key={s.id}
                  className={`p-6 border rounded-sm flex items-center justify-between group hover:border-[#22c55e]/30 transition-all ${
                    !s.available ? "opacity-60 grayscale" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="text-start">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-xl font-black uppercase tracking-tight leading-none"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {s.name}
                      </span>
                      {s.available && (
                        <span className="text-[8px] font-black text-purple-600 uppercase bg-purple-50 px-2 py-0.5 rounded-sm border border-purple-200">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {s.desc}
                      </p>
                      {s.details && (
                        <Tooltip
                          content={
                            <div className="px-1 py-2 space-y-2">
                              {s.details.map((detail: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex flex-col gap-0.5"
                                >
                                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-500">
                                    {detail.group}
                                  </span>
                                  <span
                                    className="text-[10px] font-bold"
                                    style={{ color: "var(--text-primary)" }}
                                  >
                                    {detail.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          }
                          className="border rounded-sm"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            borderColor: "var(--border-color)",
                          }}
                          closeDelay={0}
                        >
                          <button
                            className="hover:text-[#22c55e] transition-colors"
                            style={{ color: "var(--text-muted)" }}
                          >
                            <Info size={12} strokeWidth={3} />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span
                      className="text-[10px] font-black mb-1 uppercase tabular-nums"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {s.points.toLocaleString()} PTS
                    </span>
                    {s.available ? (
                      pendingClaims.includes(s.id) ? (
                        <div
                          className="px-4 py-2 text-[8px] font-black uppercase tracking-wider rounded-sm border cursor-default flex items-center gap-1.5 translate-y-[-2px]"
                          style={{
                            backgroundColor: "rgba(34, 197, 94, 0.08)",
                            borderColor: "rgba(34, 197, 94, 0.2)",
                            color: "#22c55e",
                          }}
                        >
                          <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" />
                          In Review
                        </div>
                      ) : (
                        <button
                          onClick={() => handleClaim(s)}
                          className="px-6 py-2 bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-widest rounded-sm group-hover:bg-[#1da850] transition-all"
                        >
                          CLAIM
                        </button>
                      )
                    ) : (
                      <div
                        className="px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm border"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                          color: "var(--text-muted)",
                          opacity: 0.5,
                        }}
                      >
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Claim Drawer */}
      <ResuableDrawer
        isOpen={isClaimDrawerOpen}
        onClose={() =>
          !isSubmittingClaim && !showClaimSuccess && setIsClaimDrawerOpen(false)
        }
        title={
          selectedReward?.details
            ? "Application for Grant"
            : "Claim Your Reward"
        }
        subtitle={
          selectedReward?.details
            ? "Formal request for Aid & Tools"
            : "Select your bank details"
        }
        size="md"
      >
        <div className="flex flex-col h-full">
          {showClaimSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 px-6 text-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-700 shadow-xl shadow-emerald-500/10 border"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.08)",
                  borderColor: "rgba(34, 197, 94, 0.2)",
                }}
              >
                <CheckIcon className="text-[#22c55e]" size={48} />
              </div>
              <h3
                className="text-2xl font-black uppercase tracking-tight mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Request Sent!
              </h3>
              <p
                className="text-xs font-bold uppercase tracking-widest max-w-[280px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Your request is being checked by our team.
              </p>
              <div className="mt-10 flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-bounce" />
              </div>
              <p
                className="mt-4 text-[10px] font-black uppercase tracking-[0.3em]"
                style={{ color: "var(--text-muted)" }}
              >
                Usually takes 24-48 Hours
              </p>
            </div>
          ) : (
            <div className="flex-1 space-y-7 px-6 py-4">
              {/* Grant Summary Card - MINIMALIST THEME */}
              <div
                className="rounded-sm p-8 relative overflow-hidden shadow-sm border"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/[0.03] rounded-full blur-3xl -mr-24 -mt-24" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-[#22c55e]">
                      <Star size={16} fill="currentColor" />
                      <p className="text-[11px] font-black uppercase tracking-[0.3em]">
                        {selectedReward?.details
                          ? "Grant Highlights"
                          : "Reward Details"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="text-start">
                      <h4
                        className="text-3xl font-black tracking-tighter uppercase leading-none"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {selectedReward?.amount ||
                          selectedReward?.name ||
                          "GRANT"}
                      </h4>
                      <p
                        className="text-xs font-bold tracking-wide mt-2.5"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {selectedReward?.desc ||
                          selectedReward?.name ||
                          "Funding for your NGO missions"}
                      </p>
                    </div>

                    <div
                      className="flex items-center justify-between pt-8 border-t"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <div className="text-start">
                        <p
                          className="text-[10px] font-black uppercase tracking-widest mb-1.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          NGO Account
                        </p>
                        <p className="text-xs font-black text-[#22c55e] uppercase tracking-tight">
                          Primary Verified Entity
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-[10px] font-black uppercase tracking-widest mb-1.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Reward Cost
                        </p>
                        <p className="text-3xl font-black text-[#22c55e] tabular-nums leading-none flex items-baseline gap-1">
                          {selectedReward?.points?.toLocaleString()}
                          <span className="text-[11px] uppercase font-black opacity-60">
                            Pts
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedReward?.details ? (
                /* AID & TOOLS UI - Simple Steps */
                <div
                  className="py-6 border-y space-y-5"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <p
                    className="text-[10px] font-black uppercase tracking-widest text-start px-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Simple Steps
                  </p>

                  <div className="relative pl-7 space-y-8">
                    <div
                      className="absolute left-[7px] top-1.5 bottom-1.5 w-[2px]"
                      style={{ backgroundColor: "var(--border-color)" }}
                    />

                    <div className="relative">
                      <div
                        className="absolute -left-[1.95rem] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[3px] shadow-sm"
                        style={{
                          backgroundColor: "#22c55e",
                          borderColor: "var(--bg-primary)",
                        }}
                      />
                      <div className="text-start">
                        <p
                          className="text-xs font-black uppercase tracking-tight"
                          style={{ color: "var(--text-primary)" }}
                        >
                          1. Apply Now
                        </p>
                        <p
                          className="text-[11px] font-bold uppercase tracking-tighter"
                          style={{ color: "var(--text-muted)" }}
                        >
                          We deduct your points immediately
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <div
                        className="absolute -left-[1.95rem] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[3px] shadow-sm animate-pulse"
                        style={{
                          backgroundColor: "#f59e0b",
                          borderColor: "var(--bg-primary)",
                        }}
                      />
                      <div className="text-start">
                        <p
                          className="text-xs font-black uppercase tracking-tight"
                          style={{ color: "var(--text-primary)" }}
                        >
                          2. Admin Approval
                        </p>
                        <p
                          className="text-[11px] font-bold uppercase tracking-tighter"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Verification usually takes 24 hours
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <div
                        className="absolute -left-[1.95rem] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[3px] shadow-sm"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--bg-primary)",
                        }}
                      />
                      <div className="text-start opacity-70">
                        <p
                          className="text-xs font-black uppercase tracking-tight"
                          style={{ color: "var(--text-primary)" }}
                        >
                          3. Receive Aid
                        </p>
                        <p
                          className="text-[11px] font-bold uppercase tracking-tighter"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Our team will contact you for delivery
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* CASH PRIZE UI - Bank Selection */
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Select Payment Method
                    </p>
                    <span
                      className="text-[8px] font-black border px-2 py-0.5 rounded-full uppercase tracking-tighter"
                      style={{
                        color: "#22c55e",
                        borderColor: "rgba(34, 197, 94, 0.2)",
                        backgroundColor: "rgba(34, 197, 94, 0.05)",
                      }}
                    >
                      VERIFIED SECURE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-start">
                    <div
                      onClick={() => setSelectedPayout("bank")}
                      className={`flex items-center gap-4 p-5 border transition-all cursor-pointer rounded-sm ${
                        selectedPayout === "bank"
                          ? "shadow-sm"
                          : "grayscale opacity-70"
                      }`}
                      style={{
                        backgroundColor:
                          selectedPayout === "bank"
                            ? "rgba(34, 197, 94, 0.05)"
                            : "var(--bg-primary)",
                        borderColor:
                          selectedPayout === "bank"
                            ? "rgba(34, 197, 94, 0.3)"
                            : "var(--border-color)",
                      }}
                    >
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-sm shrink-0 transition-all ${selectedPayout === "bank" ? "bg-[#22c55e] text-white" : "border"}`}
                        style={{
                          backgroundColor:
                            selectedPayout === "bank"
                              ? undefined
                              : "var(--bg-secondary)",
                          borderColor:
                            selectedPayout === "bank"
                              ? undefined
                              : "var(--border-color)",
                          color:
                            selectedPayout === "bank"
                              ? undefined
                              : "var(--text-muted)",
                        }}
                      >
                        <Building2 size={24} />
                      </div>
                      <div className="flex-1 text-start">
                        <p
                          className="text-xs font-black uppercase"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {primaryBank.bankName}
                        </p>
                        <p
                          className="text-[11px] font-bold uppercase tracking-[0.2em] mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {primaryBank.accountNumber}
                        </p>
                      </div>
                      {selectedPayout === "bank" && (
                        <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center">
                          <CheckIcon
                            size={12}
                            className="text-white"
                            strokeWidth={4}
                          />
                        </div>
                      )}
                    </div>

                    <div
                      onClick={() => setSelectedPayout("upi")}
                      className={`flex items-center gap-4 p-5 border transition-all cursor-pointer rounded-sm ${
                        selectedPayout === "upi"
                          ? "shadow-sm"
                          : "grayscale opacity-70"
                      }`}
                      style={{
                        backgroundColor:
                          selectedPayout === "upi"
                            ? "rgba(34, 197, 94, 0.05)"
                            : "var(--bg-primary)",
                        borderColor:
                          selectedPayout === "upi"
                            ? "rgba(34, 197, 94, 0.3)"
                            : "var(--border-color)",
                      }}
                    >
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-sm shrink-0 transition-all ${selectedPayout === "upi" ? "bg-[#22c55e] text-white" : "border"}`}
                        style={{
                          backgroundColor:
                            selectedPayout === "upi"
                              ? undefined
                              : "var(--bg-secondary)",
                          borderColor:
                            selectedPayout === "upi"
                              ? undefined
                              : "var(--border-color)",
                          color:
                            selectedPayout === "upi"
                              ? undefined
                              : "var(--text-muted)",
                        }}
                      >
                        <QrCode size={24} />
                      </div>
                      <div className="flex-1 text-start">
                        <p
                          className="text-xs font-black uppercase"
                          style={{ color: "var(--text-primary)" }}
                        >
                          CHARITY SMART VPA
                        </p>
                        <p
                          className="text-[11px] font-bold uppercase tracking-[0.2em] mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {primaryUpi.vpa}
                        </p>
                      </div>
                      {selectedPayout === "upi" && (
                        <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center">
                          <CheckIcon
                            size={12}
                            className="text-white"
                            strokeWidth={4}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4">
                <div
                  className="rounded-sm border p-5 mb-8"
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.03)",
                    borderColor: "rgba(34, 197, 94, 0.1)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Info
                      size={14}
                      className="text-[#22c55e] mt-0.5 shrink-0"
                    />
                    <p
                      className="text-xs font-bold leading-relaxed text-start uppercase tracking-tight"
                      style={{ color: "#22c55e" }}
                    >
                      <span className="font-black">Safe Process:</span>{" "}
                      {selectedReward?.details
                        ? "Our team will reach out for logistics after admin approval."
                        : "Your money is sent automatically after the admin check is done."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={confirmClaim}
                  disabled={isSubmittingClaim}
                  className="w-full py-6 bg-[#22c55e] text-white text-[13px] font-black uppercase tracking-[0.25em] rounded-sm hover:translate-y-[-2px] hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:grayscale disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/10"
                >
                  {isSubmittingClaim ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      SENDING...
                    </>
                  ) : (
                    "Claim Grant Now"
                  )}
                </button>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Lock
                    size={12}
                    style={{ color: "var(--text-muted)", opacity: 0.3 }}
                  />
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    SECURE SYSTEM
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ResuableDrawer>
    </div>
  );
};

export default NGORewards;
