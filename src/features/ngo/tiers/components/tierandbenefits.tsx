import { useNgoRewards } from "../../rewards/controller/rewards_controller";
import GlobalTiersOverview from "../../../../global/components/reusable-components/GlobalTiersOverview";

const TierAndBenefits = () => {
  const { currentPoints } = useNgoRewards();
  const totalPoints = currentPoints || 0;

  return <GlobalTiersOverview role="ngo" totalPoints={totalPoints} />;
};

export default TierAndBenefits;
