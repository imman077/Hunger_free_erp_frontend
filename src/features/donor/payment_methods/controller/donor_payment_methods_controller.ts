import { useAuthStore } from "../../../../global/store/auth-store";
import { useDonorStore } from "../../store/donor-store";
import { getPaymentMethodsApi } from "../api/get_payment_methods/get_payment_methods_api";
import { addBankAccountApi } from "../api/add_bank_account/add_bank_account_api";
import { updateBankAccountApi } from "../api/update_bank_account/update_bank_account_api";
import { removeBankAccountApi } from "../api/remove_bank_account/remove_bank_account_api";
import { addUpiApi } from "../api/add_upi/add_upi_api";
import { removeUpiApi } from "../api/remove_upi/remove_upi_api";
import {
  donorPaymentMethodsInputModel,
} from "../store/donor_payment_methods_store";
import type { donorPaymentMethodsFormData } from "../store/donor_payment_methods_store";
import { toast } from "sonner";
import { mapBankAccounts, mapUpiIds } from "../../store/map-payment-methods";

const updateLocalStore = (paymentMethods: any) => {
  const mappedBankAccounts = mapBankAccounts(paymentMethods.bankAccounts);
  const mappedUpiIds = mapUpiIds(paymentMethods.upiIds);

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
};

export const onInit = async () => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    donorPaymentMethodsInputModel.update({ loading: true });

    const res = await getPaymentMethodsApi({ userId: String(userId) });
    const paymentMethods = res?.data || { bankAccounts: [], upiIds: [] };

    updateLocalStore(paymentMethods);

    donorPaymentMethodsInputModel.update({ loading: false });
  } catch (err) {
    console.error("Payment methods load failed:", err);
    donorPaymentMethodsInputModel.update({ loading: false });
  }
};

export const handleAddBankAccount = async (input: {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  isPrimary: boolean;
}) => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    donorPaymentMethodsInputModel.update({ loading: true });
    const res = await addBankAccountApi({
      userId: String(userId),
      input,
    });

    if (res?.data) {
      updateLocalStore(res.data);
      toast.success("Bank Account Added", { description: `${input.bankName} has been linked.` });
    }
  } catch (err: any) {
    console.error("Add bank account failed:", err);
    toast.error(err?.message || "Failed to add bank account");
  } finally {
    donorPaymentMethodsInputModel.update({ loading: false });
  }
};

export const handleUpdateBankAccount = async (accountId: string, input: {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  isPrimary: boolean;
}) => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    donorPaymentMethodsInputModel.update({ loading: true });
    const res = await updateBankAccountApi({
      userId: String(userId),
      accountId,
      input,
    });

    if (res?.data) {
      updateLocalStore(res.data);
      toast.success("Account Updated", { description: `${input.bankName} has been updated.` });
    }
  } catch (err: any) {
    console.error("Update bank account failed:", err);
    toast.error(err?.message || "Failed to update bank account");
  } finally {
    donorPaymentMethodsInputModel.update({ loading: false });
  }
};

export const handleRemoveBankAccount = async (accountId: string) => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    donorPaymentMethodsInputModel.update({ loading: true });
    const res = await removeBankAccountApi({
      userId: String(userId),
      accountId,
    });

    if (res?.data) {
      updateLocalStore(res.data);
      toast.error("Bank Account removed");
    }
  } catch (err: any) {
    console.error("Remove bank account failed:", err);
    toast.error(err?.message || "Failed to remove bank account");
  } finally {
    donorPaymentMethodsInputModel.update({ loading: false });
  }
};

export const handleAddUpi = async (input: {
  vpa: string;
  label: string;
  isPrimary: boolean;
}) => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    donorPaymentMethodsInputModel.update({ loading: true });
    const res = await addUpiApi({
      userId: String(userId),
      input,
    });

    if (res?.data) {
      updateLocalStore(res.data);
      toast.success("UPI ID Linked", { description: `${input.vpa} is now active.` });
    }
  } catch (err: any) {
    console.error("Add UPI failed:", err);
    toast.error(err?.message || "Failed to link UPI ID");
  } finally {
    donorPaymentMethodsInputModel.update({ loading: false });
  }
};

export const handleRemoveUpi = async (upiId: string) => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    donorPaymentMethodsInputModel.update({ loading: true });
    const res = await removeUpiApi({
      userId: String(userId),
      upiId,
    });

    if (res?.data) {
      updateLocalStore(res.data);
      toast.error("UPI Identity removed");
    }
  } catch (err: any) {
    console.error("Remove UPI failed:", err);
    toast.error(err?.message || "Failed to remove UPI ID");
  } finally {
    donorPaymentMethodsInputModel.update({ loading: false });
  }
};

export const handleUpdateUpi = async (upiId: string, input: {
  vpa: string;
  label: string;
  isPrimary: boolean;
}) => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    donorPaymentMethodsInputModel.update({ loading: true });
    
    // Remove existing UPI ID
    await removeUpiApi({
      userId: String(userId),
      upiId,
    });

    // Add updated UPI ID
    const res = await addUpiApi({
      userId: String(userId),
      input,
    });

    if (res?.data) {
      updateLocalStore(res.data);
      toast.success("UPI Identity Modified", { description: `${input.vpa} has been updated.` });
    }
  } catch (err: any) {
    console.error("Update UPI failed:", err);
    toast.error(err?.message || "Failed to update UPI ID");
  } finally {
    donorPaymentMethodsInputModel.update({ loading: false });
  }
};

export const handleSetPrimaryBank = async (accountId: string) => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    donorPaymentMethodsInputModel.update({ loading: true });
    const store = useDonorStore.getState();
    const bankAccounts = store.data.bankAccounts;

    let updatedMethods = null;
    for (const bank of bankAccounts) {
      const isTarget = bank.id === accountId;
      if ((isTarget && !bank.isPrimary) || (!isTarget && bank.isPrimary)) {
        const res = await updateBankAccountApi({
          userId: String(userId),
          accountId: bank.id,
          input: {
            bankName: bank.bankName,
            accountHolder: bank.accountHolder,
            accountNumber: bank.accountNumber,
            ifscCode: bank.ifscCode,
            isPrimary: isTarget,
          },
        });
        if (res?.data) {
          updatedMethods = res.data;
        }
      }
    }

    if (updatedMethods) {
      updateLocalStore(updatedMethods);
      toast.success("Primary Account Updated");
    }
  } catch (err: any) {
    console.error("Set primary bank failed:", err);
    toast.error("Failed to set primary bank account");
  } finally {
    donorPaymentMethodsInputModel.update({ loading: false });
  }
};

export const handleSetPrimaryUpi = async (upiId: string) => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    donorPaymentMethodsInputModel.update({ loading: true });
    const store = useDonorStore.getState();
    const upiIds = store.data.upiIds;

    let updatedMethods = null;
    for (const upi of upiIds) {
      const isTarget = upi.id === upiId;
      if ((isTarget && !upi.isPrimary) || (!isTarget && upi.isPrimary)) {
        await removeUpiApi({
          userId: String(userId),
          upiId: upi.id,
        });

        const res = await addUpiApi({
          userId: String(userId),
          input: {
            vpa: upi.vpa,
            label: upi.label,
            isPrimary: isTarget,
          },
        });
        if (res?.data) {
          updatedMethods = res.data;
        }
      }
    }

    if (updatedMethods) {
      updateLocalStore(updatedMethods);
      toast.success("Primary VPA Updated");
    }
  } catch (err: any) {
    console.error("Set primary UPI failed:", err);
    toast.error("Failed to set primary UPI ID");
  } finally {
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
