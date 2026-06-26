import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ResuableButton from "../../../global/components/reusable-components/Button";
import ResuableDrawer from "../../../global/components/reusable-components/Drawer";
import FilePreviewModal from "../../../global/components/reusable-components/FilePreviewModal";
import { useDonorProfile } from "./hooks/useDonorProfile";
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
  AlertCircle,
  Eye,
  Download,
  Edit,
} from "lucide-react";

import {
  onInit,
  onDestroy,
  toggleField,
  handleSubmit,
  resetSupportHub,
  switchCategory,
  handleViewDocument
} from "./controller/profile_controller";
import { profileInputModel } from "./store/profile_store";

/**
 * @module DonorProfile
 * @description Clean, professional Donor Profile with a focus on perfect alignment and readable hierarchy.
 */
const DonorProfile = () => {
  const navigate = useNavigate();
  useEffect(() => {
    onInit();
    return () => {
      onDestroy();
    };
  }, []);

  const activeTab = profileInputModel.useSelector((s) => s.profileFormState.activeTab);
  const isRequestDrawerOpen = profileInputModel.useSelector((s) => s.profileFormState.isRequestDrawerOpen);
  const requestCategory = profileInputModel.useSelector((s) => s.profileFormState.requestCategory);
  const selectedFields = profileInputModel.useSelector((s) => s.profileFormState.selectedFields);
  const isSubmitted = profileInputModel.useSelector((s) => s.profileFormState.isSubmitted);
  const requestId = profileInputModel.useSelector((s) => s.profileFormState.requestId);
  const requestMessage = profileInputModel.useSelector((s) => s.profileFormState.requestMessage);
  const isPreviewOpen = profileInputModel.useSelector((s) => s.profileFormState.isPreviewOpen);
  const selectedFile = profileInputModel.useSelector((s) => s.profileFormState.selectedFile);
  const fieldValues = profileInputModel.useSelector((s) => s.profileFormState.fieldValues);
  const generalNotes = profileInputModel.useSelector((s) => s.profileFormState.generalNotes);

  const setActiveTab = (activeTab: string) => profileInputModel.update({ activeTab });
  const setIsRequestDrawerOpen = (isRequestDrawerOpen: boolean) => profileInputModel.update({ isRequestDrawerOpen });
  const setIsPreviewOpen = (isPreviewOpen: boolean) => profileInputModel.update({ isPreviewOpen });
  const setIsSubmitted = (isSubmitted: boolean) => profileInputModel.update({ isSubmitted });

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
        "Legal Name",
        "Website Link",
        "Registration ID",
        "Entity Type",
        "Tax Identifier",
      ],
    },
    payout: {
      label: "Payout System",
      icon: <Wallet size={16} />,
      fields: [
        "Bank Account",
        "Primary UPI ID",
        "Branch / IFSC",
        "Payout Schedule",
      ],
    },
    other: {
      label: "General Help",
      icon: <AlertCircle size={16} />,
      fields: ["UI Improvement", "Feature Request", "System Doubt", "Other"],
    },
  };

  const { profile, documents, currentPoints, tiers } = useDonorProfile();

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

  const currentTier = tiers.length > 0
    ? [...tiers].sort((a, b) => b.pointsRequired - a.pointsRequired).find((t) => currentPoints >= t.pointsRequired) || tiers[0]
    : { name: "Loading...", perks: "", color: "", bonus: "" };



  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* 1. HERO BANNER & PROFILE HEADER */}
      <div className="relative w-full">
        {/* Decorative Top Banner */}
        <div className="h-44 w-full bg-gradient-to-r from-emerald-600 to-teal-800 dark:from-emerald-950 dark:to-teal-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300 via-transparent to-transparent"></div>
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        {/* Profile Identity Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <div
            className="p-6 rounded-2xl border shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              {/* Logo Container with floating shadow */}
              <div
                className="w-32 h-32 md:w-28 md:h-28 rounded-2xl border p-2.5 shadow-xl overflow-hidden flex items-center justify-center bg-white shrink-0 group hover:scale-[1.02] transition-transform duration-500 -mt-16 md:-mt-20 border-slate-200"
              >
                <img
                  src="/hotel_logo1.jpg"
                  alt="Business Logo"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <div className="space-y-3 pt-2 md:pt-0">


                {/* Business Name & Type */}
                <div className="space-y-1">
                  <h1
                    className="text-2xl md:text-3xl font-black tracking-tight uppercase leading-none"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {profile.businessName}
                  </h1>
                  <p
                    className="font-bold text-[10px] uppercase tracking-[0.3em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {profile.businessType}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <ResuableButton
                variant="primary"
                onClick={() => {
                  resetSupportHub();
                  setIsRequestDrawerOpen(true);
                }}
                className="w-full md:w-auto px-5 py-3 md:py-3.5 rounded-xl shadow-md text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all hover:brightness-110"
              >
                <ShieldCheck size={16} className="shrink-0" />
                <span>Request Update</span>
              </ResuableButton>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full p-3 sm:p-4 lg:p-5 space-y-5">
        {/* 2. STATS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Tier Card */}
          <div
            onClick={() => navigate("/donor/rewards/tiers-benefits")}
            className="group bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-emerald-500/20 dark:hover:border-emerald-500/30 cursor-pointer transition-all duration-300 active:scale-[0.99]"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50 group-hover:scale-105 transition-transform duration-300">
                <Award size={26} strokeWidth={2} />
              </div>
              <div className="text-start space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                  Current Tier
                </p>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none">
                  {currentTier.name}
                </h3>
              </div>
            </div>
            <div className="px-3.5 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-[9px] uppercase tracking-widest rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
              View Benefits
            </div>
          </div>

          {/* Profile Finish Card */}
          <div className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex items-center gap-5 shadow-sm transition-all duration-300">
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  className="text-blue-500 dark:text-blue-400"
                  strokeDasharray={`${profile.completion || 80}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[12px] font-black text-[#0f172a] dark:text-slate-100">
                {profile.completion || 80}%
              </span>
            </div>
            <div className="text-start space-y-1.5 flex flex-col justify-center">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                Profile Finish
              </p>
              <div className="inline-block bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-black text-[9px] px-3.5 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/50 tracking-wider uppercase leading-none w-fit">
                {profile.completion === 100 ? "Complete" : "Upload Pending"}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: ENTITY INFORMATION */}
          <aside className="lg:col-span-4 w-full">
            <div
              className="border rounded-2xl shadow-sm overflow-hidden text-start lg:h-[calc(100vh-270px)] min-h-[440px] flex flex-col hover:shadow-md transition-shadow duration-300"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div
                className="h-[56px] px-6 border-b flex items-center"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <h3
                  className="text-xs font-black uppercase tracking-widest flex items-center gap-2.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  <User size={15} className="text-[#22c55e]" /> Contact Details
                </h3>
              </div>
              <div className="p-6 flex-grow overflow-y-auto thin-scrollbar flex flex-col gap-6">
                {/* Primary Contact */}
                <div className="space-y-3">
                  <p
                    className="text-[10px] font-black uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Primary Manager
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 w-full group">
                      <div
                        className="w-9 h-9 rounded-xl border flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-500/20 transition-all duration-200"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <User size={15} />
                      </div>
                      <span
                        className="text-sm font-bold tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {profile.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 w-full group">
                      <div
                        className="w-9 h-9 rounded-xl border flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-500/20 transition-all duration-200"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <Mail size={15} />
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
                  className="pt-5 border-t space-y-3"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <p
                    className="text-[10px] font-black uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Alternate Contact
                  </p>
                  <div className="flex items-center gap-3 w-full group">
                    <div
                      className="w-9 h-9 rounded-xl border flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-500/20 transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <Phone size={15} />
                    </div>
                    <span
                      className="text-sm font-bold tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {profile.alternateContact || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Registered Address */}
                <div
                  className="pt-5 border-t space-y-3"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <p
                    className="text-[10px] font-black uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Registered Address
                  </p>
                  <div className="flex gap-4 group">
                    <div
                      className="w-9 h-9 rounded-xl border flex items-center justify-center text-[#22c55e] shrink-0 group-hover:scale-105 transition-transform duration-200"
                      style={{
                        backgroundColor: "rgba(34, 197, 94, 0.08)",
                        borderColor: "rgba(34, 197, 94, 0.2)",
                      }}
                    >
                      <MapPin size={15} />
                    </div>
                    <p
                      className="text-[13px] font-bold leading-relaxed tracking-tight"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {profile.address && (profile.address.line1 || profile.address.city || profile.address.state) ? (
                        <>
                          {profile.address.line1 && <>{profile.address.line1}<br /></>}
                          {profile.address.city && <>{profile.address.city}</>}
                          {profile.address.state && <>{profile.address.city ? ", " : ""}{profile.address.state}</>}
                          {(profile.address.city || profile.address.state) && <br />}
                          {profile.address.postalCode && <>{profile.address.postalCode}<br /></>}
                          {profile.address.country || "India"}
                        </>
                      ) : (
                        profile.location || "N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: BUSINESS DETAILS */}
          <section className="lg:col-span-8 w-full">
            <div
              className="border rounded-2xl shadow-sm lg:h-[calc(100vh-270px)] min-h-[440px] flex flex-col hover:shadow-md transition-shadow duration-300"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              {/* TABS HEADER: REFINED FOR PERFECT ALIGNMENT */}
              <div
                className="h-[56px] px-6 border-b flex items-center overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex gap-6">
                  {[
                    { id: "identity", label: "Business Details" },
                    { id: "documents", label: "Documents" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4.5 px-1 text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative border-b-2 ${
                        activeTab === tab.id
                          ? "text-[#22c55e] border-[#22c55e]"
                          : "text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 text-start flex-grow overflow-y-auto thin-scrollbar flex flex-col">
                {activeTab === "identity" && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    {/* SECTION 1: BUSINESS INTELLIGENCE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      {[
                        {
                          label: "Legal Name",
                          val: profile.legalName || `${profile.businessName} Private Limited`,
                          icon: <Building2 size={15} />,
                          span: true,
                          isVerified: true,
                        },
                        {
                          label: "Website",
                          val: profile.website || "N/A",
                          icon: <Globe size={15} />,
                          link: true,
                        },
                        {
                          label: "Registration ID",
                          val: profile.registrationId,
                          icon: <FileText size={15} />,
                        },
                        {
                          label: "Entity Type",
                          val: profile.entityType || "Premium Corporate Donor",
                          icon: <Award size={15} />,
                        },
                        {
                          label: "Tax Identifier",
                          val: profile.taxId,
                          icon: <BadgeCheck size={15} />,
                        },
                      ].map((field, i) => (
                        <div
                          key={i}
                          className={`space-y-2 ${field.span ? "md:col-span-2" : ""}`}
                        >
                          <p
                            className="text-[10px] font-black uppercase tracking-wider"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {field.label}
                          </p>
                          <div
                            className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700"
                            style={{
                              backgroundColor: "var(--bg-secondary)",
                              borderColor: "var(--border-color)",
                            }}
                          >
                            <div
                              className="flex items-center justify-center w-8 h-8 rounded-lg border text-slate-400"
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

                    {/* SECTION 2: PAYOUT INTELLIGENCE (WITH HEADING) */}
                    <div
                      className="pt-6 border-t space-y-4"
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
                          <div className="flex flex-col min-w-0 text-start">
                            <h4
                              className="text-[11px] font-black uppercase tracking-[0.15em] leading-tight truncate"
                              style={{ color: "var(--text-primary)" }}
                            >
                              Payment Details
                            </h4>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] mt-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
                              Verified Bank/UPI Accounts
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {[
                          {
                            label: "Bank Account",
                            val: profile.bankName ? `${profile.bankName} (${profile.accountNumber || ""})` : "Not configured",
                            icon: <Building2 size={15} />,
                            isSecure: true,
                          },
                          {
                            label: "Primary UPI",
                            val: profile.upiId || "Not configured",
                            icon: <Wallet size={15} />,
                            isSecure: true,
                          },
                        ].map((field, i) => (
                          <div key={i} className="space-y-2">
                            <p
                              className="text-[10px] font-black uppercase tracking-wider"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {field.label}
                            </p>
                            <div
                              className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700"
                              style={{
                                backgroundColor: "var(--bg-secondary)",
                                borderColor: "var(--border-color)",
                              }}
                            >
                              <div
                                className="flex items-center justify-center w-8 h-8 rounded-lg border text-slate-400"
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
                      className="text-[10px] font-black uppercase tracking-wider text-start"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Documents
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      {documents.map((doc: any, i: number) => (
                        <div
                          key={i}
                          className="group p-4 px-5 rounded-2xl border transition-all duration-300 hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <div className="flex items-center gap-4 text-start min-w-0 flex-1">
                            <div
                              className="w-12 h-12 rounded-xl border flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-500/30 transition-all shadow-sm shrink-0 bg-white"
                              style={{
                                borderColor: "var(--border-color)",
                              }}
                            >
                              <FileText size={20} strokeWidth={2} />
                            </div>
                            <div className="flex flex-col gap-1 min-w-0">
                              <p
                                className="text-sm font-black uppercase tracking-tight leading-tight"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {doc.name}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border transition-colors ${
                                    doc.status === "Verified"
                                      ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                                      : "text-amber-600 bg-amber-500/10 border-amber-500/20"
                                  }`}
                                >
                                  {doc.status}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                  ID: {doc.date}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleViewDocument(doc)}
                              title="Quick View"
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:shadow-sm transition-all active:scale-90"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDownloadDocument(doc)}
                              title="Download Document"
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:shadow-sm transition-all active:scale-90"
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

        {/* PAGE FOOTER: GLOBAL ADMIN CONTROL NOTICE */}
        <div
          className="p-5 rounded-lg border flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{
            backgroundColor: "rgba(245, 158, 11, 0.03)",
            borderColor: "rgba(245, 158, 11, 0.1)",
          }}
        >
          <div
            className="p-2.5 rounded-md border shadow-inner shrink-0"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.08)",
              borderColor: "rgba(245, 158, 11, 0.2)",
              color: "#f59e0b",
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div className="space-y-1">
            <h4
              className="text-[10px] font-black text-left uppercase tracking-[0.2em]"
              style={{ color: "var(--text-primary)" }}
            >
              Security Note
            </h4>
            <p
              className="text-[11px] font-bold leading-relaxed tracking-tight"
              style={{ color: "var(--text-muted)" }}
            >
              To keep your account safe, changes to Bank or Legal details need
              admin approval. Most requests are reviewed within 24 hours.
            </p>
          </div>
        </div>
      </main>

      {/* SUPPORT & COMPLIANCE DRAWER */}
      <ResuableDrawer
        isOpen={isRequestDrawerOpen}
        onClose={() => setIsRequestDrawerOpen(false)}
        title="Support & Compliance Hub"
        subtitle="Manage secure inquiries and information update requests"
        size="md"
      >
        <div className="p-3 sm:p-4 lg:p-5 h-full flex flex-col">
          {isSubmitted ? (
            /* SUCCESS FEEDBACK VIEW */
            <div className="flex-grow flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95 fade-in duration-500">
              <div
                className="w-20 h-20 rounded-full border flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.08)",
                  borderColor: "rgba(34, 197, 94, 0.2)",
                }}
              >
                <BadgeCheck size={40} className="text-[#22c55e]" />
              </div>

              <div className="text-center space-y-2">
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
                  Your verification request has been successfully sent to the
                  compliance admin.
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
                  <div className="flex justify-between items-center">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Request ID
                    </span>
                    <span
                      className="text-[11px] font-black font-mono"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {requestId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Estimated Review
                    </span>
                    <span className="text-[11px] font-black text-[#22c55e]">
                      12 - 24 Hours
                    </span>
                  </div>
                </div>

                {/* Message Summary Receipt */}
                <div
                  className="pt-3 border-t space-y-2"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest block"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Message Sent
                    </span>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="flex items-center gap-1 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 hover:bg-blue-500/10 rounded-md transition-all"
                      title="Edit Message"
                    >
                      <Edit size={10} />
                      Edit
                    </button>
                  </div>
                  <div
                    className="max-h-28 overflow-y-auto thin-scrollbar p-3 border rounded-lg"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <pre
                      className="text-[10px] font-bold whitespace-pre-wrap leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {requestMessage || "No additional message provided."}
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
                Return to Dashboard
              </ResuableButton>
            </div>
          ) : (
            /* ACTIVE FORM VIEW */
            <div className="space-y-6 flex-grow">
              {/* Header Note */}
              <div
                className="flex items-start gap-3 p-3 border rounded-lg"
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.03)",
                  borderColor: "rgba(59, 130, 246, 0.1)",
                }}
              >
                <div
                  className="p-1.5 border rounded-md shrink-0"
                  style={{
                    backgroundColor: "rgba(59, 130, 246, 0.08)",
                    borderColor: "rgba(59, 130, 246, 0.2)",
                  }}
                >
                  <MessageSquare size={14} className="text-blue-500" />
                </div>
                <div className="space-y-0.5">
                  <h4
                    className="text-[9px] font-black uppercase tracking-widest"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Direct Compliance Channel
                  </h4>
                  <p
                    className="text-[10px] font-bold leading-relaxed tracking-tight"
                    style={{ color: "var(--text-muted)" }}
                  >
                    For security reasons, changing legal identifiers or payout
                    methods requires manual validation by our auditing team.
                  </p>
                </div>
              </div>

              {!requestCategory ? (
                /* CATEGORY GRID VIEW */
                <div className="space-y-3">
                  <p
                    className="text-[9px] font-black uppercase tracking-[0.2em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    What do you need help with?
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
                          className="w-10 h-10 rounded-full border flex items-center justify-center text-slate-400 group-hover:text-[#22c55e] transition-colors mb-2"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          {item.icon}
                        </div>
                        <span
                          className="text-[9px] font-black uppercase tracking-widest text-center px-3"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* SUB-FIELD SELECTION VIEW */
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between">
                    <p
                      className="text-[9px] font-black uppercase tracking-[0.2em]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Select fields to update:
                    </p>
                    <button
                      onClick={() => switchCategory(null)}
                      className="text-[8px] font-black uppercase tracking-widest text-[#22c55e] hover:underline"
                    >
                      Change Category
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
                              : "hover:border-green-500/30"
                          }`}
                          style={{
                            backgroundColor: isSelected
                              ? undefined
                              : "var(--bg-primary)",
                            borderColor: isSelected
                              ? undefined
                              : "var(--border-color)",
                            color: isSelected ? "white" : "var(--text-muted)",
                          }}
                        >
                          {field}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Fields Dynamic Inputs */}
                  {selectedFields.length > 0 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <p
                        className="text-[9px] font-black uppercase tracking-[0.2em]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Requested Update Values
                      </p>
                      <div className="space-y-3">
                        {selectedFields.map((field: string) => (
                          <div key={field} className="space-y-1">
                            <label
                              className="text-[9px] font-black uppercase tracking-wider block"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {field}
                            </label>
                            <input
                              type="text"
                              value={fieldValues[field] || ""}
                              onChange={(e) => {
                                const nextValues = {
                                  ...fieldValues,
                                  [field]: e.target.value,
                                };
                                profileInputModel.update({ fieldValues: nextValues });
                              }}
                              placeholder={`Enter update for ${field.toLowerCase()}...`}
                              className="w-full h-10 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] text-xs font-bold transition-all"
                              style={{
                                backgroundColor: "var(--bg-secondary)",
                                borderColor: "var(--border-color)",
                                color: "var(--text-primary)",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Area */}
                  <div className="space-y-3">
                    <p
                      className="text-[9px] font-black uppercase tracking-[0.2em]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {selectedFields.length > 0 ? "Additional Comments" : "Request Details & Inquiries"}
                    </p>
                    <div className="relative group">
                      <textarea
                        value={generalNotes}
                        onChange={(e) => {
                          profileInputModel.update({ generalNotes: e.target.value });
                        }}
                        placeholder={
                          selectedFields.length > 0
                            ? "Please provide any additional comments or reason for the updates..."
                            : "Please describe your request details..."
                        }
                        className="w-full h-24 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] text-xs font-bold placeholder:text-muted resize-none transition-all thin-scrollbar"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Action */}
              <div className="pt-2">
                <ResuableButton
                  variant="primary"
                  disabled={!requestCategory}
                  className={`w-full h-10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg transition-all ${
                    requestCategory
                      ? "shadow-emerald-500/20"
                      : "opacity-50 grayscale cursor-not-allowed"
                  }`}
                  onClick={handleSubmit}
                >
                  Submit Verification Request
                </ResuableButton>
                <p
                  className="text-center mt-3 text-[8px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Standard review time: 12 - 24 business hours
                </p>
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

export default DonorProfile;
