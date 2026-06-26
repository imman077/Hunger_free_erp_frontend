import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ResuableButton from "../../../../global/components/reusable-components/Button";
import ResuableDrawer from "../../../../global/components/reusable-components/Drawer";
import FilePreviewModal from "../../../../global/components/reusable-components/FilePreviewModal";
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
  TrendingUp,
  HelpCircle,
  Clock,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useDonorProfile } from "../hooks/useDonorProfile";

/**
 * @module DonorProfile
 * @description Pixel-perfect Donor Profile matching the mockup layout.
 */
const DonorProfile = () => {
  const navigate = useNavigate();
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

  const { profile, documents, currentPoints, tiers, isLoading } = useDonorProfile();

  const CATEGORIES_CONFIG: Record<
    string,
    {
      label: string;
      description: string;
      icon: any;
      iconColor: string;
      bgColor: string;
      borderColor: string;
      fields: string[];
    }
  > = {
    contact: {
      label: "Contact Info",
      description: "Update contact details and information",
      icon: <User size={18} />,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/35",
      borderColor: "border-emerald-100/50 dark:border-emerald-900/20",
      fields: [
        "Manager Name",
        "Primary Email",
        "Phone Number",
        "Address Details",
      ],
    },
    legal: {
      label: "Legal Details",
      description: "Manage legal entity and documents",
      icon: <Building2 size={18} />,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/35",
      borderColor: "border-blue-100/50 dark:border-blue-900/20",
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
      description: "Update payout method and bank details",
      icon: <Wallet size={18} />,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/35",
      borderColor: "border-purple-100/50 dark:border-purple-900/20",
      fields: [
        "Bank Account",
        "Primary UPI ID",
        "Branch / IFSC",
        "Payout Schedule",
      ],
    },
    other: {
      label: "General Help",
      description: "Get help with other questions",
      icon: <HelpCircle size={18} />,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/35",
      borderColor: "border-amber-100/50 dark:border-amber-900/20",
      fields: ["UI Improvement", "Feature Request", "System Doubt", "Other"],
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

  const currentTier = useMemo(() => {
    if (!tiers || tiers.length === 0) {
      return { name: "Bronze" };
    }
    return [...tiers].sort((a, b) => b.pointsRequired - a.pointsRequired).find((t) => currentPoints >= t.pointsRequired) || tiers[0];
  }, [tiers, currentPoints]);

  if (isLoading || !profile) {
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col font-sans p-4 sm:p-6 lg:p-8 space-y-6"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* 1. HEADER CARD */}
      <div className="max-w-7xl mx-auto w-full bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          {/* Logo Container */}
          <div
            className="w-24 h-24 rounded-2xl p-2 shadow-sm overflow-hidden flex items-center justify-center bg-black shrink-0 border border-slate-800"
          >
            <img
              src="/hotel_logo1.jpg"
              alt="Business Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <h1
              className="text-2xl md:text-3xl font-black tracking-tight text-slate-800 dark:text-white"
            >
              {profile.businessName}
            </h1>
            <p
              className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500"
            >
              {profile.businessType}
            </p>
          </div>
        </div>

        <div>
          <button
            onClick={() => {
              resetSupportHub();
              setIsRequestDrawerOpen(true);
            }}
            className="bg-[#00b955] text-white hover:bg-[#00a84e] flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm shadow-md shadow-emerald-500/10 transition-all duration-200 hover:scale-[1.02] active:scale-95 text-[12px] uppercase tracking-wider font-black"
          >
            <ShieldCheck size={16} />
            Request Update
          </button>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Account Status Card */}
        <div className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 dark:bg-emerald-950/20 text-[#00b955] flex items-center justify-center shrink-0 border border-emerald-500/20">
            <TrendingUp size={20} />
          </div>
          <div className="text-start space-y-1">
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">ACCOUNT STATUS</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 leading-none">Active</p>
            <div className="inline-block bg-emerald-500/8 text-[#00b955] font-black text-[8px] px-2 py-0.5 rounded-full border border-emerald-500/20 tracking-wide uppercase leading-none">
              OPERATIONAL
            </div>
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 dark:bg-emerald-950/20 text-[#00b955] flex items-center justify-center shrink-0 border border-emerald-500/20">
            <ShieldCheck size={20} />
          </div>
          <div className="text-start space-y-1">
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">VERIFICATION</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 leading-none">{profile.verificationLevel || "Level III"}</p>
            <div className="inline-block bg-emerald-500/8 text-[#00b955] font-black text-[8px] px-2 py-0.5 rounded-full border border-emerald-500/20 tracking-wide uppercase leading-none">
              FULLY VERIFIED
            </div>
          </div>
        </div>

        {/* Current Tier Card */}
        <div
          onClick={() => navigate("/donor/rewards/tiers-benefits")}
          className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex items-center gap-5 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 dark:bg-emerald-950/20 text-[#00b955] flex items-center justify-center shrink-0 border border-emerald-500/20">
            <Award size={20} />
          </div>
          <div className="text-start space-y-1">
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">CURRENT TIER</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 leading-none">{currentTier.name}</p>
            <div className="inline-block bg-emerald-500/8 text-[#00b955] font-black text-[8px] px-2 py-0.5 rounded-full border border-emerald-500/20 tracking-wide uppercase leading-none hover:bg-emerald-500/20 transition-colors">
              VIEW BENEFITS
            </div>
          </div>
        </div>

        {/* Profile Finish Card */}
        <div className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
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
                className="text-[#2563eb] dark:text-blue-400"
                strokeDasharray={`${profile.completion || 85}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
              />
            </svg>
            <span className="absolute text-[11px] font-black text-[#0f172a] dark:text-slate-100">{profile.completion || 85}%</span>
          </div>
          <div className="text-start space-y-1.5 flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">PROFILE FINISH</p>
            <div className="inline-block bg-blue-50/50 dark:bg-blue-950/20 text-[#2563eb] dark:text-blue-400 font-black text-[9px] px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/50 tracking-wider uppercase leading-none w-fit">
              UPLOAD PENDING
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN SECTION */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Contact Details */}
        <div className="lg:col-span-4 bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 text-start">
            <User size={18} className="text-[#00b955]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">Contact Details</h3>
          </div>

          {/* Primary Manager block */}
          <div className="space-y-2 text-start">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Primary Manager</p>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
              <div className="w-9 h-9 rounded-lg border border-slate-200/50 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                <User size={15} />
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{profile.name}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
              <div className="w-9 h-9 rounded-lg border border-slate-200/50 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                <Mail size={15} />
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{profile.email}</span>
            </div>
          </div>

          {/* Alternate Contact */}
          <div className="space-y-2 text-start pt-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Alternate Contact</p>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
              <div className="w-9 h-9 rounded-lg border border-slate-200/50 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                <Phone size={15} />
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{profile.phone || "+91 8374653321"}</span>
            </div>
          </div>

          {/* Registered Address */}
          <div className="space-y-2 text-start pt-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Registered Address</p>
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
              <div className="w-9 h-9 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-[#00b955] shrink-0 shadow-sm">
                <MapPin size={15} />
              </div>
              <span className="text-xs font-bold leading-relaxed text-slate-600 dark:text-slate-350">{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Business Details / Verification Vault */}
        <div className="lg:col-span-8 bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col min-h-[500px] overflow-hidden">
          {/* TABS HEADER: REFINED FOR PERFECT ALIGNMENT */}
          <div
            className="px-3 border-b flex items-center overflow-hidden"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
              minHeight: "52px",
            }}
          >
            <div className="w-full flex items-center gap-1.5 p-1 rounded-xl">
              {[
                { id: "identity", label: "Business Details" },
                { id: "documents", label: "Verification Vault" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 w-0 py-2.5 px-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-300 relative text-center leading-snug ${
                    activeTab === tab.id
                      ? "shadow-sm border z-10 bg-white dark:bg-slate-800"
                      : "opacity-40 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor:
                      activeTab === tab.id
                        ? undefined
                        : "transparent",
                    borderColor:
                      activeTab === tab.id
                        ? "var(--border-color)"
                        : "transparent",
                    color:
                      activeTab === tab.id
                        ? "#00b955"
                        : "var(--text-primary)",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 flex-grow overflow-y-auto thin-scrollbar">
            {activeTab === "identity" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* 6 Grid Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Legal Name (Left) */}
                  <div className="space-y-2 text-start">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">LEGAL NAME</p>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <div className="w-9 h-9 rounded-lg border border-slate-200/50 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                        <Building2 size={15} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 truncate">
                        {profile.businessName} Private Limited
                        <BadgeCheck size={15} className="text-emerald-500 shrink-0" />
                      </span>
                    </div>
                  </div>

                  {/* Legal Name (Right) */}
                  <div className="space-y-2 text-start">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">LEGAL NAME</p>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <div className="w-9 h-9 rounded-lg border border-slate-200/50 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                        <Building2 size={15} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 truncate">
                        {profile.businessName} Private Limited
                        <BadgeCheck size={15} className="text-emerald-500 shrink-0" />
                      </span>
                    </div>
                  </div>

                  {/* Website */}
                  <div className="space-y-2 text-start">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">WEBSITE</p>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <div className="w-9 h-9 rounded-lg border border-slate-200/50 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                        <Globe size={15} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                        www.grandregal.com
                      </span>
                    </div>
                  </div>

                  {/* Registration ID */}
                  <div className="space-y-2 text-start">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">REGISTRATION ID</p>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <div className="w-9 h-9 rounded-lg border border-slate-200/50 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                        <FileText size={15} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                        {profile.registrationId}
                      </span>
                    </div>
                  </div>

                  {/* Entity Type */}
                  <div className="space-y-2 text-start">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ENTITY TYPE</p>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <div className="w-9 h-9 rounded-lg border border-slate-200/50 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                        <User size={15} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                        {profile.businessType || "Premium Corporate Donor"}
                      </span>
                    </div>
                  </div>

                  {/* Tax Identifier */}
                  <div className="space-y-2 text-start">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TAX IDENTIFIER</p>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <div className="w-9 h-9 rounded-lg border border-slate-200/50 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                        <ShieldCheck size={15} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                        {profile.taxId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payout Details Section */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3 text-start">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-[#00b955]">
                        <Wallet size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Payment Details</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified Bank/UPI Accounts</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-[#00b955] text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                      <span>✓</span> VERIFIED & ACTIVE
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Bank account */}
                    <div className="space-y-2 text-start">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bank Account</p>
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg border border-slate-200/50 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                            <Building2 size={15} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {profile.bankName || "HDFC Bank"} •••• {profile.accountNumber || "4567"}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-[#00b955] text-[8px] font-black uppercase rounded-sm">
                          Primary
                        </span>
                      </div>
                    </div>

                    {/* UPI ID */}
                    <div className="space-y-2 text-start">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Primary UPI</p>
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg border border-slate-200/50 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                            <Wallet size={15} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {profile.upiId || "hotel@okicici"}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-[#00b955] text-[8px] font-black uppercase rounded-sm">
                          Primary
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <p
                  className="text-[10px] font-black uppercase tracking-[0.1em] text-start text-slate-400"
                >
                  Compliance Documents
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-start">
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
                          className="w-12 h-12 rounded-xl border flex items-center justify-center text-slate-400 group-hover:text-[#00b955] group-hover:border-emerald-500/30 transition-all shadow-sm shrink-0 bg-white dark:bg-slate-800"
                          style={{
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <FileText size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col gap-2 min-w-0 flex-1 pt-0.5">
                          <p
                            className="text-sm font-black uppercase tracking-tight leading-tight text-slate-750 dark:text-slate-250"
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
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 hover:shadow-sm transition-all active:scale-90"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(doc)}
                          title="Download Document"
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 hover:shadow-sm transition-all active:scale-90"
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
      </div>

      {/* 5. SUPPORT & COMPLIANCE DRAWER */}
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
                className="w-full p-4 rounded-2xl border space-y-4 bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800"
              >
                <div className="space-y-3 text-start">
                  <div className="flex justify-between items-center">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest text-slate-400"
                    >
                      Request ID
                    </span>
                    <span
                      className="text-[11px] font-black font-mono text-slate-700 dark:text-slate-200"
                    >
                      {requestId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest text-slate-400"
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
                  className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-start"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest block text-slate-400"
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
                    className="max-h-28 overflow-y-auto thin-scrollbar p-3 border rounded-lg bg-white dark:bg-slate-850"
                  >
                    <pre
                      className="text-[10px] font-bold whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-300"
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
            <div className="space-y-6 flex-grow flex flex-col text-start">
              {/* Direct Compliance Channel Banner */}
              <div
                className="flex items-start gap-4 p-4 rounded-2xl border text-start"
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.03)",
                  borderColor: "rgba(59, 130, 246, 0.1)",
                }}
              >
                <div
                  className="p-2 rounded-xl border shrink-0 text-blue-500"
                  style={{
                    backgroundColor: "rgba(59, 130, 246, 0.08)",
                    borderColor: "rgba(59, 130, 246, 0.2)",
                  }}
                >
                  <MessageSquare size={16} />
                </div>
                <div className="space-y-1">
                  <h4
                    className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200"
                  >
                    Direct Compliance Channel
                  </h4>
                  <p
                    className="text-[11px] font-medium leading-relaxed tracking-tight text-slate-500 dark:text-slate-400"
                  >
                    For security reasons, changing legal identifiers or payout
                    methods requires manual validation by our auditing team.
                  </p>
                </div>
              </div>

              {!requestCategory ? (
                /* CATEGORY GRID VIEW */
                <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                    What do you need help with?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(CATEGORIES_CONFIG).map(([id, item]) => (
                      <button
                        key={id}
                        onClick={() => switchCategory(id)}
                        className="flex items-center gap-4 p-4 min-h-[88px] rounded-2xl border transition-all group shadow-sm active:scale-98 text-left hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/40"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <div
                          className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${item.bgColor} ${item.borderColor}`}
                        >
                          <div className={item.iconColor}>
                            {item.icon}
                          </div>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {item.label}
                          </h4>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* SUB-FIELD SELECTION VIEW */
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Select fields to update:
                    </p>
                    <button
                      onClick={() => switchCategory(null)}
                      className="text-[8px] font-black uppercase tracking-widest text-[#00b955] hover:underline"
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
                              ? "bg-[#00b955] text-white border-[#00b955] shadow-md shadow-emerald-500/20"
                              : "hover:border-green-500/30 text-slate-400"
                          }`}
                          style={{
                            backgroundColor: isSelected
                              ? undefined
                              : "var(--bg-primary)",
                            borderColor: isSelected
                              ? undefined
                              : "var(--border-color)",
                          }}
                        >
                          {field}
                        </button>
                      );
                    })}
                  </div>

                  {/* Message Area */}
                  <div className="space-y-3 text-start">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                      Request Details & Inquiries
                    </p>
                    <textarea
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder={
                        selectedFields.length > 0
                          ? `Please describe the changes for: ${selectedFields.join(
                              ", ",
                            )}`
                          : "Please provide more details about your request..."
                      }
                      className="w-full h-32 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b955]/20 focus:border-[#00b955] text-xs font-bold placeholder:text-slate-400 resize-none transition-all thin-scrollbar"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Bottom Actions Row */}
              <div className="mt-auto pt-6 space-y-4">
                <button
                  disabled={!requestCategory}
                  onClick={handleSubmit}
                  className={`w-full h-12 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative px-6 text-white ${
                    !requestCategory
                      ? "bg-blue-600/50 cursor-not-allowed opacity-60"
                      : "bg-blue-600 hover:bg-blue-700 active:scale-98 shadow-md hover:shadow-lg shadow-blue-500/10"
                  }`}
                >
                  <span>Submit Verification Request</span>
                  <ArrowRight size={14} className="absolute right-6" />
                </button>

                {/* Standard Review Time Box */}
                <div
                  className="p-3.5 rounded-xl border flex items-center gap-3 transition-colors text-left"
                  style={{
                    backgroundColor: "rgba(59, 130, 246, 0.04)",
                    borderColor: "rgba(59, 130, 246, 0.1)",
                  }}
                >
                  <Clock size={15} className="text-blue-500 shrink-0" />
                  <span className="text-[10px] font-bold text-blue-600/90 tracking-wide">
                    Standard review time: 12 – 24 business hours
                  </span>
                </div>

                {/* Secure Information Note */}
                <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] font-medium text-slate-400">
                  <Lock size={12} className="shrink-0" />
                  <span>Your information is secure and encrypted</span>
                </div>
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
