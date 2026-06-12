import { useState } from "react";
import { toast } from "sonner";
import ResuableButton from "../../../../global/components/resuable-components/button";
import ResuableDrawer from "../../../../global/components/resuable-components/drawer";
import FilePreviewModal from "../../../../global/components/resuable-components/FilePreviewModal";
import ImpactCards from "../../../../global/components/resuable-components/ImpactCards";
import {
  ShieldCheck,
  User,
  Phone,
  Mail,
  Building2,
  FileText,
  BadgeCheck,
  Globe,
  Wallet,
  MapPin,
  Award,
  MessageSquare,
  Edit,
  Eye,
  Download,
} from "lucide-react";

import { useNgoProfile } from "../hooks/useNgoProfile";

/**
 * @module NGOProfile
 * @description Clean, professional NGO Profile with a focus on verified status and humanitarian impact.
 */
const NGOProfile = () => {
  const { profile, documents, isLoading } = useNgoProfile();
  const [activeTab, setActiveTab] = useState("identity");
  const [isRequestDrawerOpen, setIsRequestDrawerOpen] = useState(false);
  const [requestCategory, setRequestCategory] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  // Document Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const CATEGORIES_CONFIG: Record<
    string,
    { label: string; icon: any; fields: string[] }
  > = {
    contact: {
      label: "Contact Info",
      icon: <User size={16} />,
      fields: [
        "Manager Name",
        "Primary Email",
        "Phone Number",
        "Address Details",
      ],
    },
    legal: {
      label: "Legal Details",
      icon: <Building2 size={16} />,
      fields: [
        "NGO Legal Name",
        "Registration ID",
        "Operating License",
        "Tax Exemption (80G)",
        "FCRA Details",
      ],
    },
    payout: {
      label: "Payout System",
      icon: <Wallet size={16} />,
      fields: [
        "Bank Account",
        "Primary UPI ID",
        "Branch / IFSC",
        "Settlement Cycle",
      ],
    },
    other: {
      label: "General Help",
      icon: <MessageSquare size={16} />,
      fields: [
        "Grant Inquiry",
        "Technical Support",
        "Need Posting Issue",
        "Other",
      ],
    },
  };

  const toggleField = (field: string) => {
    setSelectedFields((prev) => {
      const isSelecting = !prev.includes(field);
      const entry = `${field.toUpperCase()}: `;

      if (isSelecting) {
        setRequestMessage((curr) => {
          if (curr.includes(`${field.toUpperCase()}:`)) return curr;
          return curr ? `${curr}\n${entry}` : entry;
        });
      } else {
        setRequestMessage((curr) => {
          return curr
            .split("\n")
            .filter((line) => !line.includes(`${field.toUpperCase()}:`))
            .join("\n")
            .trim();
        });
      }
      return isSelecting ? [...prev, field] : prev.filter((f) => f !== field);
    });
  };

  const handleSubmit = () => {
    const newId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    setRequestId(newId);
    setIsSubmitted(true);
  };

  const resetSupportHub = () => {
    setIsSubmitted(false);
    setRequestCategory(null);
    setSelectedFields([]);
    setRequestId("");
    setRequestMessage("");
  };

  const switchCategory = (id: string | null) => {
    setRequestCategory(id);
    setSelectedFields([]);
    setRequestMessage("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleViewDocument = (doc: any) => {
    setSelectedFile({
      url: doc.url || "/HungerFree Doc.pdf",
      name: doc.name,
    });
    setIsPreviewOpen(true);
  };

  const handleDownloadDocument = async (doc: any) => {
    const url = doc.url || "/HungerFree Doc.pdf";

    const promise = fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${doc.name.replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      });

    toast.promise(promise, {
      loading: `Preparing ${doc.name} for download...`,
      success: `${doc.name} downloaded successfully!`,
      error: "Failed to download document. Please try again.",
    });
  };

  const profileStats = [
    {
      label: "Total Donations",
      val: "850",
      trend: "This Year",
      color: "bg-[#22c55e]",
    },
    {
      label: "Beneficiaries",
      val: "2.4K",
      trend: "People Served",
      color: "bg-[#22c55e]",
    },
    {
      label: "Verification",
      val: "Partner",
      trend: "Verified",
      color: "bg-[#22c55e]",
    },
    {
      label: "Active Needs",
      val: "12",
      trend: "In Progress",
      color: "bg-blue-500",
    },
  ];

  // Alignment Helpers

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* 1. CLEAN HEADER */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div
              className="w-20 h-20 rounded-sm border p-1 overflow-hidden flex items-center justify-center mx-auto md:mx-0"
              style={{
                backgroundColor: "#22c55e",
                borderColor: "var(--border-color)",
              }}
            >
              <span className="text-3xl font-black text-white">GH</span>
            </div>

            <div className="space-y-1.5 flex flex-col items-center md:items-start">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span
                  className="px-2.5 py-1 text-hf-green text-[9px] font-black tracking-widest rounded-sm border flex items-center gap-1.5"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <ShieldCheck size={11} className="text-hf-green" />{" "}
                  {profile.verificationLevel}
                </span>
                <span
                  className="text-[9px] font-bold uppercase tracking-widest opacity-60"
                  style={{ color: "var(--text-muted)" }}
                >
                  ID: {profile.registrationId}
                </span>
              </div>
              <h1
                className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                {profile.ngoName}
              </h1>
              <p
                className="font-bold text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "var(--text-muted)" }}
              >
                {profile.ngoType}
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <ResuableButton
              variant="primary"
              onClick={() => {
                resetSupportHub();
                setIsRequestDrawerOpen(true);
              }}
              className="w-full md:w-auto px-8 h-12 rounded-sm bg-hf-green hover:bg-hf-green/90 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all active:scale-95"
            >
              <BadgeCheck size={16} />
              Request Update
            </ResuableButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-3 sm:p-4 lg:p-5 space-y-5">
        {/* 2. STATS GRID */}
        <section>
          <ImpactCards
            data={profileStats}
            orientation="horizontal"
            className="w-full"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: ENTITY INFORMATION */}
          <aside className="lg:col-span-4 w-full text-start">
            <div
              className="border rounded-lg shadow-sm overflow-hidden text-start lg:h-[calc(100vh-270px)] min-h-[440px] flex flex-col"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div
                className="h-[52px] px-6 border-b flex items-center"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <h3
                  className="text-xs font-black uppercase tracking-widest flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <User size={14} className="text-[#22c55e]" /> Organization
                  Details
                </h3>
              </div>
              <div className="p-5 flex-grow overflow-y-auto thin-scrollbar flex flex-col gap-5">
                {/* Primary Contact */}
                <div className="space-y-4">
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.1em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Managing Director
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className="w-8 h-8 rounded border flex items-center justify-center text-slate-400"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <User size={14} />
                      </div>
                      <span
                        className="text-sm font-bold tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {profile.managerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className="w-8 h-8 rounded border flex items-center justify-center text-slate-400"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <Mail size={14} />
                      </div>
                      <span
                        className="text-sm font-bold lowercase tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {profile.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secondary Contact */}
                <div
                  className="pt-4 border-t space-y-3"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.1em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Contact Number
                  </p>
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className="w-8 h-8 rounded border flex items-center justify-center text-slate-400"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <Phone size={14} />
                    </div>
                    <span
                      className="text-sm font-bold tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {profile.phone}
                    </span>
                  </div>
                </div>

                {/* Registered Address */}
                <div
                  className="pt-4 border-t space-y-3"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.1em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Operating Office
                  </p>
                  <div className="flex gap-4">
                    <div
                      className="w-8 h-8 rounded border flex items-center justify-center text-[#22c55e] shrink-0"
                      style={{
                        backgroundColor: "rgba(34, 197, 94, 0.08)",
                        borderColor: "rgba(34, 197, 94, 0.2)",
                      }}
                    >
                      <MapPin size={14} />
                    </div>
                    <p
                      className="text-[13px] font-bold leading-relaxed tracking-tight"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      456 Charity Lane, Lower East Side,
                      <br />
                      New York, NY 10002
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: NGO DETAILS */}
          <section className="lg:col-span-8 w-full text-start">
            <div
              className="border rounded-lg shadow-sm lg:h-[calc(100vh-270px)] min-h-[440px] flex flex-col"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              {/* TABS HEADER: REFINED FOR PERFECT ALIGNMENT */}
              <div
                className="px-3 border-b flex items-center overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="w-full flex items-center gap-1.5 p-1 rounded-xl">
                  {[
                    { id: "identity", label: "Profile Info" },
                    { id: "documents", label: "Documents" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 w-0 py-2 px-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 relative text-center leading-snug ${
                        activeTab === tab.id
                          ? "shadow-sm border z-10"
                          : "opacity-40 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor:
                          activeTab === tab.id
                            ? "var(--bg-primary)"
                            : "transparent",
                        borderColor:
                          activeTab === tab.id
                            ? "var(--border-color)"
                            : "transparent",
                        color:
                          activeTab === tab.id
                            ? "#22c55e"
                            : "var(--text-primary)",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 text-start flex-grow overflow-y-auto thin-scrollbar flex flex-col">
                {activeTab === "identity" && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    {/* SECTION 1: LEGAL INTELLIGENCE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      {[
                        {
                          label: "NGO Name",
                          val: profile.ngoName,
                          icon: <Building2 size={14} />,
                          span: true,
                          isVerified: true,
                        },
                        {
                          label: "Website",
                          val: "www.greenharvest.org",
                          icon: <Globe size={14} />,
                        },
                        {
                          label: "Reg. ID",
                          val: profile.registrationId,
                          icon: <FileText size={14} />,
                        },
                        {
                          label: "Category",
                          val: profile.ngoType,
                          icon: <Award size={14} />,
                        },
                        {
                          label: "Tax ID",
                          val: profile.taxId,
                          icon: <BadgeCheck size={14} />,
                        },
                      ].map((field, i) => (
                        <div
                          key={i}
                          className={`space-y-2 ${field.span ? "md:col-span-2" : ""}`}
                        >
                          <p
                            className="text-[10px] font-black uppercase tracking-[0.1em]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {field.label}
                          </p>
                          <div
                            className="flex items-center gap-3 p-2.5 rounded-md border transition-colors"
                            style={{
                              backgroundColor: "var(--bg-secondary)",
                              borderColor: "var(--border-color)",
                            }}
                          >
                            <div
                              className="flex items-center justify-center w-7 h-7 rounded-md border text-slate-400"
                              style={{
                                backgroundColor: "var(--bg-primary)",
                                borderColor: "var(--border-color)",
                              }}
                            >
                              {field.icon}
                            </div>
                            <span
                              className="text-sm font-bold tracking-tight text-[13px] flex items-center gap-2"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {field.val}
                              {field.isVerified && (
                                <BadgeCheck
                                  size={14}
                                  className="text-emerald-500"
                                />
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* SECTION 2: PAYOUT INTELLIGENCE */}
                    <div
                      className="pt-4 border-t space-y-4"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#22c55e] border shadow-sm shrink-0"
                            style={{
                              backgroundColor: "rgba(34, 197, 94, 0.08)",
                              borderColor: "rgba(34, 197, 94, 0.2)",
                            }}
                          >
                            <Wallet size={18} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <h4
                              className="text-[11px] font-bold uppercase tracking-[0.15em] leading-tight truncate px-0.5"
                              style={{ color: "var(--text-primary)" }}
                            >
                              Payment Methods
                            </h4>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                              Verified Bank & UPI
                            </span>
                          </div>
                        </div>
                        <div
                          className="w-fit sm:ml-auto px-3 py-1.5 rounded-lg border flex items-center gap-2 shadow-sm shrink-0"
                          style={{
                            backgroundColor: "rgba(59, 130, 246, 0.05)",
                            borderColor: "rgba(59, 130, 246, 0.15)",
                          }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                            Verified & Active
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        {[
                          {
                            label: "Bank Account",
                            val: `${profile.bankName} (***8824)`,
                            icon: <Building2 size={14} />,
                          },
                          {
                            label: "Primary UPI VPA",
                            val: profile.upiId,
                            icon: <Wallet size={14} />,
                          },
                        ].map((field, i) => (
                          <div key={i} className="space-y-2">
                            <p
                              className="text-[10px] font-black uppercase tracking-[0.1em]"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {field.label}
                            </p>
                            <div
                              className="flex items-center gap-3 p-2.5 rounded-md border transition-colors"
                              style={{
                                backgroundColor: "var(--bg-secondary)",
                                borderColor: "var(--border-color)",
                              }}
                            >
                              <div
                                className="flex items-center justify-center w-7 h-7 rounded-md border text-slate-400"
                                style={{
                                  backgroundColor: "var(--bg-primary)",
                                  borderColor: "var(--border-color)",
                                }}
                              >
                                {field.icon}
                              </div>
                              <span
                                className="text-sm font-bold tracking-tight text-[13px] flex items-center gap-2"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {field.val}
                                <ShieldCheck
                                  size={14}
                                  className="text-blue-500"
                                />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "documents" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <p
                      className="text-[10px] font-black uppercase tracking-[0.1em]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Documents
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      {documents.map((doc, i) => (
                        <div
                          key={i}
                          className="group p-4 px-5 rounded-[22px] border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] flex flex-col gap-3"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className="w-12 h-12 rounded-xl border flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-500/30 transition-all shadow-sm shrink-0 bg-white"
                              style={{
                                borderColor: "var(--border-color)",
                              }}
                            >
                              <FileText size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col gap-2 min-w-0 flex-1 pt-0.5">
                              <p
                                className="text-sm font-black uppercase tracking-tight leading-tight"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {doc.name}
                              </p>
                              <div className="flex flex-col items-start gap-1.5">
                                <span
                                  className={`px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-colors ${
                                    doc.status === "Verified"
                                      ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                                      : "text-amber-600 bg-amber-500/10 border-amber-500/20"
                                  }`}
                                >
                                  {doc.status}
                                </span>
                                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                  ID: {doc.date}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 mt-1">
                            <button
                              onClick={() => handleViewDocument(doc)}
                              title="Quick View"
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 hover:shadow-sm transition-all active:scale-90"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDownloadDocument(doc)}
                              title="Download Document"
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 hover:shadow-sm transition-all active:scale-90"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* PAGE FOOTER */}
        <div className="flex flex-col gap-4">
          {/* SECURE CHANNEL NOTICE */}
          <div
            className="p-4 rounded-lg border flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.03)",
              borderColor: "rgba(59, 130, 246, 0.1)",
            }}
          >
            <div
              className="p-2.5 rounded-md border shadow-inner shrink-0 text-blue-500"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.08)",
                borderColor: "rgba(59, 130, 246, 0.2)",
              }}
            >
              <MessageSquare size={18} />
            </div>
            <div className="space-y-1 text-start">
              <h4
                className="text-[10px] font-black uppercase tracking-[0.2em]"
                style={{ color: "var(--text-primary)" }}
              >
                Update Process
              </h4>
              <p
                className="text-[11px] font-bold leading-relaxed tracking-tight"
                style={{ color: "var(--text-secondary)" }}
              >
                Security Check: All updates are manually verified within 24 hours to ensure 100% authenticity for global donors.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* SUPPORT & COMPLIANCE HUB */}
      <ResuableDrawer
        isOpen={isRequestDrawerOpen}
        onClose={() => setIsRequestDrawerOpen(false)}
        title="NGO Support Hub"
        subtitle="Submit updates or requests for your profile"
        size="md"
      >
        <div className="p-8 h-full flex flex-col">
          {isSubmitted ? (
            <div className="flex-grow flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95 fade-in duration-500 text-center">
              <div
                className="w-20 h-20 rounded-full border flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.08)",
                  borderColor: "rgba(16, 185, 129, 0.2)",
                }}
              >
                <BadgeCheck size={40} className="text-[#22c55e]" />
              </div>

              <div className="space-y-2">
                <h3
                  className="text-base font-black uppercase tracking-widest"
                  style={{ color: "var(--text-primary)" }}
                >
                  Request Sent
                </h3>
                <p
                  className="text-xs font-bold max-w-[280px] mx-auto leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  We've received your update. Our team will review and process
                  it shortly.
                </p>
              </div>

              <div
                className="w-full p-4 rounded-2xl border space-y-4"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Request ID
                    </span>
                    <span
                      className="text-[11px] font-black font-mono"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {requestId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Current Status
                    </span>
                    <span className="text-[11px] font-black text-[#22c55e]">
                      Reviewing
                    </span>
                  </div>
                </div>

                {/* Note Summary Receipt */}
                <div
                  className="pt-3 border-t space-y-2 text-start"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                      Note Sent
                    </span>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="flex items-center gap-1 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-[#22c55e] hover:bg-emerald-50/20 rounded-md transition-all"
                    >
                      <Edit size={10} />
                      Edit
                    </button>
                  </div>
                  <div
                    className="max-h-28 overflow-y-auto thin-scrollbar p-3 border rounded-lg text-start"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <pre
                      className="text-[10px] font-bold whitespace-pre-wrap leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {requestMessage || "No additional note provided."}
                    </pre>
                  </div>
                </div>
              </div>

              <ResuableButton
                variant="primary"
                className="w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]"
                onClick={() => {
                  setIsRequestDrawerOpen(false);
                  resetSupportHub();
                }}
              >
                Done
              </ResuableButton>
            </div>
          ) : (
            <div className="space-y-6 flex-grow flex flex-col text-start">
              <div
                className="flex items-start gap-3 p-3 rounded-lg border"
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.03)",
                  borderColor: "rgba(59, 130, 246, 0.1)",
                }}
              >
                <div
                  className="p-1.5 rounded-md border shrink-0 text-blue-500"
                  style={{
                    backgroundColor: "rgba(59, 130, 246, 0.08)",
                    borderColor: "rgba(59, 130, 246, 0.2)",
                  }}
                >
                  <MessageSquare size={14} />
                </div>
                <div className="space-y-0.5">
                  <h4
                    className="text-[9px] font-black uppercase tracking-widest"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Security Note
                  </h4>
                  <p
                    className="text-[10px] font-bold leading-relaxed tracking-tight"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    We manually check all updates to keep your NGO profile safe
                    and verified for grants. Review usually takes 24 hours.
                  </p>
                </div>
              </div>

              {!requestCategory ? (
                <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                    What would you like to update?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(CATEGORIES_CONFIG).map(([id, item]) => (
                      <button
                        key={id}
                        onClick={() => switchCategory(id)}
                        className="flex flex-col items-center justify-center h-28 rounded-xl border transition-all group shadow-sm active:scale-95"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors mb-2"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <div
                            className="text-slate-400 group-hover:text-[#22c55e]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {item.icon}
                          </div>
                        </div>
                        <span
                          className="text-[9px] font-black uppercase tracking-widest text-center px-3 group-hover:text-[#22c55e]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Select fields to change:
                    </p>
                    <button
                      onClick={() => switchCategory(null)}
                      className="text-[8px] font-black uppercase tracking-widest text-[#22c55e] hover:underline"
                    >
                      Back
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES_CONFIG[requestCategory].fields.map((field) => {
                      const isSelected = selectedFields.includes(field);
                      return (
                        <button
                          key={field}
                          onClick={() => toggleField(field)}
                          className={`w-full h-9 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border text-center truncate ${
                            isSelected
                              ? "bg-[#22c55e] text-white border-[#22c55e] shadow-md shadow-emerald-500/20"
                              : "hover:border-slate-300"
                          }`}
                          style={{
                            backgroundColor: isSelected
                              ? "#22c55e"
                              : "var(--bg-primary)",
                            borderColor: isSelected
                              ? "#16a34a"
                              : "var(--border-color)",
                            color: isSelected ? "white" : "var(--text-muted)",
                          }}
                        >
                          {field}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                      Note for Admin
                    </p>
                    <textarea
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="Tell us why you are making this change..."
                      className="w-full h-32 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] text-xs font-bold placeholder:text-slate-400 resize-none transition-all border"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-auto pt-6">
                <ResuableButton
                  variant="primary"
                  disabled={!requestCategory}
                  className={`w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all ${
                    requestCategory
                      ? "shadow-emerald-500/20"
                      : "opacity-50 grayscale cursor-not-allowed"
                  }`}
                  onClick={handleSubmit}
                >
                  Send Request
                </ResuableButton>
              </div>
            </div>
          )}
        </div>
      </ResuableDrawer>

      <FilePreviewModal
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        file={selectedFile?.url || null}
        fileName={selectedFile?.name}
      />
    </div>
  );
};

export default NGOProfile;
