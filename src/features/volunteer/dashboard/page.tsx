import {
  MapPin,
  Clock,
  TrendingUp,
  Star,
  Zap,
  Trophy,
  Package,
  ShieldCheck,
} from "lucide-react";
import ImpactCards from "../../../global/components/reusable-components/ImpactCards";
import { useEffect, useState } from "react";
import {
  getIcon,
  getScallopedCirclePath,
} from "../../../global/constants/milestone_config";
import { tiersService } from "../../donor/dashboard/api/tiers/tiers_api";
import { milestonesService } from "../../donor/dashboard/api/milestones/milestones_api";

import { useVolunteerDashboard } from "./controller/dashboard_controller";

const VolunteerDashboard = () => {
  const {
    stats: storeStats,
    recentTasks,
    activities,
    currentPoints,
    isLoading: isStoreLoading,
  } = useVolunteerDashboard();

  const [tiers, setTiers] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      tiersService.getGamificationTiers(),
      milestonesService.getDonorMilestones({ category: "volunteers" }),
    ])
      .then(([fetchedTiers, fetchedMilestones]) => {
        if (active) {
          setTiers(fetchedTiers);
          setMilestones(fetchedMilestones);
          setIsLoadingConfig(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load config:", err);
        if (active) {
          setIsLoadingConfig(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const sortedTiersAsc = [...tiers].sort((a, b) => a.pointsRequired - b.pointsRequired);

  const currentTier = sortedTiersAsc.length > 0
    ? [...sortedTiersAsc].reverse().find((t) => currentPoints >= t.pointsRequired) || sortedTiersAsc[0]
    : null;

  const nextTier = currentTier
    ? sortedTiersAsc[sortedTiersAsc.indexOf(currentTier) + 1] || null
    : null;

  const progressToNext = nextTier && currentTier
    ? ((currentPoints - currentTier.pointsRequired) /
        (nextTier.pointsRequired - currentTier.pointsRequired)) *
      100
    : 100;

  const stats = storeStats.map((stat) => ({
    ...stat,
    icon:
      stat.title === "Deliveries" ? (
        <Package className="w-5 h-5" />
      ) : stat.title === "My Points" ? (
        <Star className="w-5 h-5" />
      ) : stat.title === "My Forest" ? (
        <Zap className="w-5 h-5" />
      ) : (
        <ShieldCheck className="w-5 h-5" />
      ),
  }));

  if (isStoreLoading || isLoadingConfig) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 max-w-[1600px] mx-auto bg-transparent px-4 md:px-6">
      <div
        className="relative overflow-hidden rounded-md p-4 md:p-6 border"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[350px] h-[350px] bg-green-500 opacity-[0.05] blur-[110px] rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-start">
            <h1
              className="text-2xl md:text-3xl font-black tracking-tighter"
              style={{ color: "var(--text-primary)" }}
            >
              Welcome back, <span className="text-green-500">Rahul!</span>
            </h1>
            <p
              className="font-medium text-xs max-w-md mx-auto md:mx-0 leading-tight"
              style={{ color: "var(--text-secondary)" }}
            >
              850 meals delivered this month.
              <br />
              You're making a real difference, keep it up!
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {currentTier ? (
              <div
                className="group/hero-stat flex flex-col gap-3 p-4 rounded-md border w-full md:min-w-[280px] shadow-inner transition-colors duration-300 hover:bg-green-500/5"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-sm flex items-center justify-center shadow-lg shadow-green-500/10 transition-transform duration-300 group-hover/hero-stat:-translate-y-1`}
                    style={{ backgroundColor: `${currentTier.color}20` }}
                  >
                    <Trophy
                      className="w-5 h-5"
                      style={{ color: currentTier.color }}
                    />
                  </div>
                  <div className="text-start">
                    <p
                      className="text-[8px] font-black uppercase tracking-widest mb-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      My Rank
                    </p>
                    <div className="flex items-center gap-2">
                      <h3
                        className="text-base font-black tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {currentTier.name}
                      </h3>
                      <div className="p-1 px-1.5 rounded-sm bg-green-500/10">
                        <TrendingUp className="text-green-500 w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {nextTier && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span
                        className="text-[8px] font-black uppercase tracking-widest"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Next Rank: {nextTier.name}
                      </span>
                      <span
                        className="text-[8px] font-black uppercase tabular-nums"
                        style={{ color: "#22c55e" }}
                      >
                        {Math.round(progressToNext)}%
                      </span>
                    </div>
                    <div
                      className="h-1 w-full rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--border-color)" }}
                    >
                      <div
                        className="h-full bg-green-500 transition-all duration-1000"
                        style={{ width: `${progressToNext}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="group/hero-stat flex flex-col justify-center p-4 rounded-md border w-full md:min-w-[280px] shadow-inner text-center">
                <span className="text-xs font-bold text-slate-400">Loading Rank...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="">
        <ImpactCards
          className="gap-3 md:gap-4"
          data={stats.map((stat: any) => ({
            label: stat.title,
            val: stat.value,
            trend: stat.change,
            color: stat.color === "#22c55e" ? "bg-green-500" : "bg-slate-300",
          }))}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-0 items-stretch">
        {/* Recent Tasks (8 cols) */}
        <div className="lg:col-span-12 flex flex-col h-full">
          <div
            className="rounded-md p-4 md:p-6 space-y-6 flex flex-col h-full overflow-hidden shadow-sm border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between px-1">
              <h2
                className="text-[11px] font-black uppercase tracking-widest"
                style={{ color: "var(--text-primary)" }}
              >
                Active Tasks
              </h2>
              <button
                className="text-[8px] font-black uppercase tracking-widest transition-colors focus:outline-none hover:opacity-80"
                style={{ color: "#22c55e" }}
              >
                Find Tasks
              </button>
            </div>

            <div className="space-y-4 flex-1">
              {recentTasks.map((activity, idx) => {
                const isCompleted = activity.status === "Completed";
                return (
                  <div
                    key={idx}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md transition-all duration-300 hover:bg-slate-500/5 cursor-pointer border hover:border-green-500/20 shadow-sm gap-4"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="flex items-center gap-4 md:gap-5 min-w-0">
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-md shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-105 border ${
                          isCompleted
                            ? "bg-emerald-500/10 text-[#22c55e] border-emerald-500/10"
                            : "bg-orange-500/10 text-orange-500 border-orange-500/10"
                        }`}
                      >
                        <MapPin
                          size={18}
                          className="md:hidden transition-transform group-hover:-translate-y-0.5"
                        />
                        <MapPin
                          size={20}
                          className="hidden md:block transition-transform group-hover:-translate-y-0.5"
                        />
                      </div>

                      <div className="min-w-0 text-start">
                        <h3
                          className="text-xs md:text-sm font-black tracking-tight truncate transition-colors mb-1 leading-none group-hover:text-[#22c55e]"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {activity.title}
                        </h3>
                        <div className="flex items-center gap-2 md:gap-3">
                          <p
                            className="text-[8px] md:text-[9px] font-black uppercase tracking-widest truncate leading-none"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {activity.location}
                          </p>
                          <span
                            className="w-1 h-1 rounded-full opacity-25"
                            style={{ backgroundColor: "var(--text-muted)" }}
                          />
                          <span
                            className="text-[8px] md:text-[9px] font-black uppercase tracking-widest"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {activity.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 sm:ml-4 sm:border-l sm:pl-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <span
                        className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] tabular-nums font-sans"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {activity.time}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-sm text-[8px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                          isCompleted
                            ? "text-[#22c55e] bg-green-500/10 border-green-500/20"
                            : "text-orange-600 bg-orange-500/10 border-orange-500/20"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-10">
        {/* Task Milestones (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div
            className="rounded-md p-4 md:p-6 space-y-6 flex flex-col h-full overflow-hidden shadow-sm border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between px-1">
              <h2
                className="text-[11px] font-black uppercase tracking-widest"
                style={{ color: "var(--text-primary)" }}
              >
                My Badges
              </h2>
              <button
                className="text-[8px] font-black uppercase tracking-widest transition-colors focus:outline-none hover:opacity-80"
                style={{ color: "#22c55e" }}
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 overflow-y-auto pr-2 max-h-[300px] thin-scrollbar">
              {milestones
                .map((badge: any, i: number) => ({
                  badge,
                  i,
                  isUnlocked: i < 3,
                }))
                .map(({ badge, i, isUnlocked }: { badge: any; i: number; isUnlocked: boolean }) => {
                  const BadgeIcon = getIcon(badge.icon || "Award");
                  return (
                    <div
                      key={i}
                      className={`group relative p-4 rounded-md border flex flex-col items-center text-center gap-3 transition-all duration-300 justify-center h-[130px] md:h-[140px] ${
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
                      <div className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1.5">
                        {/* Wavy Badge SVG Background */}
                        <svg
                          viewBox="0 0 56 56"
                          className={`absolute inset-0 w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)] transition-all duration-300 ${
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
                          <BadgeIcon size={16} className="md:hidden stroke-[2.2]" />
                          <BadgeIcon size={18} className="hidden md:block stroke-[2.2]" />
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <h3
                          className="text-[9px] md:text-[10px] font-black uppercase tracking-tight leading-tight"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {badge.name}
                        </h3>
                        <p
                          className="text-[8px] font-bold leading-snug"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {isUnlocked ? "Unlocked" : "Locked"}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Activity Details (4 cols) */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <section
            className="p-5 md:p-6 rounded-md shadow-sm h-full flex flex-col border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <h3
              className="text-[11px] font-black tracking-tight uppercase mb-6 flex items-center justify-between"
              style={{ color: "var(--text-primary)" }}
            >
              Activity
              <Clock size={14} className="text-green-500" />
            </h3>
            <div className="relative space-y-6 flex-1">
              <div
                className="absolute left-[11px] top-1.5 bottom-1.5 w-px"
                style={{ backgroundColor: "var(--border-color)" }}
              />
              {activities.map((activity: any, i: number) => (
                <div key={i} className="relative pl-8 group">
                  <div
                    className="absolute left-0 top-0 w-6 h-6 rounded-sm border flex items-center justify-center z-10 transition-colors group-hover:border-green-500"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </div>
                  <div className="text-left">
                    <h4
                      className="text-[10px] font-black leading-none mb-1 transition-colors uppercase group-hover:text-[#22c55e]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {activity.title}
                    </h4>
                    <p
                      className="text-[8px] font-black uppercase tracking-widest mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {activity.time}
                    </p>
                    <p
                      className="text-[10px] leading-tight font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {activity.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
