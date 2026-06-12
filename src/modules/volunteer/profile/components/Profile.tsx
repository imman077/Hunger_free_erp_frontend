import { useState } from "react";
import { toast } from "sonner";
import ResuableButton from "../../../../global/components/resuable-components/button";
import ResuableDrawer from "../../../../global/components/resuable-components/drawer";
import FilePreviewModal from "../../../../global/components/resuable-components/FilePreviewModal";
import ResuableModal from "../../../../global/components/resuable-components/modal";
import { ImpactCards } from "../../../../global/components/resuable-components/ImpactCards";
import {
  ShieldCheck,
  User,
  Phone,
  Mail,
  Building2,
  FileText,
  BadgeCheck,
  MapPin,
  Award,
  MessageSquare,
  Edit,
  Eye,
  Download,
  Calendar,
  Wallet,
  Bike,
} from "lucide-react";

/**
 * @module VolunteerProfile
 * @description Clean, professional Volunteer Profile aligned with Donor/NGO styles.
 */
import { useVolunteerProfile } from "../hooks/useVolunteerProfile";

/**
 * @module VolunteerProfile
 * @description Clean, professional Volunteer Profile aligned with Donor/NGO styles.
 */
const VolunteerProfile = () => {
  const { profile: storeProfile, isLoading } = useVolunteerProfile();
  const [activeTab, setActiveTab] = useState("identity");
  const [isRequestDrawerOpen, setIsRequestDrawerOpen] = useState(false);
  const [requestCategory, setRequestCategory] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  // Schedule States
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 2, 4, 5]);
  const [requestReason, setRequestReason] = useState("");

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
      fields: ["Full Name", "Primary Email", "Phone Number", "Base Location"],
    },
    transport: {
      label: "Transport",
      icon: <Bike size={16} />,
      fields: ["Vehicle Type", "Model Name", "License Plate", "Insurance Info"],
    },
    legal: {
      label: "Verification",
      icon: <ShieldCheck size={16} />,
      fields: [
        "Identity Proof",
        "Address Proof",
        "Vehicle Documents",
        "Background Check",
      ],
    },
    other: {
      label: "General Help",
      icon: <MessageSquare size={16} />,
      fields: ["System Support", "App Issue", "Profile Bug", "Other"],
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

  const profile = {
    name: storeProfile.fullName.split(" ")[0],
    role: "Master Courier",
    volunteerId: "VOL-2024-RH-01",
    email: storeProfile.email,
    phone: storeProfile.phone,
    location: storeProfile.location,
    memberSince: storeProfile.memberSince,
    verificationLevel: storeProfile.verificationStatus,
    stats: {
      missions: 124,
      onTime: "98%",
      score: 940,
      rating: 4.9,
    },
    bankName: "State Bank of India",
    accountNumber: "**** 1234",
    upiId: "rahul@okaxis",
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
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
      label: "Missions",
      val: profile.stats.missions.toString(),
      trend: "Highly Active",
      color: "bg-emerald-500",
    },
    {
      label: "Success Rate",
      val: profile.stats.onTime,
      trend: "Excellence Streak",
      color: "bg-emerald-500",
    },
    {
      label: "Quality Rating",
      val: profile.stats.rating.toString(),
      trend: "Top 1% Rated",
      color: "bg-emerald-500",
    },
    {
      label: "Impact Points",
      val: profile.stats.score.toString(),
      trend: "Level 12",
      color: "bg-emerald-500",
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
        className="sticky top-0 z-50 border-b shadow-sm"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-8 text-start">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div
              className="w-20 h-20 rounded-lg border p-1 shadow-sm overflow-hidden flex items-center justify-center text-4xl"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              🚴
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-1 bg-green-500/10 text-green-500 text-[10px] font-black tracking-widest rounded-md border border-green-500/10 flex items-center gap-1.5">
                  <ShieldCheck size={12} /> {profile.verificationLevel}
                </span>
                <span
                  className="text-[10px] font-bold tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  ID: {profile.volunteerId}
                </span>
              </div>
              <h1
                className="text-2xl md:text-3xl font-black tracking-tight uppercase leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                {profile.name}
              </h1>
              <p
                className="font-bold text-xs tracking-widest"
                style={{ color: "var(--text-secondary)" }}
              >
                {profile.role}
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
              className="w-full md:w-auto px-8 h-12 rounded-md shadow-sm text-white text-[10px] font-black tracking-widest flex items-center gap-2"
            >
              <ShieldCheck size={16} />
              Request Information Update
            </ResuableButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 md:px-8 mt-5 space-y-5">
        {/* 2. STATS GRID */}
        <section>
          <ImpactCards
            data={profileStats}
            orientation="horizontal"
            className="w-full"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: PERSONAL INFORMATION */}
          <aside className="lg:col-span-4 w-full">
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
                  <User size={14} className="text-[#22c55e]" /> Contact Details
                </h3>
              </div>
              <div className="p-5 flex-grow overflow-y-auto thin-scrollbar flex flex-col gap-5">
                {/* Contact Info */}
                <div className="space-y-4">
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.1em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Primary Identity
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-slate-400"
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
                        {profile.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-slate-400"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <Mail size={14} />
                      </div>
                      <span
                        className="text-sm font-bold tracking-tight lowercase opacity-60"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {profile.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="pt-4 space-y-3"
                  style={{ borderTop: "1px solid var(--border-color)" }}
                >
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.1em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Contact Number
                  </p>
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-slate-400"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <Phone size={14} />
                    </div>
                    <span
                      className="text-sm font-bold tracking-tight"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {profile.phone}
                    </span>
                  </div>
                </div>

                <div
                  className="pt-4 space-y-3"
                  style={{ borderTop: "1px solid var(--border-color)" }}
                >
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.1em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Base Hub / Location
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
                      {profile.location},
                      <br />
                      Pondicherry, 605001
                      <br />
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8 w-full text-start">
            <div
              className="border rounded-lg shadow-sm lg:h-[calc(100vh-270px)] min-h-[440px] flex flex-col"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div
                className="px-3 border-b flex items-center overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                  minHeight: "52px",
                }}
              >
                <div
                  className="flex items-center gap-1 p-1 rounded-xl w-full"
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                >
                  {[
                    { id: "identity", label: "Volunteer Info" },
                    { id: "documents", label: "Credential Vault" },
                    { id: "schedule", label: "Weekly Schedule" },
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
                            ? "var(--color-emerald)"
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
                    {/* SECTION 1: PERSONAL INTELLIGENCE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      {[
                        {
                          label: "Formal Name",
                          val: profile.name,
                          icon: <User size={14} />,
                          span: true,
                          isVerified: true,
                        },
                        {
                          label: "Member Since",
                          val: profile.memberSince,
                          icon: <Calendar size={14} />,
                        },
                        {
                          label: "Volunteer ID",
                          val: profile.volunteerId,
                          icon: <FileText size={14} />,
                        },
                        {
                          label: "Primary Role",
                          val: profile.role,
                          icon: <Award size={14} />,
                        },
                        {
                          label: "Verification Status",
                          val: profile.verificationLevel,
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
                              className="flex items-center justify-center w-7 h-7 rounded-md border"
                              style={{
                                backgroundColor: "var(--bg-primary)",
                                borderColor: "var(--border-color)",
                                color: "var(--text-muted)",
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

                    {/* SECTION 2: PAYMENT DETAILS */}
                    <div
                      className="pt-4 border-t space-y-4"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#22c55e] border shadow-sm shrink-0"
                            style={{
                              backgroundColor: "rgba(34, 197, 94, 0.08)",
                              borderColor: "rgba(34, 197, 94, 0.2)",
                            }}
                          >
                            <Wallet size={18} />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <h4
                              className="text-[10px] font-black uppercase tracking-[0.15em] leading-tight"
                              style={{ color: "var(--text-primary)" }}
                            >
                              Primary Payment Details
                            </h4>
                            <span
                              className="text-[8px] font-bold uppercase tracking-widest opacity-60"
                              style={{ color: "var(--text-primary)" }}
                            >
                              Your verified payout accounts
                            </span>
                          </div>
                        </div>

                        <div
                          className="sm:ml-auto flex items-center gap-1.5 px-2 py-1 rounded-md border shrink-0 self-start sm:self-auto"
                          style={{
                            backgroundColor: "rgba(59, 130, 246, 0.08)",
                            borderColor: "rgba(59, 130, 246, 0.2)",
                          }}
                        >
                          <ShieldCheck size={11} className="text-blue-500" />
                          <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest leading-none">
                            Verified & Active
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {[
                          {
                            label: "Bank Account",
                            val: `${profile.bankName} (${profile.accountNumber})`,
                            icon: <Building2 size={13} />,
                          },
                          {
                            label: "Primary UPI VPA",
                            val: profile.upiId,
                            icon: <Wallet size={13} />,
                          },
                        ].map((field, i) => (
                          <div key={i} className="space-y-2 text-start">
                            <p
                              className="text-[9px] font-black uppercase tracking-widest"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {field.label}
                            </p>
                            <div
                              className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 hover:shadow-sm"
                              style={{
                                backgroundColor: "var(--bg-secondary)",
                                borderColor: "var(--border-color)",
                              }}
                            >
                              <div
                                className="flex items-center justify-center w-8 h-8 rounded-md border shrink-0"
                                style={{
                                  backgroundColor: "var(--bg-primary)",
                                  borderColor: "var(--border-color)",
                                  color: "var(--text-muted)",
                                }}
                              >
                                {field.icon}
                              </div>
                              <div className="flex items-center justify-between flex-1 min-w-0">
                                <span
                                  className="text-[13px] font-bold tracking-tight text-start truncate"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {field.val}
                                </span>
                                <ShieldCheck
                                  size={12}
                                  className="text-blue-500 shrink-0 ml-2"
                                />
                              </div>
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
                      Credential Documents
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        {
                          name: "Aadhar/ID Proof",
                          status: "Verified",
                          date: "Jan 12, 2024",
                          url: "/HungerFree Doc.pdf",
                        },
                        {
                          name: "Vehicle Registration",
                          status: "Verified",
                          date: "Jan 12, 2024",
                          url: "/HungerFree Doc.pdf",
                        },
                        {
                          name: "Safety Certification",
                          status: "In Review",
                          date: "Pending",
                          url: "/HungerFree Doc.pdf",
                        },
                      ].map((doc, i) => (
                        <div
                          key={i}
                          className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-md hover:border-emerald-500/20"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          {/* Left: Info & Status */}
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div
                              className="w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 transition-colors group-hover:bg-emerald-500/5"
                              style={{
                                backgroundColor: "var(--bg-primary)",
                                borderColor: "var(--border-color)",
                                color: "var(--text-muted)",
                              }}
                            >
                              <FileText size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 mb-1">
                                <p
                                  className="text-[13px] font-black uppercase tracking-tight truncate"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {doc.name}
                                </p>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border shrink-0 w-fit ${
                                    doc.status === "Verified"
                                      ? "text-green-600 bg-green-500/10 border-green-500/20"
                                      : "text-amber-600 bg-amber-500/10 border-amber-500/20"
                                  }`}
                                >
                                  {doc.status}
                                </span>
                              </div>
                              <p
                                className="text-[9px] font-bold uppercase tracking-widest opacity-60"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Validated: {doc.date}
                              </p>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div
                            className="flex items-center gap-2 mt-4 sm:mt-0 sm:pl-6 sm:ml-4 sm:border-l shrink-0 ml-auto sm:ml-4"
                            style={{ borderColor: "var(--border-color)" }}
                          >
                            <button
                              onClick={() => handleViewDocument(doc)}
                              className="w-9 h-9 flex items-center justify-center hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 rounded-lg transition-all"
                              title="View Document"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDownloadDocument(doc)}
                              className="w-9 h-9 flex items-center justify-center hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 rounded-lg transition-all"
                              title="Download Document"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "schedule" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Transport Card */}
                      <section
                        className="p-6 rounded-md shadow-sm border"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <h3
                          className="text-[11px] font-black tracking-tight uppercase mb-5 flex items-center justify-between"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Transport Status
                          <button
                            onClick={() => {
                              setRequestCategory("transport");
                              setIsRequestDrawerOpen(true);
                            }}
                            className="p-1 hover:bg-green-500/10 rounded-sm transition-colors group/edit-btn"
                          >
                            <Edit
                              size={14}
                              className="text-green-500 group-hover/edit-btn:scale-110 transition-transform"
                            />
                          </button>
                        </h3>
                        <div
                          className="flex items-center gap-4 p-3 rounded-md border group transition-colors hover:bg-green-500/5"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <div
                            className="w-12 h-12 rounded-md border flex items-center justify-center text-3xl shrink-0 group-hover:border-green-500/30"
                            style={{
                              backgroundColor: "var(--bg-secondary)",
                              borderColor: "var(--border-color)",
                            }}
                          >
                            🚲
                          </div>
                          <div className="text-left">
                            <h5
                              className="text-sm font-black leading-none"
                              style={{ color: "var(--text-primary)" }}
                            >
                              Electric Bicycle
                            </h5>
                            <p
                              className="text-[9px] font-black mt-1 uppercase tracking-widest leading-none"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Model: EcoRider 3000
                            </p>
                            <div className="mt-2.5 flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-green-500/10 text-green-600 text-[8px] font-black rounded-sm border border-green-500/10">
                                VERIFIED
                              </span>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Availability Card */}
                      <section
                        className="p-6 rounded-md shadow-sm border"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <h3
                          className="text-[11px] font-black tracking-tight uppercase mb-5 flex items-center justify-between"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Schedule: Week 06
                          <button
                            onClick={() => setIsScheduleModalOpen(true)}
                            className="p-1 hover:bg-green-500/10 rounded-sm transition-colors group/edit-btn"
                          >
                            <Calendar
                              size={14}
                              className="text-green-500 group-hover/edit-btn:scale-110 transition-transform"
                            />
                          </button>
                        </h3>
                        <div className="grid grid-cols-7 gap-1">
                          {["M", "T", "W", "T", "F", "S", "S"].map(
                            (day, idx) => {
                              const isActive = [0, 2, 4, 5].includes(idx);
                              return (
                                <div
                                  key={idx}
                                  className={`aspect-square flex flex-col items-center justify-center rounded-sm border transition-all ${
                                    isActive
                                      ? "bg-green-500/10 border-green-500/20 shadow-sm"
                                      : ""
                                  }`}
                                  style={{
                                    borderColor: isActive
                                      ? "var(--color-emerald)"
                                      : "var(--border-color)",
                                    backgroundColor: isActive
                                      ? ""
                                      : "var(--bg-primary)",
                                  }}
                                >
                                  <span
                                    className={`text-[9px] font-black ${
                                      isActive ? "text-green-600" : ""
                                    }`}
                                    style={{
                                      color: !isActive
                                        ? "var(--text-muted)"
                                        : "",
                                    }}
                                  >
                                    {day}
                                  </span>
                                  <div
                                    className={`w-1 h-1 rounded-full mt-1 ${
                                      isActive
                                        ? "bg-green-500"
                                        : "bg-slate-500/10"
                                    }`}
                                  />
                                </div>
                              );
                            },
                          )}
                        </div>
                        <p
                          className="text-[9px] font-bold mt-4 leading-tight italic"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Active days determine task priority and points
                          multipliers.
                        </p>
                      </section>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* PAGE FOOTER: SECURITY NOTE */}
        <div
          className="p-4 rounded-lg border flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 text-start"
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
            <ShieldCheck size={18} />
          </div>
          <div className="space-y-1 text-start">
            <h4
              className="text-[10px] font-black uppercase tracking-[0.2em] text-start"
              style={{ color: "var(--text-primary)" }}
            >
              Update Verification Process
            </h4>
            <p
              className="text-[11px] font-bold leading-relaxed tracking-tight text-start"
              style={{ color: "var(--text-secondary)" }}
            >
              To maintain the integrity of our volunteer network, sensitive
              changes to your profile information require administrative review.
              Updates are typically processed within 24 business hours.
            </p>
          </div>
        </div>
      </main>

      {/* SUPPORT & COMPLIANCE HUB DRAWER */}
      <ResuableDrawer
        isOpen={isRequestDrawerOpen}
        onClose={() => setIsRequestDrawerOpen(false)}
        title="Volunteer Support Hub"
        subtitle="Manage secure updates and information requests"
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
                  Request Dispatched
                </h3>
                <p
                  className="text-xs font-bold max-w-[280px] mx-auto leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  Your update request has been successfully queued for review.
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
                      Review Status
                    </span>
                    <span className="text-[11px] font-black text-[#22c55e]">
                      Pending
                    </span>
                  </div>
                </div>

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
                      {requestMessage || "No additional commentary provided."}
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
                Return to Profile
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
                    Security Confirmation
                  </h4>
                  <p
                    className="text-[10px] font-bold leading-relaxed tracking-tight"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    For your protection, profile updates are subject to manual
                    validation by our trust and safety team.
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
                        className="flex flex-col items-center justify-center h-28 border rounded-xl transition-all group shadow-sm active:scale-95"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors mb-2"
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
                      Identify target fields:
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
                    <p
                      className="text-[9px] font-black uppercase tracking-[0.2em] px-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Reason for Update
                    </p>
                    <textarea
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="Please clarify the reason for your update request..."
                      className="w-full h-32 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] text-xs font-bold placeholder:text-slate-400 resize-none transition-all thin-scrollbar"
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
                  Submit Request
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

      <ResuableModal
        isOpen={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
        title="Request Schedule Change"
        subtitle="Submit a proposal to admin for your weekly availability update."
        size="md"
        icon={<Calendar size={20} />}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <label
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Propose New Availability
            </label>
            <div className="grid grid-cols-7 gap-2">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
                const isDaySelected = selectedDays.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDays((prev) =>
                        prev.includes(idx)
                          ? prev.filter((i) => i !== idx)
                          : [...prev, idx],
                      );
                    }}
                    className={`aspect-square flex flex-col items-center justify-center rounded-sm border transition-all ${
                      isDaySelected
                        ? "bg-green-500/10 border-green-500/30 shadow-sm"
                        : ""
                    }`}
                    style={{
                      borderColor: isDaySelected
                        ? "var(--color-emerald)"
                        : "var(--border-color)",
                      backgroundColor: isDaySelected
                        ? ""
                        : "var(--bg-secondary)",
                    }}
                  >
                    <span
                      className={`text-[10px] font-black ${isDaySelected ? "text-green-600" : ""}`}
                      style={{
                        color: !isDaySelected ? "var(--text-muted)" : "",
                      }}
                    >
                      {day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Reason for Change
            </label>
            <textarea
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder="e.g. Updated college timetable, vehicle maintenance..."
              className="w-full p-4 rounded-sm border text-xs font-medium focus:outline-none focus:border-green-500/50 min-h-[100px] resize-none"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <button
            onClick={() => {
              toast.success("Request Submitted", {
                description:
                  "Your schedule change request has been sent to admin for approval.",
              });
              setIsScheduleModalOpen(false);
              setRequestReason("");
            }}
            disabled={!requestReason.trim()}
            className="w-full py-4 bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
          >
            Submit Request to Admin
          </button>
        </div>
      </ResuableModal>
    </div>
  );
};

export default VolunteerProfile;
