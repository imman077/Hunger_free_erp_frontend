import { useMemo } from "react";
import { Building2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../global/components/reusable-components/PageHeader";
import { useVolunteerRewards } from "./controller/rewards_controller";
import RewardsMarketplace from "./components/RewardsMarketplace";

const VolunteerRewards = () => {
  const navigate = useNavigate();
  const { currentPoints, isLoading } = useVolunteerRewards();

  const userStats = useMemo(() => {
    return {
      totalPoints: currentPoints || 0,
    };
  }, [currentPoints]);

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
        title="My Rewards"
        subtitle="Spend your points here"
        className="mb-8"
        showPointsCard={true}
        points={userStats.totalPoints}
      >
        {/* Payout Vault Card */}
        <div
          onClick={() => navigate("vault")}
          className="flex items-center gap-4 border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 px-5 rounded-md text-left hover:border-[#22c55e]/30 transition-all cursor-pointer group relative overflow-hidden shrink-0"
        >
          <div
            className="w-12 h-12 bg-green-500/8 border border-green-500/20 rounded-[14px] flex items-center justify-center shrink-0 text-[#22c55e] group-hover:scale-105 transition-transform"
          >
            <Building2 size={24} />
          </div>
          <div className="text-start">
            <div className="flex items-center gap-1.5 mb-1">
              <p
                className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-70 leading-none"
              >
                PAYOUT VAULT
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="text-md font-black uppercase leading-none text-[var(--text-primary)]"
              >
                Manage Bank
              </span>
              <ChevronRight size={16} className="text-[#22c55e]" />
            </div>
          </div>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-12 pt-4">
        <RewardsMarketplace />
      </div>
    </div>
  );
};

export default VolunteerRewards;
