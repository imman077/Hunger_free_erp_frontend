import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../global/store/auth-store";
import {
  MapPin, Search, Eye, LayoutGrid, Table, Clock, CalendarDays, Box,
  Activity, X, RotateCcw, ChevronDown, Droplet, Package, ArrowRight,
  ShieldCheck, HeartHandshake, LayoutGrid as GridIcon, Plus, Heart,
} from "lucide-react";
import { Button } from "@heroui/react";
import ReusableTable, { TableChip } from "../../../global/components/reusable-components/Table";
import Tabs from "../../../global/components/reusable-components/Tabs";
import ResuableDrawer from "../../../global/components/reusable-components/Drawer";
import { requestsInputModel } from "../requests/store/requests_store";
import {
  fetchDonations, handleViewTracking, handleAcceptClick,
  setRequestsStateValue, onDestroy,
} from "../requests/controller/requests_controller";
import { LiveTraceDrawer, AcceptDonationModal } from "../requests/components/requests_component";
import type { DonationRequest } from "../requests/model/requests_model";

const NGOCommunityNeeds = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedNeedForSupporters, setSelectedNeedForSupporters] = useState<DonationRequest | null>(null);
  const [isSupportersDrawerOpen, setIsSupportersDrawerOpen] = useState(false);

  const viewMode = requestsInputModel.useSelector((s) => s.requestsState.viewMode);
  const subTab = requestsInputModel.useSelector((s) => s.requestsState.subTab || "all");
  const donations = requestsInputModel.useSelector((s) => s.requestsState.donations);
  const searchQuery = requestsInputModel.useSelector((s) => s.requestsState.searchQuery);
  const statusFilter = requestsInputModel.useSelector((s) => s.requestsState.statusFilter || "ALL");
  const categoryFilter = requestsInputModel.useSelector((s) => s.requestsState.categoryFilter || "ALL");
  const sortFilter = requestsInputModel.useSelector((s) => s.requestsState.sortFilter || "NEWEST");

  const isAcceptSuccess = requestsInputModel.useSelector((s) => s.requestsState.isAcceptSuccess);

  useEffect(() => {
    if (isAcceptSuccess) {
      setRequestsStateValue("subTab", "mine");
      fetchDonations(user, "community-requests");
    }
  }, [isAcceptSuccess]);

  useEffect(() => {
    setRequestsStateValue("activeTab", "community-requests");
    setRequestsStateValue("subTab", "all");
    fetchDonations(user, "community-requests");
  }, []);

  useEffect(() => { return () => { onDestroy(); }; }, []);

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "ALL" || categoryFilter !== "ALL" || sortFilter !== "NEWEST";

  const resetFilters = () => {
    setRequestsStateValue("searchQuery", "");
    setRequestsStateValue("statusFilter", "ALL");
    setRequestsStateValue("categoryFilter", "ALL");
    setRequestsStateValue("sortFilter", "NEWEST");
  };

  const allNeedsCount = donations.filter((d: DonationRequest) => {
    const isNeed = String(d.origin) === "NEED";
    const status = (d.status || "open").toLowerCase();
    const isClosed = status === "completed" || status === "cancelled" || status === "fulfilled";
    const shouldShowClosed = statusFilter === "ALL" || statusFilter.toLowerCase() === "completed";
    return isNeed && (!isClosed || shouldShowClosed) && !d.isMine && !d.isSupported;
  }).length;

  const supportedNeedsCount = donations.filter((d: DonationRequest) => {
    const isNeed = String(d.origin) === "NEED";
    return isNeed && d.isSupported && !d.isMine;
  }).length;

  const myNeedsCount = donations.filter((d: DonationRequest) => {
    const isNeed = String(d.origin) === "NEED";
    return isNeed && d.isMine;
  }).length;

  const finalFiltered = donations
    .filter((d: DonationRequest) => {
      const isNeed = String(d.origin) === "NEED";
      if (subTab === "mine") return isNeed && d.isSupported && !d.isMine;
      if (subTab === "my-need") return isNeed && d.isMine;
      const status = (d.status || "open").toLowerCase();
      const isClosed = status === "completed" || status === "cancelled" || status === "fulfilled";
      const shouldShowClosed = statusFilter === "ALL" || statusFilter.toLowerCase() === "completed";
      return isNeed && (!isClosed || shouldShowClosed) && !d.isMine && !d.isSupported;
    })
    .filter((d: DonationRequest) => {
      if (statusFilter === "ALL") return true;
      const s = (d.status || d.rawStatus || "").toLowerCase();
      const t = statusFilter.toLowerCase();
      if (t === "open") return s === "open" || s === "pending";
      if (t === "fulfilling") return s === "accepted" || s === "fulfilling";
      if (t === "completed") return s === "completed" || s === "fulfilled";
      return s.includes(t);
    })
    .filter((d: DonationRequest) => {
      if (categoryFilter === "ALL") return true;
      const tgt = categoryFilter.toLowerCase();
      return (d.title || "").toLowerCase().includes(tgt) || (d.category || "").toLowerCase().includes(tgt);
    })
    .filter((d: DonationRequest) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        d.title?.toLowerCase().includes(q) || d.source?.toLowerCase().includes(q) ||
        d.id?.toString().includes(q) || d.quantity?.toLowerCase().includes(q) ||
        d.category?.toLowerCase().includes(q) || d.pickupAddress?.toLowerCase().includes(q)
      );
    })
    .sort((a: DonationRequest, b: DonationRequest) => {
      if (sortFilter === "OLDEST") return Number(a.id) - Number(b.id);
      if (sortFilter === "URGENCY") {
        const sc = (u?: string) => { const v = (u || "").toLowerCase(); return v.includes("high") || v.includes("urgent") ? 3 : v.includes("medium") ? 2 : 1; };
        return sc(b.urgency) - sc(a.urgency);
      }
      return Number(b.id) - Number(a.id);
    });

  const getCatImg = (title?: string) => {
    const t = (title || "").toLowerCase();
    if (t.includes("cooked") || t.includes("rice") || t.includes("meal")) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
    if (t.includes("oil") || t.includes("ration") || t.includes("grocery")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80";
    if (t.includes("water") || t.includes("beverage")) return "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80";
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";
  };

  const renderSupportersStack = (supporters: any[], donation: DonationRequest) => {
    const list = supporters || [];
    const count = list.length;
    
    const bgColors = [
      "bg-emerald-100 text-emerald-700 border-emerald-50",
      "bg-blue-100 text-blue-700 border-blue-50",
      "bg-amber-100 text-amber-700 border-amber-50",
      "bg-purple-100 text-purple-700 border-purple-50",
    ];

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          setSelectedNeedForSupporters(donation);
          setIsSupportersDrawerOpen(true);
        }}
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/20 shrink-0 select-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all active:scale-[0.97]"
      >
        <div className="flex -space-x-2.5 overflow-hidden">
          {count > 0 ? (
            list.slice(0, 3).map((supporter: any, idx: number) => {
              const name = supporter.username || supporter.email || "Donor";
              const letter = name.charAt(0).toUpperCase();
              const bgClass = bgColors[idx % bgColors.length];
              return supporter.avatar ? (
                <img
                  key={supporter.id || idx}
                  src={supporter.avatar}
                  alt={name}
                  className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-slate-900"
                />
              ) : (
                <div
                  key={supporter.id || idx}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-slate-900 ${bgClass}`}
                >
                  {letter}
                </div>
              );
            })
          ) : (
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border-2 border-white dark:border-slate-900">
              <Heart size={12} className="fill-slate-300 dark:fill-slate-700 stroke-none" />
            </div>
          )}
          
          {count > 3 && (
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-black text-slate-700 dark:text-slate-200">
              +{count - 3}
            </div>
          )}
        </div>
        <div className="flex flex-col text-start leading-none gap-0.5">
          <span className="text-[11px] font-black text-slate-800 dark:text-slate-100">
            {count} {count === 1 ? "Supporter" : "Supporters"}
          </span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
            So far
          </span>
        </div>
      </div>
    );
  };

  const renderNeedCard = (donation: DonationRequest) => (
    <div key={donation.id}
      onClick={() => {
        if (subTab !== "all") {
          handleViewTracking(donation);
        }
      }}
      className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[1.75rem] p-5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group/card relative overflow-hidden text-start cursor-pointer">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
          donation.urgency === "High" || donation.urgency === "Urgent"
            ? "bg-red-50 text-red-600 border-red-200/80 dark:bg-red-950/30 dark:border-red-800/50"
            : "bg-amber-50 text-amber-600 border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-800/50"
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${donation.urgency === "High" || donation.urgency === "Urgent" ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} />
          <span>{donation.urgency ? `${donation.urgency.toUpperCase()} PRIORITY` : "MEDIUM PRIORITY"}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200/80">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{donation.status || "OPEN"}</span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative aspect-[16/6.5] rounded-[1.25rem] overflow-hidden mb-4 shadow-sm bg-slate-100 dark:bg-slate-800">
        <img src={getCatImg(donation.title)} alt={donation.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Title */}
      <div className="mb-4">
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-snug mb-1">{donation.title || "Community Need"}</h3>
        <div className="flex items-center gap-1.5">
          <Package size={15} className="text-[#22c55e]" />
          <span className="text-sm font-black text-[#22c55e]">{donation.quantity || "20 Litres"}</span>
          <span className="text-xs font-semibold text-slate-400">required</span>
        </div>
      </div>

      {/* Detail: Requested By & Category */}
      <div className="bg-slate-50/90 dark:bg-slate-800/40 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800/60 grid grid-cols-2 gap-3 divide-x divide-slate-200/60 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-[#22c55e] flex items-center justify-center shrink-0"><MapPin size={16} /></div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">REQUESTED BY</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{donation.source || "Helping Hands NGO"}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 pl-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-[#22c55e] flex items-center justify-center shrink-0"><GridIcon size={16} /></div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">CATEGORY</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{donation.category || "Cooked Food"}</span>
          </div>
        </div>
      </div>

      {/* Detail: Progress & Posted */}
      {(() => {
        const totalQty = donation.quantity_num || 0;
        const rawFulfilled = donation.fulfilled_quantity || 0;
        const fulfilledQty = totalQty > 0 ? Math.min(totalQty, rawFulfilled) : rawFulfilled;
        const progressPct = totalQty > 0 ? Math.min(100, Math.round((fulfilledQty / totalQty) * 100)) : 0;
        return (
          <div className="bg-slate-50/90 dark:bg-slate-800/40 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800/60 grid grid-cols-12 gap-3 divide-x divide-slate-200/60 items-center mb-5">
            <div className="col-span-7 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-[#22c55e] flex items-center justify-center shrink-0"><Box size={16} /></div>
              <div className="flex flex-col min-w-0 w-full">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">
                  <span>FULFILLMENT PROGRESS</span><span className="text-[#22c55e] font-black">{progressPct}%</span>
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">
                  {fulfilledQty} / {donation.quantity || `${totalQty} Units`} fulfilled
                </span>
                <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-[#22c55e] rounded-full transition-all duration-500" style={{ width: `${Math.min(100, progressPct)}%` }} />
                </div>
              </div>
            </div>
            <div className="col-span-5 flex items-center gap-3 pl-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0"><CalendarDays size={16} /></div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">POSTED ON</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">{donation.time || "Aug 9, 2026"}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Action */}
      <div className="pt-2 flex items-center justify-between gap-3 w-full mt-auto">
        <div className="flex-grow">
          {subTab !== "all" ? (
            <button onClick={(e) => { e.stopPropagation(); handleViewTracking(donation); }}
              className="w-full py-3.5 px-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 text-center">
              <span>View Intelligence Details</span>
            </button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); handleAcceptClick(donation, user); }}
              className="w-full py-3.5 px-5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-[0.98]">
              <HeartHandshake size={18} /><span>SUPPORT THIS NEED</span><ArrowRight size={16} />
            </button>
          )}
        </div>

        {renderSupportersStack(donation.supporters || [], donation)}
      </div>
    </div>
  );

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center w-full col-span-full">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
        <Search size={32} className="text-[var(--text-muted)]" />
      </div>
      <h3 className="text-xl font-black uppercase tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>No Needs Found</h3>
      <p className="text-sm font-medium max-w-xs" style={{ color: "var(--text-muted)" }}>
        {subTab === "mine" ? "You haven't posted or supported any needs yet." : "No open community needs at the moment."}
      </p>
    </div>
  );

  return (
    <div className="w-full p-0 bg-transparent">
      {/* Header */}
      <div className="border-b shadow-sm relative" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] h-[300px] bg-blue-500 opacity-[0.03] blur-[100px] rounded-full" />
        </div>
        <div className="px-4 md:px-8 pt-6 pb-4" style={{ backgroundColor: "var(--bg-primary)" }}>
          <div className="flex items-center justify-between gap-4 w-full mb-4">
            <div>
              <h1 className="text-3xl font-[1000] uppercase tracking-tight" style={{ color: "var(--text-primary)" }}>
                COMMUNITY <span className="text-blue-500">NEEDS</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>Support resource requests from NGOs in the network</p>
            </div>
            <button onClick={() => navigate("/ngo/needs/post")}
              className="group flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/20 shrink-0">
              <Plus size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest pt-0.5">Post a Need</span>
            </button>
          </div>
        </div>
        {/* Filters */}
        <div className="px-4 md:px-8 pt-2 pb-6">
          <div className="relative z-10 p-4 sm:p-6 flex flex-col gap-4 border rounded-2xl shadow-sm w-full" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
              <div className="relative w-full sm:w-[320px]">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type="text" value={searchQuery} onChange={(e) => setRequestsStateValue("searchQuery", e.target.value)}
                  placeholder="Search needs, NGO, category..."
                  className="w-full pl-11 pr-10 py-2.5 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm border"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
                {searchQuery && (
                  <button type="button" onClick={() => setRequestsStateValue("searchQuery", "")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:text-red-500 transition-colors rounded-full" style={{ color: "var(--text-muted)" }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <Tabs tabs={[{ id: "table", icon: Table, label: "Table" }, { id: "card", icon: LayoutGrid, label: "Cards" }]}
                activeTab={viewMode} onTabChange={(v) => setRequestsStateValue("viewMode", v)} layoutId="cnViewMode" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { label: "STATUS", key: "statusFilter" as const, value: statusFilter, options: [["ALL","All Statuses"],["Open","Open"],["Fulfilling","Fulfilling"],["Completed","Completed"]] },
                { label: "CATEGORY", key: "categoryFilter" as const, value: categoryFilter, options: [["ALL","All Categories"],["Cooked Food","Cooked Food"],["Dry Ration","Dry Ration"],["Beverages","Beverages"],["Medical","Medical"]] },
                { label: "SORT BY", key: "sortFilter" as const, value: sortFilter, options: [["NEWEST","Newest First"],["OLDEST","Oldest First"],["URGENCY","High Urgency"]] },
              ].map(({ label, key, value, options }) => (
                <div key={key} className="relative inline-flex items-center shrink-0">
                  <div className="flex items-center justify-between gap-3 rounded-2xl h-[46px] px-4 shadow-sm hover:border-blue-500/60 transition-all cursor-pointer relative min-w-[140px] border"
                    style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
                    <div className="flex flex-col text-left justify-center leading-tight">
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 select-none">{label}</span>
                      <span className="text-[12px] font-bold select-none mt-0.5" style={{ color: "var(--text-primary)" }}>
                        {(options.find(([v]) => v === value) || options[0])[1]}
                      </span>
                    </div>
                    <ChevronDown size={12} className="text-slate-400 pointer-events-none ml-1.5 shrink-0" />
                    <select value={value} onChange={(e) => setRequestsStateValue(key, e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              {hasActiveFilters && (
                <button type="button" onClick={resetFilters}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-100 border border-red-200/80 transition-all shadow-sm ml-auto">
                  <RotateCcw size={12} />Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab: All / My Records / My Needs */}
      <div className="px-4 md:px-8 pt-4 pb-1 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-50/90 dark:bg-slate-900/90 border-slate-200/80 shadow-sm">
          <button onClick={() => { setRequestsStateValue("subTab", "all"); fetchDonations(user, "community-requests"); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${subTab === "all" ? "bg-white dark:bg-slate-800 shadow-sm" : ""}`}
            style={{ color: subTab === "all" ? "var(--text-primary)" : "var(--text-muted)" }}>
            <span>🌐</span>All Needs ({allNeedsCount})
          </button>
          <button onClick={() => { setRequestsStateValue("subTab", "mine"); fetchDonations(user, "community-requests"); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${subTab === "mine" ? "bg-blue-500 text-white shadow-sm shadow-blue-500/20" : ""}`}
            style={{ color: subTab === "mine" ? "white" : "var(--text-muted)" }}>
            <span>✅</span>Supported Needs ({supportedNeedsCount})
          </button>
          <button onClick={() => { setRequestsStateValue("subTab", "my-need"); fetchDonations(user, "community-requests"); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${subTab === "my-need" ? "bg-blue-500 text-white shadow-sm shadow-blue-500/20" : ""}`}
            style={{ color: subTab === "my-need" ? "white" : "var(--text-muted)" }}>
            <span>📋</span>My Needs ({myNeedsCount})
          </button>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {subTab === "all"
            ? "Showing all open community needs"
            : subTab === "mine"
            ? "Showing community needs you supported"
            : "Showing needs you have posted"}
        </span>
      </div>

      {/* Content */}
      <div className="h-auto px-4 md:px-8 py-6">
        {finalFiltered.length > 0 ? (
          viewMode === "table" ? (
            <div className="border rounded-md shadow-sm p-2 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
              <ReusableTable variant="compact" data={finalFiltered}
                title="Community Resource Needs"
                description="Browse resource requirements shared by the local community"
                onRowClick={(donation: DonationRequest) => { if (subTab !== "all") handleViewTracking(donation); }}
                columns={[
                  { name: "ID", uid: "id", sortable: true },
                  { name: "Need", uid: "title", sortable: true, align: "start" },
                  { name: "NGO", uid: "source", sortable: true },
                  { name: "Status", uid: "metadata", sortable: false },
                  { name: "Posted", uid: "time", sortable: false },
                  { name: "Urgency", uid: "urgency", sortable: true },
                  { name: "Actions", uid: "actions", sortable: false },
                ]}
                renderCell={(donation: DonationRequest, columnKey: React.Key) => {
                  switch (columnKey) {
                    case "id": return <span className="text-[10px] font-black uppercase tracking-widest tabular-nums border px-2 py-1 rounded-sm" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-muted)" }}>#HF-{donation.id}</span>;
                    case "title": return <TableChip text={donation.title} icon={<span className="text-lg">📋</span>} iconClassName="shadow-sm border" maxWidth="max-w-[280px]" />;
                    case "source": return <TableChip text={donation.source} initials={donation.source?.substring(0, 2)} iconClassName="bg-blue-500 text-white" />;
                    case "metadata": return <div className="py-1"><span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit border" style={{ backgroundColor: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.2)", color: "#3b82f6" }}><Activity size={10} />{donation.status || "Open"}</span></div>;
                    case "time": return <div className="flex items-center gap-1.5 py-1" style={{ color: "var(--text-muted)" }}><Clock size={11} /><span className="text-[10px] font-black uppercase">{donation.time}</span></div>;
                    case "urgency": return <span className="px-2.5 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest border" style={{ backgroundColor: donation.urgency === "High" ? "rgba(245,158,11,0.08)" : "rgba(59,130,246,0.08)", borderColor: donation.urgency === "High" ? "rgba(245,158,11,0.2)" : "rgba(59,130,246,0.2)", color: donation.urgency === "High" ? "#f59e0b" : "#3b82f6" }}>{donation.urgency}</span>;
                    case "actions": return (
                      <div className="flex items-center gap-2 justify-end">
                        {subTab === "all"
                          ? <Button size="sm" className="h-8 px-4 rounded-md text-[10px] font-black uppercase shadow-sm bg-blue-500 hover:bg-blue-600 text-white" onPress={() => handleAcceptClick(donation, user)}><HeartHandshake size={12} />&nbsp;Support</Button>
                          : <Button isIconOnly size="sm" variant="flat" onClick={(e) => { e.stopPropagation(); handleViewTracking(donation); }} className="h-8 w-8 shadow-sm border" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)", color: "var(--text-muted)" }}><Eye size={15} /></Button>
                        }
                      </div>
                    );
                    default: return null;
                  }
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-1">
              {finalFiltered.map((d: DonationRequest) => <div key={d.id} className="h-full">{renderNeedCard(d)}</div>)}
            </div>
          )
        ) : (
          <div className="py-20">{renderEmpty()}</div>
        )}
      </div>

      <LiveTraceDrawer user={user} />
      <AcceptDonationModal user={user} />

      <ResuableDrawer
        isOpen={isSupportersDrawerOpen}
        onClose={() => setIsSupportersDrawerOpen(false)}
        title="Supporters Details"
      >
        {selectedNeedForSupporters && (
          <div className="space-y-6 p-6 text-start bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tighter">
                {selectedNeedForSupporters.title}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Resource Requirement Supporters
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                <Heart
                  size={12}
                  fill="currentColor"
                  className="text-red-500"
                />{" "}
                Active Supporters ({selectedNeedForSupporters.supporters?.length || 0})
              </h4>
              
              {selectedNeedForSupporters.supporters && selectedNeedForSupporters.supporters.length > 0 ? (
                <div className="space-y-3">
                  {selectedNeedForSupporters.supporters.map(
                    (supporter: any, idx: number) => {
                      const contribution = (selectedNeedForSupporters.supporters_details || []).find(
                        (sd: any) =>
                          sd.id === supporter.id ||
                          sd.username === supporter.id ||
                          sd.username === supporter.username ||
                          sd.name === supporter.username
                      );
                      const role = supporter.role || "DONOR";
                      const quantity = contribution?.quantity || "Supported";
                      return (
                        <div
                          key={supporter.id || idx}
                          className="flex justify-between items-center bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] text-start"
                        >
                          <div className="flex flex-col text-start gap-1 min-w-0">
                            <span className="text-xs font-black text-[var(--text-primary)] truncate">
                              {supporter.donorProfile?.businessName || supporter.username || supporter.email}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                              Role: <span className="text-[#22c55e]">{role}</span>
                            </span>
                          </div>
                          <div className="flex flex-col text-end gap-1 shrink-0 pl-3">
                            <span className="text-[11px] font-black text-[#22c55e]">
                              {quantity}
                            </span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                              Contributed
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-[var(--border-color)] rounded-3xl">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900/60 border border-[var(--border-color)] flex items-center justify-center mb-3">
                    <Heart size={20} className="text-slate-300 dark:text-slate-700" />
                  </div>
                  <p className="text-xs font-black text-[var(--text-primary)]">No Supporters Yet</p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-[220px] leading-relaxed">
                    Be the first to support this need!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </ResuableDrawer>
    </div>
  );
};

export default NGOCommunityNeeds;
