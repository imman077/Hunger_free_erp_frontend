import { useEnquiryStore } from "../store/enquiry-store";
import { toast } from "sonner";

export const useEnquiries = () => {
  const { registrations, rewards, fetchEnquiries, isLoading, approveRegistration, rejectRegistration } =
    useEnquiryStore();

  const handleApprove = async (
    id: string,
    name: string,
    type: "registrations" | "claims" | "payments" | "updates" | "rewards",
  ) => {
    if (type === "registrations") {
      await approveRegistration(id);
    }
    toast.success(`${name} has been approved!`);
  };

  const handleReject = async (
    id: string,
    name: string,
    type: "registrations" | "claims" | "payments" | "updates" | "rewards",
  ) => {
    if (type === "registrations") {
      await rejectRegistration(id);
    }
    toast.error(`${name} has been rejected.`);
  };

  return {
    registrations,
    rewards,
    fetchEnquiries,
    isLoading,
    actions: {
      approve: handleApprove,
      reject: handleReject,
    },
  };
};
