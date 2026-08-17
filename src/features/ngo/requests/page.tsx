import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../global/store/auth-store";
import {
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  Eye,
  LayoutGrid,
  Table,
  Clock,
  Building2,
  CalendarDays,
  Box,
  Activity,
  X,
  RotateCcw,
  ChevronDown,
  Droplet,
  Package,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  MoreVertical,
} from "lucide-react";
import { Button } from "@heroui/react";
import ReusableTable, {
  TableChip,
} from "../../../global/components/reusable-components/Table";
import Tabs from "../../../global/components/reusable-components/Tabs";
import { requestsInputModel } from "./store/requests_store";
import {
  fetchDonations,
  handleViewTracking,
  handleAcceptClick,
  setRequestsStateValue,
  onDestroy,
} from "./controller/requests_controller";
import { LiveTraceDrawer, AcceptDonationModal } from "./components/requests_component";
import type { DonationRequest } from "./model/requests_model";

const DonationRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const viewMode = requestsInputModel.useSelector((state) => state.requestsState.viewMode);
  const activeTab = requestsInputModel.useSelector((state) => state.requestsState.activeTab);
  const subTab = requestsInputModel.useSelector((state) => state.requestsState.subTab || "all");
  const donations = requestsInputModel.useSelector((state) => state.requestsState.donations);
  const searchQuery = requestsInputModel.useSelector((state) => state.requestsState.searchQuery);
  const roleFilter = requestsInputModel.useSelector((state) => state.requestsState.roleFilter);
  const statusFilter = requestsInputModel.useSelector((state) => state.requestsState.statusFilter || "ALL");
  const categoryFilter = requestsInputModel.useSelector((state) => state.requestsState.categoryFilter || "ALL");
  const sortFilter = requestsInputModel.useSelector((state) => state.requestsState.sortFilter || "NEWEST");

  useEffect(() => {
    fetchDonations(user);
  }, [activeTab]);

  useEffect(() => {
    return () => {
      onDestroy();
    };
  }, []);

  const hasActiveFilters =
    searchQuery !== "" ||
    roleFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    categoryFilter !== "ALL" ||
    sortFilter !== "NEWEST";

  const resetFilters = () => {
    setRequestsStateValue("searchQuery", "");
    setRequestsStateValue("roleFilter", "ALL");
    setRequestsStateValue("statusFilter", "ALL");
    setRequestsStateValue("categoryFilter", "ALL");
    setRequestsStateValue("sortFilter", "NEWEST");
  };

  const allDonationsCount = donations.filter((d: DonationRequest) => {
    return String(d.origin) === "DONATION" && d.sourceType === "DONOR" && !d.isClaimed && !d.isOwn;
  }).length;

  const myDonationsCount = donations.filter((d: DonationRequest) => {
    return String(d.origin) === "DONATION" && d.isOwn;
  }).length;

  const allNeedsCount = donations.filter((d: DonationRequest) => {
    const isNeed = String(d.origin) === "NEED";
    const status = (d.status || "open").toLowerCase();
    const isClosed = status === "completed" || status === "cancelled" || status === "fulfilled";
    return isNeed && !isClosed && !d.isMine;
  }).length;

  const supportedNeedsCount = donations.filter((d: DonationRequest) => {
    const isNeed = String(d.origin) === "NEED";
    return isNeed && d.isSupported && !d.isMine;
  }).length;

  const myNeedsCount = donations.filter((d: DonationRequest) => {
    const isNeed = String(d.origin) === "NEED";
    return isNeed && d.isMine;
  }).length;

  const finalFilteredDonations = donations
    .filter((d: DonationRequest) => {
      // 1. Marketplace: Show All Available or My Accepted Donor Donations
      if (activeTab === "marketplace") {
        if (subTab === "mine") {
          return String(d.origin) === "DONATION" && d.isOwn;
        }
        return String(d.origin) === "DONATION" && d.sourceType === "DONOR" && !d.isClaimed && !d.isOwn;
      }
      
      // 2. Community: Show All or My Posted/Supported NGO Needs
      if (activeTab === "community-requests") {
        const isNGOResource = String(d.origin) === "NEED";
        const status = (d.status || "open").toLowerCase();
        const isClosed = status === "completed" || status === "cancelled" || status === "fulfilled";
        if (subTab === "mine") {
          return isNGOResource && d.isSupported && !d.isMine;
        }
        if (subTab === "my-need") {
          return isNGOResource && d.isMine;
        }
        return isNGOResource && !isClosed && !d.isMine;
      }
      
      // 3. My Records: Show EVERYTHING I am involved in (My own posts + items I am fulfilling)
      if (activeTab === "my-requests") {
        return d.isOwn;
      }
      return true;
    })
    .filter((d: DonationRequest) => roleFilter === "ALL" || d.sourceType === roleFilter)
    .filter((d: DonationRequest) => {
      if (statusFilter === "ALL") return true;
      const statusLower = (d.status || d.rawStatus || "").toLowerCase();
      const targetLower = statusFilter.toLowerCase();
      if (targetLower === "available") {
        return statusLower === "available" || statusLower === "pending" || statusLower === "open";
      }
      if (targetLower === "accepted") {
        return statusLower === "accepted" || statusLower === "assigned" || statusLower === "picked_up" || statusLower === "in_transit";
      }
      if (targetLower === "completed") {
        return statusLower === "completed" || statusLower === "delivered";
      }
      return statusLower.includes(targetLower);
    })
    .filter((d: DonationRequest) => {
      if (categoryFilter === "ALL") return true;
      const titleLower = (d.title || "").toLowerCase();
      const resLower = (d.resourceType || "").toLowerCase();
      const catLower = (d.category || "").toLowerCase();
      const targetLower = categoryFilter.toLowerCase();
      return (
        titleLower.includes(targetLower) ||
        resLower.includes(targetLower) ||
        catLower.includes(targetLower)
      );
    })
    .filter((d: DonationRequest) => {
      const search = searchQuery.toLowerCase().trim();
      if (!search) return true;
      return (
        d.title?.toLowerCase().includes(search) ||
        d.source?.toLowerCase().includes(search) ||
        d.id?.toString().includes(search) ||
        d.quantity?.toLowerCase().includes(search) ||
        d.category?.toLowerCase().includes(search) ||
        d.pickupAddress?.toLowerCase().includes(search) ||
        d.description?.toLowerCase().includes(search)
      );
    })
    .sort((a: DonationRequest, b: DonationRequest) => {
      if (sortFilter === "OLDEST") {
        return Number(a.id) - Number(b.id);
      }
      if (sortFilter === "URGENCY") {
        const getUrgencyScore = (urg?: string) => {
          const u = (urg || "").toLowerCase();
          if (u.includes("high") || u.includes("urgent")) return 3;
          if (u.includes("medium")) return 2;
          return 1;
        };
        return getUrgencyScore(b.urgency) - getUrgencyScore(a.urgency);
      }
      return Number(b.id) - Number(a.id);
    });

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

  const getCategoryImage = (title?: string) => {
    const t = (title || "").toLowerCase();
    if (t.includes("cooked") || t.includes("rice") || t.includes("meal") || t.includes("biryani") || t.includes("curry")) {
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
    }
    if (t.includes("packaged") || t.includes("snack") || t.includes("ration") || t.includes("biscuit") || t.includes("grocery")) {
      return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80";
    }
    if (t.includes("water") || t.includes("beverage") || t.includes("juice") || t.includes("drink")) {
      return "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80";
    }
    if (t.includes("bakery") || t.includes("bread") || t.includes("pastry") || t.includes("cake")) {
      return "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80";
    }
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";
  };

  const renderCard = (donation: DonationRequest) => {
    if (donation.origin === "NEED") {
      return (
        <div
          key={donation.id}
          onClick={() => {
            if (activeTab === "my-requests") {
              handleViewTracking(donation);
            } else {
              handleAcceptClick(donation, user);
            }
          }}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[1.75rem] p-5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group/card relative overflow-hidden text-start"
        >
          {/* Top Header Row */}
          <div className="flex items-center justify-between gap-2 mb-4">
            {/* Priority Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                donation.urgency === "High" || donation.urgency === "Urgent"
                  ? "bg-red-50 text-red-600 border-red-200/80 dark:bg-red-950/30 dark:border-red-800/50"
                  : "bg-amber-50 text-amber-600 border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-800/50"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  donation.urgency === "High" || donation.urgency === "Urgent"
                    ? "bg-red-500 animate-pulse"
                    : "bg-amber-500"
                }`}
              />
              <span>{donation.urgency ? `${donation.urgency.toUpperCase()} PRIORITY` : "MEDIUM PRIORITY"}</span>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200/80 dark:bg-emerald-950/30 dark:border-emerald-800/50">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{donation.status || "OPEN"}</span>
            </div>
          </div>

          {/* Cover Image Banner */}
          <div className="relative aspect-[16/6.5] rounded-[1.25rem] overflow-hidden mb-4 shadow-sm bg-slate-100 dark:bg-slate-800">
            <img
              src={getCategoryImage(donation.title)}
              alt={donation.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Volume Overlay Pill */}
            <div className="absolute bottom-3 left-3 px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-slate-800 shadow-md flex items-center gap-2">
              <Droplet size={14} className="text-[#22c55e]" />
              <span className="text-xs font-black text-slate-800 dark:text-slate-100 tabular-nums">
                {donation.quantity || "20 Litres"} required
              </span>
            </div>
          </div>

          {/* Title & Subheading */}
          <div className="mb-4">
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-snug mb-1">
              {donation.title || "Cooking Oil"}
            </h3>
            <div className="flex items-center gap-1.5">
              <Package size={15} className="text-[#22c55e]" />
              <span className="text-sm font-black text-[#22c55e]">
                {donation.quantity || "20 Litres"}
              </span>
              <span className="text-xs font-semibold text-slate-400">required</span>
            </div>
          </div>

          {/* Detail Block 1: Requested By & Category */}
          <div className="bg-slate-50/90 dark:bg-slate-800/40 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800/60 grid grid-cols-2 gap-3 divide-x divide-slate-200/60 dark:divide-slate-700/60 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/50 text-[#22c55e] flex items-center justify-center shrink-0">
                <MapPin size={16} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">
                  REQUESTED BY
                </span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                  {donation.source || "Helping Hands NGO"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pl-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/50 text-[#22c55e] flex items-center justify-center shrink-0">
                <LayoutGrid size={16} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">
                  CATEGORY
                </span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                  {donation.category || "Cooked Food"}
                </span>
              </div>
            </div>
          </div>

          {/* Detail Block 2: Fulfillment Progress & Posted On */}
          <div className="bg-slate-50/90 dark:bg-slate-800/40 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800/60 grid grid-cols-12 gap-3 divide-x divide-slate-200/60 dark:divide-slate-700/60 items-center mb-5">
            <div className="col-span-7 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/50 text-[#22c55e] flex items-center justify-center shrink-0">
                <Box size={16} />
              </div>
              <div className="flex flex-col min-w-0 w-full">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">
                  <span>FULFILLMENT PROGRESS</span>
                  <span className="text-[#22c55e] font-black">0%</span>
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">
                  0 / {donation.quantity || "20 Litres"} fulfilled
                </span>
                <div className="w-full h-1.5 bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-[#22c55e] rounded-full w-0" />
                </div>
              </div>
            </div>

            <div className="col-span-5 flex items-center gap-3 pl-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
                <CalendarDays size={16} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">
                  POSTED ON
                </span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">
                  {donation.time || "Aug 9, 2026"}
                </span>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5">
                  10:44 AM
                </span>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div>
            {activeTab === "my-requests" ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewTracking(donation);
                }}
                className="w-full py-3.5 px-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Eye size={16} />
                <span>View Intelligence Details</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptClick(donation, user);
                }}
                className="w-full py-3.5 px-5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-[0.98]"
              >
                <HeartHandshake size={18} />
                <span>SUPPORT THIS NEED</span>
                <ArrowRight size={16} />
              </button>
            )}

            {/* Footer Support Note */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 mt-3">
              <ShieldCheck size={14} className="text-[#22c55e]" />
              <span>Your support helps NGOs serve more people in need.</span>
            </div>
          </div>
        </div>
      );
    }

    const isExpired = !!(
      donation.expiryTime &&
      donation.expiryTime !== "No Expiry" &&
      donation.expiryTime !== "NO EXPIRY" &&
      new Date(donation.expiryTime).getTime() < Date.now()
    );

    return (
      <div
        key={donation.id}
        onClick={() => {
          if (isExpired) return;
          if (activeTab === "my-requests" || subTab === "mine") {
            handleViewTracking(donation);
          } else {
            handleAcceptClick(donation, user);
          }
        }}
        className={`w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[1.75rem] p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group/card relative overflow-hidden text-start ${isExpired ? "opacity-60 cursor-not-allowed select-none" : "cursor-pointer"}`}
      >
        {/* Top Split Section: Image Left, Info Right */}
        <div className="flex items-stretch gap-3.5 mb-2">
          {/* Left Cover Image Container */}
          <div className="w-[130px] sm:w-[145px] h-[165px] sm:h-[180px] rounded-[1.25rem] overflow-hidden relative shrink-0 bg-slate-100 dark:bg-slate-800 shadow-sm">
            <img
              src={getCategoryImage(donation.title)}
              alt={donation.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Volume Overlay Pill */}
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-white/50 dark:border-slate-800 shadow-sm flex items-center gap-1.5">
              <Droplet size={13} className="text-[#22c55e]" />
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-100 tabular-nums">
                {donation.quantity || "5 Litres"}
              </span>
            </div>
          </div>

          {/* Right Info Section */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              {/* Header Badge & Action Menu */}
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200/60 dark:bg-emerald-950/30 dark:border-emerald-800/50">
                    {String(donation.origin) === "NEED" ? "COMMUNITY NEED" : "DONATION"}
                  </span>
                  {isExpired && (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/30 dark:border-red-900/50 animate-pulse">
                      EXPIRED
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg"
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Title */}
              <h4 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-snug line-clamp-1 group-hover/card:text-emerald-600 transition-colors mb-2">
                {donation.title || "Surplus Food Donation"}
              </h4>

              {/* Tags: Category & Dietary */}
              <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                <span className="bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                  {donation.category || "Dry Ration"}
                </span>
                <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                  Veg
                </span>
              </div>
            </div>

            {/* Provider & Pickup Address */}
            <div className="space-y-1.5">
              {/* Provider */}
              <div className="flex items-start gap-1.5">
                <Building2 size={14} className="text-[#22c55e] shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                    {donation.source || "The Star Grand Hotel"}
                  </span>
                  <span className="text-[9px] font-medium text-slate-400">
                    {donation.sourceType || "Donor"}
                  </span>
                </div>
              </div>

              {/* Pickup Address */}
              <div className="flex items-start gap-1.5">
                <MapPin size={14} className="text-[#22c55e] shrink-0 mt-0.5" />
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                  {donation.pickupAddress || "Star Hotel Main Lobby, Block 4, Sector 7, MG Road"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Detail Box: Quantity & Date */}
        <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-3 border border-slate-100 dark:border-slate-800/60 grid grid-cols-2 gap-3 divide-x divide-slate-200/60 dark:divide-slate-700/60 my-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/50 text-[#22c55e] flex items-center justify-center shrink-0">
              <Package size={15} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-0.5">
                QUANTITY
              </span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                {donation.quantity || "5 Litres"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pl-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/50 text-[#22c55e] flex items-center justify-center shrink-0">
              <CalendarDays size={15} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-0.5">
                DATE
              </span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                {donation.time || "Jun 23, 2026"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Action Button */}
        <div>
          {isExpired ? (
            <button
              disabled={true}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800/60 text-red-500 dark:text-red-400 border border-red-200/40 dark:border-red-950/30 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Clock size={15} />
              <span>DONATION EXPIRED</span>
            </button>
          ) : activeTab === "my-requests" || subTab === "mine" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewTracking(donation);
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Eye size={15} />
              <span>View Tracking Details</span>
            </button>
          ) : activeTab === "marketplace" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAcceptClick(donation, user);
              }}
              className="w-full py-2.5 px-4 bg-[#22c55e] hover:bg-green-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
            >
              <CheckCircle2 size={15} />
              <span>ACCEPT DONATION</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAcceptClick(donation, user);
              }}
              className="w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
            >
              <HeartHandshake size={15} />
              <span>SUPPORT THIS NEED</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    );
  };

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
            className="relative z-10 px-4 md:px-8 py-4 border-b border-[var(--border-color)] flex flex-col gap-4 backdrop-blur-md"
            style={{ backgroundColor: "var(--bg-primary)" }}
          >
            {/* Top Row: Title & Action Button */}
            <div className="flex items-center justify-between gap-4 w-full">
              <h1
                className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                DONATION <span className="text-hf-green">Requests</span>
              </h1>

              <button
                onClick={() => navigate("/ngo/needs/post")}
                className="group flex items-center gap-2 px-6 py-3 bg-[#22c55e] hover:bg-green-600 text-white rounded-xl transition-all duration-300 active:scale-95 shadow-lg shadow-green-600/20 shrink-0"
              >
                <Plus size={16} className="font-black" />
                <span className="text-[10px] font-black uppercase tracking-widest pt-0.5">
                  Request Food
                </span>
              </button>
            </div>

            {/* Bottom Row: Marketplace Navigation Toggle Bar (Individual Separate Row) */}
            <div className="pt-2 border-t border-[var(--border-color)]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
              <Tabs
                tabs={[
                  { id: "marketplace", label: "Marketplace" },
                  { id: "community-requests", label: "Community Needs" },
                  { id: "my-requests", label: "My Records" },
                ]}
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setRequestsStateValue("activeTab", tab);
                  setRequestsStateValue("subTab", "all");
                }}
                layoutId="ngoMarketplaceTab"
              />
              
              {/* Descriptive Context Text */}
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] opacity-80">
                {activeTab === "marketplace" && "Browse surplus food from local donors"}
                {activeTab === "community-requests" && "Collaborate with NGO resource networks"}
                {activeTab === "my-requests" && "Track your active fulfillments and history"}
              </p>
            </div>
          </div>
        </div>
      </div>

        {/* Global Control Bar Card Container */}
        <div className="px-4 md:px-8 pt-6">
          <div
            className="relative z-10 p-4 sm:p-5 md:p-6 flex flex-col gap-4 border rounded-2xl shadow-sm w-full"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Top Row: Search & View Switcher */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
              {/* Search Hub */}
              <div className="relative w-full sm:w-[320px]">
                <Search
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setRequestsStateValue("searchQuery", e.target.value)}
                  placeholder="Search food, donor, ID..."
                  className="w-full pl-11 pr-10 py-2.5 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 transition-all shadow-sm border"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setRequestsStateValue("searchQuery", "")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* View Switcher */}
              <Tabs
                tabs={[
                  { id: "table", icon: Table, label: "Table" },
                  { id: "card", icon: LayoutGrid, label: "Cards" },
                ]}
                activeTab={viewMode}
                onTabChange={(view) => setRequestsStateValue("viewMode", view)}
                layoutId="ngoViewModeTab"
              />
            </div>

            {/* Bottom Row: Inline Filter Controls for NGO */}
            <div className="flex flex-wrap items-center gap-3 border-t pt-3 w-full" style={{ borderColor: "var(--border-color)" }}>
              {/* 1. Status Filter Box */}
              <div className="relative inline-flex items-center shrink-0">
                <div
                  className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl h-[46px] px-4 shadow-sm hover:border-emerald-500/60 transition-all group cursor-pointer relative min-w-[140px]"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex flex-col text-left justify-center leading-tight">
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 select-none">
                      STATUS
                    </span>
                    <span
                      className="text-[12px] font-bold select-none mt-0.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {statusFilter === "ALL" ? "All Statuses" : statusFilter === "AVAILABLE" ? "Pending" : statusFilter === "ACCEPTED" ? "In Progress" : "Completed"}
                    </span>
                  </div>
                  <ChevronDown
                    size={12}
                    className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors shrink-0 ml-1.5 pointer-events-none"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setRequestsStateValue("statusFilter", e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[12px]"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="AVAILABLE">Pending</option>
                    <option value="ACCEPTED">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              {/* 2. Category Filter Box */}
              <div className="relative inline-flex items-center shrink-0">
                <div
                  className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl h-[46px] px-4 shadow-sm hover:border-emerald-500/60 transition-all group cursor-pointer relative min-w-[140px]"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex flex-col text-left justify-center leading-tight">
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 select-none">
                      CATEGORY
                    </span>
                    <span
                      className="text-[12px] font-bold select-none mt-0.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {categoryFilter === "ALL" ? "All Categories" : categoryFilter === "Cooked" ? "Cooked Food" : categoryFilter === "Water" ? "Water" : categoryFilter === "Packaged" ? "Packaged" : "Dry Ration"}
                    </span>
                  </div>
                  <ChevronDown
                    size={12}
                    className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors shrink-0 ml-1.5 pointer-events-none"
                  />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setRequestsStateValue("categoryFilter", e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[12px]"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Cooked">Cooked Food</option>
                    <option value="Water">Water</option>
                    <option value="Packaged">Packaged</option>
                    <option value="Ration">Dry Ration</option>
                  </select>
                </div>
              </div>

              {/* 3. Sort Filter Box */}
              <div className="relative inline-flex items-center shrink-0">
                <div
                  className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl h-[46px] px-4 shadow-sm hover:border-emerald-500/60 transition-all group cursor-pointer relative min-w-[140px]"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex flex-col text-left justify-center leading-tight">
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 select-none">
                      SORT BY
                    </span>
                    <span
                      className="text-[12px] font-bold select-none mt-0.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {sortFilter === "NEWEST" ? "Newest First" : sortFilter === "OLDEST" ? "Oldest First" : "High Urgency"}
                    </span>
                  </div>
                  <ChevronDown
                    size={12}
                    className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors shrink-0 ml-1.5 pointer-events-none"
                  />
                  <select
                    value={sortFilter}
                    onChange={(e) => setRequestsStateValue("sortFilter", e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[12px]"
                  >
                    <option value="NEWEST">Newest First</option>
                    <option value="OLDEST">Oldest First</option>
                    <option value="URGENCY">High Urgency</option>
                  </select>
                </div>
              </div>

              {/* 4. Entity / Source Filter Box (Only in Marketplace tab) */}
              {activeTab === "marketplace" && (
                <div className="relative inline-flex items-center shrink-0">
                  <div
                    className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl h-[46px] px-4 shadow-sm hover:border-emerald-500/60 transition-all group cursor-pointer relative min-w-[140px]"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="flex flex-col text-left justify-center leading-tight">
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 select-none">
                        SOURCE
                      </span>
                      <span
                        className="text-[12px] font-bold select-none mt-0.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {roleFilter === "ALL" ? "All Entities" : roleFilter === "DONOR" ? "Donors Only" : "NGOs Only"}
                      </span>
                    </div>
                    <ChevronDown
                      size={12}
                      className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors shrink-0 ml-1.5 pointer-events-none"
                    />
                    <select
                      value={roleFilter}
                      onChange={(e) => setRequestsStateValue("roleFilter", e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[12px]"
                    >
                      <option value="ALL">All Entities</option>
                      <option value="DONOR">Donors Only</option>
                      <option value="NGO">NGOs Only</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 5. Reset Filters Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-100 border border-red-200/80 transition-all shadow-sm ml-auto"
                >
                  <RotateCcw size={12} />
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

      {/* Sub-tab toggle: All vs My Records (only for Marketplace and Community Needs) */}
      {(activeTab === "marketplace" || activeTab === "community-requests") && (
        <div className="px-4 md:px-8 pt-4 pb-1 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-50/90 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setRequestsStateValue("subTab", "all")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                subTab === "all"
                  ? "bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span>🌐</span>
              {activeTab === "marketplace" ? `All Donations (${allDonationsCount})` : `All Needs (${allNeedsCount})`}
            </button>
            <button
              onClick={() => setRequestsStateValue("subTab", "mine")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                subTab === "mine"
                  ? "bg-[#22c55e] text-white shadow-sm shadow-emerald-500/20"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span>✅</span>
              {activeTab === "marketplace" ? `My Records (${myDonationsCount})` : `Supported Needs (${supportedNeedsCount})`}
            </button>
            {activeTab === "community-requests" && (
              <button
                onClick={() => setRequestsStateValue("subTab", "my-need")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                  subTab === "my-need"
                    ? "bg-[#22c55e] text-white shadow-sm shadow-emerald-500/20"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span>📋</span>
                My Needs ({myNeedsCount})
              </button>
            )}
          </div>
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            {subTab === "all"
              ? activeTab === "marketplace"
                ? "Showing all available donor donations"
                : "Showing all community resource needs"
              : subTab === "mine"
              ? activeTab === "marketplace"
                ? "Showing donations you have accepted"
                : "Showing community needs you supported"
              : "Showing needs you have posted"}
          </span>
        </div>
      )}

      {/* Dynamic Content Based on View Mode */}
      <div className="h-auto px-4 md:px-8 py-6">
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
              title="Donation Requests"
              description="Track and fulfill local food donation requests"
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
                        {activeTab === "marketplace" && subTab === "all" ? (
                          <Button
                            size="sm"
                            className="h-8 px-4 rounded-md text-[10px] font-black tracking-widest uppercase shadow-sm bg-[#22c55e] hover:bg-green-600 text-white"
                            onPress={() => handleAcceptClick(donation, user)}
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={12} />
                              <span>Accept</span>
                            </div>
                          </Button>
                        ) : activeTab === "community-requests" && subTab === "all" ? (
                          <Button
                            size="sm"
                            className="h-8 px-4 rounded-md text-[10px] font-black tracking-widest uppercase shadow-sm bg-blue-500 hover:bg-blue-600 text-white"
                            onPress={() => handleAcceptClick(donation, user)}
                          >
                            <div className="flex items-center gap-2">
                              <HeartHandshake size={12} />
                              <span>Support</span>
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
                  {/* Column 1: Donor Hub (Left Side) */}
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
                        {finalFilteredDonations.filter((d: DonationRequest) => String(d.origin) === "DONATION" || d.sourceType === "DONOR").length} ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-1">
                      {finalFilteredDonations.filter((d: DonationRequest) => String(d.origin) === "DONATION" || d.sourceType === "DONOR").length > 0 ? (
                        finalFilteredDonations
                          .filter((d: DonationRequest) => String(d.origin) === "DONATION" || d.sourceType === "DONOR")
                          .map((donation: DonationRequest) => (
                          <div key={donation.id} className="h-full">
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

                  {/* Column 2: Community Hub (Right Side - NGO Resource Needs) */}
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
                        {finalFilteredDonations.filter((d: DonationRequest) => String(d.origin) === "NEED" || d.sourceType === "NGO").length} ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-1">
                      {finalFilteredDonations.filter((d: DonationRequest) => String(d.origin) === "NEED" || d.sourceType === "NGO").length > 0 ? (
                        finalFilteredDonations
                          .filter((d: DonationRequest) => String(d.origin) === "NEED" || d.sourceType === "NGO")
                          .map((donation: DonationRequest) => (
                          <div key={donation.id} className="h-full">
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
                  finalFilteredDonations.map((donation: DonationRequest) => (
                    <div key={donation.id} className="h-full">
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
      </div>

      {/* Live Tracking Drawer */}
      <LiveTraceDrawer user={user} />

      {/* Accept Donation Modal */}
      <AcceptDonationModal user={user} />
    </div>
  );
};

export default DonationRequests;
