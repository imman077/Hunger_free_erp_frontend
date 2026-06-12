import { useUserStore } from "../store/user-store";

export const useUsers = () => {
  const { data, setUserData, fetchUsers, isLoading, error } = useUserStore();
  const users = data.users;

  return {
    users,
    setUserData,
    fetchUsers,
    isLoading,
    error,
  };
};
