import ImpactCards from "../../../global/components/resuable-components/ImpactCards";
import { useNgoDashboard } from "./controller/dashboard_controller";
import {
  WelcomeHeader,
  AvailableDonations,
  UpdateFeed,
} from "./components/dashboard_component";

const NGODashboard = () => {
  const { stats, notifications, isLoading } = useNgoDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
        <div className="w-12 h-12 border-4 border-hf-green border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-hf-green">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-3 sm:p-4 lg:p-5 space-y-5 max-w-[1600px] mx-auto bg-transparent">
      {/* Hero / Operations Header */}
      <WelcomeHeader progressToNext={75} />

      {/* Analytics Hub */}
      <section>
        <ImpactCards
          className="gap-4"
          data={stats.map((stat: any) => ({
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
          <AvailableDonations />
        </div>

        {/* Right Column: Information Feed */}
        <div className="xl:col-span-4 flex flex-col h-full">
          <UpdateFeed notifications={notifications} />
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
