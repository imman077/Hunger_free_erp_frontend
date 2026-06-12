import {
  Package,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Trophy,
  Activity,
  LayoutGrid,
} from "lucide-react";
import ImpactCards from "../../../../global/components/resuable-components/ImpactCards";
import { useNgoDashboard } from "../hooks/useNgoDashboard";

const NGODashboard = () => {
  const { stats, notifications, isLoading } = useNgoDashboard();

  // Tier Logic for NGO (similar to Donor)
  const progressToNext = 75; // 75% to next tier

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full p-3 sm:p-4 lg:p-5 space-y-5 max-w-[1600px] mx-auto bg-transparent">
      {/* Hero / Operations Header */}
      <div
        className="relative overflow-hidden rounded-2xl p-5 sm:p-8 md:p-10 shadow-sm border"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[350px] h-[350px] bg-hf-green/5 blur-[110px] rounded-full" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6 md:gap-8">
          <div className="space-y-3">
            <h1
              className="text-2xl md:text-3xl xl:text-4xl font-black tracking-tighter"
              style={{ color: "var(--text-primary)" }}
            >
              Welcome back,{" "}
              <span className="text-hf-green">Hope Foundation!</span>
            </h1>
            <p
              className="font-medium text-[11px] md:text-xs xl:text-sm max-w-xl text-start leading-tight"
              style={{ color: "var(--text-muted)" }}
            >
              Your team has successfully distributed over{" "}
              <span
                className="font-black underline decoration-hf-green decoration-2 underline-offset-4"
                style={{ color: "var(--text-primary)" }}
              >
                5,420 meals
              </span>{" "}
              to families in the Central District this month.
            </p>
          </div>

          <div className="shrink-0 w-full xl:w-auto">
            <div
              className="group/hero-stat flex flex-col gap-3 md:gap-4 p-5 md:p-6 rounded-2xl border w-full xl:min-w-[340px] shadow-inner transition-colors duration-300"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-hf-green/10 flex items-center justify-center shadow-lg shadow-hf-green/10 transition-transform duration-300 group-hover/hero-stat:-translate-y-1 text-hf-green">
                  <Trophy size={20} />
                </div>
                <div className="text-start">
                  <p
                    className="text-[8px] font-black uppercase tracking-widest mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Your Level
                  </p>
                  <div className="flex items-center gap-2.5">
                    <h3
                      className="text-lg font-black tracking-tight leading-none"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Platinum Partner
                    </h3>
                    <div className="p-1.5 rounded-md bg-hf-green/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="text-hf-green w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span
                    className="text-[8px] font-black uppercase tracking-[0.2em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Next Level Progress
                  </span>
                  <span className="text-[9px] font-black text-hf-green uppercase tabular-nums">
                    {progressToNext}%
                  </span>
                </div>
                <div
                  className="h-1.5 w-full rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                >
                  <div
                    className="h-full bg-hf-green transition-all duration-1000"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Hub */}
      <section>
        <ImpactCards
          className="gap-4"
          data={stats.map((stat) => ({
            label: stat.label,
            val: stat.val,
            trend: stat.trend,
            color: stat.color,
          }))}
        />
      </section>

      {/* Grid: Active Needs & Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Operational Needs */}
        <div className="xl:col-span-8 flex flex-col h-full">
          <div
            className="rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 flex flex-col h-full overflow-hidden shadow-sm border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between gap-4 px-1">
              <h2
                className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider md:tracking-[0.2em] flex items-center gap-2 min-w-0"
                style={{ color: "var(--text-primary)" }}
              >
                <LayoutGrid size={14} className="text-hf-green shrink-0" />
                <span className="truncate">Available Donations</span>
              </h2>
              <button
                // onClick={() => navigate("/ngo/donations")}
                className="text-[9px] font-black text-hf-green hover:underline uppercase tracking-widest transition-colors flex items-center gap-1 shrink-0 group"
              >
                VIEW ALL
                <ArrowUpRight
                  size={12}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
                />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto pr-1 thin-scrollbar">
              {[
                {
                  title: "Fresh Bakery Food",
                  desc: "Baker Street • 2km away",
                  type: "Immediate",
                },
                {
                  title: "Cooked Meals (20kg)",
                  desc: "Promenade Hotel • 5km away",
                  type: "Priority",
                },
                {
                  title: "Dairy Products",
                  desc: "Auroville Dairy • 12km away",
                  type: "Standard",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group p-4 sm:p-5 rounded-2xl border hover:border-hf-green/30 transition-all duration-300"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex justify-between items-center gap-3">
                    <div className="min-w-0">
                      <h3
                        className="text-[12px] sm:text-[14px] font-black tracking-tight group-hover:text-hf-green transition-colors leading-none mb-1 sm:mb-2 uppercase truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest opacity-60 truncate"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-md text-[7px] sm:text-[8px] font-black uppercase tracking-[0.1em] border shrink-0 ${
                        item.type === "Priority"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : item.type === "Immediate"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : "bg-hf-green/10 text-hf-green border-hf-green/20"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Information Feed */}
        <div className="xl:col-span-4 flex flex-col h-full">
          <div
            className="rounded-2xl p-5 md:p-8 space-y-8 flex flex-col h-full overflow-hidden shadow-sm border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between gap-4 px-1">
              <h2
                className="text-[11px] font-black uppercase tracking-wider md:tracking-[0.2em] flex items-center gap-2 min-w-0"
                style={{ color: "var(--text-primary)" }}
              >
                <Activity size={14} className="text-hf-green shrink-0" />
                <span className="truncate">Update Feed</span>
              </h2>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1 thin-scrollbar">
              {notifications.map((activity, idx) => {
                const isDonation = activity.type === "donation";
                return (
                  <div
                    key={idx}
                    className="group relative flex flex-col gap-5 p-5 rounded-2xl transition-all duration-300 hover:bg-slate-500/5 border shadow-sm"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="flex items-start justify-between min-w-0 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-105 border ${
                            isDonation
                              ? "bg-hf-green/10 text-hf-green border-hf-green/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }`}
                        >
                          {isDonation ? (
                            <Package size={18} />
                          ) : (
                            <Zap size={18} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3
                            className="text-[11px] font-black tracking-widest uppercase truncate leading-none mb-1.5 group-hover:text-hf-green transition-colors"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {activity.title}
                          </h3>
                          <div className="flex items-center gap-2">
                             <Activity size={10} className="text-hf-green opacity-50" />
                             <span
                              className="text-[9px] font-black uppercase tracking-widest opacity-40 leading-none"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-[0.1em] border shrink-0 whitespace-nowrap ${
                          activity.status === "completed"
                            ? "text-hf-green bg-hf-green/10 border-hf-green/20"
                            : activity.status === "in_transit"
                              ? "text-blue-500 bg-blue-500/10 border-blue-500/20"
                              : "text-amber-600 bg-amber-500/10 border-amber-500/20"
                        }`}
                      >
                        {activity.status.replace("_", " ")}
                      </span>
                    </div>

                    <p
                      className="text-[11px] font-bold tracking-tight border-t pt-4 leading-relaxed opacity-80"
                      style={{
                        color: "var(--text-secondary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      {activity.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
