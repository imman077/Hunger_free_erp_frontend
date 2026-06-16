import { useUserStore } from "../../store/user_store";

export const useNgos = () => {
  const { data, updateNgo, setUserData } = useUserStore();
  const ngos = data.ngos;

  return {
    ngos,
    updateNgo,
    setUserData,
  };
};
