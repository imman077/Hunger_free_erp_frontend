import { useVolunteerRewards } from "../../rewards/controller/rewards_controller";
import GlobalTiersOverview from "../../../../global/components/reusable-components/GlobalTiersOverview";

const TierAndBenefits = () => {
  const { currentPoints } = useVolunteerRewards();
  const totalPoints = currentPoints || 0;

  return <GlobalTiersOverview role="volunteer" totalPoints={totalPoints} />;
};

export default TierAndBenefits;
