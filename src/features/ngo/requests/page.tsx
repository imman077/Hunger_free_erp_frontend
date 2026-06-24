import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../global/store/auth-store";
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
  Building2,
  Check,
  CalendarDays,
  Box,
  Activity,
} from "lucide-react";
import { Button } from "@heroui/react";
import ReusableTable, {
  TableChip,
} from "../../../global/components/reusable-components/Table";
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
  const donations = requestsInputModel.useSelector((state) => state.requestsState.donations);
  const searchQuery = requestsInputModel.useSelector((state) => state.requestsState.searchQuery);
  const roleFilter = requestsInputModel.useSelector((state) => state.requestsState.roleFilter);

  useEffect(() => {
    fetchDonations(user);
    return () => {
      onDestroy();
    };
  }, [activeTab, user]);

  const finalFilteredDonations = donations
    .filter((d: DonationRequest) => {
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
    .filter((d: DonationRequest) => roleFilter === "ALL" || d.sourceType === roleFilter)
    .filter((d: DonationRequest) => {
      const search = searchQuery.toLowerCase();
      if (!search) return true;
      return (
        d.title?.toLowerCase().includes(search) ||
        d.source?.toLowerCase().includes(search) ||
        d.id?.toString().includes(search)
      );
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

  const renderCard = (donation: DonationRequest) => (
    <div
      className="group relative flex flex-col rounded-[24px] bg-white border border-[var(--border-color)] shadow-sm overflow-hidden h-full cursor-pointer"
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
               onClick={(e) => { e.stopPropagation(); handleAcceptClick(donation, user); }} 
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
                    onClick={() => setRequestsStateValue("activeTab", tab.id)}
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
                    onChange={(e) => setRequestsStateValue("searchQuery", e.target.value)}
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
                      onClick={() => setRequestsStateValue("viewMode", view.id)}
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
                            onClick={() => setRequestsStateValue("roleFilter", opt.value)}
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
                            onPress={() => handleAcceptClick(donation, user)}
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
                        {finalFilteredDonations.filter((d: DonationRequest) => d.origin === "DONATION").length} ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-1">
                      {finalFilteredDonations.filter((d: DonationRequest) => d.origin === "DONATION").length > 0 ? (
                        finalFilteredDonations
                          .filter((d: DonationRequest) => d.origin === "DONATION")
                          .map((donation: DonationRequest) => (
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
                        {finalFilteredDonations.filter((d: DonationRequest) => d.origin === "NEED").length} ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-1">
                      {finalFilteredDonations.filter((d: DonationRequest) => d.origin === "NEED").length > 0 ? (
                        finalFilteredDonations
                          .filter((d: DonationRequest) => d.origin === "NEED")
                          .map((donation: DonationRequest) => (
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
                  finalFilteredDonations.map((donation: DonationRequest) => (
                    <div key={donation.id} onClick={() => handleAcceptClick(donation, user)} className="h-full">
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
