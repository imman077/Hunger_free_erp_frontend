import { memo, useState } from "react";
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
import ResuableInput from "../../../../global/components/reusable-components/Input";
import ResuableModal from "../../../../global/components/reusable-components/Modal";
import ResuableDrawer from "../../../../global/components/reusable-components/Drawer";
import type { BankAccount, UpiId } from "../../store/donor-schemas";
import {
  handleAddBankAccount,
  handleUpdateBankAccount,
  handleRemoveBankAccount,
  handleAddUpi,
  handleRemoveUpi,
  handleUpdateUpi,
  handleSetPrimaryBank,
  handleSetPrimaryUpi,
} from "../controller/donor_payment_methods_controller";

interface Props {
  bankAccounts: BankAccount[];
  upiIds: UpiId[];
  isLoading?: boolean;
}

export const PaymentMethodsBodyField = memo(({ bankAccounts, upiIds, isLoading }: Props) => {
  const [activeTab, setActiveTab] = useState<"bank" | "upi">("bank");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [methodType, setMethodType] = useState<"bank" | "upi">("bank");
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleOpenAddBank = () => {
    setMethodType("bank");
    setBankForm({ bankName: "", accountHolder: "", accountNumber: "", ifscCode: "", isPrimary: bankAccounts.length === 0 });
    setIsModalOpen(true);
  };

  const handleOpenAddUpi = () => {
    setMethodType("upi");
    setUpiForm({ vpa: "", label: "", isPrimary: upiIds.length === 0 });
    setIsModalOpen(true);
  };

  const saveBank = async () => {
    await handleAddBankAccount(bankForm);
    setIsModalOpen(false);
    setBankForm({ bankName: "", accountHolder: "", accountNumber: "", ifscCode: "", isPrimary: false });
  };

  const saveUpi = async () => {
    await handleAddUpi(upiForm);
    setIsModalOpen(false);
    setUpiForm({ vpa: "", label: "", isPrimary: false });
  };

  const deleteBank = async (id: string) => {
    await handleRemoveBankAccount(id);
  };

  const deleteUpi = async (id: string) => {
    await handleRemoveUpi(id);
  };

  const setPrimaryBank = async (id: string) => {
    await handleSetPrimaryBank(id);
  };

  const setPrimaryUpi = async (id: string) => {
    await handleSetPrimaryUpi(id);
  };

  const handleEditBank = (account: BankAccount) => {
    setMethodType("bank");
    setEditingId(account.id);
    setBankForm({ bankName: account.bankName, accountHolder: account.accountHolder, accountNumber: account.accountNumber, ifscCode: account.ifscCode, isPrimary: account.isPrimary });
    setIsEditDrawerOpen(true);
  };

  const handleEditUpi = (upi: UpiId) => {
    setMethodType("upi");
    setEditingId(upi.id);
    setUpiForm({ vpa: upi.vpa, label: upi.label, isPrimary: upi.isPrimary });
    setIsEditDrawerOpen(true);
  };

  const updateBank = async () => {
    if (!editingId) return;
    await handleUpdateBankAccount(editingId, bankForm);
    setIsEditDrawerOpen(false);
    setEditingId(null);
  };

  const updateUpi = async () => {
    if (!editingId) return;
    await handleUpdateUpi(editingId, upiForm);
    setIsEditDrawerOpen(false);
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-green-500 animate-pulse">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-start space-y-2">
          <h1 className="text-4xl font-black tracking-tight uppercase leading-none" style={{ color: "var(--text-primary)" }}>
            Payment Methods
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
            Manage Settlements
          </p>
        </div>
        <div className="flex items-center gap-4 p-1.5 rounded-lg border shadow-sm" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
          {(["bank", "upi"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "shadow-sm border" : "hover:bg-[var(--bg-primary)]"}`}
              style={{
                backgroundColor: activeTab === tab ? "var(--bg-primary)" : "transparent",
                borderColor: activeTab === tab ? "var(--border-color)" : "transparent",
                color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)",
              }}
            >
              {tab === "bank" ? "Bank Accounts" : "UPI Identities"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="text-start">
            <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: "var(--text-primary)" }}>
              {activeTab === "bank" ? "Saved Accounts" : "Linked Virtual IDs"}
            </h2>
            <div className="w-12 h-1 bg-green-500 mt-2" />
          </div>
          <button
            onClick={activeTab === "bank" ? handleOpenAddBank : handleOpenAddUpi}
            className="group flex items-center gap-3 px-6 py-4 bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-green-500/20"
          >
            <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            Add New {activeTab === "bank" ? "Method" : "VPA"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeTab === "bank"
            ? bankAccounts.map((account) => (
                <div key={account.id} className="border p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 border flex items-center justify-center rounded-lg animate-in fade-in" style={{ backgroundColor: "rgba(14,165,233,0.08)", borderColor: "rgba(14,165,233,0.2)" }}>
                      <Building2 className="text-sky-400" size={24} />
                    </div>
                    <div className="flex items-center gap-3">
                      {account.isPrimary ? (
                        <span className="px-2.5 py-1 text-[#22c55e] text-[9px] font-black uppercase tracking-widest rounded-md border" style={{ backgroundColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)" }}>Primary</span>
                      ) : (
                        <button onClick={() => setPrimaryBank(account.id)} className="px-2.5 py-1 text-sky-500 text-[9px] font-black uppercase tracking-widest rounded-md border transition-all active:scale-95" style={{ backgroundColor: "rgba(14,165,233,0.08)", borderColor: "rgba(14,165,233,0.2)" }}>SET PRIMARY</button>
                      )}
                      <button onClick={() => handleEditBank(account)} className="p-1.5 transition-all hover:scale-110" style={{ color: "var(--text-muted)" }}><Edit2 size={16} /></button>
                      <button onClick={() => deleteBank(account.id)} className="p-1.5 transition-all hover:text-red-500 hover:scale-110" style={{ color: "var(--text-muted)" }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="mb-6 text-start flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight leading-none" style={{ color: "var(--text-primary)" }}>{account.bankName}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] mt-2" style={{ color: "var(--text-muted)" }}>{account.accountHolder}</p>
                    </div>
                    {account.isVerified ? (
                      <span className="px-2.5 py-1 text-[#22c55e] text-[8px] font-black uppercase tracking-widest rounded-md border flex items-center gap-1 shrink-0 h-fit" style={{ backgroundColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)" }}>
                        <CheckCircle2 size={10} strokeWidth={3} />
                        VERIFIED
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded-md border flex items-center gap-1.5 shrink-0 h-fit animate-pulse" style={{ backgroundColor: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.2)" }}>
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        PENDING
                      </span>
                    )}
                  </div>
                  <div className="w-full h-px mb-5" style={{ backgroundColor: "var(--border-color)" }} />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-start space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest leading-none" style={{ color: "var(--text-muted)" }}>Account Number</p>
                      <p className="text-[14px] font-black tabular-nums tracking-wider leading-none" style={{ color: "var(--text-primary)" }}>{account.accountNumber}</p>
                    </div>
                    <div className="text-start space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest leading-none" style={{ color: "var(--text-muted)" }}>IFSC Code</p>
                      <p className="text-[14px] font-black uppercase tracking-tight leading-none" style={{ color: "var(--text-primary)" }}>{account.ifscCode}</p>
                    </div>
                  </div>
                </div>
              ))
            : upiIds.map((upi) => (
                <div key={upi.id} className="border p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group flex items-start gap-5" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
                  <div className="w-16 h-16 border flex items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)" }}>
                    <QrCode className="text-[#22c55e]" size={32} />
                  </div>
                  <div className="flex-1 text-start min-w-0 py-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {upi.label && upi.label.toUpperCase() !== "PRIMARY" && (
                          <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>{upi.label}</p>
                        )}
                        {upi.isPrimary ? (
                          <span className="px-2 py-0.5 text-[#22c55e] text-[8px] font-black uppercase tracking-widest rounded-md border" style={{ backgroundColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)" }}>Primary</span>
                        ) : (
                          <button onClick={() => setPrimaryUpi(upi.id)} className="px-2.5 py-1 text-sky-500 text-[9px] font-black uppercase tracking-widest rounded-md border transition-all active:scale-95" style={{ backgroundColor: "rgba(14,165,233,0.08)", borderColor: "rgba(14,165,233,0.2)" }}>SET PRIMARY</button>
                        )}
                        {upi.isVerified ? (
                          <span className="px-2 py-0.5 text-[#22c55e] text-[8px] font-black uppercase tracking-widest rounded-md border flex items-center gap-0.5" style={{ backgroundColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)" }}>
                            <CheckCircle2 size={9} strokeWidth={3} />
                            VERIFIED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded-md border flex items-center gap-0.5 animate-pulse" style={{ backgroundColor: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.2)" }}>
                            <div className="w-1 h-1 bg-amber-500 rounded-full" />
                            PENDING
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-black truncate uppercase tracking-tight" style={{ color: "var(--text-primary)" }}>{upi.vpa}</h3>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#22c55e]"><ShieldCheck size={16} strokeWidth={2.5} /><span className="text-[10px] font-black uppercase tracking-widest">Secure VPA</span></div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleEditUpi(upi)} className="p-1.5 transition-all hover:scale-110" style={{ color: "var(--text-muted)" }}><Edit2 size={16} /></button>
                        <button onClick={() => deleteUpi(upi.id)} className="p-1.5 transition-all hover:text-red-500 hover:scale-110" style={{ color: "var(--text-muted)" }}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Empty State */}
        {((activeTab === "bank" && bankAccounts.length === 0) || (activeTab === "upi" && upiIds.length === 0)) && (
          <div className="py-32 flex flex-col items-center justify-center border border-dashed rounded-sm" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
            <div className="w-24 h-24 shadow-sm border flex items-center justify-center rounded-3xl mb-8" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
              <CreditCard style={{ color: "var(--text-muted)" }} size={48} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight" style={{ color: "var(--text-primary)" }}>No Payment Vaults</h3>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mt-3" style={{ color: "var(--text-muted)" }}>
              Initializing secure link for {activeTab === "bank" ? "Bank settlement" : "Instant UPI"} transfer
            </p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <ResuableModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} title={methodType === "bank" ? "Add Bank Account" : "Link UPI ID"} subtitle={methodType === "bank" ? "Secure account for settlements" : "Virtual payment address link"} size="md" icon={methodType === "bank" ? <Landmark size={20} /> : <Smartphone size={20} />}>
        <div className="space-y-4">
          {methodType === "bank" ? (
            <div className="space-y-3">
              <ResuableInput label="Institution Name" placeholder="e.g. HDFC BANK" value={bankForm.bankName} onChange={(val: any) => setBankForm({ ...bankForm, bankName: val })} required />
              <ResuableInput label="Account Holder" placeholder="Legal Name as per Records" value={bankForm.accountHolder} onChange={(val: any) => setBankForm({ ...bankForm, accountHolder: val })} required />
              <ResuableInput label="Account Number" placeholder="Primary Settlement Account" value={bankForm.accountNumber} onChange={(val: any) => setBankForm({ ...bankForm, accountNumber: val })} required />
              <ResuableInput label="IFSC Identifier" placeholder="e.g. HDFC0001234" value={bankForm.ifscCode} onChange={(val: any) => setBankForm({ ...bankForm, ifscCode: val })} required />
              <div className="pt-4">
                <button onClick={saveBank} className="w-full py-3.5 bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-sm hover:opacity-90 transition-all shadow-xl shadow-green-500/10 active:scale-[0.98]">Add</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <ResuableInput label="VPA ADDRESS" placeholder="e.g. user@okaxis" value={upiForm.vpa} onChange={(val: any) => setUpiForm({ ...upiForm, vpa: val })} required />
              <ResuableInput label="Identity Label" placeholder="e.g. PRIMARY, BUSINESS" value={upiForm.label} onChange={(val: any) => setUpiForm({ ...upiForm, label: val })} required />
              <div className="pt-4">
                <button onClick={saveUpi} className="w-full py-3.5 bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-sm hover:opacity-90 transition-all shadow-xl shadow-green-500/10 active:scale-[0.98]">Link</button>
              </div>
            </div>
          )}
        </div>
      </ResuableModal>

      {/* Edit Drawer */}
      <ResuableDrawer isOpen={isEditDrawerOpen} onClose={() => setIsEditDrawerOpen(false)} title={methodType === "bank" ? "Edit Bank Account" : "Edit UPI ID"} subtitle={methodType === "bank" ? "Update your bank details" : "Modify your virtual ID"} size="md">
        <div className="space-y-4">
          {methodType === "bank" ? (
            <div className="space-y-3">
              <ResuableInput label="Institution Name" placeholder="e.g. HDFC BANK" value={bankForm.bankName} onChange={(val: any) => setBankForm({ ...bankForm, bankName: val })} required />
              <ResuableInput label="Account Holder" placeholder="Legal Name as per Records" value={bankForm.accountHolder} onChange={(val: any) => setBankForm({ ...bankForm, accountHolder: val })} required />
              <ResuableInput label="Account Number" placeholder="Primary Settlement Account" value={bankForm.accountNumber} onChange={(val: any) => setBankForm({ ...bankForm, accountNumber: val })} required />
              <ResuableInput label="IFSC Identifier" placeholder="e.g. HDFC0001234" value={bankForm.ifscCode} onChange={(val: any) => setBankForm({ ...bankForm, ifscCode: val })} required />
              <div className="flex items-center gap-3 p-3 border rounded-sm" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
                <input type="checkbox" id="editPrimaryBank" checked={bankForm.isPrimary} onChange={(e) => setBankForm({ ...bankForm, isPrimary: e.target.checked })} className="w-4 h-4 accent-green-500" />
                <label htmlFor="editPrimaryBank" className="text-[10px] font-black uppercase tracking-widest cursor-pointer" style={{ color: "var(--text-secondary)" }}>Set as Primary Settlement Vault</label>
              </div>
              <div className="pt-4">
                <button onClick={updateBank} className="w-full py-4 bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all shadow-xl shadow-green-500/10 active:scale-[0.98]">Update</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <ResuableInput label="VPA ADDRESS" placeholder="e.g. user@okaxis" value={upiForm.vpa} onChange={(val: any) => setUpiForm({ ...upiForm, vpa: val })} required />
              <ResuableInput label="Identity Label" placeholder="e.g. PRIMARY, BUSINESS" value={upiForm.label} onChange={(val: any) => setUpiForm({ ...upiForm, label: val })} required />
              <div className="flex items-center gap-3 p-3 border rounded-sm" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
                <input type="checkbox" id="editPrimaryUpi" checked={upiForm.isPrimary} onChange={(e) => setUpiForm({ ...upiForm, isPrimary: e.target.checked })} className="w-4 h-4 accent-green-500" />
                <label htmlFor="editPrimaryUpi" className="text-[10px] font-black uppercase tracking-widest cursor-pointer" style={{ color: "var(--text-secondary)" }}>Set as Primary VPA</label>
              </div>
              <div className="pt-4">
                <button onClick={updateUpi} className="w-full py-4 bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all shadow-xl shadow-green-500/10 active:scale-[0.98]">Update</button>
              </div>
            </div>
          )}
        </div>
      </ResuableDrawer>
    </div>
  );
});

PaymentMethodsBodyField.displayName = "PaymentMethodsBodyField";
