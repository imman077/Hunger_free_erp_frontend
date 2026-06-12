import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
  ClipboardList,
  UserCog,
  Gift,
  CreditCard,
  Settings2,
  Download,
} from "lucide-react";
import { Tabs, Tab } from "@heroui/react";
import ReusableTable from "../../../../global/components/resuable-components/table";
import ResuableDrawer from "../../../../global/components/resuable-components/drawer";
import DocumentPreviewModal from "../../../../global/components/resuable-components/DocumentPreviewModal";

import { useEnquiries } from "../hooks/useEnquiries";
import { NGO_ENQUIRY_COLUMNS } from "../store/enquiry-constants";

const NGOEnquiryPage = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const { registrations, actions } = useEnquiries();
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{
    name: string;
    type: string;
    issuer?: string;
  } | null>(null);

  const ngoEnquiries = registrations.filter((e) => e.type.includes("NGO"));

  const handleApprove = (id: string, name: string) => {
    actions.approve(id, name, "registrations");
    setIsDrawerOpen(false);
  };

  const handleReject = (id: string, name: string) => {
    actions.reject(id, name, "registrations");
    setIsDrawerOpen(false);
  };

  const renderCell = (item: any, columnKey: React.Key) => {
    const value = item[columnKey as string];

    switch (columnKey) {
      case "id":
        return (
          <span className="font-black text-[10px] tracking-widest text-slate-400">
            {value}
          </span>
        );
      case "name":
        return (
          <div className="flex flex-col">
            <span
              className="font-bold text-sm tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {value}
            </span>
            <span
              className="text-[10px] font-bold opacity-50 uppercase tracking-widest"
              style={{ color: "var(--text-secondary)" }}
            >
              {item.regNo}
            </span>
          </div>
        );
      case "priority":
        return (
          <span
            className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
              value === "high"
                ? "bg-hf-green/10 border-hf-green/20 text-hf-green"
                : value === "medium"
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-500"
            }`}
          >
            {value}
          </span>
        );
      case "actions":
        return (
          <button
            onClick={() => {
              setSelectedEnquiry(item);
              setIsDrawerOpen(true);
            }}
            className="p-2 hover:bg-hf-green/10 rounded-lg text-hf-green transition-colors group"
          >
            <Eye
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
        );
      default:
        return (
          <span
            className="text-xs font-bold"
            style={{ color: "var(--text-secondary)" }}
          >
            {value}
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-8 p-4 md:p-8">
      {/* Header */}
      {!hideHeader && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1
                className="text-3xl font-black uppercase tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                NGO Enquiries
              </h1>
              <p
                className="text-[11px] font-black uppercase tracking-widest opacity-40"
                style={{ color: "var(--text-secondary)" }}
              >
                Management System for NGO Requests
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <div className="w-full">
        <Tabs
          aria-label="NGO Enquiries"
          variant="underlined"
          classNames={{
            base: "w-full",
            tabList:
              "gap-6 sm:gap-8 w-full relative rounded-none p-0 border-b border-[var(--border-color)] overflow-x-auto no-scrollbar",
            cursor: "bg-hf-green h-0.5",
            tab: "max-w-fit px-0 h-12 whitespace-nowrap",
            tabContent:
              "group-data-[selected=true]:text-hf-green font-black uppercase tracking-widest text-[10px]",
          }}
        >
          <Tab
            key="registrations"
            title={
              <div className="flex items-center gap-2">
                <ClipboardList size={14} />
                <span>New NGOs</span>
                <span className="px-1.5 py-0.5 rounded bg-hf-green/10 text-hf-green text-[8px] ml-1">
                  {ngoEnquiries.length}
                </span>
              </div>
            }
          >
            <div
              className="mt-6 rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="overflow-x-auto">
                <ReusableTable
                  data={ngoEnquiries}
                  columns={NGO_ENQUIRY_COLUMNS}
                  renderCell={renderCell}
                />
              </div>
            </div>
          </Tab>

          <Tab
            key="rewards"
            title={
              <div className="flex items-center gap-2">
                <Gift size={14} />
                <span>Reward Claims</span>
              </div>
            }
          >
            <div className="mt-12 flex flex-col items-center justify-center p-20 opacity-30 border border-dashed rounded-3xl">
              <Gift size={48} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center">
                No NGO Reward Claims
              </p>
            </div>
          </Tab>

          <Tab
            key="payments"
            title={
              <div className="flex items-center gap-2">
                <CreditCard size={14} />
                <span>Payments Pending</span>
              </div>
            }
          >
            <div className="mt-12 flex flex-col items-center justify-center p-20 opacity-30 border border-dashed rounded-3xl">
              <CreditCard size={48} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center">
                No NGO Payment Enquiries
              </p>
            </div>
          </Tab>

          <Tab
            key="dropdowns"
            title={
              <div className="flex items-center gap-2">
                <Settings2 size={14} />
                <span>Dropdown Requests</span>
              </div>
            }
          >
            <div className="mt-12 flex flex-col items-center justify-center p-20 opacity-30 border border-dashed rounded-3xl">
              <Settings2 size={48} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center">
                No Master Configuration Requests
              </p>
            </div>
          </Tab>

          <Tab
            key="updates"
            title={
              <div className="flex items-center gap-2">
                <UserCog size={14} />
                <span>Profile Changes</span>
              </div>
            }
          >
            <div className="mt-12 flex flex-col items-center justify-center p-20 opacity-30 border border-dashed rounded-3xl">
              <UserCog size={48} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center">
                No NGO Profile Update Requests
              </p>
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* Detail Drawer */}
      <ResuableDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Enquiry Detail"
        subtitle={selectedEnquiry?.id}
        size="md"
      >
        {selectedEnquiry && (
          <div className="space-y-8 p-3 sm:p-4 lg:p-5">
            <div
              className="p-6 rounded-2xl border bg-slate-500/5 text-center"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="w-20 h-20 rounded-2xl bg-hf-green/10 border border-hf-green/20 flex items-center justify-center text-hf-green mx-auto mb-4">
                <Building2 size={32} />
              </div>
              <h3
                className="text-xl font-black uppercase tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {selectedEnquiry.name}
              </h3>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-hf-green mt-1">
                {selectedEnquiry.type}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-4">
                <h4
                  className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30"
                  style={{ color: "var(--text-primary)" }}
                >
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl border"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--bg-secondary)",
                    }}
                  >
                    <Mail size={16} className="text-slate-400" />
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedEnquiry.email}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl border"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--bg-secondary)",
                    }}
                  >
                    <Phone size={16} className="text-slate-400" />
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedEnquiry.phone}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl border"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--bg-secondary)",
                    }}
                  >
                    <MapPin size={16} className="text-slate-400" />
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedEnquiry.city}, Tamil Nadu
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h4
                  className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30"
                  style={{ color: "var(--text-primary)" }}
                >
                  Verify Documents
                </h4>
                <div className="space-y-3">
                  <div
                    className="p-4 rounded-2xl border border-dashed flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--bg-secondary)",
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-500/10 flex items-center justify-center shrink-0">
                        <ClipboardList size={20} className="text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-bold truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Registration Certificate
                        </p>
                        <p
                          className="text-[10px] font-black uppercase tracking-widest opacity-40"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Verified Govt. Document
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2 sm:gap-1 justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-dashed"
                      style={{ borderTopColor: "var(--border-color)" }}
                    >
                      <button
                        onClick={() =>
                          setPreviewDoc({
                            name: "Registration Certificate",
                            type: "NGO Registration",
                            issuer: "Ministry of Corporate Affairs",
                          })
                        }
                        className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-hf-green hover:bg-hf-green/10 transition-colors cursor-pointer"
                      >
                        View
                      </button>
                      <span className="opacity-20 text-xs hidden sm:inline">
                        |
                      </span>
                      <button
                        onClick={() =>
                          setPreviewDoc({
                            name: "Registration Certificate",
                            type: "NGO Registration",
                            issuer: "Ministry of Corporate Affairs",
                          })
                        }
                        className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-500/10 hover:text-hf-green transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download size={11} /> PDF
                      </button>
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-2xl border border-dashed flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--bg-secondary)",
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-500/10 flex items-center justify-center shrink-0">
                        <ClipboardList size={20} className="text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-bold truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          80G / 12A Certificate
                        </p>
                        <p
                          className="text-[10px] font-black uppercase tracking-widest opacity-40"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Tax Exempt Status
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2 sm:gap-1 justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-dashed"
                      style={{ borderTopColor: "var(--border-color)" }}
                    >
                      <button
                        onClick={() =>
                          setPreviewDoc({
                            name: "80G / 12A Certificate",
                            type: "Tax Exemption",
                            issuer: "Income Tax Department of India",
                          })
                        }
                        className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-hf-green hover:bg-hf-green/10 transition-colors cursor-pointer"
                      >
                        View
                      </button>
                      <span className="opacity-20 text-xs hidden sm:inline">
                        |
                      </span>
                      <button
                        onClick={() =>
                          setPreviewDoc({
                            name: "80G / 12A Certificate",
                            type: "Tax Exemption",
                            issuer: "Income Tax Department of India",
                          })
                        }
                        className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-500/10 hover:text-hf-green transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download size={11} /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-dashed"
              style={{ borderColor: "var(--border-color)" }}
            >
              <button
                onClick={() =>
                  handleApprove(selectedEnquiry.id, selectedEnquiry.name)
                }
                className="flex-1 py-4 bg-hf-green text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-hf-green/20"
              >
                <CheckCircle2 size={16} className="shrink-0" />
                <span className="truncate">Approve Registration</span>
              </button>
              <button
                onClick={() =>
                  handleReject(selectedEnquiry.id, selectedEnquiry.name)
                }
                className="flex-1 py-4 border-2 border-red-500/20 text-red-500 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-red-500/5 transition-colors"
              >
                <XCircle size={16} className="shrink-0" />
                <span className="truncate">Reject</span>
              </button>
            </div>
          </div>
        )}
      </ResuableDrawer>

      {previewDoc && (
        <DocumentPreviewModal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          documentName={previewDoc.name}
          documentType={previewDoc.type}
          issuer={previewDoc.issuer}
          issuedDate="Feb 2026"
        />
      )}
    </div>
  );
};

export default NGOEnquiryPage;
