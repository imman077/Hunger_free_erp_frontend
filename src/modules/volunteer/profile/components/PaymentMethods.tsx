import { useState } from "react";
import {
  Building2,
  QrCode,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ShieldCheck,
  Landmark,
  Smartphone,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import ResuableInput from "../../../../global/components/resuable-components/input";
import ResuableModal from "../../../../global/components/resuable-components/modal";
import ResuableDrawer from "../../../../global/components/resuable-components/drawer";

interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  isPrimary: boolean;
  isVerified: boolean;
}

interface UpiId {
  id: string;
  vpa: string;
  label: string;
  isPrimary: boolean;
  isVerified: boolean;
}

const VolunteerPaymentMethods = () => {
  const [activeTab, setActiveTab] = useState<"bank" | "upi">("bank");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [methodType, setMethodType] = useState<"bank" | "upi">("bank");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Mock Data for Volunteer
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      bankName: "HDFC BANK",
      accountHolder: "ADITYA VERMA",
      accountNumber: "**** **** 1234",
      ifscCode: "HDFC0001234",
      isPrimary: true,
      isVerified: true,
    },
  ]);

  const [upiIds, setUpiIds] = useState<UpiId[]>([
    {
      id: "1",
      vpa: "volunteer@okaxis",
      label: "PRIMARY UPI",
      isPrimary: true,
      isVerified: true,
    },
  ]);

  // Form States
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    isPrimary: false,
  });

  const [upiForm, setUpiForm] = useState({
    vpa: "",
    label: "",
    isPrimary: false,
  });

  const handleAddBank = () => {
    setMethodType("bank");
    setBankForm({
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      ifscCode: "",
      isPrimary: bankAccounts.length === 0,
    });
    setIsModalOpen(true);
  };

  const handleAddUpi = () => {
    setMethodType("upi");
    setUpiForm({
      vpa: "",
      label: "",
      isPrimary: upiIds.length === 0,
    });
    setIsModalOpen(true);
  };

  const saveBank = () => {
    const newBank: BankAccount = {
      id: Math.random().toString(36).substr(2, 9),
      ...bankForm,
      isVerified: false,
    };
    if (newBank.isPrimary) {
      setBankAccounts(
        [...bankAccounts, newBank].map((b) => ({
          ...b,
          isPrimary: b.id === newBank.id,
        })),
      );
    } else {
      setBankAccounts([...bankAccounts, newBank]);
    }
    setIsModalOpen(false);
    toast.success("Bank Account Added", {
      description: `${bankForm.bankName} has been linked for reward payouts.`,
    });
    setBankForm({
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      ifscCode: "",
      isPrimary: false,
    });
  };

  const saveUpi = () => {
    const newUpi: UpiId = {
      id: Math.random().toString(36).substr(2, 9),
      ...upiForm,
      isVerified: true,
    };
    if (newUpi.isPrimary) {
      setUpiIds(
        [...upiIds, newUpi].map((u) => ({
          ...u,
          isPrimary: u.id === newUpi.id,
        })),
      );
    } else {
      setUpiIds([...upiIds, newUpi]);
    }
    setIsModalOpen(false);
    toast.success("UPI ID Linked", {
      description: `${upiForm.vpa} is now active for instant reward transfers.`,
    });
    setUpiForm({ vpa: "", label: "", isPrimary: false });
  };

  const deleteBank = (id: string) => {
    setBankAccounts(bankAccounts.filter((b: BankAccount) => b.id !== id));
    toast.error("Bank Account removed", {
      description: "The payout method has been disconnected.",
    });
  };

  const deleteUpi = (id: string) => {
    setUpiIds(upiIds.filter((u: UpiId) => u.id !== id));
    toast.error("UPI ID removed", {
      description: "The UPI ID has been unlinked.",
    });
  };

  const setPrimaryBank = (id: string) => {
    setBankAccounts(
      bankAccounts.map((b) => ({
        ...b,
        isPrimary: b.id === id,
      })),
    );
    toast.success("Primary Account Updated", {
      description: "Default reward payout method has been changed.",
    });
  };

  const setPrimaryUpi = (id: string) => {
    setUpiIds(
      upiIds.map((u) => ({
        ...u,
        isPrimary: u.id === id,
      })),
    );
    toast.success("Primary UPI ID Updated", {
      description: "Default reward UPI ID has been changed.",
    });
  };

  const handleEditBank = (account: BankAccount) => {
    setMethodType("bank");
    setEditingId(account.id);
    setBankForm({
      bankName: account.bankName,
      accountHolder: account.accountHolder,
      accountNumber: account.accountNumber,
      ifscCode: account.ifscCode,
      isPrimary: account.isPrimary,
    });
    setIsEditDrawerOpen(true);
  };

  const handleEditUpi = (upi: UpiId) => {
    setMethodType("upi");
    setEditingId(upi.id);
    setUpiForm({
      vpa: upi.vpa,
      label: upi.label,
      isPrimary: upi.isPrimary,
    });
    setIsEditDrawerOpen(true);
  };

  const updateBank = () => {
    const updated = bankAccounts.map((b) =>
      b.id === editingId ? { ...b, ...bankForm } : b,
    );

    if (bankForm.isPrimary) {
      setBankAccounts(
        updated.map((b) => ({
          ...b,
          isPrimary: b.id === editingId,
        })),
      );
    } else {
      setBankAccounts(updated);
    }

    setIsEditDrawerOpen(false);
    toast.success("Account Updated", {
      description: "Changes have been saved successfully.",
    });
    setEditingId(null);
  };

  const updateUpi = () => {
    const updated = upiIds.map((u) =>
      u.id === editingId ? { ...u, ...upiForm } : u,
    );

    if (upiForm.isPrimary) {
      setUpiIds(
        updated.map((u) => ({
          ...u,
          isPrimary: u.id === editingId,
        })),
      );
    } else {
      setUpiIds(updated);
    }

    setIsEditDrawerOpen(false);
    toast.success("UPI ID Modified", {
      description: "The payment identifier has been updated.",
    });
    setEditingId(null);
  };

  return (
    <div
      className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-start space-y-2">
          <h1
            className="text-4xl font-black tracking-tight uppercase leading-none"
            style={{ color: "var(--text-primary)" }}
          >
            Payout Vault
          </h1>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--text-muted)" }}
          >
            Manage your reward payout methods
          </p>
        </div>

        <div
          className="flex items-center gap-4 p-1.5 rounded-sm border"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <button
            onClick={() => setActiveTab("bank")}
            className={`px-8 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "bank"
                ? "shadow-sm border"
                : "opacity-40 hover:opacity-100"
            }`}
            style={{
              backgroundColor:
                activeTab === "bank" ? "var(--bg-primary)" : "transparent",
              borderColor:
                activeTab === "bank" ? "var(--border-color)" : "transparent",
              color:
                activeTab === "bank"
                  ? "var(--color-emerald)"
                  : "var(--text-primary)",
            }}
          >
            Bank Accounts
          </button>
          <button
            onClick={() => setActiveTab("upi")}
            className={`px-8 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "upi"
                ? "shadow-sm border"
                : "opacity-40 hover:opacity-100"
            }`}
            style={{
              backgroundColor:
                activeTab === "upi" ? "var(--bg-primary)" : "transparent",
              borderColor:
                activeTab === "upi" ? "var(--border-color)" : "transparent",
              color:
                activeTab === "upi"
                  ? "var(--color-emerald)"
                  : "var(--text-primary)",
            }}
          >
            UPI IDs
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="text-start">
            <h2
              className="text-xl font-black uppercase tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {activeTab === "bank"
                ? "Verified Bank Accounts"
                : "Linked UPI IDs"}
            </h2>
            <div className="w-12 h-1 bg-[#22c55e] mt-2" />
          </div>
          <button
            onClick={activeTab === "bank" ? handleAddBank : handleAddUpi}
            className="group flex items-center gap-3 px-6 py-4 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-green-500/10"
            style={{ backgroundColor: "var(--color-emerald)" }}
          >
            <Plus
              size={16}
              strokeWidth={3}
              className="group-hover:rotate-90 transition-transform"
            />
            Add New {activeTab === "bank" ? "Account" : "UPI ID"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeTab === "bank"
            ? bankAccounts.map((account: BankAccount) => (
                <div
                  key={account.id}
                  className="border p-6 rounded-sm shadow-sm hover:shadow-md transition-all relative group"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-12 h-12 flex items-center justify-center rounded-sm border"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <Building2 className="text-[#22c55e]" size={24} />
                    </div>
                    <div className="flex items-center gap-3">
                      {account.isPrimary ? (
                        <span className="px-2.5 py-1 bg-green-500/10 text-[#22c55e] text-[9px] font-black uppercase tracking-widest rounded-sm border border-green-500/20">
                          Primary
                        </span>
                      ) : (
                        <button
                          onClick={() => setPrimaryBank(account.id)}
                          className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm border transition-all active:scale-95"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-muted)",
                          }}
                        >
                          SET PRIMARY
                        </button>
                      )}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditBank(account)}
                          className="p-1.5 transition-all"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteBank(account.id)}
                          className="p-1.5 hover:text-red-500 transition-all"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 text-start">
                    <h3
                      className="text-lg font-black uppercase tracking-tight leading-none"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {account.bankName}
                    </h3>
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.15em] mt-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {account.accountHolder}
                    </p>
                  </div>

                  <div
                    className="w-full h-px mb-5"
                    style={{ backgroundColor: "var(--border-color)" }}
                  />

                  {/* Details Container */}
                  <div className="flex items-start gap-9">
                    <div className="text-start space-y-1">
                      <p
                        className="text-[9px] font-black uppercase tracking-widest leading-none"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Account Number
                      </p>
                      <p
                        className="text-[14px] font-black tabular-nums tracking-wider leading-none"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {account.accountNumber}
                      </p>
                    </div>
                    <div className="text-start space-y-1">
                      <p
                        className="text-[9px] font-black uppercase tracking-widest leading-none"
                        style={{ color: "var(--text-muted)" }}
                      >
                        IFSC Code
                      </p>
                      <div className="flex items-center gap-4">
                        <p
                          className="text-[14px] font-black uppercase tracking-tight leading-none"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {account.ifscCode}
                        </p>

                        {/* Status Identifier */}
                        {account.isVerified ? (
                          <div className="flex items-center gap-1 text-[#22c55e]">
                            <CheckCircle2 size={13} strokeWidth={3} />
                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                              VERIFIED
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-500">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                              PENDING
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : upiIds.map((upi: UpiId) => (
                <div
                  key={upi.id}
                  className="border p-6 rounded-sm shadow-sm hover:shadow-md transition-all relative group flex items-start gap-5"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div
                    className="w-16 h-16 border flex items-center justify-center rounded-sm shrink-0"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <QrCode className="text-[#22c55e]" size={32} />
                  </div>

                  <div className="flex-1 text-start min-w-0 py-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <p
                          className="text-[9px] font-black uppercase tracking-[0.2em]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {upi.label}
                        </p>
                        {upi.isPrimary ? (
                          <span
                            className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-sm border"
                            style={{
                              backgroundColor: "var(--color-emerald-light)",
                              color: "var(--color-emerald-dark)",
                              borderColor: "var(--color-emerald)",
                            }}
                          >
                            Primary
                          </span>
                        ) : (
                          <button
                            onClick={() => setPrimaryUpi(upi.id)}
                            className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm border transition-all active:scale-95"
                            style={{
                              backgroundColor: "var(--bg-secondary)",
                              borderColor: "var(--border-color)",
                              color: "var(--text-muted)",
                            }}
                          >
                            SET PRIMARY
                          </button>
                        )}
                      </div>
                    </div>
                    <h3
                      className="text-lg font-black truncate uppercase tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {upi.vpa}
                    </h3>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#22c55e]">
                        <ShieldCheck size={16} strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Secure UPI
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditUpi(upi)}
                          className="p-1.5 transition-all"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteUpi(upi.id)}
                          className="p-1.5 hover:text-red-500 transition-all"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Empty State */}
        {((activeTab === "bank" && bankAccounts.length === 0) ||
          (activeTab === "upi" && upiIds.length === 0)) && (
          <div
            className="py-32 flex flex-col items-center justify-center border border-dashed rounded-sm"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className="w-24 h-24 shadow-sm border flex items-center justify-center rounded-3xl mb-8"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <CreditCard style={{ color: "var(--text-muted)" }} size={48} />
            </div>
            <h3
              className="text-2xl font-black uppercase tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              No Payment Methods
            </h3>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em] mt-3"
              style={{ color: "var(--text-muted)" }}
            >
              Add a {activeTab === "bank" ? "bank account" : "UPI ID"} to
              receive reward payouts
            </p>
          </div>
        )}
      </div>

      {/* Add New Modal */}
      <ResuableModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={methodType === "bank" ? "Add Bank Account" : "Link UPI ID"}
        subtitle={
          methodType === "bank"
            ? "Link a personal bank account for reward redemptions"
            : "Connect your UPI ID for instant reward payouts"
        }
        size="md"
        icon={
          methodType === "bank" ? (
            <Landmark size={20} />
          ) : (
            <Smartphone size={20} />
          )
        }
      >
        <div className="space-y-4">
          {methodType === "bank" ? (
            <div className="space-y-3">
              <ResuableInput
                label="Bank Name"
                placeholder="e.g. HDFC BANK"
                value={bankForm.bankName}
                onChange={(val) => setBankForm({ ...bankForm, bankName: val })}
                required
              />
              <ResuableInput
                label="Account Holder Name"
                placeholder="Your name as per bank records"
                value={bankForm.accountHolder}
                onChange={(val) =>
                  setBankForm({ ...bankForm, accountHolder: val })
                }
                required
              />
              <ResuableInput
                label="Account Number"
                placeholder="Personal Savings/Current Account"
                value={bankForm.accountNumber}
                onChange={(val) =>
                  setBankForm({ ...bankForm, accountNumber: val })
                }
                required
              />
              <ResuableInput
                label="IFSC Code"
                placeholder="e.g. HDFC0001234"
                value={bankForm.ifscCode}
                onChange={(val) => setBankForm({ ...bankForm, ifscCode: val })}
                required
              />

              <div className="pt-4">
                <button
                  onClick={saveBank}
                  className="w-full py-3.5 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-sm hover:opacity-90 transition-all shadow-xl shadow-green-500/10 active:scale-[0.98]"
                  style={{ backgroundColor: "var(--color-emerald)" }}
                >
                  Add Account
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <ResuableInput
                label="UPI ID"
                placeholder="e.g. volunteer@okaxis"
                value={upiForm.vpa}
                onChange={(val) => setUpiForm({ ...upiForm, vpa: val })}
                required
              />
              <ResuableInput
                label="Label"
                placeholder="e.g. PRIMARY, PERSONAL"
                value={upiForm.label}
                onChange={(val) => setUpiForm({ ...upiForm, label: val })}
                required
              />
              <div className="pt-4">
                <button
                  onClick={saveUpi}
                  className="w-full py-3.5 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-sm hover:opacity-90 transition-all shadow-xl shadow-green-500/10 active:scale-[0.98]"
                  style={{ backgroundColor: "var(--color-emerald)" }}
                >
                  Link UPI ID
                </button>
              </div>
            </div>
          )}
        </div>
      </ResuableModal>

      {/* Edit Drawer */}
      <ResuableDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title={methodType === "bank" ? "Edit Bank Account" : "Edit UPI ID"}
        subtitle={
          methodType === "bank"
            ? "Update your bank account details"
            : "Modify your UPI ID details"
        }
        size="md"
      >
        <div className="p-6 space-y-6">
          {methodType === "bank" ? (
            <div className="space-y-4">
              <ResuableInput
                label="Bank Name"
                placeholder="e.g. HDFC BANK"
                value={bankForm.bankName}
                onChange={(val) => setBankForm({ ...bankForm, bankName: val })}
                required
              />
              <ResuableInput
                label="Account Holder Name"
                placeholder="Full Name as per Bank records"
                value={bankForm.accountHolder}
                onChange={(val) =>
                  setBankForm({ ...bankForm, accountHolder: val })
                }
                required
              />
              <ResuableInput
                label="Account Number"
                placeholder="Bank Account Number"
                value={bankForm.accountNumber}
                onChange={(val) =>
                  setBankForm({ ...bankForm, accountNumber: val })
                }
                required
              />
              <ResuableInput
                label="IFSC Code"
                placeholder="e.g. HDFC0001234"
                value={bankForm.ifscCode}
                onChange={(val) => setBankForm({ ...bankForm, ifscCode: val })}
                required
              />

              <div
                className="flex items-center gap-3 p-3 border rounded-sm"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <input
                  type="checkbox"
                  id="primaryBank"
                  checked={bankForm.isPrimary}
                  onChange={(e) =>
                    setBankForm({ ...bankForm, isPrimary: e.target.checked })
                  }
                  className="w-4 h-4"
                  style={{ accentColor: "var(--color-emerald)" }}
                />
                <label
                  htmlFor="primaryBank"
                  className="text-[10px] font-black uppercase tracking-widest cursor-pointer"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Set as Primary Payout Vault
                </label>
              </div>

              <div className="pt-4">
                <button
                  onClick={updateBank}
                  className="w-full py-4 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all shadow-xl shadow-green-500/10 active:scale-[0.98]"
                  style={{ backgroundColor: "var(--color-emerald)" }}
                >
                  Update Account
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <ResuableInput
                label="UPI ID"
                placeholder="e.g. volunteer@okaxis"
                value={upiForm.vpa}
                onChange={(val) => setUpiForm({ ...upiForm, vpa: val })}
                required
              />
              <ResuableInput
                label="Label"
                placeholder="e.g. PRIMARY, PERSONAL"
                value={upiForm.label}
                onChange={(val) => setUpiForm({ ...upiForm, label: val })}
                required
              />

              <div
                className="flex items-center gap-3 p-3 border rounded-sm"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <input
                  type="checkbox"
                  id="primaryUpi"
                  checked={upiForm.isPrimary}
                  onChange={(e) =>
                    setUpiForm({ ...upiForm, isPrimary: e.target.checked })
                  }
                  className="w-4 h-4"
                  style={{ accentColor: "var(--color-emerald)" }}
                />
                <label
                  htmlFor="primaryUpi"
                  className="text-[10px] font-black uppercase tracking-widest cursor-pointer"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Set as Primary UPI ID
                </label>
              </div>

              <div className="pt-4">
                <button
                  onClick={updateUpi}
                  className="w-full py-4 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all shadow-xl shadow-green-500/10 active:scale-[0.98]"
                  style={{ backgroundColor: "var(--color-emerald)" }}
                >
                  Update UPI ID
                </button>
              </div>
            </div>
          )}
        </div>
      </ResuableDrawer>
    </div>
  );
};

export default VolunteerPaymentMethods;
