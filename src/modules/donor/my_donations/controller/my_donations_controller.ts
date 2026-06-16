import React from "react";
import { toast } from "sonner";
import { navigate } from "../../../../core/navigation";
import { useDonorStore } from "../../store/donor-store";
import { myDonationsInputModel } from "../store/my_donations_store";
import { getMyDonationsApi } from "../api/get_my_donations/get_my_donations_api";
import { verifyPickupApi } from "../api/verify_pickup/verify_pickup_api";
import { cancelDonationApi } from "../api/cancel_donation/cancel_donation_api";
import { deleteDonationApi } from "../api/delete_donation/delete_donation_api";

export const refreshData = async () => {
  const state = myDonationsInputModel.useStore.getState().myDonationsData;
  const status = state.statusFilter;
  const sortOrder = state.sortOrder;

  try {
    const res = await getMyDonationsApi({ status, sortOrder });
    if (res?.data) {
      // Sync with global store
      useDonorStore.setState((globalState) => ({
        data: {
          ...globalState.data,
          donationHistory: res.data.donations.map((d: any) => ({
            ...d,
            id: isNaN(Number(d.id)) ? d.id : Number(d.id),
          })),
        },
        donationStats: res.data.donationStats || globalState.donationStats,
      }));
    }
  } catch (err) {
    console.error("Failed to refresh donations:", err);
  }
};

export const onInit = () => {
  console.log("MyDonations page initialized");
  refreshData();
};

export const onDestroy = () => {
  console.log("MyDonations page destroyed");
};

export const handleDetailsClick = (donation: any) => {
  myDonationsInputModel.update({
    selectedDonation: donation,
    otpValue: "",
    otpDigits: ["", "", "", "", "", ""],
    otpError: "",
    ...(donation.status === "ASSIGNED"
      ? { isDetailsModalOpen: true }
      : { isGeneralDetailsOpen: true }),
  });
};

export const handleLiveTrackClick = (donation: any) => {
  if (donation.status !== "ASSIGNED") return;
  myDonationsInputModel.update({
    selectedDonation: donation,
    isTrackingModalOpen: true,
  });
};

export const handleCancelClick = (donationId: string, status?: string) => {
  if (status && status !== "PENDING") {
    toast.error("Only pending food donations can be cancelled.");
    return;
  }
  myDonationsInputModel.update({
    cancellingDonationId: donationId,
    cancelReason: "",
    isCancelModalOpen: true,
  });
};

export const confirmCancellation = async () => {
  const state = myDonationsInputModel.useStore.getState().myDonationsData;
  const id = state.cancellingDonationId;
  const reason = state.cancelReason;
  if (!id) return;

  myDonationsInputModel.update({
    isCancelModalOpen: false,
    cancellingId: id,
  });

  try {
    const result = await cancelDonationApi({ id, reason });
    if (result) {
      toast.success("Food donation cancelled successfully.");
    } else {
      toast.error("Failed to cancel donation. Please try again.");
    }
  } catch (err) {
    console.error("Cancel donation failed:", err);
    toast.error("Failed to cancel donation. Please try again.");
  } finally {
    myDonationsInputModel.update({
      cancellingId: null,
      cancellingDonationId: null,
    });
    refreshData();
  }
};

export const closeCancelModal = () => {
  myDonationsInputModel.update({
    isCancelModalOpen: false,
    cancellingDonationId: null,
  });
};

export const confirmDelete = async () => {
  const state = myDonationsInputModel.useStore.getState().myDonationsData;
  const id = state.deletingDonationId;
  if (!id) return;

  myDonationsInputModel.update({
    isDeleting: true,
  });

  try {
    const result = await deleteDonationApi({ id });
    if (result) {
      toast.success("Food donation deleted successfully.");
    } else {
      toast.error("Failed to delete donation. Please try again.");
    }
  } catch (err) {
    console.error("Delete donation failed:", err);
    toast.error("Failed to delete donation. Please try again.");
  } finally {
    myDonationsInputModel.update({
      isDeleting: false,
      isDeleteModalOpen: false,
      deletingDonationId: null,
    });
    refreshData();
  }
};

export const onOtpSubmit = async () => {
  const state = myDonationsInputModel.useStore.getState().myDonationsData;
  const selectedDonation = state.selectedDonation;
  const otpValue = state.otpValue;
  if (!selectedDonation || otpValue.length !== 6) return;

  myDonationsInputModel.update({
    isVerifying: true,
    otpError: "",
  });

  try {
    const result = await verifyPickupApi({ id: String(selectedDonation.id), otp: otpValue });
    if (result) {
      myDonationsInputModel.update({
        isDetailsModalOpen: false,
        isTrackingModalOpen: false,
        otpValue: "",
      });
      toast.success("OTP verified and pickup confirmed!");
    } else {
      myDonationsInputModel.update({
        otpError: "Invalid verification code. Please try again.",
      });
    }
  } catch (err) {
    console.error("OTP Verification failed:", err);
    myDonationsInputModel.update({
      otpError: "Invalid verification code. Please try again.",
    });
  } finally {
    myDonationsInputModel.update({
      isVerifying: false,
    });
    refreshData();
  }
};

export const confirmRedonate = () => {
  const state = myDonationsInputModel.useStore.getState().myDonationsData;
  const redonateDonation = state.redonateDonation;
  if (!redonateDonation) return;

  myDonationsInputModel.update({
    isRedonateModalOpen: false,
  });

  useDonorStore.getState().setRedonatePayload(redonateDonation);
  navigate("/donor/donations/create");

  myDonationsInputModel.update({
    redonateDonation: null,
  });
};

export const handleOtpDigitChange = (val: string, index: number, otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>) => {
  const cleanVal = val.replace(/\D/g, "");
  const state = myDonationsInputModel.useStore.getState().myDonationsData;
  const otpDigits = [...state.otpDigits];

  if (!cleanVal) {
    otpDigits[index] = "";
    myDonationsInputModel.update({
      otpDigits,
      otpValue: otpDigits.join(""),
    });
    return;
  }

  const digit = cleanVal.slice(-1);
  otpDigits[index] = digit;
  myDonationsInputModel.update({
    otpDigits,
    otpValue: otpDigits.join(""),
  });

  // Move to next input
  if (index < 5 && otpRefs.current[index + 1]) {
    otpRefs.current[index + 1]?.focus();
  }
};

export const handleOtpKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  index: number,
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>,
) => {
  if (e.key === "Backspace") {
    const state = myDonationsInputModel.useStore.getState().myDonationsData;
    const otpDigits = [...state.otpDigits];

    if (!otpDigits[index] && index > 0 && otpRefs.current[index - 1]) {
      otpDigits[index - 1] = "";
      myDonationsInputModel.update({
        otpDigits,
        otpValue: otpDigits.join(""),
      });
      otpRefs.current[index - 1]?.focus();
    }
  }
};

export const handleOtpPaste = (
  e: React.ClipboardEvent<HTMLInputElement>,
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>,
) => {
  e.preventDefault();
  const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
  if (pasteData.length === 6) {
    const newDigits = pasteData.split("");
    myDonationsInputModel.update({
      otpDigits: newDigits,
      otpValue: pasteData,
    });
    otpRefs.current[5]?.focus();
  }
};

export const handleOtpFocus = (
  index: number,
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>,
) => {
  const firstEmptyIndex = otpRefs.current.findIndex((ref) => ref && ref.value === "");
  if (firstEmptyIndex !== -1 && index > firstEmptyIndex) {
    otpRefs.current[firstEmptyIndex]?.focus();
  }
};
