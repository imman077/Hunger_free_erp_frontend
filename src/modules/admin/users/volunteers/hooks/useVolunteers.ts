import { useUserStore } from "../../store/user-store";

export const useVolunteers = () => {
  const { data, updateVolunteer, setUserData } = useUserStore();
  const volunteers = data.volunteers;

  return {
    volunteers,
    updateVolunteer,
    setUserData,
  };
};
