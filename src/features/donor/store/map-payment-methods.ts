import type { BankAccount, UpiId } from "./donor-schemas";

export const mapBankAccounts = (bankAccounts: any[] | null | undefined): BankAccount[] => {
  return (bankAccounts || []).map((b: any, index: number) => ({
    id: b?.id || `bank-${index}`,
    bankName: b?.bankName || "",
    accountHolder: b?.accountHolder || "",
    accountNumber: b?.accountNumber || "",
    ifscCode: b?.ifscCode || "",
    isPrimary: b?.isPrimary ?? false,
    isVerified: b?.isVerified ?? false,
  }));
};

export const mapUpiIds = (upiIds: any[] | null | undefined): UpiId[] => {
  return (upiIds || []).map((u: any, index: number) => ({
    id: u?.id || `upi-${index}`,
    vpa: u?.vpa || "",
    label: u?.label || "",
    isPrimary: u?.isPrimary ?? false,
    isVerified: u?.isVerified ?? false,
  }));
};
