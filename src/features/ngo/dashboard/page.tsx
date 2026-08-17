import ImpactCards from "../../../global/components/reusable-components/ImpactCards";
import { useNgoDashboard } from "./controller/dashboard_controller";
import {
  WelcomeHeader,
  AvailableDonations,
  UpdateFeed,
} from "./components/dashboard_component";

import { Loader } from "../../../global/components/reusable-components/Loader";

const NGODashboard = () => {
  const { stats, notifications, isLoading } = useNgoDashboard();

  if (isLoading) {
    return <Loader text="Syncing Dashboard..." minHeight="400px" />;
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
