import { useUserStore } from "../../store/user_store";

export const useDonors = () => {
  const { data, updateDonor, setUserData } = useUserStore();
  const donors = data.donors;

  return {
    donors,
    updateDonor,
    setUserData,
  };
};
