import { useEffect } from "react";
import LineChart from "../../../../global/charts/LineChart";
import BarChart from "../../../../global/charts/BarChart";
import { Spinner } from "@heroui/react";
import ImpactCards from "../../../../global/components/resuable-components/ImpactCards";
import { useDashboard } from "../hooks/useDashboard";

const AdminDashboard = () => {
  const { stats, fetchDashboardData, isLoading } = useDashboard();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="w-full space-y-8 p-4 md:p-8 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-50">
          <Spinner color="success" size="lg" label="Syncing with SQL..." />
        </div>
      )}
      {/* Four Boxes */}
      <ImpactCards
        data={stats.map((item) => ({
          label: item.title,
          val: item.value,
          trend: item.change,
          color: item.changeColor.includes("green")
            ? "bg-emerald-500"
            : "bg-slate-300",
        }))}
      />

      {/* Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <div
          className="group relative rounded-xl p-5 md:p-7 border transition-all duration-500"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          {/* Subtle Glow Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="mb-6 flex flex-col items-start relative z-10">
            <h3
              className="text-lg font-black uppercase tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Donations
            </h3>
            <p
              className="text-[11px] font-black uppercase tracking-widest mt-1 opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              Monthly overview
            </p>
          </div>

          <div className="h-[250px] md:h-[300px] w-full relative">
            <LineChart />
          </div>
        </div>

        <div
          className="group relative rounded-xl p-5 md:p-7 border transition-all duration-500"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          {/* Subtle Glow Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="mb-6 flex flex-col items-start relative z-10">
            <h3
              className="text-lg font-black uppercase tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              New Users
            </h3>
            <p
              className="text-[11px] font-black uppercase tracking-widest mt-1 opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              Growth this month
            </p>
          </div>

          <div className="h-[250px] md:h-[300px] w-full relative">
            <BarChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
