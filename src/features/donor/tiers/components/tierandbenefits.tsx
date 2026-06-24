import { useDonorStore } from "../../store/donor-store";
import GlobalTiersOverview from "../../../../global/components/reusable-components/GlobalTiersOverview";

const TierAndBenefits = () => {
  const { data } = useDonorStore();
  const totalPoints = data.currentPoints || 0;

  return <GlobalTiersOverview role="donor" totalPoints={totalPoints} />;
};

export default TierAndBenefits;
