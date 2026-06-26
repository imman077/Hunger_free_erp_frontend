import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Shield,
  Zap,
  Star,
  Gift,
  Crown,
  Trophy,
  Building2,
  Award,
  Target,
  Flame,
  Rocket,
  Users,
  TrendingUp,
  Lock,
} from "lucide-react";
import PageHeader from "./PageHeader";

interface GlobalTiersOverviewProps {
  role: "donor" | "ngo" | "volunteer";
  totalPoints: number;
}

interface Tier {
  name: string;
  points: string;
  minPoints: number;
  maxPoints: number | null;
  bonus: number;
  color: string;
  icon: string;
  perks: string[];
  image?: string;
  textColor?: string;
}

const donorTiers: Tier[] = [
  { name: "Starter Donor", points: "0 - 499", minPoints: 0, maxPoints: 499, bonus: 0, color: "from-slate-400 to-slate-500", icon: "Sparkles", image: "/donor_tiers/begineer.png", textColor: "#00ab55", perks: ["Welcome Pack (Digital Assets)", "Community Forum Access", "Basic Daily Impact Tracking", "Standard Support Email"] },
  { name: "Bronze Donor", points: "500 - 2,499", minPoints: 500, maxPoints: 2499, bonus: 5, color: "from-amber-600 to-amber-700", icon: "Shield", image: "/donor_tiers/bronze.png", textColor: "#8a583c", perks: ["Bronze Verified Profile Badge", "5% Bonus Impact Points", "Monthly Lucky Draw Entry", "Community Member Status"] },
  { name: "Silver Donor", points: "2,500 - 7,499", minPoints: 2500, maxPoints: 7499, bonus: 10, color: "from-slate-300 to-slate-400", icon: "Zap", image: "/donor_tiers/silver.png", textColor: "#4f5e74", perks: ["Silver Verified Profile Badge", "10% Bonus Impact Points", "Priority Food Pickup Services", "Detailed Monthly Impact Reports"] },
  { name: "Gold Donor", points: "7,500 - 19,999", minPoints: 7500, maxPoints: 19999, bonus: 15, color: "from-yellow-400 to-yellow-500", icon: "Star", image: "/donor_tiers/gold.png", textColor: "#c59218", perks: ["Gold Verified Profile Badge", "15% Bonus Impact Points", "VIP NGO Event Invitations", "Direct Support Chat Access"] },
  { name: "Platinum Donor", points: "20,000 - 49,999", minPoints: 20000, maxPoints: 49999, bonus: 20, color: "from-cyan-400 to-cyan-500", icon: "Gift", image: "/donor_tiers/platinum.png", textColor: "#1a788b", perks: ["Platinum Verified Profile Badge", "20% Bonus Impact Points", "Exclusive Hunger-Free ERP Gear", "Dedicated Impact Manager"] },
  { name: "Diamond Donor", points: "50,000 - 99,999", minPoints: 50000, maxPoints: 99999, bonus: 25, color: "from-blue-500 to-indigo-600", icon: "Crown", image: "/donor_tiers/diamond.png", textColor: "#6f42c1", perks: ["Diamond Verified Profile Badge", "25% Bonus Impact Points", "Featured Donor on Home Wall", "Custom Impact Milestone Gifts"] },
  { name: "Legend Donor", points: "100,000+", minPoints: 100000, maxPoints: null, bonus: 40, color: "from-emerald-500 to-green-600", icon: "Trophy", image: "/donor_tiers/legend.png", textColor: "#198754", perks: ["Legend Verified Profile Badge", "40% Bonus Impact Points", "10 Trees Planted Monthly in your Name", "Lifetime Achievement Trophy", "Global All-Access Pass"] },
];

const ngoTiers: Tier[] = [
  { name: "Beginner", points: "0 - 1,000", minPoints: 0, maxPoints: 1000, bonus: 0, color: "from-slate-400 to-slate-500", icon: "Sparkles", perks: ["Apply for basic grants", "See your stats easily", "Chat with our team", "Track how much you help"] },
  { name: "Partner", points: "1,001 - 5,000", minPoints: 1001, maxPoints: 5000, bonus: 5, color: "from-emerald-500 to-emerald-600", icon: "Building2", perks: ["Verified 'Partner' badge", "Get 5% extra grant money", "We're here for you 24/7", "Your requests handled first"] },
  { name: "Elite", points: "5,001 - 15,000", minPoints: 5001, maxPoints: 15000, bonus: 15, color: "from-blue-500 to-blue-600", icon: "Shield", perks: ["Elite member status", "Get 15% extra grant money", "Show up on the app home", "Money for health camps"] },
  { name: "Master", points: "15,001 - 35,000", minPoints: 15001, maxPoints: 35000, bonus: 30, color: "from-purple-500 to-purple-600", icon: "Zap", perks: ["Official 'Master' license", "Get 30% extra grant money", "Apply for Mega Grants", "Your own support person"] },
  { name: "Legend", points: "35,001 - 75,000", minPoints: 35001, maxPoints: 75000, bonus: 50, color: "from-amber-500 to-amber-600", icon: "Award", perks: ["'Legend' member status", "Get 50% extra grant money", "Special tech grants", "Go to national summits"] },
  { name: "Titan", points: "75,001+", minPoints: 75001, maxPoints: null, bonus: 75, color: "from-red-500 to-red-600", icon: "Trophy", perks: ["Carbon Titan reward", "Get 75% extra grant money", "Join the Global Council", "Partner with big brands", "Special lifetime trophy"] },
];

const volunteerTiers: Tier[] = [
  { name: "Beginner", points: "0 - 500", minPoints: 0, maxPoints: 500, bonus: 0, color: "from-slate-400 to-slate-500", icon: "Sparkles", perks: ["Earn points for every task", "Digital ID card", "Community forum access", "Standard support"] },
  { name: "Bronze", points: "501 - 1,500", minPoints: 501, maxPoints: 1500, bonus: 5, color: "from-emerald-400 to-emerald-500", icon: "Target", perks: ["Verified Bronze badge", "5% extra points on tasks", "Early access to new tasks", "Community member status"] },
  { name: "Silver", points: "1,501 - 3,500", minPoints: 1501, maxPoints: 3500, bonus: 10, color: "from-slate-400 to-slate-500", icon: "Shield", perks: ["Verified Silver badge", "10% extra points on tasks", "Priority task assignments", "Monthly lucky draw entry"] },
  { name: "Gold", points: "3,501 - 7,500", minPoints: 3501, maxPoints: 7500, bonus: 15, color: "from-yellow-400 to-yellow-500", icon: "Zap", perks: ["Verified Gold badge", "15% extra points on tasks", "Unlock premium rewards shop", "Direct support chat access"] },
  { name: "Platinum", points: "7,501 - 15,000", minPoints: 7501, maxPoints: 15000, bonus: 20, color: "from-teal-400 to-teal-500", icon: "Flame", perks: ["Verified Platinum badge", "20% extra points on tasks", "Exclusive volunteer gear", "Featured volunteer spotlight"] },
  { name: "Diamond", points: "15,001 - 30,000", minPoints: 15001, maxPoints: 30000, bonus: 30, color: "from-blue-400 to-blue-500", icon: "Rocket", perks: ["Verified Diamond badge", "30% extra points on tasks", "Join the planning committee", "Custom milestone rewards"] },
  { name: "Legend", points: "30,001+", minPoints: 30001, maxPoints: null, bonus: 50, color: "from-amber-400 to-amber-500", icon: "Trophy", perks: ["Verified Legend badge", "50% extra points on tasks", "National summit invitations", "Lifetime achievement reward", "Global all-access pass"] },
];

const getIcon = (iconName: string, size = 32, colorClass = "") => {
  switch (iconName) {
    case "Sparkles": return <Sparkles size={size} className={colorClass} />;
    case "Shield": return <Shield size={size} className={colorClass} />;
    case "Zap": return <Zap size={size} className={colorClass} />;
    case "Star": return <Star size={size} className={colorClass} fill="currentColor" />;
    case "Gift": return <Gift size={size} className={colorClass} />;
    case "Crown": return <Crown size={size} className={colorClass} />;
    case "Trophy": return <Trophy size={size} className={colorClass} fill="currentColor" />;
    case "Building2": return <Building2 size={size} className={colorClass} />;
    case "Award": return <Award size={size} className={colorClass} />;
    case "Target": return <Target size={size} className={colorClass} />;
    case "Flame": return <Flame size={size} className={colorClass} />;
    case "Rocket": return <Rocket size={size} className={colorClass} />;
    case "Users": return <Users size={size} className={colorClass} />;
    case "TrendingUp": return <TrendingUp size={size} className={colorClass} />;
    default: return <Star size={size} className={colorClass} />;
  }
};

export const GlobalTiersOverview: React.FC<GlobalTiersOverviewProps> = ({
  role,
  totalPoints,
}) => {

  const pointsTiers = useMemo(() => {
    if (role === "ngo") return ngoTiers;
    if (role === "volunteer") return volunteerTiers;
    return donorTiers;
  }, [role]);

  const userStats = useMemo(() => {
    const currentTierObj = [...pointsTiers].reverse().find(t => totalPoints >= t.minPoints) || pointsTiers[0];
    const currentIndex = pointsTiers.findIndex(t => t.name === currentTierObj.name);
    const nextTierObj = pointsTiers[currentIndex + 1] || null;

    let pointsToNext = 0;
    if (nextTierObj) {
      pointsToNext = nextTierObj.minPoints - totalPoints;
    }

    return {
      currentTier: currentTierObj.name,
      nextTier: nextTierObj ? nextTierObj.name : "Max Tier",
      pointsToNextTier: pointsToNext > 0 ? pointsToNext : 0,
      currentIndex,
    };
  }, [pointsTiers, totalPoints]);

  const [previewTier, setPreviewTier] = useState<string>(
    pointsTiers[pointsTiers.length - 1]?.name || "Legend"
  );

  const previewTierObj = useMemo(() => {
    return pointsTiers.find((t) => t.name === previewTier) || pointsTiers[0];
  }, [pointsTiers, previewTier]);

  const calculatorItems = useMemo(() => {
    if (role === "ngo") {
      return [
        { label: "Donation Received", base: 100 },
        { label: "Person Helped", base: 50 },
        { label: "Weekly Update", base: 500 },
      ];
    }
    if (role === "volunteer") {
      return [
        { label: "Task Completed", base: 100 },
        { label: "Verified Photo", base: 50 },
        { label: "Weekly Streak", base: 500 },
      ];
    }
    return [
      { label: "First Donation", base: 300 },
      { label: "Per KG Food", base: 25 },
      { label: "Milestone Bonus", base: 600 },
    ];
  }, [role]);

  const calculatorTitle = role === "ngo" ? "Payout" : role === "volunteer" ? "Boost" : "Bonus";

  const previewDescription = useMemo(() => {
    if (previewTier === pointsTiers[0]?.name) {
      if (role === "ngo") return "Start helping people and earn points for every donation you receive.";
      if (role === "volunteer") return "Start your volunteer journey by completing tasks. Every action helps the community and earns you points.";
      return "Start your journey by making your first impact. Every contribution counts toward your ranking.";
    }
    return `Enjoy a permanent ${previewTierObj.bonus}% boost to all your impact activities as a ${previewTier} member.`;
  }, [previewTier, previewTierObj, pointsTiers, role]);

  return (
    <div
      className="p-6 md:p-10 min-h-screen space-y-10 max-w-[1600px] mx-auto text-left"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Header */}
      <div className="space-y-6">
        <div className="space-y-3">
          <PageHeader
            title="Loyalty Tiers & Benefits"
            subtitle="Track your progress and unlock exclusive perks"
            className="mb-8"
            showPointsCard={false}
          />
        </div>
      </div>

      {/* Progression Section */}
      <section
        className="border p-8 md:p-10 rounded-sm"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 bg-[#e6f7ed] rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-[#00ab55]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.65 10c.02.66-.08 1.3-.27 1.9a7 7 0 11-14.76 0A6.87 6.87 0 014.35 10 7 7 0 0112 3a7 7 0 017.65 7z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.21 13.89L7 21l5-1.5 5 1.5-1.21-7.11" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xl font-black uppercase tracking-tight text-[var(--text-primary)]">
              Loyalty Progression
            </h2>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-60">
              Track your rank and point multipliers
            </p>
          </div>
        </div>

        <div className="relative mb-6">
          {/* Background Line (Gray) */}
          <div
            className="absolute top-[48px] left-[7.14%] h-[3px] -translate-y-1/2 z-0 hidden lg:block bg-zinc-200"
            style={{ 
              width: pointsTiers.length > 1 
                ? `${(pointsTiers.length - 1) * (100 / pointsTiers.length)}%` 
                : "0%"
            }}
          />

          {/* Active Progress Line (Green) */}
          <div
            className="absolute top-[48px] left-[7.14%] h-[3px] -translate-y-1/2 z-0 hidden lg:block transition-all duration-700 ease-in-out bg-[#00ab55]"
            style={{
              width: pointsTiers.length > 1 
                ? `${userStats.currentIndex * (100 / pointsTiers.length)}%` 
                : "0%",
              boxShadow: "0 0 8px rgba(0, 171, 85, 0.4)"
            }}
          />

          {/* Lock Badges on Connecting Lines (Donor Only) */}
          {role === "donor" && pointsTiers.map((tier, idx) => {
            if (idx === 0) return null;
            // Only show lock if the destination tier idx is locked and is beyond the next immediate tier
            const isLockedSegment = idx > userStats.currentIndex + 1;
            if (!isLockedSegment) return null;

            const segmentMidpointPercent = (100 / pointsTiers.length) * (idx - 0.5) + 100 / (2 * pointsTiers.length);

            return (
              <div
                key={`lock-line-${idx}`}
                className="absolute top-[48px] -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full border border-slate-200 bg-white flex items-center justify-center z-10 shadow-sm"
                style={{ left: `${segmentMidpointPercent}%` }}
              >
                <Lock size={10} className="text-slate-400" />
              </div>
            );
          })}

          <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-${pointsTiers.length} gap-4 relative z-10`}>
            {pointsTiers.map((tier, idx) => {
              const isCurrent = tier.name === userStats.currentTier;
              const isPast = idx < userStats.currentIndex;
              const isFuture = idx > userStats.currentIndex;

              return (
                <div key={tier.name} className="flex flex-col items-center relative">
                  <div className="h-24 flex items-center justify-center mb-3 relative">
                    {isCurrent ? (
                      <div className="relative">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#00ab55] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-sm whitespace-nowrap z-30 shadow-md">
                          Current Tier
                          <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#00ab55] rotate-45" />
                        </div>
                        <div className="w-24 h-24 border border-[#00ab55] p-1 bg-white rounded-full flex items-center justify-center z-20 shadow-md">
                          {tier.image ? (
                            <img src={tier.image} alt={tier.name} className="w-full h-full object-contain rounded-full" />
                          ) : (
                            <div className="w-full h-full bg-[#00ab55] rounded-full flex items-center justify-center">
                              {getIcon(tier.icon, 28, "text-white")}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : isPast ? (
                      <div className="relative w-20 h-20 border border-[#00ab55] bg-white rounded-full flex items-center justify-center z-20 shadow-sm p-1">
                        {tier.image ? (
                          <img src={tier.image} alt={tier.name} className="w-full h-full object-contain rounded-full" />
                        ) : (
                          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                            {getIcon(tier.icon, 24, "text-[#00ab55]")}
                          </div>
                        )}
                        <div className="absolute -top-1 -right-1 bg-[#00ab55] border border-white rounded-full w-5 h-5 flex items-center justify-center z-30 shadow-sm">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="w-20 h-20 border border-slate-200 bg-slate-50 rounded-full flex items-center justify-center z-20 opacity-60 p-1">
                        {tier.image ? (
                          <img src={tier.image} alt={tier.name} className="w-full h-full object-contain rounded-full" />
                        ) : (
                          <div className="w-full h-full rounded-full flex items-center justify-center">
                            <Lock className="text-slate-400" size={20} strokeWidth={2} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p
                    className="text-[10px] font-black uppercase tracking-widest mt-1 text-center"
                    style={{ color: tier.textColor || (isFuture ? "var(--text-muted)" : "#00ab55") }}
                  >
                    {tier.name}
                  </p>
                  
                  {role === "donor" ? (
                    <p 
                      className="text-[8px] font-bold mt-0.5 text-center leading-normal"
                      style={{ color: isFuture ? "var(--text-muted)" : "var(--text-secondary)" }}
                    >
                      {tier.maxPoints === null || tier.maxPoints === undefined
                        ? `${tier.minPoints.toLocaleString()}+ kg`
                        : `${tier.minPoints.toLocaleString()} - ${tier.maxPoints.toLocaleString()} kg`}
                      <br />
                      donated
                    </p>
                  ) : (
                    <p 
                      className="text-[8px] font-bold mt-0.5 text-center"
                      style={{ color: isFuture ? "var(--text-muted)" : "var(--text-secondary)" }}
                    >
                      {tier.maxPoints === null || tier.maxPoints === undefined
                        ? `${tier.minPoints.toLocaleString()}+`
                        : `${tier.minPoints.toLocaleString()} - ${tier.maxPoints.toLocaleString()}`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 rounded-2xl border border-dashed mt-8 gap-4 bg-[#f9fefb] border-[#b6eed0]">
          <div className="flex items-center gap-4">
            <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm shrink-0 flex items-center justify-center">
              <Sparkles className="text-[#00ab55]" size={20} />
            </div>
            <div className="text-start space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                STATUS: <span className="text-[#00ab55] font-black">{userStats.currentTier}</span>
              </p>
              {userStats.pointsToNextTier > 0 ? (
                <p className="text-[11px] font-semibold leading-none text-slate-400">
                  {userStats.pointsToNextTier.toLocaleString()} points left to{" "}
                  <span className="font-black text-[#00ab55]">{userStats.nextTier}</span>
                </p>
              ) : (
                <p className="text-[11px] font-black leading-none text-[#00ab55]">
                  You have achieved the highest tier!
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Points System Info Section */}
      <div
        className="border rounded-sm p-8 flex flex-col lg:flex-row items-center justify-between gap-10"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="space-y-3 max-w-md w-full text-left">
          <h2
            className="text-2xl font-black uppercase tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {previewTier} Tier
          </h2>
          <p
            className="text-sm font-medium leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {previewDescription}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {calculatorItems.map((item, idx) => {
            const bonusPercent = previewTierObj.bonus || 0;
            const multipliedPoints = Math.floor(
              item.base * (1 + bonusPercent / 100)
            );

            return (
              <div
                key={idx}
                className="flex-1 border border-dashed rounded-sm p-5 min-w-[180px]"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <p
                    className="text-[10px] font-black uppercase tracking-widest"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.label}
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-2xl font-black tabular-nums"
                    style={{
                      color: previewTierObj.bonus > 0 ? "#00ab55" : "var(--text-primary)",
                    }}
                  >
                    {multipliedPoints}
                  </span>
                  <span
                    className="text-[10px] font-black uppercase"
                    style={{ color: "var(--text-muted)" }}
                  >
                    PTS
                  </span>
                </div>
                {bonusPercent > 0 && (
                  <p className="text-[9px] font-black text-[#00ab55] opacity-80 uppercase tracking-tighter mt-1">
                    +{bonusPercent}% {calculatorTitle}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tiers Detail Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {pointsTiers.map((tier, idx) => (
          <div
            key={tier.name}
            onClick={() => setPreviewTier(tier.name)}
            className="cursor-pointer border rounded-sm p-8 transition-colors duration-200 relative overflow-hidden group"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: previewTier === tier.name ? "#00ab55" : "var(--border-color)",
              borderWidth: previewTier === tier.name ? "2px" : "1px",
            }}
          >
            {/* Background Decorative Element */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tier.color} opacity-[0.05] rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110`}
            />

            <div className="relative z-10 flex flex-col h-full text-left">
              <div className="flex items-center justify-between">
                {tier.image ? (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 border border-slate-100 shadow-sm p-0.5">
                    <img src={tier.image} alt={tier.name} className="w-full h-full object-contain rounded-full" />
                  </div>
                ) : (
                  <div
                    className="p-4 border rounded-sm"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    {getIcon(tier.icon)}
                  </div>
                )}
                <div className="text-right">
                  <p
                    className="text-[10px] font-black uppercase tracking-widest leading-none mb-1.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Requirement
                  </p>
                  <p
                    className="text-sm font-black tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {tier.points} PTS
                  </p>
                </div>
              </div>

              <div className="space-y-1 mt-6 text-left">
                <h3
                  className="text-2xl font-black uppercase tracking-tight text-left"
                  style={{ color: "var(--text-primary)" }}
                >
                  {tier.name}
                </h3>
                <div
                  className={`h-1 w-12 bg-gradient-to-r ${tier.color} rounded-full`}
                />
              </div>

              {/* Perks List */}
              <ul className="mt-4 space-y-2 text-xs font-semibold text-[var(--text-secondary)] opacity-80 list-disc list-inside text-left">
                {tier.perks.map((perk, pIdx) => (
                  <li key={pIdx} className="leading-tight text-left">{perk}</li>
                ))}
              </ul>

              {/* Earning Rates Details */}
              <div 
                className="mt-6 p-4 rounded-xl border text-xs space-y-2.5 text-left"
                style={{ 
                  borderColor: "var(--border-color)",
                  backgroundColor: "rgba(0, 0, 0, 0.01)"
                }}
              >
                <p className="font-black text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Earning Rates
                </p>
                {calculatorItems.map((item, itemIdx) => {
                  const itemBonus = tier.bonus || 0;
                  let baseVal = item.base;
                  if (role === "donor") {
                    if (item.label === "First Donation") baseVal = 200;
                    else if (item.label === "Per KG Food") baseVal = 20;
                    else if (item.label === "Milestone Bonus") baseVal = 400;
                  }
                  const itemPoints = Math.floor(baseVal * (1 + itemBonus / 100));
                  return (
                    <div key={itemIdx} className="flex justify-between items-center text-left">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">{item.label}</span>
                      <span className="font-black text-slate-700 dark:text-slate-300">
                        {itemPoints} <span className="text-[9px] text-slate-400">PTS</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div
                className="pt-6 mt-auto border-t"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br ${tier.color}`}
                  >
                    +{tier.bonus}%
                  </span>
                  <span
                    className="text-[10px] font-black uppercase tracking-widest"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Multiplier
                  </span>
                </div>
                <p
                  className="text-[11px] font-bold mt-2 leading-tight animate-pulse"
                  style={{ color: "#00ab55" }}
                >
                  Click card to calculate rates
                </p>
              </div>
            </div>

            {/* Tier Rank Indicator */}
            <div
              className="absolute bottom-6 right-8 text-[40px] font-black opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity"
              style={{ color: "var(--text-primary)" }}
            >
              0{idx + 1}
            </div>
          </div>
        ))}

        {/* Global Council / Immortal Custom Card */}
        <div
          className="rounded-sm p-8 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4 shadow-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
            borderWidth: "1px",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />

          <div
            className="w-16 h-16 rounded-full flex items-center justify-center border shadow-inner"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <Crown size={32} className="text-amber-500" />
          </div>
          <div>
            <h3
              className="text-xl font-black uppercase tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {role === "ngo" ? "Global Council" : role === "volunteer" ? "Elite Status" : "Immortal"}
            </h3>
            <p
              className="text-[10px] font-black uppercase tracking-widest mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              {role === "ngo" ? "For our top NGOs" : role === "volunteer" ? "Top 1% Volunteers" : "Top 0.1% Contributors"}
            </p>
          </div>
          <p
            className="text-xs font-bold max-w-[200px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {role === "ngo" 
              ? "Help us decide how we grow and help more people globally." 
              : role === "volunteer" 
              ? "Join our exclusive inner circle for special recognition."
              : "Exclusive benefits reserved for the most impactful heroes."}
          </p>
          <div
            className="px-4 py-2 border rounded-sm"
            style={{ borderColor: "var(--border-color)" }}
          >
            <span
              className="text-[9px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              {role === "ngo" ? "By Invitation" : "Coming Soon"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalTiersOverview;
