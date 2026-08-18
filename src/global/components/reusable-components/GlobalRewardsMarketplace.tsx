import React, { useState, useMemo } from "react";
import {
  Building2,
  QrCode,
  ChevronRight,
  Check as CheckIcon,
  Lock,
  Coins,
  Sparkles,
} from "lucide-react";
import ResuableDrawer from "./Drawer";
import ResuableDatePicker from "./DatePicker";
import ResuableInput from "./Input";
import ResuableTextarea from "./Textarea";

interface GlobalRewardsMarketplaceProps {
  role: "donor" | "ngo" | "volunteer";
  totalPoints: number;
  rewards: {
    cash: any[];
    tours: any[];
    youth: any[];
  };
  pendingClaims: (string | number)[];
  primaryBank?: {
    bankName: string;
    accountNumber: string;
    isPrimary?: boolean;
  };
  primaryUpi?: {
    vpa: string;
    isPrimary?: boolean;
  };
  onConfirmClaim: (reward: any, claimDetails: any) => Promise<void>;
}

export const GlobalRewardsMarketplace: React.FC<GlobalRewardsMarketplaceProps> = ({
  role,
  totalPoints,
  rewards,
  pendingClaims,
  primaryBank = { bankName: "HDFC BANK", accountNumber: "**** 4590", isPrimary: true },
  primaryUpi = { vpa: "user@okaxis", isPrimary: true },
  onConfirmClaim,
}) => {
  // Claim Logic States
  const [isClaimDrawerOpen, setIsClaimDrawerOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);

  const [selectedPayout, setSelectedPayout] = useState<"bank" | "upi">("bank");
  const [claimDate, setClaimDate] = useState<string | null>(null);

  // Delivery Form State
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    mobile: "",
    email: "",
    cityState: "",
    address: "",
  });

  const isTravelReward = useMemo(() => {
    if (!selectedReward) return false;
    return rewards.tours.some((t) => t.id === selectedReward.id);
  }, [selectedReward, rewards.tours]);

  const isFormValid = useMemo(() => {
    if (!selectedReward) return false;
    // Cash rewards only need reward selection
    if (selectedReward.amount) return true;

    const dateValid = isTravelReward ? !!claimDate : true;
    const contactValid =
      !!deliveryInfo.fullName && !!deliveryInfo.mobile && !!deliveryInfo.email;
    const addressValid = isTravelReward
      ? true
      : !!deliveryInfo.cityState && !!deliveryInfo.address;

    return dateValid && contactValid && addressValid;
  }, [selectedReward, claimDate, deliveryInfo, isTravelReward]);

  const handleClaim = (reward: any) => {
    if (pendingClaims.includes(reward.id)) return;
    setSelectedReward(reward);
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

  const confirmClaim = async () => {
    if (!selectedReward) return;
    setIsSubmittingClaim(true);
    try {
      let claimDetails: any = {};
      if (selectedReward.amount) {
        claimDetails = {
          payoutMethod: selectedPayout,
          ...(selectedPayout === "bank" ? { bankDetails: primaryBank } : { upiDetails: primaryUpi })
        };
      } else if (isTravelReward) {
        claimDetails = {
          preferredDate: claimDate,
          contactDetails: {
            fullName: deliveryInfo.fullName,
            primaryPhone: deliveryInfo.mobile,
            email: deliveryInfo.email,
          }
        };
      } else {
        claimDetails = {
          contactDetails: {
            fullName: deliveryInfo.fullName,
            primaryPhone: deliveryInfo.mobile,
            email: deliveryInfo.email,
          },
          deliveryAddress: {
            cityState: deliveryInfo.cityState,
            address: deliveryInfo.address,
          }
        };
      }

      await onConfirmClaim(selectedReward, claimDetails);
      
      setIsSubmittingClaim(false);
      setShowClaimSuccess(true);

      // Close drawer after showing success animation
      setTimeout(() => {
        setIsClaimDrawerOpen(false);
        setShowClaimSuccess(false);
        setSelectedReward(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to claim reward:", error);
      setIsSubmittingClaim(false);
    }
  };


  const categories = useMemo(() => {
    return {
      cash: {
        title: role === "ngo" ? "Grants & Payouts" : role === "volunteer" ? "Cash Payouts" : "Mega Cash Rewards",
        subtitle: role === "ngo" ? "Apply for direct financial assistance" : role === "volunteer" ? "Money for your account" : "Direct cash prizes for top contributors",
        tag: role === "ngo" ? "Grant" : "Cash",
      },
      tours: {
        title: role === "ngo" ? "Development Trips" : role === "volunteer" ? "Travel Rewards" : "Tours & Escapes",
        subtitle: role === "ngo" ? "Study tours and community exchange programs" : role === "volunteer" ? "Trips and getaways" : "Redeem for premium trips and getaways",
        tag: "Trip",
      },
      youth: {
        title: role === "ngo" ? "Technology Perks" : role === "volunteer" ? "Gifts & Shop" : "Youth & Tech",
        subtitle: role === "ngo" ? "Laptops, tablets, and infrastructure assets" : role === "volunteer" ? "Tech and items" : "High-value gadgets and technology gear",
        tag: "Item",
      },
    };
  }, [role]);

  return (
    <div className="grid grid-cols-1 gap-12">
      {/* Marketplace Header */}
      <section className="space-y-12 text-left">


        {/* Cash Category */}
        {rewards.cash.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h4
                className="text-[11px] font-black uppercase tracking-[0.3em] leading-none"
                style={{ color: "var(--text-muted)" }}
              >
                {categories.cash.title}
              </h4>
              <p className="text-[10px] font-black text-hf-green uppercase tracking-widest">
                {categories.cash.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.cash.map((c) => {
                const isLocked = totalPoints < c.points;
                const isAvailable = c.available !== false;
                const neededPoints = Math.max(0, c.points - totalPoints);
                const progressPercent = Math.min(100, Math.max(0, Math.round((totalPoints / c.points) * 100)));
                const isPending = pendingClaims.includes(c.id);

                return (
                  <div
                    key={c.id}
                    className={`group relative border rounded-sm p-6 transition-all duration-300 flex flex-col justify-between gap-5 overflow-hidden ${
                      !isAvailable
                        ? "opacity-60 grayscale"
                        : isLocked
                        ? "hover:border-amber-500/40 shadow-sm"
                        : "hover:border-hf-green/40 shadow-sm hover:-translate-y-0.5"
                    }`}
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    {/* Top Accent bar */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-[3px] transition-all ${
                        isPending
                          ? "bg-blue-500"
                          : !isLocked
                          ? "bg-hf-green"
                          : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    />

                    {/* Card Content Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 text-start">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className="text-2xl font-black tabular-nums tracking-tight leading-none"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {c.amount || c.name}
                          </span>
                          <span
                            className="text-[9px] font-black text-hf-green uppercase px-2 py-0.5 rounded-sm border"
                            style={{
                              backgroundColor: "rgba(34, 197, 94, 0.08)",
                              borderColor: "rgba(34, 197, 94, 0.2)",
                            }}
                          >
                            {categories.cash.tag}
                          </span>
                        </div>
                        {c.amount && c.name && (
                          <p
                            className="text-[10px] font-black uppercase tracking-widest opacity-80"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {c.name}
                          </p>
                        )}
                        {c.desc && (
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2">
                            {c.desc}
                          </p>
                        )}
                      </div>

                      {/* Points Required Badge */}
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-[10px] font-black tracking-wide shrink-0 shadow-sm"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <Coins size={12} className="text-amber-500" />
                        <span>{c.points.toLocaleString()} PTS</span>
                      </div>
                    </div>

                    {/* Footer Action / Points Needed Section */}
                    <div className="pt-3 border-t border-[var(--border-color)] flex flex-col gap-2.5">
                      {isPending ? (
                        <div
                          className="w-full py-2.5 px-4 rounded-sm text-[10px] font-black uppercase tracking-widest border cursor-default flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: "rgba(59, 130, 246, 0.08)",
                            borderColor: "rgba(59, 130, 246, 0.2)",
                            color: "#3b82f6",
                          }}
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                          Processing Claim
                        </div>
                      ) : !isLocked && isAvailable ? (
                        <button
                          onClick={() => handleClaim(c)}
                          className="w-full py-2.5 px-6 bg-hf-green hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all active:scale-95 shadow-md shadow-hf-green/10 flex items-center justify-center gap-2 group/btn"
                        >
                          <Sparkles size={12} className="group-hover/btn:rotate-12 transition-transform" />
                          <span>REDEEM NOW</span>
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-sm">
                              <Lock size={10} />
                              Need {neededPoints.toLocaleString()} more pts to unlock
                            </span>
                            <span className="text-[10px] font-black text-slate-400 tracking-wider">
                              {progressPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-sm overflow-hidden">
                            <div
                              className="bg-hf-green h-full rounded-sm transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Trips Category */}
        {rewards.tours.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h4
                className="text-[11px] font-black uppercase tracking-[0.3em] leading-none"
                style={{ color: "var(--text-muted)" }}
              >
                {categories.tours.title}
              </h4>
              <p className="text-[10px] font-black text-hf-green uppercase tracking-widest">
                {categories.tours.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.tours.map((t) => {
                const isLocked = totalPoints < t.points;
                const isAvailable = t.available !== false;
                const neededPoints = Math.max(0, t.points - totalPoints);
                const progressPercent = Math.min(100, Math.max(0, Math.round((totalPoints / t.points) * 100)));
                const isPending = pendingClaims.includes(t.id);

                return (
                  <div
                    key={t.id}
                    className={`group relative border rounded-sm p-6 transition-all duration-300 flex flex-col justify-between gap-5 overflow-hidden ${
                      !isAvailable
                        ? "opacity-60 grayscale"
                        : isLocked
                        ? "hover:border-amber-500/40 shadow-sm"
                        : "hover:border-hf-green/40 shadow-sm hover:-translate-y-0.5"
                    }`}
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-[3px] transition-all ${
                        isPending
                          ? "bg-blue-500"
                          : !isLocked
                          ? "bg-hf-green"
                          : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 text-start">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {t.name}
                          </span>
                          <span
                            className="text-[9px] font-black text-hf-green uppercase px-2 py-0.5 rounded-sm border"
                            style={{
                              backgroundColor: "rgba(34, 197, 94, 0.08)",
                              borderColor: "rgba(34, 197, 94, 0.2)",
                            }}
                          >
                            {categories.tours.tag}
                          </span>
                        </div>
                        {t.desc && (
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2">
                            {t.desc}
                          </p>
                        )}
                      </div>

                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-[10px] font-black tracking-wide shrink-0 shadow-sm"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <Coins size={12} className="text-amber-500" />
                        <span>{t.points.toLocaleString()} PTS</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-color)] flex flex-col gap-2.5">
                      {isPending ? (
                        <div
                          className="w-full py-2.5 px-4 rounded-sm text-[10px] font-black uppercase tracking-widest border cursor-default flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: "rgba(59, 130, 246, 0.08)",
                            borderColor: "rgba(59, 130, 246, 0.2)",
                            color: "#3b82f6",
                          }}
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                          Requested
                        </div>
                      ) : !isLocked && isAvailable ? (
                        <button
                          onClick={() => handleClaim(t)}
                          className="w-full py-2.5 px-6 bg-hf-green hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all active:scale-95 shadow-md shadow-hf-green/10 flex items-center justify-center gap-2 group/btn"
                        >
                          <Sparkles size={12} className="group-hover/btn:rotate-12 transition-transform" />
                          <span>REDEEM NOW</span>
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-sm">
                              <Lock size={10} />
                              Need {neededPoints.toLocaleString()} more pts to unlock
                            </span>
                            <span className="text-[10px] font-black text-slate-400 tracking-wider">
                              {progressPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-sm overflow-hidden">
                            <div
                              className="bg-hf-green h-full rounded-sm transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tech Category */}
        {rewards.youth.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h4
                className="text-[11px] font-black uppercase tracking-[0.3em] leading-none"
                style={{ color: "var(--text-muted)" }}
              >
                {categories.youth.title}
              </h4>
              <p className="text-[10px] font-black text-hf-green uppercase tracking-widest">
                {categories.youth.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.youth.map((y) => {
                const isLocked = totalPoints < y.points;
                const isAvailable = y.available !== false;
                const neededPoints = Math.max(0, y.points - totalPoints);
                const progressPercent = Math.min(100, Math.max(0, Math.round((totalPoints / y.points) * 100)));
                const isPending = pendingClaims.includes(y.id);

                return (
                  <div
                    key={y.id}
                    className={`group relative border rounded-sm p-6 transition-all duration-300 flex flex-col justify-between gap-5 overflow-hidden ${
                      !isAvailable
                        ? "opacity-60 grayscale"
                        : isLocked
                        ? "hover:border-amber-500/40 shadow-sm"
                        : "hover:border-hf-green/40 shadow-sm hover:-translate-y-0.5"
                    }`}
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-[3px] transition-all ${
                        isPending
                          ? "bg-blue-500"
                          : !isLocked
                          ? "bg-hf-green"
                          : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 text-start">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {y.name}
                          </span>
                          <span
                            className="text-[9px] font-black text-hf-green uppercase px-2 py-0.5 rounded-sm border"
                            style={{
                              backgroundColor: "rgba(34, 197, 94, 0.08)",
                              borderColor: "rgba(34, 197, 94, 0.2)",
                            }}
                          >
                            {categories.youth.tag}
                          </span>
                        </div>
                        {y.desc && (
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2">
                            {y.desc}
                          </p>
                        )}
                      </div>

                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-[10px] font-black tracking-wide shrink-0 shadow-sm"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <Coins size={12} className="text-amber-500" />
                        <span>{y.points.toLocaleString()} PTS</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-color)] flex flex-col gap-2.5">
                      {isPending ? (
                        <div
                          className="w-full py-2.5 px-4 rounded-sm text-[10px] font-black uppercase tracking-widest border cursor-default flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: "rgba(59, 130, 246, 0.08)",
                            borderColor: "rgba(59, 130, 246, 0.2)",
                            color: "#3b82f6",
                          }}
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                          Requested
                        </div>
                      ) : !isLocked && isAvailable ? (
                        <button
                          onClick={() => handleClaim(y)}
                          className="w-full py-2.5 px-6 bg-hf-green hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all active:scale-95 shadow-md shadow-hf-green/10 flex items-center justify-center gap-2 group/btn"
                        >
                          <Sparkles size={12} className="group-hover/btn:rotate-12 transition-transform" />
                          <span>REDEEM NOW</span>
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-sm">
                              <Lock size={10} />
                              Need {neededPoints.toLocaleString()} more pts to unlock
                            </span>
                            <span className="text-[10px] font-black text-slate-400 tracking-wider">
                              {progressPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-sm overflow-hidden">
                            <div
                              className="bg-hf-green h-full rounded-sm transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Claim drawer verification */}
      <ResuableDrawer
        isOpen={isClaimDrawerOpen}
        onClose={() => !isSubmittingClaim && !showClaimSuccess && setIsClaimDrawerOpen(false)}
        title="Confirm Redemption"
        subtitle="Verification before processing claim"
        size="md"
      >
        <div className="flex flex-col h-full overflow-hidden">
          {showClaimSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 px-6 text-center">
              <div
                className="w-20 h-20 border rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500 bg-green-500/8 border-green-500/20"
              >
                <CheckIcon className="text-green-500" size={40} />
              </div>
              <h3
                className="text-xl font-black uppercase tracking-tight mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Request Sent!
              </h3>
              <p
                className="text-[11px] font-bold uppercase tracking-widest max-w-[200px] leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                Waiting for admin response...
              </p>

              <div className="mt-8 flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" />
              </div>
            </div>
          ) : (
            <div className="flex-1 space-y-8 p-5 overflow-y-auto thin-scrollbar text-left">
              {/* Summary card */}
              {selectedReward && (
                <div
                  className="rounded-sm border relative overflow-hidden shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div
                    className="p-6 border-b border-dashed text-left"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <p
                      className="text-[8px] font-black uppercase tracking-[0.4em] mb-4 block"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Reward details
                    </p>
                    <h4
                      className="text-3xl font-black tracking-tighter uppercase leading-none"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedReward.amount || selectedReward.name}
                    </h4>
                    {selectedReward.amount && (
                      <p
                        className="text-[11px] font-bold tracking-[0.1em] mt-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {selectedReward.name}
                      </p>
                    )}
                  </div>

                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className="text-3xl font-black tabular-nums leading-none"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {selectedReward.points.toLocaleString()}
                        </span>
                        <span className="text-[9px] font-black text-green-500 uppercase tracking-wider">
                          PTS
                        </span>
                      </div>
                    </div>

                    <div className="bg-green-500/8 border border-green-500/20 px-3 py-1.5 rounded-sm">
                      <span className="text-[8px] font-black text-green-500 uppercase tracking-[0.2em] leading-none whitespace-nowrap">
                        Verified Reward
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Destination inputs for Cash */}
              {selectedReward?.amount ? (
                <div className="space-y-4">
                  <p
                    className="text-[8px] font-black uppercase tracking-widest px-1 text-[var(--text-secondary)]"
                  >
                    Payout Destinations
                  </p>

                  {/* Bank destination card */}
                  <div
                    onClick={() => setSelectedPayout("bank")}
                    className={`flex items-center gap-4 p-4 border rounded-sm transition-all cursor-pointer ${
                      selectedPayout === "bank"
                        ? "shadow-sm border-green-500/50 bg-green-500/5"
                        : "opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                    }`}
                    style={{
                      borderColor: selectedPayout === "bank" ? undefined : "var(--border-color)",
                    }}
                  >
                    <div
                      className="w-10 h-10 border flex items-center justify-center rounded-lg shrink-0 transition-all"
                      style={{
                        backgroundColor: selectedPayout === "bank" ? "rgba(34, 197, 94, 0.08)" : "var(--bg-secondary)",
                        borderColor: selectedPayout === "bank" ? "rgba(34, 197, 94, 0.2)" : "var(--border-color)",
                      }}
                    >
                      <Building2
                        className={selectedPayout === "bank" ? "text-green-500" : "text-slate-400"}
                        size={20}
                      />
                    </div>
                    <div className="flex-1 text-start">
                      <div className="flex items-center gap-2">
                        <p
                          className="text-[11px] font-black uppercase"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {primaryBank.bankName}
                        </p>
                        <span className="text-[8px] font-black bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">
                          PRIMARY
                        </span>
                      </div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {primaryBank.accountNumber}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedPayout === "bank" ? "border-green-500" : "border-slate-300"
                      }`}
                    >
                      {selectedPayout === "bank" && (
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                      )}
                    </div>
                  </div>

                  {/* UPI destination card */}
                  <div
                    onClick={() => setSelectedPayout("upi")}
                    className={`flex items-center gap-4 p-4 border rounded-sm transition-all cursor-pointer ${
                      selectedPayout === "upi"
                        ? "shadow-sm border-green-500/50 bg-green-500/5"
                        : "opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                    }`}
                    style={{
                      borderColor: selectedPayout === "upi" ? undefined : "var(--border-color)",
                    }}
                  >
                    <div
                      className="w-10 h-10 border flex items-center justify-center rounded-lg shrink-0 transition-all"
                      style={{
                        backgroundColor: selectedPayout === "upi" ? "rgba(34, 197, 94, 0.08)" : "var(--bg-secondary)",
                        borderColor: selectedPayout === "upi" ? "rgba(34, 197, 94, 0.2)" : "var(--border-color)",
                      }}
                    >
                      <QrCode
                        className={selectedPayout === "upi" ? "text-green-500" : "text-slate-400"}
                        size={20}
                      />
                    </div>
                    <div className="flex-1 text-start">
                      <div className="flex items-center gap-2">
                        <p
                          className="text-[11px] font-black uppercase"
                          style={{ color: "var(--text-primary)" }}
                        >
                          UPI/VPA
                        </p>
                        <span className="text-[8px] font-black bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">
                          PRIMARY
                        </span>
                      </div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                      >
                        {primaryUpi.vpa}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedPayout === "upi" ? "border-green-500" : "border-slate-300"
                      }`}
                    >
                      {selectedPayout === "upi" && (
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Trip Date selection */}
                  {isTravelReward && (
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-70">
                        Preferred Date
                      </label>
                      <ResuableDatePicker
                        value={claimDate}
                        onChange={(date: string) => setClaimDate(date)}
                      />
                    </div>
                  )}

                  {/* Delivery contact info */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-left" style={{ color: "var(--text-primary)" }}>
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <ResuableInput
                        label="FULL NAME"
                        placeholder="John Doe"
                        value={deliveryInfo.fullName}
                        onChange={(val) => setDeliveryInfo({ ...deliveryInfo, fullName: val })}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ResuableInput
                          label="MOBILE NUMBER"
                          placeholder="9876543210"
                          value={deliveryInfo.mobile}
                          onChange={(val) => setDeliveryInfo({ ...deliveryInfo, mobile: val })}
                        />
                        <ResuableInput
                          label="EMAIL ADDRESS"
                          placeholder="john@example.com"
                          value={deliveryInfo.email}
                          onChange={(val) => setDeliveryInfo({ ...deliveryInfo, email: val })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Physical shipping details */}
                  {!isTravelReward && (
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-left" style={{ color: "var(--text-primary)" }}>
                        Delivery Address
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        <ResuableInput
                          label="CITY & STATE"
                          placeholder="Chennai, Tamil Nadu"
                          value={deliveryInfo.cityState}
                          onChange={(val) => setDeliveryInfo({ ...deliveryInfo, cityState: val })}
                        />
                        <ResuableTextarea
                          label="STREET ADDRESS"
                          placeholder="Flat No, Street, Locality"
                          value={deliveryInfo.address}
                          onChange={(val) => setDeliveryInfo({ ...deliveryInfo, address: val })}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Drawer footer confirm button */}
              <div className="pt-4">
                <button
                  disabled={!isFormValid || isSubmittingClaim}
                  onClick={confirmClaim}
                  className="w-full py-4 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 hover:bg-green-600 shadow-md shadow-green-500/10 flex items-center justify-center gap-2"
                >
                  {isSubmittingClaim ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Payout"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </ResuableDrawer>
    </div>
  );
};

export default GlobalRewardsMarketplace;
