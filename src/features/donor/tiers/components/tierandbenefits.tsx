import { useEffect } from "react";
import { useDonorStore } from "../../store/donor-store";
import GlobalTiersOverview from "../../../../global/components/reusable-components/GlobalTiersOverview";
import { onInit } from "../controller/tiers_controller";

const TierAndBenefits = () => {
  const { data } = useDonorStore();
  const totalPoints = data.currentPoints || 0;

  useEffect(() => {
    onInit();
  }, []);

  return <GlobalTiersOverview role="donor" totalPoints={totalPoints} />;
};

export default TierAndBenefits;
