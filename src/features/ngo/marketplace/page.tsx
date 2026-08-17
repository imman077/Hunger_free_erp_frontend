import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../global/store/auth-store";
import {
  MapPin, Search, CheckCircle2, Eye, LayoutGrid, Table,
  Clock, Building2, CalendarDays, X, RotateCcw, ChevronDown,
  Droplet, Package, ArrowRight, MoreVertical, ShoppingBag,
} from "lucide-react";
import { Button } from "@heroui/react";
import ReusableTable, { TableChip } from "../../../global/components/reusable-components/Table";
import Tabs from "../../../global/components/reusable-components/Tabs";
import { requestsInputModel } from "../requests/store/requests_store";
import {
  fetchDonations, handleViewTracking, handleAcceptClick,
  setRequestsStateValue, onDestroy,
} from "../requests/controller/requests_controller";
import { LiveTraceDrawer, AcceptDonationModal } from "../requests/components/requests_component";
import type { DonationRequest } from "../requests/model/requests_model";

const NGOMarketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const viewMode = requestsInputModel.useSelector((s) => s.requestsState.viewMode);
  const subTab = requestsInputModel.useSelector((s) => s.requestsState.subTab || "all");
  const donations = requestsInputModel.useSelector((s) => s.requestsState.donations);
  const searchQuery = requestsInputModel.useSelector((s) => s.requestsState.searchQuery);
  const statusFilter = requestsInputModel.useSelector((s) => s.requestsState.statusFilter || "ALL");
  const categoryFilter = requestsInputModel.useSelector((s) => s.requestsState.categoryFilter || "ALL");
  const sortFilter = requestsInputModel.useSelector((s) => s.requestsState.sortFilter || "NEWEST");

  useEffect(() => {
    setRequestsStateValue("activeTab", "marketplace");
    setRequestsStateValue("subTab", "all");
    fetchDonations(user, "marketplace");
  }, []);

  useEffect(() => { return () => { onDestroy(); }; }, []);

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "ALL" || categoryFilter !== "ALL" || sortFilter !== "NEWEST";

  const resetFilters = () => {
    setRequestsStateValue("searchQuery", "");
    setRequestsStateValue("statusFilter", "ALL");
    setRequestsStateValue("categoryFilter", "ALL");
    setRequestsStateValue("sortFilter", "NEWEST");
  };

  const finalFiltered = donations
    .filter((d: DonationRequest) => {
      if (subTab === "mine") return String(d.origin) === "DONATION" && d.isOwn;
      return String(d.origin) === "DONATION" && d.sourceType === "DONOR" && !d.isClaimed && !d.isOwn;
    })
    .filter((d: DonationRequest) => {
      if (statusFilter === "ALL") return true;
      const s = (d.status || d.rawStatus || "").toLowerCase();
      const t = statusFilter.toLowerCase();
      if (t === "available") return s === "available" || s === "pending" || s === "open";
      if (t === "accepted") return s === "accepted" || s === "assigned" || s === "picked_up" || s === "in_transit";
      if (t === "completed") return s === "completed" || s === "delivered";
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
    if (t.includes("packaged") || t.includes("ration") || t.includes("grocery")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80";
    if (t.includes("water") || t.includes("beverage")) return "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80";
    if (t.includes("bread") || t.includes("bakery")) return "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80";
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";
  };

  const renderCard = (donation: DonationRequest) => {
    const isExpired = !!(
      donation.expiryTime &&
      donation.expiryTime !== "No Expiry" &&
      donation.expiryTime !== "NO EXPIRY" &&
      new Date(donation.expiryTime).getTime() < Date.now()
    );

    return (
      <div key={donation.id}
        onClick={() => {
          if (isExpired) return;
          subTab === "mine" ? handleViewTracking(donation) : handleAcceptClick(donation, user);
        }}
        className={`w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[1.75rem] p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group/card relative overflow-hidden text-start ${isExpired ? "opacity-60 cursor-not-allowed select-none" : "cursor-pointer"}`}>
      <div className="flex items-stretch gap-3.5 mb-2">
        <div className="w-[130px] sm:w-[145px] h-[165px] sm:h-[180px] rounded-[1.25rem] overflow-hidden relative shrink-0 bg-slate-100 dark:bg-slate-800 shadow-sm">
          <img src={getCatImg(donation.title)} alt={donation.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-white/50 shadow-sm flex items-center gap-1.5">
            <Droplet size={13} className="text-[#22c55e]" />
            <span className="text-[11px] font-black text-slate-800 dark:text-slate-100">{donation.quantity || "5 Litres"}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  {subTab === "mine" ? "ACCEPTED" : "AVAILABLE"}
                </span>
                {isExpired && (
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/30 dark:border-red-900/50 animate-pulse">
                    EXPIRED
                  </span>
                )}
              </div>
              <button type="button" onClick={(e) => e.stopPropagation()} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"><MoreVertical size={16} /></button>
            </div>
            <h4 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-snug line-clamp-1 group-hover/card:text-emerald-600 transition-colors mb-2">
              {donation.title || "Surplus Food Donation"}
            </h4>
            <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
              <span className="bg-purple-50 text-purple-600 border border-purple-200/60 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">{donation.category || "Dry Ration"}</span>
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/60 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">Veg</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start gap-1.5">
              <Building2 size={14} className="text-[#22c55e] shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{donation.source || "The Star Grand Hotel"}</span>
                <span className="text-[9px] font-medium text-slate-400">{donation.sourceType || "Donor"}</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <MapPin size={14} className="text-[#22c55e] shrink-0 mt-0.5" />
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">{donation.pickupAddress || "Main Lobby, MG Road"}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-3 border border-slate-100 dark:border-slate-800/60 grid grid-cols-2 gap-3 divide-x divide-slate-200/60 my-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-[#22c55e] flex items-center justify-center shrink-0"><Package size={15} /></div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">QUANTITY</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{donation.quantity || "5 Litres"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 pl-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-[#22c55e] flex items-center justify-center shrink-0"><CalendarDays size={15} /></div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">DATE</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{donation.time || "Jun 23, 2026"}</span>
          </div>
        </div>
      </div>
      <div>
        {isExpired ? (
          <button
            disabled={true}
            className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800/60 text-red-500 dark:text-red-400 border border-red-200/40 dark:border-red-950/30 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Clock size={15} />
            <span>DONATION EXPIRED</span>
          </button>
        ) : subTab === "mine" ? (
          <button onClick={(e) => { e.stopPropagation(); handleViewTracking(donation); }}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95">
            <Eye size={15} /><span>View Tracking Details</span>
          </button>
        ) : (
          <button onClick={(e) => { e.stopPropagation(); handleAcceptClick(donation, user); }}
            className="w-full py-2.5 px-4 bg-[#22c55e] hover:bg-green-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-[0.98]">
            <CheckCircle2 size={15} /><span>ACCEPT DONATION</span><ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
    );
  };

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center w-full col-span-full">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
        <Search size={32} className="text-[var(--text-muted)]" />
      </div>
      <h3 className="text-xl font-black uppercase tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>No Donations Found</h3>
      <p className="text-sm font-medium max-w-xs" style={{ color: "var(--text-muted)" }}>
        {subTab === "mine" ? "You haven't accepted any donations yet." : "No available donor donations at the moment."}
      </p>
    </div>
  );

  return (
    <div className="w-full p-0 bg-transparent">
      {/* Header */}
      <div className="border-b shadow-sm relative" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] h-[300px] bg-[#22c55e] opacity-[0.03] blur-[100px] rounded-full" />
        </div>
        <div className="px-4 md:px-8 pt-6 pb-4" style={{ backgroundColor: "var(--bg-primary)" }}>
          <div className="flex items-center justify-between gap-4 w-full mb-4">
            <div>
              <h1 className="text-3xl font-[1000] uppercase tracking-tight" style={{ color: "var(--text-primary)" }}>
                DONOR <span className="text-[#22c55e]">MARKETPLACE</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>Browse surplus food donations from local donors</p>
            </div>
            <button onClick={() => navigate("/ngo/community-needs")}
              className="group flex items-center gap-2 px-6 py-3 bg-[#22c55e] hover:bg-green-600 text-white rounded-xl transition-all duration-300 active:scale-95 shadow-lg shadow-green-600/20 shrink-0">
              <ShoppingBag size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest pt-0.5">Community Needs</span>
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
                  placeholder="Search food, donor, ID..."
                  className="w-full pl-11 pr-10 py-2.5 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 transition-all shadow-sm border"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
                {searchQuery && (
                  <button type="button" onClick={() => setRequestsStateValue("searchQuery", "")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:text-red-500 transition-colors rounded-full" style={{ color: "var(--text-muted)" }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <Tabs tabs={[{ id: "table", icon: Table, label: "Table" }, { id: "card", icon: LayoutGrid, label: "Cards" }]}
                activeTab={viewMode} onTabChange={(v) => setRequestsStateValue("viewMode", v)} layoutId="mktViewMode" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { label: "STATUS", key: "statusFilter" as const, value: statusFilter, options: [["ALL","All Statuses"],["Available","Available"],["Accepted","Accepted"],["Completed","Completed"]] },
                { label: "CATEGORY", key: "categoryFilter" as const, value: categoryFilter, options: [["ALL","All Categories"],["Cooked Food","Cooked Food"],["Packaged Food","Packaged Food"],["Dry Ration","Dry Ration"],["Beverages","Beverages"]] },
                { label: "SORT BY", key: "sortFilter" as const, value: sortFilter, options: [["NEWEST","Newest First"],["OLDEST","Oldest First"],["URGENCY","High Urgency"]] },
              ].map(({ label, key, value, options }) => (
                <div key={key} className="relative inline-flex items-center shrink-0">
                  <div className="flex items-center justify-between gap-3 rounded-2xl h-[46px] px-4 shadow-sm hover:border-emerald-500/60 transition-all cursor-pointer relative min-w-[140px] border"
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

      {/* Sub-tab: All / My Records */}
      <div className="px-4 md:px-8 pt-4 pb-1 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-50/90 dark:bg-slate-900/90 border-slate-200/80 shadow-sm">
          <button onClick={() => { setRequestsStateValue("subTab", "all"); fetchDonations(user, "marketplace"); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${subTab === "all" ? "bg-white dark:bg-slate-800 shadow-sm" : "hover:text-[var(--text-primary)]"}`}
            style={{ color: subTab === "all" ? "var(--text-primary)" : "var(--text-muted)" }}>
            <span>🌐</span>All Donations
          </button>
          <button onClick={() => { setRequestsStateValue("subTab", "mine"); fetchDonations(user, "marketplace"); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${subTab === "mine" ? "bg-[#22c55e] text-white shadow-sm shadow-emerald-500/20" : "hover:text-[var(--text-primary)]"}`}
            style={{ color: subTab === "mine" ? "white" : "var(--text-muted)" }}>
            <span>✅</span>My Records
          </button>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {subTab === "all" ? "Showing all available donor donations" : "Showing donations you have accepted"}
        </span>
      </div>

      {/* Content */}
      <div className="h-auto px-4 md:px-8 py-6">
        {finalFiltered.length > 0 ? (
          viewMode === "table" ? (
            <div className="border rounded-md shadow-sm p-2 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
              <ReusableTable variant="compact" data={finalFiltered}
                title="Marketplace Donations"
                description="Browse and request food donations shared by local donors"
                onRowClick={(donation: DonationRequest) => { if (subTab === "mine") handleViewTracking(donation); }}
                columns={[
                  { name: "ID", uid: "id", sortable: true },
                  { name: "Item", uid: "title", sortable: true, align: "start" },
                  { name: "Source", uid: "source", sortable: true },
                  { name: "Distance", uid: "metadata", sortable: false },
                  { name: "Posted", uid: "time", sortable: false },
                  { name: "Urgency", uid: "urgency", sortable: true },
                  { name: "Actions", uid: "actions", sortable: false },
                ]}
                renderCell={(donation: DonationRequest, columnKey: React.Key) => {
                  switch (columnKey) {
                    case "id": return <span className="text-[10px] font-black uppercase tracking-widest tabular-nums border px-2 py-1 rounded-sm" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-muted)" }}>#HF-{donation.id}</span>;
                    case "title": return <TableChip text={donation.title} icon={<span className="text-lg">{donation.icon}</span>} iconClassName="shadow-sm border" maxWidth="max-w-[280px]" />;
                    case "source": return <TableChip text={donation.source} initials={donation.source?.substring(0, 2)} iconClassName="bg-emerald-500 text-white" />;
                    case "metadata": return <div className="flex items-center gap-1.5 py-1"><MapPin size={12} className="text-[#22c55e]" /><span className="text-[11px] font-extrabold" style={{ color: "var(--text-secondary)" }}>{donation.distance}</span></div>;
                    case "time": return <div className="flex items-center gap-1.5 py-1" style={{ color: "var(--text-muted)" }}><Clock size={11} /><span className="text-[10px] font-black uppercase">{donation.time}</span></div>;
                    case "urgency": return <span className="px-2.5 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest border" style={{ backgroundColor: donation.urgency === "High" ? "rgba(245,158,11,0.08)" : "rgba(34,197,94,0.08)", borderColor: donation.urgency === "High" ? "rgba(245,158,11,0.2)" : "rgba(34,197,94,0.2)", color: donation.urgency === "High" ? "#f59e0b" : "#22c55e" }}>{donation.urgency}</span>;
                    case "actions": return (
                      <div className="flex items-center gap-2 justify-end">
                        {subTab === "mine"
                          ? <Button isIconOnly size="sm" variant="flat" onClick={(e) => { e.stopPropagation(); handleViewTracking(donation); }} className="h-8 w-8 shadow-sm border" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)", color: "var(--text-muted)" }}><Eye size={15} /></Button>
                          : <Button size="sm" className="h-8 px-4 rounded-md text-[10px] font-black uppercase shadow-sm bg-[#22c55e] hover:bg-green-600 text-white" onPress={() => handleAcceptClick(donation, user)}><CheckCircle2 size={12} />&nbsp;Accept</Button>
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
              {finalFiltered.map((d: DonationRequest) => <div key={d.id} className="h-full">{renderCard(d)}</div>)}
            </div>
          )
        ) : (
          <div className="py-20">{renderEmpty()}</div>
        )}
      </div>

      <LiveTraceDrawer user={user} />
      <AcceptDonationModal user={user} />
    </div>
  );
};

export default NGOMarketplace;
