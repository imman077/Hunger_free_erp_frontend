import { useAuthStore } from "../../../../global/store/auth-store";
import { useDonorStore } from "../../store/donor-store";
import { getPaymentMethodsApi } from "../api/get_payment_methods/get_payment_methods_api";
import {
  donorPaymentMethodsInputModel,
} from "../store/donor_payment_methods_store";
import type { donorPaymentMethodsFormData } from "../store/donor_payment_methods_store";

export const onInit = async () => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    donorPaymentMethodsInputModel.update({ loading: true });

    const res = await getPaymentMethodsApi({ userId: String(userId) });
    const paymentMethods = res?.data || { bankAccounts: [], upiIds: [] };

    // Map bank accounts — fallback id using index if backend returns null
    const mappedBankAccounts = (paymentMethods.bankAccounts || []).map((b: any, index: number) => ({
      id: b?.id || `bank-${index}`,
      bankName: b?.bankName || "",
      accountHolder: b?.accountHolder || "",
      accountNumber: b?.accountNumber || "",
      ifscCode: b?.ifscCode || "",
      isPrimary: b?.isPrimary ?? false,
      isVerified: b?.isVerified ?? false,
    }));

    // Map UPI IDs — fallback id using index if backend returns null
    const mappedUpiIds = (paymentMethods.upiIds || []).map((u: any, index: number) => ({
      id: u?.id || `upi-${index}`,
      vpa: u?.vpa || "",
      label: u?.label || "",
      isPrimary: u?.isPrimary ?? false,
      isVerified: u?.isVerified ?? false,
    }));

    const primaryBank = mappedBankAccounts.find((b: any) => b.isPrimary) || mappedBankAccounts[0];
    const primaryUpi = mappedUpiIds.find((u: any) => u.isPrimary) || mappedUpiIds[0];

    // Merge into the shared donor store so both profile page & payments page stay in sync
    const store = useDonorStore.getState();
    store.setDonorData({
      ...store.data,
      bankAccounts: mappedBankAccounts,
      upiIds: mappedUpiIds,
      profile: {
        ...store.data.profile,
        bankName: primaryBank?.bankName || store.data.profile.bankName || "",
        accountNumber: primaryBank?.accountNumber || store.data.profile.accountNumber || "",
        upiId: primaryUpi?.vpa || store.data.profile.upiId || "",
        branch: primaryBank?.ifscCode || store.data.profile.branch || "",
      },
    });

    donorPaymentMethodsInputModel.update({ loading: false });
  } catch (err) {
    console.error("Payment methods load failed:", err);
    donorPaymentMethodsInputModel.update({ loading: false });
  }
};

export const onDestroy = () => {
  donorPaymentMethodsInputModel.reset();
};

export const resetForm = () => {
  donorPaymentMethodsInputModel.reset();
};

export const validateForm = (
  _data: Partial<donorPaymentMethodsFormData>,
): string[] => {
  const errors: string[] = [];
  return errors;
};
