import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ngoDonationsService } from "../api/donations/donations.api.ts";
import { ngoNeedsService } from "../../needs/api/needs/needs.api";
import { toast } from "sonner";
import { useAuthStore } from "../../../../global/contexts/auth-store";
import { useNgoDonations } from "../hooks/useNgoDonations";
import {
  MapPin,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Eye,
  LayoutGrid,
  Table,
  Clock,
  Package,
  Truck,
  User,
  Activity,
  Building2,
  Phone,
  Star,
  Check,
  Loader2,
  AlertTriangle,
  Navigation,
  Box,
  ChevronUp,
  ChevronDown,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@heroui/react";
import ReusableTable, {
  TableChip,
} from "../../../../global/components/resuable-components/table";
import ResuableDrawer from "../../../../global/components/resuable-components/drawer";
import ResuableButton from "../../../../global/components/resuable-components/button";
import ResuableModal from "../../../../global/components/resuable-components/modal";

interface DonationRequest {
  id: number;
  title: string;
  source: string;
  sourceType: "DONOR" | "NGO";
  isOwn: boolean;
  distance: string;
  icon: string;
  time: string;
  urgency: "High" | "Normal";
  status: string;
  rawStatus?: string;
  progress: number;
  description?: string;
  quantity?: string;
  resourceType?: string;
  quality?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  expiryTime?: string;
  origin: "DONATION" | "NEED";
  isMine?: boolean;
  isSupported?: boolean;
  isClaimed?: boolean;
  volunteer?: {
    name: string;
    phone: string;
    rating: string;
  };
}

const DonationRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState<"table" | "card">("card");
  const [activeTab, setActiveTab] = useState<"marketplace" | "my-requests" | "community-requests">(
    "marketplace",
  );
  const { verifyDelivery, refreshData } = useNgoDonations();
  const [selectedRequest, setSelectedRequest] =
    useState<DonationRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [acceptingDonation, setAcceptingDonation] =
    useState<DonationRequest | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAcceptSuccess, setIsAcceptSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "DONOR" | "NGO">("ALL");
  const [supportQty, setSupportQty] = useState("");
  const [supportPhone, setSupportPhone] = useState("");

  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Sync state when modal opens for a NEED
  useEffect(() => {
    if (isAcceptModalOpen && acceptingDonation?.origin === "NEED") {
      // Pre-fill quantity (strip 'packs', 'kg' etc if possible or just use string)
      setSupportQty(acceptingDonation.quantity?.split(' ')[0] || "");
      // Pre-fill phone from user profile
      const phone = user?.ngo_profile?.contact_number || user?.profile?.phone || "";
      setSupportPhone(phone);
    }
  }, [isAcceptModalOpen, acceptingDonation, user]);

  const handleViewTracking = (donation: DonationRequest) => {
    if (activeTab === "my-requests" || donation.status !== "Available") {
      setSelectedRequest(donation);
      setIsDrawerOpen(true);
    }
  };

  const handleAcceptClick = useCallback((donation: DonationRequest) => {
    setAcceptingDonation(donation);
    setIsAcceptModalOpen(true);
  }, []);

  const handleVerifyOTP = async () => {
    if (!selectedRequest) return;
    setIsVerifying(true);
    setOtpError("");
    const result = await verifyDelivery(selectedRequest.id, otpValue);
    if (result.success) {
      toast.success("Food delivery confirmed securely!");
      setIsDrawerOpen(false);
      refreshData();
    } else {
      setOtpError(result.error);
      toast.error(result.error);
    }
    setIsVerifying(false);
  };


  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const timerRef = React.useRef<any>(null);
  const startTimeRef = React.useRef<number>(0);
  const remainingTimeRef = React.useRef<number>(2500);

  const startCloseTimer = (duration: number) => {
    startTimeRef.current = Date.now();
    remainingTimeRef.current = duration;

    timerRef.current = setTimeout(() => {
      setIsAcceptSuccess(false);
      setIsAcceptModalOpen(false);
      setAcceptingDonation(null);
      remainingTimeRef.current = 2500;
    }, duration);
  };

  const clearCloseTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(
        0,
        remainingTimeRef.current - elapsed,
      );
    }
  };

  const handleConfirmAccept = async () => {
    if (!acceptingDonation) return;
    
    setIsAccepting(true);
    try {
      if (acceptingDonation.origin === "NEED") {
        await ngoDonationsService.supportNeed(acceptingDonation.id, {
          quantity: parseFloat(supportQty) || 0,
          phone: supportPhone
        });
      } else {
        await ngoDonationsService.acceptDonation(acceptingDonation.id);
      }
      
      setIsAccepting(false);
      setIsAcceptSuccess(true);
      startCloseTimer(2500);
      
      // Refresh data
      fetchDonations();
    } catch (error) {
      setIsAccepting(false);
      toast.error(
        acceptingDonation.origin === "NEED" 
          ? "Failed to support need. It might already be closed."
          : "Failed to accept donation. It might already be claimed."
      );
      setIsAcceptModalOpen(false);
    }
  };

  const handleMouseEnterSuccess = () => {
    setIsTimerPaused(true);
    clearCloseTimer();
  };

  const handleMouseLeaveSuccess = () => {
    setIsTimerPaused(false);
    if (remainingTimeRef.current > 0) {
      startCloseTimer(remainingTimeRef.current);
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    // Optional: Only clear selectedRequest after drawer closes to avoid flickering
    // setTimeout(() => setSelectedRequest(null), 300);
  };

  const [donations, setDonations] = useState<DonationRequest[]>([]);

  const fetchDonations = useCallback(async () => {
    try {
      let rawDonations: any[] = [];
      let rawNeeds: any[] = [];

      // Use try-catch blocks individually if needed, but here we'll handle the array results
      // Always fetch both for Community and My Records to ensure all resource types are visible
      if (activeTab === "marketplace") {
        const response = await ngoDonationsService.getMarketplaceDonations();
        rawDonations = Array.isArray(response) ? response : [];
      } else if (activeTab === "community-requests") {
        const results = await Promise.allSettled([
          ngoDonationsService.getMarketplaceDonations(),
          ngoNeedsService.getAllNeeds()
        ]);
        const donationsRes = results[0].status === 'fulfilled' ? results[0].value : [];
        const needsRes = results[1].status === 'fulfilled' ? results[1].value : [];
        rawDonations = Array.isArray(donationsRes) ? donationsRes : [];
        rawNeeds = Array.isArray(needsRes) ? needsRes : [];
      } else if (activeTab === "my-requests") {
        const results = await Promise.allSettled([
          ngoDonationsService.getMyRequests(),
          ngoDonationsService.getAllDonations(),
          ngoNeedsService.getAllNeeds()
        ]);
        const d1 = results[0].status === 'fulfilled' ? results[0].value : [];
        const d2 = results[1].status === 'fulfilled' ? results[1].value : [];
        const needsRes = results[2].status === 'fulfilled' ? results[2].value : [];
        
        const res1 = Array.isArray(d1) ? d1 : [];
        const res2 = Array.isArray(d2) ? d2 : [];
        const allDonations = [...res1, ...res2];
        
        // Deduplicate by ID
        const seenIds = new Set();
        rawDonations = allDonations.filter(d => {
          if (seenIds.has(d.id)) return false;
          seenIds.add(d.id);
          return true;
        });

        rawNeeds = Array.isArray(needsRes) ? needsRes : [];
      }

      // Map Donations
      const mappedDonations: DonationRequest[] = rawDonations.map((d: any) => {
        const userId = String(user?.id);
        const ngoProfileId = String((user?.ngo_profile as any)?.id || "");
        
        // Check against BOTH the user ID and the NGO profile ID
        const matchesNGO = (val: any) => {
          const s = String(val);
          return s === userId || !!(ngoProfileId && s === ngoProfileId);
        };

        // Robust ID matching for NGO Support — accepted_ngo_id in DB stores user ID
        const isSupported = 
          matchesNGO(d.accepted_ngo) || 
          matchesNGO(d.accepted_ngo_id) ||
          matchesNGO(d.accepted_by_id) ||
          matchesNGO(d.accepted_by) ||
          (d.accepted_ngo && matchesNGO(d.accepted_ngo.id));

        // Donor ownership
        const isMine = 
          matchesNGO(d.donor_id) || 
          matchesNGO(d.donor) ||
          (d.donor && matchesNGO(d.donor.id));

        // Is anyone supporting this?
        const isClaimed = 
          !!d.accepted_ngo || 
          !!d.accepted_ngo_id || 
          !!d.accepted_by || 
          !!d.accepted_by_id;

        return {
          id: d.id,
          title: d.title || d.food_items || d.food_category,
          source: d.donor_name || d.donor?.name || "Private Donor",
          sourceType: d.donor_role || "DONOR",
          isMine: isMine,
          isSupported: isSupported,
          isOwn: isMine || isSupported, 
          isClaimed: isClaimed,
          distance: "Nearby",
          icon: (d.food_category === "Cooked Food" || d.food_items?.toLowerCase().includes("rice")) ? "🥗" : "🥖",
          time: d.created_at ? new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
          urgency: (d.status === "PENDING" || d.urgency === "High") ? "High" : "Normal",
          rawStatus: d.status,
          status: d.status === "PENDING" && !isClaimed ? "Available" : (isSupported ? d.status : "Claimed"),
          progress: isClaimed ? 60 : (d.status === "PENDING" ? 25 : 75),
          description: d.description || d.food_items,
          quantity: d.quantity || "N/A",
          expiryTime: d.expiry_time ? new Date(d.expiry_time).toLocaleDateString() : "No Expiry",
          pickupAddress: d.pickup_address,
          origin: "DONATION",
          volunteer: d.accepted_volunteer_detail ? {
             name: d.accepted_volunteer_detail.name,
             phone: d.accepted_volunteer_detail.phone,
             rating: "4.8"
          } : undefined
        }
      });

      // Map Needs
      const mappedNeeds: DonationRequest[] = rawNeeds.map((n: any) => {
        const userId = String(user?.id);
        const ngoProfileId = String((user?.ngo_profile as any)?.id || "");

        const matchesNGO = (val: any) => {
          const s = String(val);
          return s === userId || !!(ngoProfileId && s === ngoProfileId);
        };
        
        // Robust ID matching for NGO Support/Acceptance
        const isSupported = 
          (Array.isArray(n.supporter_ids) && n.supporter_ids.map(String).some((id: string) => id === userId || id === ngoProfileId)) || 
          matchesNGO(n.accepted_by) ||
          matchesNGO(n.accepted_by_id) ||
          matchesNGO(n.accepted_ngo_id) ||
          (n.accepted_by && matchesNGO(n.accepted_by.id));

        const isMine = Boolean(n.is_mine) || matchesNGO(n.ngo_id) || matchesNGO(n.ngo);

        return {
          id: n.id,
          title: n.item_name || n.title,
          source: n.ngo_name || n.ngo?.name || "Partner NGO",
          sourceType: "NGO",
          isMine: isMine,
          isSupported: isSupported,
          isOwn: isMine || isSupported, 
          distance: "Community",
          icon: "📋",
          time: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
          urgency: n.urgency || "Normal",
          status: n.status || (isSupported ? "Fulfilling" : "Open"),
          progress: isSupported ? 40 : 10,
          description: n.description,
          quantity: n.quantity ? `${n.quantity} ${n.unit || ""}` : "N/A",
          origin: "NEED",
        }
      });

      setDonations([...mappedDonations, ...mappedNeeds]);
    } catch (error) {
      toast.error("Failed to load requests");
    }
  }, [activeTab, user]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const finalFilteredDonations = donations
    .filter((d) => {
      // 1. Marketplace: Only show external Donor donations that are available
      if (activeTab === "marketplace") {
        return d.origin === "DONATION" && d.sourceType === "DONOR" && !d.isClaimed && !d.isOwn;
      }
      
      // 2. Community: Show resources from other NGOs only
      if (activeTab === "community-requests") {
        const isNGOResource = d.origin === "NEED" || (d.origin === "DONATION" && d.sourceType === "NGO");
        const status = d.status?.toLowerCase();
        
        // Match only if it belongs to someone else and is currently active/open
        const isOpen = status === "open" || status === "available" || status === "pending";
        return isNGOResource && !d.isMine && isOpen;
      }
      
      // 3. My Records: Show EVERYTHING I am involved in (My own posts + items I am fulfilling)
      if (activeTab === "my-requests") {
        return d.isOwn;
      }
      return true;
    })
    .filter((d) => roleFilter === "ALL" || d.sourceType === roleFilter)
    .filter((d) => {
      const search = searchQuery.toLowerCase();
      if (!search) return true;
      return (
        d.title?.toLowerCase().includes(search) ||
        d.source?.toLowerCase().includes(search) ||
        d.id?.toString().includes(search)
      );
    });

  const handleAccept = useCallback(
    (donation: DonationRequest) => {
      handleAcceptClick(donation);
    },
    [handleAcceptClick]
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center w-full col-span-full">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border bg-[var(--bg-secondary)] border-[var(--border-color)]">
        <Search size={32} className="text-[var(--text-muted)]" />
      </div>
      <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-[var(--text-primary)]">
        No Matching Requests
      </h3>
      <p className="text-sm font-medium max-w-xs text-[var(--text-muted)]">
        We couldn't find any donations or needs matching your current filters.
      </p>
    </div>
  );

  const renderCard = (donation: DonationRequest) => (
    <div
      className="group relative flex flex-col rounded-[24px] bg-white border border-[var(--border-color)] shadow-sm overflow-hidden h-full"
    >
      {/* 1. Top Visual Hub (Compact Height) */}
      <div className={`w-full h-28 relative flex items-center justify-center overflow-hidden ${
        donation.sourceType === "DONOR" ? "bg-green-50/40" : "bg-blue-50/40"
      }`}>
        {/* Subtle Gradient Glow */}
        <div className={`absolute top-0 right-0 w-24 h-24 blur-2xl opacity-20 -mr-6 -mt-6 ${
          donation.sourceType === "DONOR" ? "bg-green-400" : "bg-blue-400"
        }`} />
        
        {/* Circular Hub - Compact */}
        <div className="relative z-10 w-[64px] h-[64px] rounded-full border-[5px] border-white/80 bg-white shadow-sm flex items-center justify-center text-2xl">
           <span className="relative z-10 filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.05)]">
             {donation.icon}
           </span>
        </div>

        {/* Action Button - Scaled */}
        <div className="absolute bottom-2 right-3 z-20">
          {activeTab === "my-requests" ? (
             <div 
               onClick={(e) => { e.stopPropagation(); handleViewTracking(donation); }} 
               className="w-10 h-10 rounded-full bg-white border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
             >
                <Eye size={18} />
             </div>
          ) : (
             <div 
               onClick={(e) => { e.stopPropagation(); handleAccept(donation); }} 
               className={`w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg cursor-pointer transition-transform active:scale-90 ${
                 donation.origin === "NEED" ? "bg-blue-600" : "bg-[#22c55e]"
               }`}
             >
                <Check size={18} strokeWidth={3} />
             </div>
          )}
        </div>
      </div>

      {/* 2. Bottom Content Section - Data Dense */}
      <div className="flex-1 p-4 flex flex-col justify-between relative z-10">
        <div className="space-y-4 text-left">
          {/* Header Row: Big Labels */}
          <div className="flex items-center justify-between">
            <div className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-[0.1em] border ${
              donation.urgency === "High"
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-gray-50 text-[var(--text-muted)] border-gray-100"
            }`}>
              {donation.urgency}
            </div>
            <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
              activeTab === "community-requests" ? "text-blue-600" : "text-[#22c55e]"
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                 activeTab === "community-requests" ? "bg-blue-600" : "bg-[#22c55e]"
              }`} />
              {donation.status}
            </div>
          </div>

          {/* Title Area + Global Quantity (Industrial Scale) */}
          <div className="space-y-1.5">
            <h4 className={`text-[20px] font-black tracking-tight leading-[1.2] pr-2 line-clamp-2 ${
              activeTab === "community-requests" ? "text-blue-800" : (activeTab === "marketplace" ? "text-[#16a34a]" : "text-[var(--text-primary)]")
            }`}>
              {donation.title}
            </h4>
            <div className="flex items-center gap-2">
               <span className="text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)]">Vol:</span>
               <span className={`text-[14px] font-[1000] px-3 py-0.5 rounded-lg tabular-nums ${
                 activeTab === "community-requests" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-[#15803d]"
               }`}>
                 {donation.quantity || "N/A"}
               </span>
            </div>
          </div>

          {/* Data Matrix: High Legibility Meta */}
          <div className="grid grid-cols-2 gap-4 pt-1 border-t border-[var(--border-color)]/10">
            {/* Source Info */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 shrink-0 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-color)]">
                <MapPin size={14} className={activeTab === "community-requests" ? "text-blue-500" : "text-[#22c55e]"} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black text-[var(--text-primary)] tracking-tight truncate leading-tight">{donation.source}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">PROVIDER</span>
              </div>
            </div>

            {/* Lifecycle Info */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 shrink-0 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-color)]">
                <CalendarDays size={14} className="text-amber-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black text-[var(--text-primary)] tracking-tight truncate leading-tight">
                  {donation.origin === "DONATION" ? (donation.expiryTime || "Ongoing") : (donation.urgency === "High" ? "Urgent" : "Normal")}
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] leading-tight">
                  {donation.origin === "DONATION" ? "EXPIRES" : "TIMELINE"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full p-0 bg-transparent">
      <div
        className="border-b shadow-sm relative"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Isolated Decoration Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] h-[300px] bg-[#22c55e] opacity-[0.03] blur-[100px] rounded-full" />
        </div>
        {/* Sticky Header Hub */}
        <div className="sticky top-0 z-[100] overflow-hidden shadow-md">
          <div 
            className="relative z-10 px-4 md:px-8 py-6 border-b border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md"
            style={{ backgroundColor: "var(--bg-primary)" }}
          >
            <div className="flex items-center gap-5 text-start w-full md:w-auto">
              <div className="space-y-1">
                <h1
                  className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  DONATION <span className="text-hf-green">Requests</span>
                </h1>
              </div>
            </div>

            <button
              onClick={() => navigate("/ngo/needs/post")}
              className="group flex items-center gap-2 px-6 py-3 bg-[#22c55e] hover:bg-green-600 text-white rounded-xl transition-all duration-300 active:scale-95 shadow-lg shadow-green-600/20 w-full md:w-auto justify-center"
            >
              <Plus size={16} className="font-black" />
              <span className="text-[10px] font-black uppercase tracking-widest pt-0.5">
                Request Food
              </span>
            </button>
          </div>

          {/* Global Control Bar */}
          <div
            className="relative z-10 px-4 md:px-8 py-4 flex flex-col xl:flex-row items-center justify-between gap-6 border-t backdrop-blur-md shadow-sm"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex flex-col gap-2 w-full xl:w-auto">
              <div
                className="flex items-center gap-1 p-1 rounded-xl shadow-sm border w-full xl:w-auto"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                {[
                  { id: "marketplace", label: "Marketplace" },
                  { id: "community-requests", label: "Community Needs" },
                  { id: "my-requests", label: "My Records" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-center gap-3 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all transition-duration-300 w-1/3 xl:w-auto ${
                      activeTab === tab.id
                        ? "bg-[#22c55e] text-white shadow-lg shadow-green-500/20"
                        : "hover:bg-[var(--bg-tertiary)]"
                    }`}
                    style={{
                      backgroundColor:
                        activeTab === tab.id ? undefined : "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                      color: activeTab === tab.id ? "white" : "var(--text-muted)",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Descriptive Context: Understanding Text */}
              <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] pl-2 opacity-60">
                {activeTab === "marketplace" && "Browse surplus food from local donors"}
                {activeTab === "community-requests" && "Collaborate with NGO resource networks"}
                {activeTab === "my-requests" && "Track your active fulfillments and history"}
              </p>
            </div>

            {/* Right: Search & View Controls */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
              {/* Search Hub */}
              {viewMode === "card" && (
                <div className="relative w-full md:w-[280px]">
                  <Search
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 transition-all shadow-sm border"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              )}

              <div className="flex items-center gap-3 shrink-0">
                {/* View Switcher */}
                <div
                  className="flex items-center gap-1 p-1 rounded-xl shadow-sm border"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {[
                    { id: "table", icon: Table, label: "Table" },
                    { id: "card", icon: LayoutGrid, label: "Cards" },
                  ].map((view) => (
                    <button
                      key={view.id}
                      onClick={() => setViewMode(view.id as any)}
                      className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        viewMode === view.id
                          ? "bg-[#22c55e] text-white shadow-lg shadow-green-500/20"
                          : "hover:bg-[var(--bg-secondary)]"
                      }`}
                      style={{
                        backgroundColor:
                          viewMode === view.id ? undefined : "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                        color:
                          viewMode === view.id ? "white" : "var(--text-muted)",
                      }}
                    >
                      <view.icon size={14} />
                      <span className="hidden sm:inline">{view.label}</span>
                    </button>
                  ))}
                </div>

                {/* Filter Menu */}
                {viewMode === "card" && activeTab === "marketplace" && (
                  <div className="relative group/filter">
                    <div
                      className="absolute right-0 top-full mt-2 w-48 shadow-xl rounded-xl opacity-0 invisible group-hover/filter:opacity-100 group-hover/filter:visible transition-all z-50 overflow-hidden border"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div className="p-2 space-y-1">
                        {[
                          { value: "ALL", label: "All Entities" },
                          { value: "DONOR", label: "Donors Only" },
                          { value: "NGO", label: "NGOs Only" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setRoleFilter(opt.value as any)}
                            className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors ${
                              roleFilter === opt.value
                                ? "bg-emerald-500/10 text-[#22c55e]"
                                : "text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-xl transition-all shadow-sm border"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Filter size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Dynamic Content Based on View Mode */}
      <div className="h-auto p-4 md:p-8">
        {viewMode === "table" && (
          <div
            className="border rounded-md shadow-sm p-2 overflow-hidden"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <ReusableTable
              variant="compact"
              data={finalFilteredDonations}
              onRowClick={(donation: DonationRequest) => {
                if (activeTab === "my-requests") {
                  handleViewTracking(donation);
                }
              }}
              columns={[
                { name: "ID", uid: "id", sortable: true },
                {
                  name: "Item",
                  uid: "title",
                  sortable: true,
                  align: "start",
                },
                { name: "Source", uid: "source", sortable: true },
                { name: "Role", uid: "sourceType", sortable: true },
                {
                  name: activeTab === "marketplace" ? "Distance" : "Status",
                  uid: "metadata",
                  sortable: true,
                },
                { name: "Posted", uid: "time", sortable: false },
                { name: "Urgency", uid: "urgency", sortable: true },
                { name: "Actions", uid: "actions", sortable: false },
              ]}
              renderCell={(donation: DonationRequest, columnKey: React.Key) => {
                switch (columnKey) {
                  case "id":
                    return (
                      <div className="py-1">
                        <span
                          className="text-[10px] font-black uppercase tracking-widest tabular-nums border px-2 py-1 rounded-sm"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-muted)",
                          }}
                        >
                          #HF-{donation.id}024
                        </span>
                      </div>
                    );
                  case "title":
                    return (
                      <div className="py-1">
                        <TableChip
                          text={donation.title}
                          icon={
                            <span className="text-lg">{donation.icon}</span>
                          }
                          iconClassName="shadow-sm border"
                          maxWidth="max-w-[280px]"
                        />
                      </div>
                    );
                  case "source":
                    return (
                      <div className="py-1">
                        <TableChip
                          text={donation.source}
                          initials={donation.source.substring(0, 2)}
                          iconClassName={
                            donation.sourceType === "DONOR"
                              ? "bg-emerald-500 text-white"
                              : "bg-blue-500 text-white"
                          }
                        />
                      </div>
                    );
                  case "sourceType":
                    return (
                      <div className="py-1">
                        <span
                          className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border shadow-sm flex items-center gap-2"
                          style={{
                            backgroundColor:
                              donation.sourceType === "DONOR"
                                ? "rgba(16, 185, 129, 0.08)"
                                : "rgba(59, 130, 246, 0.08)",
                            borderColor:
                              donation.sourceType === "DONOR"
                                ? "rgba(16, 185, 129, 0.2)"
                                : "rgba(59, 130, 246, 0.2)",
                            color:
                              donation.sourceType === "DONOR"
                                ? "#10b981"
                                : "#3b82f6",
                          }}
                        >
                          {donation.origin === "NEED" ? (
                            <span className="text-[7px] bg-[#3b82f6]/10 text-[#3b82f6] px-1 rounded-sm">POSTED NEED</span>
                          ) : (
                            <span className="text-[7px] bg-[#10b981]/10 text-[#10b981] px-1 rounded-sm">ACCEPTED</span>
                          )}
                          {donation.sourceType}
                        </span>
                      </div>
                    );
                  case "metadata":
                    return activeTab === "marketplace" ? (
                      <div
                        className="flex items-center gap-1.5 py-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <MapPin size={12} className="text-[#22c55e]" />
                        <span className="text-[11px] font-extrabold tracking-tight tabular-nums">
                          {donation.distance}
                        </span>
                      </div>
                    ) : (
                      <div className="py-1">
                        <span
                          className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit border"
                          style={{
                            backgroundColor: "rgba(59, 130, 246, 0.08)",
                            borderColor: "rgba(59, 130, 246, 0.2)",
                            color: "var(--color-blue)",
                          }}
                        >
                          <Activity size={10} /> {donation.status}
                        </span>
                      </div>
                    );
                  case "time":
                    return (
                      <div
                        className="flex items-center gap-1.5 py-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Clock size={11} />
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] tabular-nums">
                          {donation.time}
                        </span>
                      </div>
                    );
                  case "urgency":
                    return (
                      <span
                        className="px-2.5 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest border"
                        style={{
                          backgroundColor:
                            donation.urgency === "High"
                              ? "rgba(245, 158, 11, 0.08)"
                              : "rgba(34, 197, 94, 0.08)",
                          borderColor:
                            donation.urgency === "High"
                              ? "rgba(245, 158, 11, 0.2)"
                              : "rgba(34, 197, 94, 0.2)",
                          color:
                            donation.urgency === "High" ? "#f59e0b" : "#22c55e",
                        }}
                      >
                        {donation.urgency}
                      </span>
                    );
                  case "actions":
                    return (
                      <div className="flex items-center gap-2 justify-end">
                        {activeTab === "marketplace" ? (
                          <Button
                            size="sm"
                            className="h-8 px-4 rounded-md text-[10px] font-black tracking-widest uppercase shadow-sm bg-[#22c55e] hover:bg-green-600 text-white"
                            onPress={() => handleAcceptClick(donation)}
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={12} />
                              <span>Accept</span>
                            </div>
                          </Button>
                        ) : (
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewTracking(donation);
                            }}
                            className="transition-all min-w-0 h-8 w-8 shadow-sm border"
                            style={{
                              backgroundColor: "var(--bg-primary)",
                              borderColor: "var(--border-color)",
                              color: "var(--text-muted)",
                            }}
                            title="View Intelligence Details"
                          >
                            <Eye size={15} />
                          </Button>
                        )}
                      </div>
                    );
                  default:
                    return null;
                }
              }}
            />
          </div>
        )}

        {viewMode === "card" && (
          <div className="w-full">
            {activeTab === "my-requests" ? (
              // Split Column Hubs ONLY for My Records
              finalFilteredDonations.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                  {/* Column 1: Donor Hub (Left Side) - Added visible separator border */}
                  <div className="space-y-8 group/hub border-r-0 lg:border-r border-slate-200 pr-0 lg:pr-10">
                    <div className="flex items-center justify-between px-4 pb-5 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[20px] bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-sm group-hover/hub:scale-110 transition-transform duration-500">
                          <Box size={20} className="stroke-[2.5]" />
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="text-base font-[1000] uppercase tracking-[0.2em] text-[var(--text-primary)]">
                            Donor Hub
                          </h3>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#22c55e]">
                            ACCEPTED DONOR REQUESTS
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black px-4 py-1.5 bg-[#22c55e] text-white rounded-xl shadow-lg shadow-emerald-500/20">
                        {finalFilteredDonations.filter(d => d.origin === "DONATION").length} ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-1">
                      {finalFilteredDonations.filter(d => d.origin === "DONATION").length > 0 ? (
                        finalFilteredDonations
                          .filter(d => d.origin === "DONATION")
                          .map((donation) => (
                          <div key={donation.id} onClick={() => handleViewTracking(donation)} className="h-full">
                             {renderCard(donation)}
                          </div>
                        ))
                      ) : (
                         <div className="opacity-40 grayscale scale-90">
                           {renderEmptyState()}
                         </div>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Community Hub (Right Side) */}
                  <div className="space-y-8 group/hub">
                    <div className="flex items-center justify-between px-4 pb-5 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[20px] bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-sm group-hover/hub:scale-110 transition-transform duration-500">
                          <Building2 size={20} className="stroke-[2.5]" />
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="text-base font-[1000] uppercase tracking-[0.2em] text-[var(--text-primary)]">
                            Community Hub
                          </h3>
                          <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">
                            NGO COLLABORATIONS
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black px-4 py-1.5 bg-[#3b82f6] text-white rounded-xl shadow-lg shadow-blue-500/20">
                        {finalFilteredDonations.filter(d => d.origin === "NEED").length} ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-1">
                      {finalFilteredDonations.filter(d => d.origin === "NEED").length > 0 ? (
                        finalFilteredDonations
                          .filter(d => d.origin === "NEED")
                          .map((donation) => (
                          <div key={donation.id} onClick={() => handleViewTracking(donation)} className="h-full">
                             {renderCard(donation)}
                          </div>
                        ))
                      ) : (
                         <div className="opacity-40 grayscale scale-90">
                           {renderEmptyState()}
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                 <div className="py-20">
                   {renderEmptyState()}
                 </div>
              )
            ) : (
              // Standard Unified Grid for Marketplace and Community Needs
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-1">
                {finalFilteredDonations.length > 0 ? (
                  finalFilteredDonations.map((donation) => (
                    <div key={donation.id} onClick={() => handleAcceptClick(donation)} className="h-full">
                      {renderCard(donation)}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20">
                    {renderEmptyState()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* Live Tracking Drawer */}
        <ResuableDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          title="Donation Info"
          subtitle={`ID: #HF-${selectedRequest?.id}2024`}
          size="md"
          hideHeaderBorder={true}
        >
          {selectedRequest && (
            <div className="space-y-6 p-3 sm:p-4 lg:p-5">
              {/* Hero Section */}
              <div
                className="p-5 rounded-sm border space-y-3 relative overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-hf-green animate-pulse" />
                      <span className="text-[10px] font-black text-hf-green uppercase tracking-[0.2em]">
                        LIVE
                      </span>
                    </div>
                    <h3
                      className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedRequest.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 bg-hf-green/10 text-hf-green text-[9px] font-black uppercase tracking-widest rounded-md border border-hf-green/20">
                        {selectedRequest.status}
                      </span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest opacity-60"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        * {selectedRequest.urgency} Urgency
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-14 h-14 rounded-sm flex items-center justify-center border shrink-0"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <span className="text-3xl">{selectedRequest.icon}</span>
                  </div>
                </div>

                <p
                  className="text-[11px] font-medium leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {selectedRequest.description ? selectedRequest.description : "Secure mission trace enabled. Coordination in progress."}
                </p>
              </div>

              {/* Secure Delivery Verification Terminal (NGO Side) - MOVED TO TOP FOR VISIBILITY */}
              {selectedRequest.rawStatus === "PICKED_UP" && (
                <div
                  className="p-5 rounded-sm border-2 border-hf-green space-y-4 relative overflow-hidden group animate-in slide-in-from-top-10 duration-1000"
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.03)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-sm bg-hf-green/10 border border-hf-green/20 flex items-center justify-center text-hf-green shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                      <ShieldCheck size={24} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-[1000] uppercase tracking-widest text-hf-green">
                        Handover Protocol
                      </h4>
                      <p className="text-[9px] font-black text-hf-green/60 uppercase tracking-widest">
                        AGENT IS AT DESTINATION | ENTER CODE
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="----"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                        className={`flex-1 h-16 bg-white border-2 text-center text-3xl font-black tracking-[0.5em] rounded-sm focus:outline-none transition-all ${
                          otpError ? "border-red-500 text-red-600 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-hf-green/30 text-hf-green focus:border-hf-green"
                        }`}
                      />
                      <ResuableButton
                        variant="primary"
                        onClick={handleVerifyOTP}
                        disabled={otpValue.length < 4 || isVerifying}
                        className="h-16 w-16 !rounded-sm bg-hf-green hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-90"
                      >
                        {isVerifying ? (
                          <Loader2 size={24} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={24} />
                        )}
                      </ResuableButton>
                    </div>

                    {otpError && (
                      <div className="flex items-center justify-center gap-2 text-red-600 animate-bounce">
                         <AlertTriangle size={12} />
                         <p className="text-[10px] font-[1000] uppercase tracking-widest">
                           {otpError}
                         </p>
                      </div>
                    )}

                    <p className="text-[9px] font-black text-center opacity-40 uppercase tracking-[0.2em] leading-relaxed">
                      Verify the handover by entering the 4-digit code <br /> from the delivery agent.
                    </p>
                  </div>
                  
                  {/* Subtle Scanning Effect Wrap */}
                  <div className="absolute inset-0 pointer-events-none border border-hf-green/10 opacity-50" />
                </div>
              )}

              {/* Resource Intelligence Grid */}
              <div
                className="rounded-sm p-4 border grid grid-cols-3 gap-2"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="space-y-1">
                  <span
                    className="text-[7px] font-black uppercase tracking-widest block"
                    style={{ color: "var(--text-muted)" }}
                  >
                    QUANTITY
                  </span>
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {selectedRequest.quantity || "Pending Estimation"}
                  </span>
                </div>
                <div
                  className="space-y-1 border-x px-2"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <span
                    className="text-[7px] font-black uppercase tracking-widest block"
                    style={{ color: "var(--text-muted)" }}
                  >
                    TYPE
                  </span>
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {selectedRequest.resourceType || "General Food"}
                  </span>
                </div>
                <div className="space-y-1 pl-2">
                  <span
                    className="text-[7px] font-black uppercase tracking-widest block"
                    style={{ color: "var(--text-muted)" }}
                  >
                    QUALITY
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">
                    {selectedRequest.quality || "Verified Good"}
                  </span>
                </div>
              </div>

              {/* Progress Timeline Section - ONLY AFTER ACCEPTANCE */}
              {selectedRequest.status !== "Available" && (
                <div className="space-y-4">
                  <h4
                    className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Clock size={14} className="text-[#22c55e]" />
                    Live Trace
                  </h4>
                  <div className="relative space-y-4 before:absolute before:inset-0 before:ml-2.5 before:h-full before:w-0.5 before:bg-[var(--border-color)]">
                    {[
                      {
                        status: selectedRequest.isOwn
                          ? "Mission Initialized"
                          : "Donation Posted",
                        time: "Verified",
                        date: "Checkpoint 01",
                        icon: Package,
                        completed: true,
                      },
                      {
                        status: "Volunteer Assigned",
                        time: selectedRequest.volunteer ? "Active" : "Searching",
                        date: "Checkpoint 02",
                        icon: User,
                        completed: !!selectedRequest.volunteer,
                      },
                      {
                        status: "Food Picked Up",
                        time: selectedRequest.rawStatus === "PICKED_UP" ? "Live" : "Pending",
                        date: "Checkpoint 03",
                        icon: Truck,
                        completed:
                          selectedRequest.rawStatus === "PICKED_UP" ||
                          selectedRequest.rawStatus === "DELIVERED",
                      },
                      {
                        status: "Mission Complete",
                        time: selectedRequest.rawStatus === "DELIVERED" ? "Success" : "-- : --",
                        date: "Final Point",
                        icon: CheckCircle2,
                        completed: selectedRequest.rawStatus === "DELIVERED",
                      },
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className="relative flex items-center gap-4 pl-1"
                      >
                        <div
                          className={`z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                            step.completed
                              ? "border-[#22c55e]"
                              : "border-[var(--border-color)]"
                          }`}
                          style={{ backgroundColor: "var(--bg-primary)" }}
                        >
                          {step.completed && (
                            <div className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                          )}
                        </div>
                        <div
                          className="flex flex-1 justify-between items-center gap-3 p-2.5 rounded-sm border transition-all min-w-0"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <div className="min-w-0">
                            <p
                              className={`text-[10px] font-black uppercase tracking-wider truncate mb-0.5 ${
                                step.completed
                                  ? "text-[var(--text-primary)]"
                                  : "text-[var(--text-muted)]"
                              }`}
                            >
                              {step.status}
                            </p>
                            <p
                              className="text-[8px] font-bold uppercase tracking-tight"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {step.date}
                            </p>
                          </div>
                          <span
                            className={`text-[10px] font-black tabular-nums shrink-0 ${
                              step.completed
                                ? "text-[#22c55e]"
                                : "text-[var(--text-muted)]"
                            }`}
                          >
                            {step.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Points Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="p-6 rounded-sm border space-y-4 transition-all duration-500"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center border"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <MapPin size={16} className="text-[#22c55e]" />
                    </div>
                    Pickup Point
                  </div>
                  <div className="space-y-1">
                    <p
                      className="text-[13px] font-black uppercase tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedRequest.source}
                    </p>
                    <p
                      className="text-[11px] font-semibold leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {selectedRequest.status === "Available"
                        ? "Address Hidden (Revealed after acceptance)"
                        : selectedRequest.pickupAddress || "Verified Location"}
                    </p>
                  </div>
                </div>

                <div
                  className="p-6 rounded-sm border space-y-4 transition-all duration-500"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center border"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <Building2 size={16} className="text-blue-500" />
                    </div>
                    Delivery Point
                  </div>
                  <div className="space-y-1">
                    <p
                      className="text-[13px] font-black uppercase tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Hope Shelter Main
                    </p>
                    <p
                      className="text-[11px] font-semibold leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {selectedRequest.deliveryAddress || "NGO Main Hub"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Field Agent Identification Unit */}
              {selectedRequest.status !== "Available" && (
                <div className="space-y-3 pt-2">
                  <h4
                    className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <User size={14} className="text-hf-green" />
                    Field Agent
                  </h4>
                  <div
                    className="p-3 rounded-sm border border-dashed flex items-center gap-4 transition-all duration-300 shadow-sm shadow-hf-green/5 overflow-hidden"
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.03)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    {/* Agent Identity Profile */}
                    <div
                      className="w-11 h-11 rounded-sm border flex items-center justify-center shrink-0 relative"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "rgba(34, 197, 128, 0.2)",
                      }}
                    >
                      <span className="text-lg font-black text-hf-green uppercase">
                        {selectedRequest.volunteer?.name.charAt(0) || "V"}
                      </span>
                      {/* Operational Status Indicator */}
                      <div className="absolute -top-1 -right-1 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-hf-green border border-[var(--bg-primary)] shadow-sm" />
                      </div>
                    </div>

                    {/* Agent Identification Data */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="space-y-0.5">
                        <p
                          className="text-[13px] font-black uppercase tracking-tight leading-tight truncate"
                          style={{ color: "var(--text-primary)" }}
                          title={selectedRequest.volunteer?.name}
                        >
                          {selectedRequest.volunteer?.name || "Field Agent"}
                        </p>

                        <div className="flex items-center gap-2">
                          <div
                            className="flex items-center gap-1 px-1 py-0.5 rounded-sm border shrink-0"
                            style={{
                              backgroundColor: "rgba(245, 158, 11, 0.05)",
                              borderColor: "rgba(245, 158, 11, 0.2)",
                            }}
                          >
                            <Star
                              className="fill-yellow-400 text-yellow-400"
                              size={8}
                            />
                            <span className="text-[9px] font-black text-yellow-600 tabular-nums">
                              {selectedRequest.volunteer?.rating || "4.8"}
                            </span>
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-[0.1em] text-hf-green/60 px-2 border-l border-[var(--border-color)] truncate">
                            Verified Expert
                          </span>
                        </div>
                      </div>

                      {selectedRequest.volunteer?.phone && (
                        <div className="flex items-center gap-1.5 pt-1 border-t border-[var(--border-color)] border-dotted">
                          <Phone
                            size={9}
                            className="text-hf-green opacity-60 shrink-0"
                          />
                          <p
                            className="text-[10px] font-bold tracking-wider tabular-nums opacity-60 truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {selectedRequest.volunteer.phone}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Primary Action Button */}
                    {selectedRequest.volunteer?.phone && (
                      <a
                        href={`tel:${selectedRequest.volunteer.phone.replace(/\s+/g, "")}`}
                        className="w-10 h-10 rounded-sm bg-hf-green flex items-center justify-center shadow-lg shadow-hf-green/10 hover:bg-emerald-600 transition-all duration-300 group shrink-0"
                      >
                        <Phone
                          size={18}
                          className="text-white group-hover:rotate-12 transition-transform"
                        />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </ResuableDrawer>

        {/* Accept Donation Modal */}
        <ResuableModal
          isOpen={isAcceptModalOpen}
          onOpenChange={setIsAcceptModalOpen}
          title="Confirm Acceptance"
          footer={
            !isAcceptSuccess && (
              <div className="flex items-center justify-end gap-3">
                <ResuableButton
                  variant="ghost"
                  size="sm"
                  disabled={isAccepting}
                  onClick={() => setIsAcceptModalOpen(false)}
                >
                  Cancel
                </ResuableButton>
                <ResuableButton
                  variant="primary"
                  size="md"
                  disabled={isAccepting}
                  onClick={handleConfirmAccept}
                  className="bg-[#22c55e] hover:bg-green-600 shadow-lg shadow-green-500/20 px-5 py-1.5 !rounded-lg"
                >
                    {isAccepting ? (
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider">
                      <Loader2 size={13} className="animate-spin" />
                      <span>Accepting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider">
                      <CheckCircle2 size={13} />
                      <span>Confirm Acceptance</span>
                    </div>
                  )}
                </ResuableButton>
              </div>
            )
          }
        >
          <div className="py-4">
            {isAcceptSuccess ? (
              <div
                className="relative flex flex-col items-center justify-center py-12 overflow-hidden animate-in fade-in zoom-in duration-500 cursor-default"
                onMouseEnter={handleMouseEnterSuccess}
                onMouseLeave={handleMouseLeaveSuccess}
              >
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-[#22c55e] rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-green-500/20">
                    <Check className="text-white" size={32} strokeWidth={3} />
                  </div>
                </div>

                <div className="text-center space-y-3 z-10">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#22c55e] leading-none mb-1">
                    Success
                  </h3>
                  <h2
                    className="text-xl font-black tracking-tight leading-none uppercase"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Donation Accepted!
                  </h2>
                  <p
                    className="text-[12px] font-bold max-w-[320px] leading-relaxed mx-auto"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Resource{" "}
                    <span
                      className="font-black px-1.5 py-0.5 rounded-sm"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                      }}
                    >
                      #{acceptingDonation?.id}
                    </span>{" "}
                    has been successfully accepted. A volunteer will be notified
                    for the pickup soon.
                  </p>
                </div>

                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div
                    className={`h-full bg-[#22c55e] ${isTimerPaused ? "animate-none" : "animate-[progress-shrink_2.5s_linear_forwards]"}`}
                    style={{
                      width: isTimerPaused
                        ? `${(remainingTimeRef.current / 2500) * 100}%`
                        : undefined,
                      animationDuration: `${remainingTimeRef.current}ms`,
                    }}
                  />
                </div>

                <p
                  className="absolute bottom-2 text-[9px] font-bold uppercase tracking-widest mt-4"
                  style={{ color: "var(--text-muted)" }}
                >
                  {isTimerPaused ? "Timer Paused" : "Closing automatically..."}
                </p>

                <style>{`
                  @keyframes progress-shrink {
                    from { width: ${(remainingTimeRef.current / 2500) * 100}%; }
                    to { width: 0%; }
                  }
                `}</style>
              </div>
            ) : (
              <div className="space-y-2">
                <div
                  className="p-2.5 border rounded-2xl flex items-start gap-2.5"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl shadow-sm border flex items-center justify-center text-lg shrink-0"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    {acceptingDonation?.icon}
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="text-[13px] font-black uppercase tracking-tight leading-tight mb-0.5 truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {acceptingDonation?.title}
                    </h4>
                    <p
                      className="text-[9px] font-black flex items-center gap-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Building2 size={10} className="opacity-50" />
                      {acceptingDonation?.source}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className="flex items-start gap-2.5 p-2.5 rounded-xl border"
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.08)",
                      borderColor: "rgba(34, 197, 94, 0.2)",
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border shadow-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "rgba(34, 197, 94, 0.2)",
                      }}
                    >
                      <Navigation size={12} className="text-[#22c55e]" />
                    </div>
                    <div className="space-y-0.5">
                      <p
                        className="text-[9px] font-black uppercase tracking-[0.1em]"
                        style={{ color: "var(--color-emerald-dark)" }}
                      >
                        Acceptance Policy
                      </p>
                      <p
                        className="text-[9px] font-bold leading-relaxed opacity-80"
                        style={{ color: "var(--color-emerald-dark)" }}
                      >
                        By confirming, you agree to receive and distribute this
                        food donation to your registered beneficiaries.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className="p-2.5 border rounded-xl space-y-1 shadow-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <p
                        className="text-[8px] font-black uppercase tracking-[0.1em]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Urgency
                      </p>
                      <div className="flex items-center gap-1.5 pt-1 border-t border-[var(--border-color)]">
                        <AlertTriangle
                          size={10}
                          className={
                            acceptingDonation?.urgency === "High"
                              ? "text-red-500"
                              : "text-amber-500"
                          }
                        />
                        <p
                          className={`text-[12px] font-black uppercase tracking-tight ${acceptingDonation?.urgency === "High" ? "text-red-500" : "text-amber-600"}`}
                        >
                          {acceptingDonation?.urgency}
                        </p>
                      </div>
                    </div>
                    <div
                      className="p-2.5 border rounded-xl space-y-1 shadow-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <p
                        className="text-[8px] font-black uppercase tracking-[0.1em]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Quantity
                      </p>
                      <div className="pt-1 border-t border-[var(--border-color)] flex items-center gap-1">
                        <Box size={10} style={{ color: "var(--text-muted)" }} />
                        <p
                          className="text-[12px] font-black uppercase tracking-tight"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {acceptingDonation?.quantity || "Units"}
                        </p>
                      </div>
                    </div>
                    <div
                      className="p-2.5 border rounded-xl space-y-1 shadow-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <p
                        className="text-[8px] font-black uppercase tracking-[0.1em]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Expiry
                      </p>
                      <div className="pt-1 border-t border-[var(--border-color)] flex items-center gap-1">
                        <Clock size={10} style={{ color: "var(--text-muted)" }} />
                        <p
                          className="text-[12px] font-black uppercase tracking-tight"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {acceptingDonation?.expiryTime || "Soon"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {acceptingDonation?.origin === "NEED" && (
                    <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                        Fulfillment Details
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-bold uppercase text-[var(--text-muted)] tracking-wider">
                            Amount to Donate
                          </label>
                          <div className="relative group">
                            <Box size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                              type="number"
                              value={supportQty}
                              onChange={(e) => setSupportQty(e.target.value)}
                              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-2 pl-9 pr-10 text-[12px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="0"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                              <button 
                                onClick={() => setSupportQty(prev => ((parseInt(prev) || 0) + 1).toString())}
                                className="p-0.5 hover:bg-emerald-50 rounded text-[var(--text-muted)] hover:text-emerald-600 transition-colors"
                              >
                                <ChevronUp size={10} />
                              </button>
                              <button 
                                onClick={() => setSupportQty(prev => Math.max(0, (parseInt(prev) || 0) - 1).toString())}
                                className="p-0.5 hover:bg-emerald-50 rounded text-[var(--text-muted)] hover:text-emerald-600 transition-colors"
                              >
                                <ChevronDown size={10} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-bold uppercase text-[var(--text-muted)] tracking-wider">
                            Direct Contact
                          </label>
                          <div className="relative group">
                            <Phone size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                              type="text"
                              value={supportPhone}
                              onChange={(e) => setSupportPhone(e.target.value)}
                              disabled={Boolean(user?.ngo_profile?.contact_number)}
                              className={`w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-2 pl-9 pr-4 text-[12px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all ${user?.ngo_profile?.contact_number ? 'opacity-70 cursor-not-allowed grayscale-[0.5]' : ''}`}
                              placeholder="+1..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ResuableModal>
      </div>
    </div>
  </div>
);
};

export default DonationRequests;
