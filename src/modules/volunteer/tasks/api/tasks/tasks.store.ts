import { create } from "zustand";
import type { VolunteerTask } from "./tasks.output";

interface VolunteerTasksState {
  nearbyPickups: VolunteerTask[];
  myTasks: VolunteerTask[];
  isLoading: boolean;
  error: string | null;
  setNearbyPickups: (tasks: VolunteerTask[]) => void;
  setMyTasks: (tasks: VolunteerTask[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVolunteerTasksStore = create<VolunteerTasksState>((set) => ({
  nearbyPickups: [],
  myTasks: [],
  isLoading: false,
  error: null,
  setNearbyPickups: (nearbyPickups) => set({ nearbyPickups }),
  setMyTasks: (myTasks) => set({ myTasks }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
