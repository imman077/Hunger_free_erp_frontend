import { useVolunteerStore } from "../../store/volunteer-store";

export const useVolunteerTasks = () => {
  const { tasks, isLoading, error } = useVolunteerStore();

  return {
    tasks,
    isLoading,
    error,
  };
};
