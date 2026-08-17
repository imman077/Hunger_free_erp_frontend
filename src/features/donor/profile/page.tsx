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
  CalendarDays,
  Package,
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
      <div className="max-w-7xl mx-auto w-full p-4 md:p-6 pb-2">
        <div className="relative w-full rounded-[2rem] bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 md:p-8 lg:p-10 shadow-lg text-white text-start flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          {/* Subtle grid pattern & watermark overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          {/* Watermark Logo (Heart logo placeholder) in top right */}
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-[200px] h-[200px] border-[24px] border-white/5 rounded-full pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center gap-6 text-center md:text-left z-10">
            {/* Logo Container */}
            <div className="w-28 h-28 bg-[#111827] rounded-3xl border border-white/10 flex items-center justify-center p-3.5 shrink-0 shadow-xl overflow-hidden">
              <img
                src="/hotel_logo1.jpg"
                alt="Business Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-[1000] tracking-tight text-white leading-none">
                  {profile.businessName || "The Star Grand Hotel"}
                </h1>
                <BadgeCheck size={22} className="text-[#22c55e] fill-white shrink-0" />
              </div>
              <p className="text-xs text-white/80 font-bold tracking-wide">
                {profile.businessType || "Hotel"} • Donor since {profile.memberSince || "Jan 2024"}
              </p>
              <div className="flex flex-wrap items-center gap-2.5 justify-center md:justify-start pt-1">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck size={11} className="stroke-[3]" /> Verified Donor
                </span>
                <span className="px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-full border border-white/10">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                resetSupportHub();
                setIsRequestDrawerOpen(true);
              }}
              className="bg-white hover:bg-slate-50 text-emerald-700 rounded-2xl py-3.5 px-6 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 w-full md:w-auto shrink-0"
            >
              <ShieldCheck size={15} className="text-[#22c55e] stroke-[3]" />
              <span>Request Update</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 space-y-5">
        {/* 2. STATS ROW */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 items-center gap-4">
          {/* Current Tier */}
          <div onClick={() => navigate("/donor/rewards/tiers-benefits")} className="flex items-center gap-4 p-2 cursor-pointer group hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 flex items-center justify-center shrink-0">
              <Award size={22} className="stroke-[2.5]" />
            </div>
            <div className="text-start min-w-0">
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Current Tier</p>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none mb-1.5">{currentTier.name}</h3>
              <span className="text-[8px] font-black text-[#22c55e] uppercase tracking-wider bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-100/30">View Benefits</span>
            </div>
          </div>

          {/* Profile Finish */}
          <div className="flex items-center gap-4 p-2 md:pl-6">
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9155" className="text-slate-100 dark:text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" />
                <circle cx="18" cy="18" r="15.9155" className="text-emerald-500" strokeDasharray={`${profile.completion || 95}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" />
              </svg>
              <span className="absolute text-[10px] font-black text-slate-800 dark:text-slate-100">{profile.completion || 95}%</span>
            </div>
            <div className="text-start min-w-0">
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Profile Finish</p>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none mb-1.5">{profile.completion || 95}% Completed</h3>
              <span className="text-[8px] font-black text-[#22c55e] uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-100/30">Upload Pending</span>
            </div>
          </div>

          {/* Total Donations */}
          <div className="flex items-center gap-4 p-2 md:pl-6">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 flex items-center justify-center shrink-0">
              <Package size={22} className="stroke-[2.5]" />
            </div>
            <div className="text-start min-w-0">
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Total Donations</p>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none mb-1">₹ 68,450</h3>
              <p className="text-[9px] font-bold text-slate-400 leading-none">Across 24 donations</p>
            </div>
          </div>

          {/* Joined On */}
          <div className="flex items-center gap-4 p-2 md:pl-6">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 flex items-center justify-center shrink-0">
              <CalendarDays size={22} className="stroke-[2.5]" />
            </div>
            <div className="text-start min-w-0">
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Joined On</p>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none mb-1">{profile.memberSince || "15 Jan 2024"}</h3>
              <p className="text-[9px] font-bold text-slate-400 leading-none">1 year, 7 months</p>
            </div>
          </div>
        </section>

        {/* 3. TABS NAVIGATION CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-3 px-5 shadow-sm text-start flex items-center">
          <div className="flex gap-6 w-full">
            {[
              { id: "contact", label: "Contact Details", icon: <User size={15} className="shrink-0" /> },
              { id: "business", label: "Business Details", icon: <Building2 size={15} className="shrink-0" /> },
              { id: "documents", label: "Documents", icon: <FileText size={15} className="shrink-0" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 relative border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "text-[#22c55e] border-[#22c55e]"
                    : "text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. ACTIVE TAB CONTENT CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-6 shadow-sm text-start">
          {/* TAB 1: CONTACT DETAILS */}
          {activeTab === "contact" && (
            <div className="space-y-6 animate-in fade-in duration-500 text-start">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <User size={18} className="text-[#22c55e]" /> Contact Details
                  </h2>
                  <p className="text-xs text-slate-400 font-bold mt-1">Manage your contact information</p>
                </div>
                <button
                  onClick={() => {
                    resetSupportHub();
                    setIsRequestDrawerOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-[#22c55e] bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border border-emerald-200/40 transition-all cursor-pointer active:scale-95"
                >
                  <Edit size={12} /> Edit Details
                </button>
              </div>

              {/* Three Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Primary Manager", val: profile.name, icon: <User size={16} /> },
                  { label: "Email Address", val: profile.email, icon: <Mail size={16} /> },
                  { label: "Alternate Contact", val: profile.alternateContact || "N/A", icon: <Phone size={16} /> },
                ].map((c, i) => (
                  <div key={i} className="bg-slate-50/50 dark:bg-slate-800/40 p-4.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 flex items-center justify-center shrink-0">
                      {c.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1.5">{c.label}</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{c.val}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Registered Address */}
              <div className="bg-slate-50/50 dark:bg-slate-800/40 p-4.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-2">Registered Address</span>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed max-w-xl">
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
          )}

          {/* TAB 2: BUSINESS DETAILS */}
          {activeTab === "business" && (
            <div className="space-y-6 animate-in fade-in duration-500 text-start">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Building2 size={18} className="text-[#22c55e]" /> Business Details
                  </h2>
                  <p className="text-xs text-slate-400 font-bold mt-1">Manage your business and tax details</p>
                </div>
                <button
                  onClick={() => {
                    resetSupportHub();
                    setIsRequestDrawerOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-[#22c55e] bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border border-emerald-200/40 transition-all cursor-pointer active:scale-95"
                >
                  <Edit size={12} /> Edit Details
                </button>
              </div>

              {/* Grid of Business Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div key={i} className={`space-y-2 ${field.span ? "md:col-span-2" : ""}`}>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{field.label}</p>
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 shrink-0">
                        {field.icon}
                      </div>
                      <span className="text-sm font-bold tracking-tight text-slate-700 dark:text-slate-200 flex items-center gap-2 truncate">
                        {field.val}
                        {field.isVerified && <BadgeCheck size={14} className="text-emerald-500 fill-white" />}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Details Section */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-[#22c55e] border border-emerald-100/50 dark:border-emerald-900/30 flex items-center justify-center shrink-0">
                      <Wallet size={16} />
                    </div>
                    <div className="flex flex-col text-start">
                      <h4 className="text-xs font-black uppercase tracking-wider leading-none">Payment Details</h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Bank/UPI Accounts</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-[#22c55e] text-[8px] font-black uppercase tracking-widest rounded-md border border-emerald-100/40">Verified & Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Bank Account", val: profile.bankName ? `${profile.bankName} (${profile.accountNumber || ""})` : "Not configured", icon: <Building2 size={15} /> },
                    { label: "Primary UPI ID", val: profile.upiId || "Not configured", icon: <Wallet size={15} /> },
                  ].map((field, i) => (
                    <div key={i} className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{field.label}</p>
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 shrink-0">
                          {field.icon}
                        </div>
                        <span className="text-sm font-bold tracking-tight text-slate-700 dark:text-slate-200 flex items-center gap-2 truncate">
                          {field.val}
                          <ShieldCheck size={14} className="text-emerald-500 fill-white" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="space-y-6 animate-in fade-in duration-500 text-start">
              <div>
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <FileText size={18} className="text-[#22c55e]" /> Verification Documents
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-1">Manage and upload verification documents</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {documents.map((doc: any, i: number) => (
                  <div key={i} className="group p-4 px-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-900/60 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-start min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-200 dark:group-hover:border-emerald-900/50 flex items-center justify-center shrink-0 transition-colors">
                        <FileText size={20} strokeWidth={2} />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-slate-100 leading-tight truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border transition-colors ${doc.status === "Verified" ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-amber-600 bg-amber-500/10 border-amber-500/20"}`}>{doc.status}</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">ID: {doc.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleViewDocument(doc)} title="Quick View" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 hover:shadow-sm transition-all active:scale-90"><Eye size={16} /></button>
                      <button onClick={() => handleDownloadDocument(doc)} title="Download Document" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 hover:shadow-sm transition-all active:scale-90"><Download size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Note at the bottom */}
          <div className="p-4.5 rounded-2xl border border-amber-100 dark:border-amber-950/20 bg-amber-50/30 dark:bg-amber-950/5 flex items-start gap-3.5 shadow-sm mt-8 text-start animate-in fade-in duration-500">
            <div className="w-9 h-9 rounded-xl bg-amber-100/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} className="stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">Security Note</h4>
              <p className="text-[11px] font-bold text-slate-400 leading-relaxed tracking-tight">
                To keep your account safe, changes to Bank or Legal details need admin approval. Most requests are reviewed within 24 hours.
              </p>
            </div>
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
