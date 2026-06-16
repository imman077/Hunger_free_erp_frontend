import { useDonorStore } from "../../store/donor-store";

export const useDonorProfile = () => {
  const { data, isLoading, error } = useDonorStore();

  return {
    profile: data.profile,
    documents: data.documents,
    bankAccounts: data.bankAccounts,
    upiIds: data.upiIds,
    currentPoints: data.currentPoints,
    isLoading,
    error,
  };
};
