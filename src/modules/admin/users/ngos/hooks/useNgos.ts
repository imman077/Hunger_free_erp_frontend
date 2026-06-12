import { useUserStore } from "../../store/user-store";

export const useNgos = () => {
  const { data, updateNgo, setUserData } = useUserStore();
  const ngos = data.ngos;

  return {
    ngos,
    updateNgo,
    setUserData,
  };
};
