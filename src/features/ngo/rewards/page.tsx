import { useMemo } from "react";
import { Users, Package } from "lucide-react";
import PageHeader from "../../../global/components/reusable-components/PageHeader";
import { useNgoRewards } from "./controller/rewards_controller";
import RewardsMarketplace from "./components/RewardsMarketplace";

const NGORewards = () => {
  const {
    data,
    currentPoints,
    isLoading,
  } = useNgoRewards();

  const userStats = useMemo(() => {
    return {
      totalPoints: currentPoints || 0,
      beneficiariesServed: data?.profile?.beneficiariesServed || 0,
      donationsAccepted: data?.profile?.donationsAccepted || 0,
    };
  }, [currentPoints, data?.profile?.beneficiariesServed, data?.profile?.donationsAccepted]);

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
      <PageHeader
        title="NGO Grants & Rewards"
        subtitle="Redeem points for exclusive benefits"
        className="mb-8"
        showPointsCard={true}
        points={userStats.totalPoints}
      >
        {/* Beneficiaries Card */}
        <div
          className="flex items-center gap-4 border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 px-5 rounded-md text-left relative overflow-hidden shrink-0"
        >
          <div
            className="w-12 h-12 bg-blue-500/8 border border-blue-500/20 rounded-[14px] flex items-center justify-center shrink-0 text-blue-500"
          >
            <Users size={24} />
          </div>
          <div className="text-start">
            <div className="flex items-center gap-1.5 mb-1">
              <p
                className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-70 leading-none"
              >
                PEOPLE SERVED
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-2xl font-black tabular-nums leading-none text-[var(--text-primary)]"
              >
                {userStats.beneficiariesServed.toLocaleString()}
              </span>
              <span className="text-xs font-black text-blue-500 uppercase tracking-wide">
                Impact
              </span>
            </div>
          </div>
        </div>

        {/* Donations Card */}
        <div
          className="flex items-center gap-4 border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 px-5 rounded-md text-left relative overflow-hidden shrink-0"
        >
          <div
            className="w-12 h-12 bg-orange-500/8 border border-orange-500/20 rounded-[14px] flex items-center justify-center shrink-0 text-orange-500"
          >
            <Package size={24} />
          </div>
          <div className="text-start">
            <div className="flex items-center gap-1.5 mb-1">
              <p
                className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-70 leading-none"
              >
                TOTAL RESCUES
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-2xl font-black tabular-nums leading-none text-[var(--text-primary)]"
              >
                {userStats.donationsAccepted.toLocaleString()}
              </span>
              <span className="text-xs font-black text-orange-500 uppercase tracking-wide">
                Donated
              </span>
            </div>
          </div>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-12">
        <RewardsMarketplace />
      </div>
    </div>
  );
};

export default NGORewards;
