import React, { useState, useMemo } from "react";
import {
  Star,
  CheckCircle,
  Lock,
  ChevronRight,
  Zap,
  Check as CheckIcon,
  Building2,
  QrCode,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal, ModalContent, ModalBody } from "@heroui/react";
import ResuableButton from "../../../../global/components/resuable-components/button";
import ResuableDrawer from "../../../../global/components/resuable-components/drawer";
import ResuableDatePicker from "../../../../global/components/resuable-components/datepicker";
import ResuableInput from "../../../../global/components/resuable-components/input";
import ResuableTextarea from "../../../../global/components/resuable-components/textarea";
import { useVolunteerRewards } from "../hooks/useVolunteerRewards";

// --- TYPES ---
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

// --- PRIZE MODAL ---
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
        backdrop: "bg-black/60 backdrop-blur-xl",
        base: "border-[1px]",
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
              className={`text-4xl font-black mb-3 tracking-tighter uppercase ${prize.label === "GRAND PRIZE" ? "text-[#22c55e]" : ""}`}
              style={{
                color:
                  prize.label === "GRAND PRIZE" ? "" : "var(--text-primary)",
              }}
            >
              {prize.label}
            </h3>
            <p
              className="font-medium px-4 leading-relaxed italic"
              style={{ color: "var(--text-secondary)" }}
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

// --- WHEEL COMPONENT ---
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
      ></div>
      <div
        className="absolute inset-[-12px] md:inset-[-16px] rounded-full border-[2px] z-11 pointer-events-none opacity-20"
        style={{ borderColor: "var(--text-primary)" }}
      ></div>

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

            const isJackpot = prize.label === "GRAND PRIZE";

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
                        style={{
                          fontFamily: "Segoe UI Emoji, Apple Color Emoji",
                        }}
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
          <path d="M30 54L52 12H8L30 54Z" fill="var(--bg-secondary)" />
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


// --- MAIN VOLUNTEER REWARDS ---
const VolunteerRewards = () => {
  const navigate = useNavigate();
  const {
    currentPoints,
    prizes,
    rewards: storeRewards,
    isLoading,
  } = useVolunteerRewards();

  const userStats = {
    totalPoints: currentPoints || 0,
    currentTier: "Platinum",
    nextTier: "Diamond",
    pointsToNextTier: 2500,
    totalDeliveries: 156,
    treesPlanted: 12,
  };

  // --- Spin Logic ---
  const [isSpinModalOpen, setIsSpinModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);

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
      setWonPrize(prizes[targetIndex]);
      setIsPrizeModalOpen(true);
    }, 5000);
  };

  const prizeReaction = useMemo(() => {
    if (!wonPrize) return "";
    if (wonPrize.label === "GRAND PRIZE")
      return "Wow! You just won the Grand Prize!";
    return `Great! You won ${wonPrize.label}!`;
  }, [wonPrize]);

  // --- Claim Logic ---
  const [isClaimDrawerOpen, setIsClaimDrawerOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);
  const [pendingClaims, setPendingClaims] = useState<number[]>([]);
  const [selectedPayout, setSelectedPayout] = useState<"bank" | "upi">("bank");
  const [claimDate, setClaimDate] = useState<string | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    mobile: "",
    email: "",
    cityState: "",
    address: "",
  });

  const rewards = {
    cash: storeRewards.grants,
    tours: storeRewards.mega,
    youth: storeRewards.social,
  };


  const primaryBank = {
    bankName: "HDFC BANK",
    accountNumber: "**** 1234",
    isPrimary: true,
  };

  const primaryUpi = {
    vpa: "volunteer@okaxis",
    isPrimary: true,
  };

  const handleClaim = (reward: any) => {
    if (pendingClaims.includes(reward.id)) return;
    setSelectedReward(reward);
    // Reset forms
    setClaimDate(null);
    setDeliveryInfo({
      fullName: "",
      mobile: "",
      email: "",
      cityState: "",
      address: "",
    });
    setIsClaimDrawerOpen(true);
  };

  const confirmClaim = () => {
    setIsSubmittingClaim(true);
    setTimeout(() => {
      setIsSubmittingClaim(false);
      setShowClaimSuccess(true);
      setPendingClaims([...pendingClaims, selectedReward.id]);

      setTimeout(() => {
        setIsClaimDrawerOpen(false);
        setShowClaimSuccess(false);
        setSelectedReward(null);
        setClaimDate(null);
        setDeliveryInfo({
          fullName: "",
          mobile: "",
          email: "",
          cityState: "",
          address: "",
        });
      }, 3000);
    }, 2000);
  };

  const tiers = [
    { name: "Beginner", points: "0-500", color: "text-gray-400" },
    { name: "Bronze", points: "501-1,500", color: "text-amber-700" },
    { name: "Silver", points: "1,501-3,500", color: "text-slate-400" },
    { name: "Gold", points: "3,501-7,500", color: "text-yellow-600" },
    { name: "Platinum", points: "7,501-15,000", color: "text-teal-600" },
    { name: "Diamond", points: "15,001-30,000", color: "text-[#22c55e]" },
    { name: "Legend", points: "30,001+", color: "text-[#22c55e]" },
  ];

  const isFormValid = useMemo(() => {
    if (!selectedReward) return false;
    // Cash rewards only need reward selection
    if (selectedReward.amount) return true;

    // Travel rewards (Tours category)
    const isTravelReward = rewards.tours.some(
      (t) => t.id === selectedReward.id,
    );
    // Gift rewards (Youth/Gifts & Shop category)
    const isGiftReward = rewards.youth.some((y) => y.id === selectedReward.id);

    if (isTravelReward) {
      return (
        !!claimDate &&
        !!deliveryInfo.fullName &&
        !!deliveryInfo.mobile &&
        !!deliveryInfo.email
      );
    }

    if (isGiftReward) {
      return (
        !!deliveryInfo.fullName &&
        !!deliveryInfo.mobile &&
        !!deliveryInfo.email &&
        !!deliveryInfo.cityState &&
        !!deliveryInfo.address
      );
    }

    return true;
  }, [selectedReward, claimDate, deliveryInfo, rewards.tours, rewards.youth]);

  const getCurrentTierIndex = () =>
    tiers.findIndex((t) => t.name === userStats.currentTier);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

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
            "z-[110] bg-white/10 hover:bg-white/20 text-white rounded-sm m-4 right-4 left-auto",
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
                  Win prizes for your work
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
            My Rewards
          </h1>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#22c55e]">
            Spend your points here
          </p>
        </div>

        <div className="flex items-center gap-4">
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
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <Star className="text-[#22c55e]" size={22} fill="currentColor" />
            </div>
            <div className="text-start">
              <p
                className="text-[9px] font-black uppercase tracking-widest mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Reward Points
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-xl font-black tabular-nums leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  {userStats.totalPoints.toLocaleString()}
                </span>
                <span className="text-[9px] font-black text-[#22c55e] uppercase">
                  PTS
                </span>
              </div>
            </div>
          </div>

          {/* Payout Vault Card */}
          <div
            className="flex items-center gap-3.5 border p-4 rounded-sm text-left hover:border-[#22c55e]/30 transition-all cursor-pointer group"
            onClick={() => navigate("vault")}
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className="w-11 h-11 border flex items-center justify-center rounded-sm"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <Building2
                className="text-[#22c55e] group-hover:scale-110 transition-transform"
                size={22}
              />
            </div>
            <div className="text-start">
              <p
                className="text-[9px] font-black uppercase tracking-widest mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Payout Vault
              </p>
              <div className="flex items-center gap-1">
                <span
                  className="text-xs font-black uppercase leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  Manage Bank
                </span>
                <ChevronRight size={14} className="text-[#22c55e]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Progression & Draw Grid */}
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
              Your Progress
            </h2>
            <p
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Unlock new levels to get more
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

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 relative z-10">
              {tiers.map((tier, idx) => {
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
                          borderColor: !isCurrent && !isPast
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
                          <CheckCircle 
                            className={isPast ? "text-[#22c55e]" : "text-black dark:text-zinc-400 opacity-40"} 
                            size={20} 
                          />
                        )}
                      </div>
                    </div>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                        isCurrent ? "text-[#22c55e]" : ""
                      }`}
                      style={{ color: isCurrent ? "" : "var(--text-muted)" }}
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
                  Status: {userStats.currentTier}
                </p>
                <p
                  className="text-[11px] font-semibold italic leading-none mt-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Only {userStats.pointsToNextTier.toLocaleString()} points away
                  from {userStats.nextTier} perks!
                </p>
              </div>
            </div>
            <ResuableButton
              variant="primary"
              className="px-8 py-3 !rounded-sm text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 shadow-lg shadow-emerald-500/20"
              onClick={() => navigate("benefits")}
            >
              View Benefits <ChevronRight size={16} />
            </ResuableButton>
          </div>
        </section>

        {/* Vertical Draw Card */}
        <div
          className="lg:col-span-1 p-8 md:p-10 rounded-sm flex flex-col items-center justify-between relative overflow-hidden border text-center"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e]/5 rounded-full blur-3xl -mr-16 -mt-16" />

          <div className="relative z-10 w-full space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#22c55e]">
              Weekly Win
            </p>
            <h3
              className="text-2xl font-black tracking-tight uppercase leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              Prize Draw
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
              ₹50,000
            </p>
            <p
              className="text-[10px] font-black uppercase mt-2 tracking-[0.3em]"
              style={{ color: "var(--text-muted)" }}
            >
              Pool Prize
            </p>
          </div>

          <button
            onClick={() => setIsSpinModalOpen(true)}
            className="relative z-10 w-full py-4 bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#1da850] transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Enter Now
          </button>
        </div>
      </div>

      {/* Rewards Center */}
      <div className="grid grid-cols-1 gap-12 pt-4">
        <section className="space-y-12 text-left">
          <div className="space-y-2">
            <h3
              className="text-3xl md:text-5xl font-black tracking-tighter uppercase"
              style={{ color: "var(--text-primary)" }}
            >
              Rewards Shop
            </h3>
            <p className="text-[11px] font-black text-[#22c55e] uppercase tracking-[0.5em]">
              Use your points for items below
            </p>
          </div>

          {/* Cash Prizes */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h4
                className="text-[11px] font-black uppercase tracking-[0.3em] leading-none"
                style={{ color: "var(--text-muted)" }}
              >
                Cash Payouts
              </h4>
              <p className="text-[10px] font-black text-[#22c55e] uppercase tracking-widest">
                Money for your account
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.cash.map((c) => (
                <div
                  key={c.id}
                  className="border p-6 flex items-center justify-between group hover:border-[#22c55e]/30 transition-all rounded-sm shadow-sm"
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
                        {c.amount}
                      </span>
                      <span className="text-[9px] font-black text-[#22c55e] uppercase bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/20">
                        Cash
                      </span>
                    </div>
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {c.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span
                      className="text-[10px] font-black mb-1 uppercase tabular-nums"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {c.points.toLocaleString()} PTS
                    </span>
                    {pendingClaims.includes(c.id) ? (
                      <div className="px-4 py-2 bg-emerald-500/10 text-[#22c55e] text-[8px] font-black uppercase tracking-wider rounded-sm border border-emerald-500/10 cursor-default flex items-center gap-1.5 translate-y-[-2px]">
                        <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" />
                        In Vault
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaim(c)}
                        className="px-6 py-2 bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-widest rounded-sm group-hover:bg-[#1da850] transition-all"
                      >
                        REDEEM
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Rewards */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h4
                className="text-[11px] font-black uppercase tracking-[0.3em] leading-none"
                style={{ color: "var(--text-muted)" }}
              >
                Travel Rewards
              </h4>
              <p className="text-[10px] font-black text-[#22c55e] uppercase tracking-widest">
                Trips and getaways
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.tours.map((t) => (
                <div
                  key={t.id}
                  className={`border p-6 flex items-center justify-between group hover:border-[#22c55e]/30 transition-all rounded-sm ${
                    !t.available ? "opacity-60 grayscale" : "shadow-sm"
                  }`}
                  style={{
                    backgroundColor: t.available
                      ? "var(--bg-primary)"
                      : "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="text-start">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-xl font-black uppercase tracking-tight leading-none"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {t.name}
                      </span>
                      <span className="text-[9px] font-black text-[#22c55e] uppercase bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/20">
                        Trip
                      </span>
                    </div>
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t.desc}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span
                      className="text-[10px] font-black mb-1 uppercase tabular-nums"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {t.points.toLocaleString()} PTS
                    </span>
                    {t.available && (
                      <button
                        onClick={() => handleClaim(t)}
                        className="px-6 py-2 bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-[#1da850] transition-all"
                      >
                        REDEEM
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gifts & Shop */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h4
                className="text-[11px] font-black uppercase tracking-[0.3em] leading-none"
                style={{ color: "var(--text-muted)" }}
              >
                Gifts & Shop
              </h4>
              <p className="text-[10px] font-black text-[#22c55e] uppercase tracking-widest">
                Tech and items
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.youth.map((y) => (
                <div
                  key={y.id}
                  className={`border p-6 flex items-center justify-between group hover:border-[#22c55e]/30 transition-all rounded-sm ${
                    !y.available ? "opacity-60 grayscale" : "shadow-sm"
                  }`}
                  style={{
                    backgroundColor: y.available
                      ? "var(--bg-primary)"
                      : "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="text-start">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-xl font-black uppercase tracking-tight leading-none"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {y.name}
                      </span>
                      <span className="text-[9px] font-black text-[#22c55e] uppercase bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/20">
                        Item
                      </span>
                    </div>
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {y.desc}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span
                      className="text-[10px] font-black mb-1 uppercase tabular-nums"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {y.points.toLocaleString()} PTS
                    </span>
                    {y.available && (
                      <button
                        onClick={() => handleClaim(y)}
                        className="px-6 py-2 bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-[#1da850] transition-all"
                      >
                        REDEEM
                      </button>
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
        onClose={() => setIsClaimDrawerOpen(false)}
        title="Confirm Redeem"
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-8 space-y-8 flex-1 overflow-y-auto thin-scrollbar">
            {selectedReward && (
              <div
                className="p-6 rounded-sm border text-center"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.05)",
                  borderColor: "rgba(34, 197, 94, 0.1)",
                }}
              >
                <p className="text-[10px] font-black text-[#22c55e] uppercase tracking-[0.3em] mb-2">
                  Confirming Payout
                </p>
                <p
                  className="text-4xl font-black uppercase tracking-tighter mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {selectedReward.amount || selectedReward.name}
                </p>
                <p
                  className="text-[10px] font-black uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  {selectedReward.name}
                </p>
              </div>
            )}

            {selectedReward && selectedReward.amount && (
              <div className="space-y-4">
                <h4
                  className="text-[11px] font-black uppercase tracking-widest"
                  style={{ color: "var(--text-primary)" }}
                >
                  Payment Details
                </h4>

                <div
                  className={`p-4 border rounded-sm cursor-pointer transition-all ${selectedPayout === "bank" ? "border-[#22c55e] bg-emerald-500/5" : "hover:border-[#22c55e]/30"}`}
                  onClick={() => setSelectedPayout("bank")}
                  style={{
                    backgroundColor:
                      selectedPayout === "bank" ? "" : "var(--bg-secondary)",
                    borderColor:
                      selectedPayout === "bank"
                        ? "#22c55e"
                        : "var(--border-color)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-sm border ${selectedPayout === "bank" ? "bg-[#22c55e] text-white border-[#22c55e]" : ""}`}
                      style={{
                        backgroundColor:
                          selectedPayout === "bank" ? "" : "var(--bg-primary)",
                        borderColor:
                          selectedPayout === "bank"
                            ? ""
                            : "var(--border-color)",
                        color:
                          selectedPayout === "bank" ? "" : "var(--text-muted)",
                      }}
                    >
                      <Building2 size={20} />
                    </div>
                    <div className="text-start">
                      <p
                        className="text-xs font-black uppercase leading-none"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {primaryBank.bankName}
                      </p>
                      <p
                        className="text-[10px] font-bold mt-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {primaryBank.accountNumber}
                      </p>
                    </div>
                    {selectedPayout === "bank" && (
                      <CheckCircle
                        size={18}
                        className="text-[#22c55e] ml-auto"
                      />
                    )}
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-sm cursor-pointer transition-all ${selectedPayout === "upi" ? "border-[#22c55e] bg-emerald-500/5" : "hover:border-[#22c55e]/30"}`}
                  onClick={() => setSelectedPayout("upi")}
                  style={{
                    backgroundColor:
                      selectedPayout === "upi" ? "" : "var(--bg-secondary)",
                    borderColor:
                      selectedPayout === "upi"
                        ? "#22c55e"
                        : "var(--border-color)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-sm border ${selectedPayout === "upi" ? "bg-[#22c55e] text-white border-[#22c55e]" : ""}`}
                      style={{
                        backgroundColor:
                          selectedPayout === "upi" ? "" : "var(--bg-primary)",
                        borderColor:
                          selectedPayout === "upi" ? "" : "var(--border-color)",
                        color:
                          selectedPayout === "upi" ? "" : "var(--text-muted)",
                      }}
                    >
                      <QrCode size={20} />
                    </div>
                    <div className="text-start">
                      <p
                        className="text-xs font-black uppercase leading-none"
                        style={{ color: "var(--text-primary)" }}
                      >
                        UPI Payment
                      </p>
                      <p
                        className="text-[10px] font-bold mt-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {primaryUpi.vpa}
                      </p>
                    </div>
                    {selectedPayout === "upi" && (
                      <CheckCircle
                        size={18}
                        className="text-[#22c55e] ml-auto"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {selectedReward &&
              rewards.tours.some((t) => t.id === selectedReward.id) && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4
                      className="text-[11px] font-black uppercase tracking-widest"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Preferred Date
                    </h4>
                    <ResuableDatePicker
                      label="Select Travel Date"
                      value={claimDate}
                      onChange={(date) => setClaimDate(date)}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4
                      className="text-[11px] font-black uppercase tracking-widest"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <ResuableInput
                        label="Full Name"
                        placeholder="As per Passport/Aadhar"
                        value={deliveryInfo.fullName}
                        onChange={(val) =>
                          setDeliveryInfo({ ...deliveryInfo, fullName: val })
                        }
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <ResuableInput
                          label="Mobile"
                          placeholder="Contact No."
                          value={deliveryInfo.mobile}
                          onChange={(val) =>
                            setDeliveryInfo({ ...deliveryInfo, mobile: val })
                          }
                        />
                        <ResuableInput
                          label="Email"
                          placeholder="For Tickets"
                          type="email"
                          value={deliveryInfo.email}
                          onChange={(val) =>
                            setDeliveryInfo({ ...deliveryInfo, email: val })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {selectedReward &&
              rewards.youth.some((y) => y.id === selectedReward.id) && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4
                      className="text-[11px] font-black uppercase tracking-widest"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Delivery Details
                    </h4>
                    <div className="space-y-3">
                      <ResuableInput
                        label="Recipient Name"
                        placeholder="Full Name"
                        value={deliveryInfo.fullName}
                        onChange={(val) =>
                          setDeliveryInfo({ ...deliveryInfo, fullName: val })
                        }
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <ResuableInput
                          label="Contact Mobile"
                          placeholder="Phone Number"
                          value={deliveryInfo.mobile}
                          onChange={(val) =>
                            setDeliveryInfo({ ...deliveryInfo, mobile: val })
                          }
                        />
                        <ResuableInput
                          label="Email ID"
                          placeholder="For Updates"
                          value={deliveryInfo.email}
                          onChange={(val) =>
                            setDeliveryInfo({ ...deliveryInfo, email: val })
                          }
                        />
                      </div>
                      <ResuableInput
                        label="City & State"
                        placeholder="e.g. Mumbai, Maharashtra"
                        value={deliveryInfo.cityState}
                        onChange={(val) =>
                          setDeliveryInfo({ ...deliveryInfo, cityState: val })
                        }
                      />
                      <ResuableTextarea
                        label="Detailed Address"
                        placeholder="House No, Street, Landmark, Pincode"
                        value={deliveryInfo.address}
                        onChange={(val) =>
                          setDeliveryInfo({ ...deliveryInfo, address: val })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

            <div
              className="p-4 rounded-sm border flex items-start gap-4"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <Info
                size={16}
                className="shrink-0 mt-0.5"
                style={{ color: "var(--text-muted)" }}
              />
              <p
                className="text-[10px] font-medium leading-relaxed italic"
                style={{ color: "var(--text-secondary)" }}
              >
                {selectedReward &&
                rewards.tours.some((t) => t.id === selectedReward.id)
                  ? "Our travel desk will contact you within 48 hours of redemption to confirm flight availability and hotel booking details."
                  : selectedReward &&
                      rewards.youth.some((y) => y.id === selectedReward.id)
                    ? "Physical goods are shipped within 3-5 business days. You will receive a tracking link on your registered email and mobile."
                    : "Redemptions are processed within 24-48 hours. You will receive a notification once the amount is credited to your selected vault."}
              </p>
            </div>
          </div>

          <div
            className="p-8 border-t"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            {showClaimSuccess ? (
              <div className="w-full py-4 bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-widest rounded-sm flex items-center justify-center gap-3">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Done!
              </div>
            ) : (
              <ResuableButton
                variant="primary"
                className="w-full py-4 !rounded-sm text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#22c55e]/20"
                onClick={confirmClaim}
                disabled={isSubmittingClaim || !isFormValid}
              >
                {isSubmittingClaim ? "Checking..." : "Redeem Now"}
              </ResuableButton>
            )}
          </div>
        </div>
      </ResuableDrawer>
    </div>
  );
};

export default VolunteerRewards;
