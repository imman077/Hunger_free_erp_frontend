import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  TrendingUp,
  Trophy,
  Sparkles,
  Truck,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Utensils,
} from "lucide-react";
import ImpactCards from "../../../global/components/reusable-components/ImpactCards";
import {
  getIcon,
  getScallopedCirclePath,
} from "../../../global/constants/milestone_config";
import { onInit, onDestroy } from "./controller/dashboard_controller";
import { dashboardInputModel } from "./store/dashboard_store";
import { useDonorStore } from "../store/donor-store";
import { type RecentActivity } from "../store/donor-schemas";
import NGONeedsFeed from "./components/NGONeedsFeed";
import { getCategoryImage } from "../../../global/constants/donation_config";
import type { MilestoneItem } from "./api/milestones/milestones_api";

const DonorDashboardPage = () => {
  const navigate = useNavigate();

  // Initialize and clean up controllers
  useEffect(() => {
    onInit();
    return () => {
      onDestroy();
    };
  }, []);

  const { data, donationStats } = useDonorStore();
  const currentPoints = data.currentPoints;
  const recentActivities = data.recentActivities;
  const profile = data.profile;

  const milestones = dashboardInputModel.useSelector(
    (state) => state.dashboardData?.milestones
  ) || [];
  const totalDonations = donationStats.totalDonations;

  const donationsThisWeek = data.donationHistory.filter((d) => {
    const dateStr = d.createdAt || d.date;
    if (!dateStr) return false;
    const createdDate = new Date(dateStr);
    if (isNaN(createdDate.getTime())) return false;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return createdDate >= oneWeekAgo;
  }).length;

  const urgentNeedsCount = dashboardInputModel.useSelector(
    (state) => state.dashboardData.urgentNeedsCount
  );

  const tiers = dashboardInputModel.useSelector(
    (state) => state.dashboardData?.tiers
  ) || [];

  // Sort tiers by pointsRequired ascending for index lookup, but descending for search
  const sortedTiersAsc = [...tiers].sort((a, b) => a.pointsRequired - b.pointsRequired);

  // Find the highest tier achieved by searching from the top down (descending pointsRequired)
  const currentTier = sortedTiersAsc.length > 0
    ? [...sortedTiersAsc].reverse().find((t) => currentPoints >= t.pointsRequired) || sortedTiersAsc[0]
    : null;

  const nextTier = currentTier
    ? sortedTiersAsc[sortedTiersAsc.indexOf(currentTier) + 1] || null
    : null;

  const pointsInRange = nextTier && currentTier
    ? currentPoints - currentTier.pointsRequired
    : 0;
  const rangeTotal = nextTier && currentTier
    ? nextTier.pointsRequired - currentTier.pointsRequired
    : 1;

  const progressToNext = nextTier
    ? Math.min((pointsInRange / rangeTotal) * 100, 100)
    : 100;

  const pointsRemaining = nextTier
    ? nextTier.pointsRequired - currentPoints
    : 0;

  const isMilestoneUnlocked = (badge: MilestoneItem): boolean => {
    if (badge.requirementType === "donations") return totalDonations >= badge.threshold;
    if (badge.requirementType === "points") return currentPoints >= badge.threshold;
    return false;
  };

  const firstName = profile?.name ? profile.name.split(" ")[0] : "Anish";

  return (
    <div className="w-full space-y-4 max-w-[1600px] mx-auto bg-transparent p-4">
      {/* Hero / Header Section */}
      <div
        className="relative overflow-hidden p-5 md:p-10"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[450px] h-[450px] bg-green-500 opacity-[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] h-[300px] bg-blue-500 opacity-[0.03] blur-[100px] rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-4 flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <div className="relative inline-block">
                {/* Decorative Elements (Confetti) - Closer to Text */}
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: -25 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute -top-6 -left-4 w-4 h-2 bg-green-500 rounded-full"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: 30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 15 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="absolute top-2 -left-8 w-2.5 h-1.5 bg-green-400 rounded-full"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: 45 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="absolute -top-4 -right-8 w-3.5 h-2 bg-green-300 rounded-full"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: -30 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute bottom-10 -right-8 w-3 h-1.5 bg-green-500 rounded-full"
                />

                <h1
                  className="text-3xl md:text-6xl font-black tracking-tighter leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  Welcome back, <br />
                  <span className="text-green-500">{firstName}!</span>
                </h1>
              </div>
              <p className="text-sm font-medium opacity-60 max-w-lg leading-relaxed">
                You've made a significant impact this week. Your contributions
                are helping us reach our goal of a zero-hunger community.
              </p>
            </motion.div>
          </div>

          {/* Premium Tier Card - Merged Layout */}
          <div className="lg:shrink-0 w-full lg:max-w-[590px]">
            {currentTier ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative group w-full flex flex-col md:flex-row items-stretch gap-4 md:gap-6 p-4 md:p-5 rounded-2xl border transition-all duration-500 bg-white border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
              >
                {/* Left Column: Current Rank */}
                <div className="flex-1 flex flex-row items-center gap-4 min-w-[170px]">
                  {/* Trophy Container */}
                  <div className="relative w-20 h-20 shrink-0 rounded-[18px] bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] flex items-center justify-center border border-[#bbf7d0] shadow-[0_6px_14px_-4px_rgba(34,197,94,0.1)] overflow-hidden">
                    {/* Floating particles */}
                    <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-[#22c55e] rounded-full opacity-60" />
                    <div className="absolute bottom-2 right-1.5 w-1 h-1 bg-[#4ade80] rounded-full opacity-40" />
                    <div className="absolute top-3 right-2.5 w-0.5 h-0.5 bg-[#86efac] rounded-full opacity-50" />
                    <div className="absolute bottom-1.5 left-2.5 w-1 h-1 bg-[#22c55e] rounded-full opacity-30" />
                    
                    {/* Glow */}
                    <div className="absolute w-12 h-12 bg-[#22c55e]/10 rounded-full blur-md" />

                    {/* Trophy Icon */}
                    <div className="relative z-10 scale-[1.1] transition-transform duration-500 group-hover:scale-[1.2]">
                      <Trophy
                        className="w-8 h-8 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                        style={{
                          color: currentTier.name.toLowerCase().includes("bronze") ? "#A05822" : 
                                 currentTier.name.toLowerCase().includes("silver") ? "#8A8A8A" : 
                                 currentTier.name.toLowerCase().includes("gold") ? "#D4AF37" : "#059669",
                          fill: currentTier.name.toLowerCase().includes("bronze") ? "#CD7F32" : 
                                currentTier.name.toLowerCase().includes("silver") ? "#C0C0C0" : 
                                currentTier.name.toLowerCase().includes("gold") ? "#FFD700" : "#10B981",
                        }}
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Rank Details */}
                  <div className="flex-1 flex flex-col justify-center text-start">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#22c55e]">
                      Current Rank
                    </span>
                    <h3 className="text-2xl font-extrabold tracking-tight text-slate-800 mt-0.5 leading-tight">
                      {currentTier.name}
                    </h3>
                    <div className="inline-flex items-center gap-1 p-0.5 px-2 rounded-full bg-[#f0fdf4] text-[#22c55e] border border-[#dcfce7] w-fit mt-1.5">
                      <TrendingUp size={9} strokeWidth={2.5} />
                      <span className="text-[8px] font-black uppercase tracking-wider">
                        {currentTier.bonus} Bonus
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-[1px] self-stretch bg-slate-100" />
                <div className="block md:hidden h-[1px] w-full bg-slate-100" />

                {/* Right Column: Progress */}
                <div className="flex-[1.4] flex flex-col justify-between gap-3.5 text-start">
                  {nextTier ? (
                    <>
                      {/* Next Tier Header */}
                      <div className="flex justify-between items-start w-full gap-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#22c55e]">
                              Next Milestone
                            </span>
                            <Sparkles size={9} className="text-[#22c55e] fill-[#22c55e]/20" />
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-sm">
                              <Sparkles size={10} className="text-white fill-white/20" />
                            </div>
                            <h4 className="text-base font-extrabold tracking-wider text-slate-800 uppercase">
                              {nextTier.name}
                            </h4>
                          </div>
                        </div>

                        {/* Points to Achieve Mini-Card */}
                        <div className="relative overflow-hidden bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-1.5 px-3 text-center flex flex-col justify-center min-w-[90px] shadow-sm">
                          {/* Tiny background sparkles */}
                          <Sparkles className="absolute -right-1 -top-1 w-4 h-4 text-[#22c55e] opacity-10" />
                          <span className="text-sm font-black text-[#22c55e] leading-none">
                            {pointsRemaining.toLocaleString()}
                          </span>
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                            Pts to Achieve
                          </span>
                        </div>
                      </div>

                      {/* Progress Info Score & Remaining */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-[#22c55e] to-[#10b981] text-white px-2.5 py-0.5 rounded-lg text-[10px] font-black shadow-[0_2px_6px_rgba(34,197,94,0.12)]">
                            {currentPoints.toLocaleString()} PTS
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 mx-1.5">/</span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {nextTier.pointsRequired.toLocaleString()} PTS
                          </span>
                        </div>
                        <div className="bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">
                          {pointsRemaining.toLocaleString()} PTS LEFT
                        </div>
                      </div>

                      {/* Progress Bar Container with Tooltip & Labels */}
                      <div className="relative pt-7 pb-2.5">
                        {/* Tooltip & Dotted Line */}
                        <motion.div
                          initial={{ left: 0 }}
                          animate={{ left: `${progressToNext}%` }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className="absolute top-[2px] flex flex-col items-center -translate-x-1/2"
                        >
                          <div className="bg-white text-[#22c55e] border border-[#dcfce7] shadow-[0_2px_8px_rgba(0,0,0,0.03)] font-black px-2 py-0.5 text-[8.5px] rounded-md relative z-10">
                            {Math.round(progressToNext)}%
                            {/* Triangle pointing down */}
                            <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white border-r border-b border-[#dcfce7] rotate-45" />
                          </div>
                          <div className="w-[1px] h-[11px] border-l border-dashed border-[#22c55e]/55 mt-0.5" />
                        </motion.div>

                        {/* Progress Bar */}
                        <div className="relative h-1.5 w-full rounded-full bg-slate-100 overflow-visible">
                          {/* Fill */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressToNext}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="absolute h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#10b981]"
                          />
                          {/* Knob */}
                          <motion.div
                            initial={{ left: 0 }}
                            animate={{ left: `${progressToNext}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="absolute top-1/2 -translate-y-1/2 -ml-1.5 w-3 h-3 rounded-full bg-white border-[2px] border-[#22c55e] shadow-md hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        {/* Labels Below Bar */}
                        <div className="flex justify-between items-start mt-2.5 px-0.5">
                          <div className="text-start space-y-0.5">
                            <p className="text-[10px] font-black text-slate-500 leading-none">
                              {currentTier.pointsRequired.toLocaleString()} PTS
                            </p>
                            <p className="text-[7.5px] font-black text-slate-300 uppercase tracking-widest">
                              MIN
                            </p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-[10px] font-black text-[#22c55e] uppercase tracking-wider">
                              {Math.round(progressToNext)}% COMPLETE
                            </p>
                          </div>

                          <div className="text-end space-y-0.5">
                            <p className="text-[10px] font-black text-slate-500 leading-none">
                              {nextTier.pointsRequired.toLocaleString()} PTS
                            </p>
                            <p className="text-[7.5px] font-black text-slate-300 uppercase tracking-widest">
                              TARGET
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center items-center py-4 text-center">
                      <Sparkles size={24} className="text-[#22c55e] animate-pulse mb-1.5" />
                      <h4 className="text-base font-black text-slate-800 uppercase tracking-wider">
                        Ultimate Tier Reached
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        You are at the highest rank! Thank you for your amazing contributions.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="relative flex flex-col justify-center p-4 rounded-2xl border-[0.5px] w-full min-w-[240px] bg-white border-slate-100">
                <span className="text-xs font-bold text-slate-400">Loading Rank...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid & Banner - Fluid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 items-stretch w-full">
        <div className="md:col-span-2 xl:col-span-2">
          <ImpactCards
            className="gap-4 md:gap-6 h-full"
            data={[
              {
                label: "Total Donations",
                val: donationStats.totalDonations.toString(),
                trend: `+${donationsThisWeek} this week`,
                color: "bg-green-500",
                image: "/stats_icon/donation.png",
              },
              {
                label: "Urgent NGO Needs",
                val: urgentNeedsCount.toString(),
                trend:
                  urgentNeedsCount > 0 ? "Requires Attention" : "All Clear",
                color: "bg-red-500",
                image: "/stats_icon/urgent.png",
              },
            ]}
          />
        </div>

       
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-4 items-stretch">
        {/* Left Column: NGO Needs Feed (Equal Width) */}
        <div className="lg:col-span-6 flex flex-col h-full">
          <NGONeedsFeed />
        </div>

        {/* Right Column: Activity (Equal Width) */}
        <div className="lg:col-span-6 flex flex-col h-full">
          <div
            className="rounded-md p-4 md:p-5 space-y-4 flex flex-col h-full overflow-hidden border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between px-1">
              <h2
                className="text-[10px] font-black uppercase tracking-widest opacity-70"
                style={{ color: "var(--text-primary)" }}
              >
                Recent Activity
              </h2>
              <button className="text-[8px] font-black text-green-500 hover:text-green-700 uppercase tracking-widest transition-colors focus:outline-none">
                DETAILS
              </button>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto pr-1 thin-scrollbar flex flex-col">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity: RecentActivity, idx: number) => {
                  const isCollected = activity.status === "Collected";
                  
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 2 }}
                      className="group flex flex-col min-[450px]:flex-row items-stretch bg-white rounded-lg transition-all duration-300 hover:shadow-sm cursor-pointer border border-slate-100 overflow-hidden"
                    >
                      {/* Left: Content Section - Refined Alignment */}
                      <div className="flex-1 flex items-center gap-3 p-3">
                        {/* Icon Box - Professional Image Assets */}
                        <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-slate-50 border border-slate-100 overflow-hidden shadow-sm">
                          <img 
                            src={getCategoryImage(activity.category)} 
                            alt="Activity Icon" 
                            className="w-9 h-9 object-contain"
                          />
                        </div>

                        {/* Info - Vertical Stack to prevent overlap */}
                        <div className="min-w-0 flex-1 flex flex-col justify-center">
                          <div className="mb-2">
                            <h3 className="text-[14px] font-black tracking-tight text-slate-800 leading-tight truncate">
                              {activity.title}
                            </h3>
                            <p className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mt-1 truncate">
                              {activity.ngo}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <div className={`flex items-center gap-1.5 text-[9px] font-black shrink-0 ${
                              isCollected ? "text-[#22c55e]" : "text-[#3b82f6]"
                            }`}>
                              {isCollected ? <Leaf size={11} /> : <Utensils size={11} />}
                              <span className="uppercase tracking-widest opacity-70">
                                {isCollected ? "12 kg vegetables" : "10 meals on way"}
                              </span>
                            </div>
                            
                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider shrink-0 ${
                              isCollected 
                                ? "bg-[#f0fdf4] text-[#22c55e] border border-[#22c55e]/10" 
                                : "bg-[#eff6ff] text-[#3b82f6] border border-[#3b82f6]/10"
                            }`}>
                              {isCollected ? <ShieldCheck size={10} /> : <Sparkles size={10} />}
                              {isCollected ? "Impact" : "Community"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Status Section - Perfected Alignment */}
                      <div className="w-full min-[450px]:w-[120px] flex flex-row min-[450px]:flex-col items-center justify-between min-[450px]:justify-center gap-3 border-t min-[450px]:border-t-0 min-[450px]:border-l border-slate-50 bg-slate-50/20 p-3">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock size={12} className="stroke-[2.5]" />
                          <span className="text-[9px] font-black uppercase tracking-wide whitespace-nowrap">
                            {activity.time}
                          </span>
                        </div>
                        
                        <div className={`flex items-center gap-2 px-3.5 py-2 rounded-full border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:scale-105 ${
                          isCollected 
                            ? "bg-white border-green-100 text-[#22c55e]" 
                            : "bg-white border-blue-100 text-[#3b82f6]"
                        }`}>
                          {isCollected ? (
                            <CheckCircle2 size={13} className="stroke-[2.5]" />
                          ) : (
                            <Truck size={13} className="stroke-[2.5]" />
                          )}
                          <span className="text-[9px] font-black uppercase tracking-[0.05em] leading-none whitespace-nowrap">
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 text-center relative overflow-hidden group bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] mt-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-green-500/10 transition-colors duration-700" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-700" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      animate={{ 
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative w-40 h-28 -mb-1"
                    >
                      <img
                        src="/empty_food.png"
                        alt="No Activity"
                        className="w-full h-full object-contain opacity-90"
                      />
                    </motion.div>

                    <div className="space-y-2 mb-8">
                      <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                        No activity yet
                      </h3>
                      <p className="text-[11px] font-bold text-slate-500/70 max-w-[240px] mx-auto leading-relaxed">
                        You haven't created any donation requests yet. <br />
                        Start sharing surplus food and help someone in need.
                      </p>
                    </div>

                    <button
                      onClick={() => navigate("/donor/donations/create")}
                      className="px-8 py-3.5 bg-[#22c55e] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#16a34a] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-green-500/10"
                    >
                      <img src="/giving.png" className="w-5 h-5 object-contain" alt="Giving" />
                      <span>Start Your Journey</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Row: Impact Milestones */}
      <div className="mt-4">
        <div
          className="rounded-xl p-4 md:p-5 space-y-5 flex flex-col overflow-hidden border border-slate-100 shadow-sm bg-white"
        >
          <div className="flex items-center justify-between px-1">
            <h2
              className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800"
            >
              Impact Milestones
            </h2>
            <button className="text-[9px] font-black text-green-500 hover:text-green-700 uppercase tracking-widest transition-colors focus:outline-none">
              VIEW ALL
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 overflow-y-auto pr-2 max-h-[260px] thin-scrollbar scroll-smooth">
            {milestones.length === 0 ? (
              <div className="col-span-full py-10 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                Loading Milestones...
              </div>
            ) : (
              milestones
                .map((badge: MilestoneItem) => ({
                  badge,
                  isUnlocked: isMilestoneUnlocked(badge),
                }))
                .sort((a: { badge: MilestoneItem; isUnlocked: boolean }, b: { badge: MilestoneItem; isUnlocked: boolean }) => {
                  if (a.isUnlocked && !b.isUnlocked) return -1;
                  if (!a.isUnlocked && b.isUnlocked) return 1;
                  return 0;
                })
                .map(({ badge, isUnlocked }: { badge: MilestoneItem; isUnlocked: boolean }) => {
                  const BadgeIcon = getIcon(badge.icon || "Award");
                  return (
                    <div
                      key={badge.id}
                      className={`group relative p-6 rounded-md border flex flex-col items-center text-center gap-4 transition-all duration-300 justify-center h-full ${
                        isUnlocked
                          ? "shadow-sm hover:shadow-md"
                          : "opacity-40 grayscale"
                      }`}
                      style={{
                        backgroundColor: isUnlocked
                          ? "var(--bg-secondary)"
                          : "var(--bg-tertiary)",
                        borderColor: isUnlocked
                          ? "var(--color-emerald-light)"
                          : "var(--border-color)",
                      }}
                    >
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2">
                        {/* Wavy Badge SVG Background */}
                        <svg
                          viewBox="0 0 56 56"
                          className={`absolute inset-0 w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] transition-all duration-300 ${
                            isUnlocked
                              ? "text-[#22c55e]"
                              : "text-slate-300"
                          }`}
                        >
                          <path
                            d={getScallopedCirclePath(28, 28, 20.5, 7.0, 12)}
                            fill="currentColor"
                          />
                          {/* Inner Bevel Accent Line */}
                          <path
                            d={getScallopedCirclePath(28, 28, 15.5, 5.5, 12)}
                            fill="none"
                            stroke={isUnlocked ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.08)"}
                            strokeWidth="1.2"
                          />
                        </svg>
                        {/* Icon */}
                        <div className={`relative z-10 flex items-center justify-center transition-transform duration-350 group-hover:scale-110 ${
                          isUnlocked ? "text-white" : "text-slate-400"
                        }`}>
                          <BadgeIcon size={22} className="stroke-[2.2]" />
                        </div>
                      </div>

                      <div className="space-y-1 flex-1 flex flex-col justify-center">
                        <h3
                          className="text-xs font-black uppercase tracking-tight leading-tight"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {badge.name}
                        </h3>
                        <p
                          className="text-[10px] font-bold leading-snug"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {badge.desc}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-md text-[7px] font-black uppercase tracking-widest ${
                          isUnlocked
                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                            : "opacity-30 border border-current"
                        }`}
                        style={{ color: isUnlocked ? "" : "var(--text-muted)" }}
                      >
                        {isUnlocked ? "UNLOCKED" : "LOCKED"}
                      </span>
                      {!isUnlocked && (
                        <div
                          className="absolute top-4 right-4 opacity-20"
                          style={{ color: "var(--text-primary)" }}
                        >
                          <Clock size={16} />
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Banner - Occupies Remaining Space with Matched Height */}
        <div className="md:col-span-2 xl:col-span-1 flex flex-col min-h-[140px] bg-[#F8F8F3] rounded-2xl">
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden shadow-[0_4px_25px_-5px_rgba(0,0,0,0.04)] group border-[0.5px] border-slate-200/50 bg-[#F8F8F3]">
            {/* Background Illustration - Perfectly Right-Aligned */}
            <div className="absolute inset-0 flex justify-end">
              <img
                src="/dashboard_banner1.png"
                alt="Dashboard Banner"
                className="h-full w-auto object-contain object-right select-none pointer-events-none opacity-20 sm:opacity-100 transition-opacity duration-300"
              />
            </div>

            {/* Content Overlay - Floating Over Background */}
            <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12">
              <h2 className="text-xl md:text-2xl font-black tracking-tight leading-[1.1] text-slate-800">
                Together, we can <br />
                reduce food waste and <br />
                <span className="text-green-500">end hunger.</span>
              </h2>
            </div>
          </div>
        </div>
    </div>
  );
};

export default DonorDashboardPage;
