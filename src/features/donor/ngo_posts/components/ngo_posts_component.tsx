import React, { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  LayoutGrid,
  Table,
  Clock,
  Building2,
  Loader2,
  Box,
  Heart,
  ChevronDown,
  Check,
  TrendingUp,
  X,
  Package,
  CalendarDays,
  ShieldCheck,
  AlertTriangle,
  HeartHandshake,
  Tag,
  Phone,
  Info,
} from "lucide-react";
import { Button } from "@heroui/react";
import ReusableTable, {
  TableChip,
} from "../../../../global/components/reusable-components/Table";
import ResuableDrawer from "../../../../global/components/reusable-components/Drawer";
import ResuableModal from "../../../../global/components/reusable-components/Modal";
import PageHeader from "../../../../global/components/reusable-components/PageHeader";
import { getCategoryImage } from "../../../../global/constants/donation_config";
import { useAuthStore } from "../../../../global/store/auth-store";
import { ngoPostsInputModel } from "../store/ngo_posts_store";
import { getNeedsApiOutputModel } from "../api/get_needs/get_needs_store";
import {
  handleApplyToHelp,
  handleFulfillSubmit,
  handleValueChange,
  fetchNeeds,
} from "../controller/ngo_posts_controller";

const EMPTY_ARRAY: any[] = [];

export const NgoPostsHeader = () => {
  const needs = getNeedsApiOutputModel.useSelector(
    (state) => state.getNeedsApiData?.data?.needs || EMPTY_ARRAY
  );

  return (
    <PageHeader
      title="NGO Requests"
      subtitle="Help local NGOs by contributing what they need most"
      greenLastWord={true}
      className="mb-8"
      showPointsCard={true}
      points={needs.length}
      pointsCardTitle="Live Update"
      pointsCardUnit="Active Posts"
      pointsCardIcon={<TrendingUp size={20} className="text-green-500" />}
    />
  );
};

export const NgoPostsControls = () => {
  const viewMode = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.viewMode
  );
  const searchQuery = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.searchQuery
  );
  const categoryFilter = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.categoryFilter
  );

  const [searchValue, setSearchValue] = useState(searchQuery);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);



  const priorities = [
    { id: "ALL", label: "All Priorities" },
    { id: "HIGH", label: "High Priority" },
    { id: "MEDIUM", label: "Medium Priority" },
    { id: "LOW", label: "Low Priority" },
  ];

  return (
    <div className="flex flex-row flex-wrap items-center gap-4 mb-4 w-full justify-start">
      {/* Right Column: Search, Filter and View Switcher */}
      <div className="flex flex-wrap items-center gap-3.5 w-full lg:w-auto justify-start">
        {/* Search Bar */}
        <div className="relative w-full sm:w-[240px]">
          <input
            type="text"
            placeholder="Search items, NGOs, or locations..."
            value={searchValue}
            onChange={(e) => {
              const val = e.target.value;
              setSearchValue(val);
              if (val === "") {
                ngoPostsInputModel.update({ searchQuery: "" });
                fetchNeeds("");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                ngoPostsInputModel.update({ searchQuery: searchValue });
                fetchNeeds(searchValue);
              }
            }}
            className="w-full pl-4 pr-16 py-3 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 shadow-sm transition-all outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 z-10">
            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  ngoPostsInputModel.update({ searchQuery: "" });
                  fetchNeeds("");
                }}
                className="p-1 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
            <Search
              onClick={() => {
                ngoPostsInputModel.update({ searchQuery: searchValue });
                fetchNeeds(searchValue);
              }}
              className="hover:text-emerald-500 transition-colors cursor-pointer p-0.5"
              size={16}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            className="w-full sm:w-[150px] bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-3 px-4 flex flex-col items-start gap-0.5 shadow-sm text-start outline-none transition-all cursor-pointer relative"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
              Priority
            </span>
            <div className="flex justify-between items-center w-full gap-2 mt-0.5">
              <span className="text-xs font-black text-slate-700 leading-none truncate">
                {priorities.find(p => p.id === categoryFilter)?.label || "All Priorities"}
              </span>
              <ChevronDown
                className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                  isCategoryDropdownOpen ? "rotate-180 text-emerald-500" : ""
                }`}
                size={14}
              />
            </div>
          </button>

          {isCategoryDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setIsCategoryDropdownOpen(false)}
              />
              <div className="absolute left-0 sm:right-0 top-full mt-1.5 w-full sm:w-[150px] bg-white border border-slate-200 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {priorities.map((opt) => {
                  const isSelected = categoryFilter === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        ngoPostsInputModel.update({ categoryFilter: opt.id });
                        setIsCategoryDropdownOpen(false);
                        fetchNeeds(searchValue, opt.id);
                      }}
                      className={`w-full text-left px-4 py-3 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-emerald-50 text-emerald-600 font-black"
                          : "text-slate-600 hover:bg-slate-50 font-semibold"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={14} className="text-emerald-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* View Switcher (Cards / Table) */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 shrink-0 w-full sm:w-auto">
          <button
            onClick={() =>
              ngoPostsInputModel.update({ viewMode: "card" })
            }
            className={`px-3.5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer w-1/2 sm:w-auto ${
              viewMode === "card"
                ? "bg-emerald-500 text-white shadow-md active:scale-95"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LayoutGrid size={14} />
            Cards
          </button>
          <button
            onClick={() =>
              ngoPostsInputModel.update({ viewMode: "table" })
            }
            className={`px-3.5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer w-1/2 sm:w-auto ${
              viewMode === "table"
                ? "bg-emerald-500 text-white shadow-md active:scale-95"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Table size={14} />
            Table
          </button>
        </div>
      </div>
    </div>
  );
};

export const NgoPostsGrid = ({ filteredNeeds }: { filteredNeeds: any[] }) => {
  const { user } = useAuthStore();

  const renderSupportersStack = (supporters: any[], need: any) => {
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
          ngoPostsInputModel.update({
            selectedNeed: need,
            isDrawerOpen: true,
          });
        }}
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/20 shrink-0 select-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all active:scale-[0.97]"
      >
        <div className="flex -space-x-2.5 overflow-hidden">
          {count > 0 ? (
            list.slice(0, 3).map((supporter, idx) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full pb-10">
      {filteredNeeds.map((need) => {
        const isMine = user
          ? need.ngo === user.id ||
            need.ngo === String(user.id) ||
            need.is_mine
          : false;
        return (
          <div
            key={need.id}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[1.75rem] p-5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group/card relative overflow-hidden text-start"
          >
            {/* Top Header Row */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  need.urgency === "HIGH" || need.urgency === "URGENT" || need.urgency === "High" || need.urgency === "Urgent"
                    ? "bg-red-50 text-red-600 border-red-200/80 dark:bg-red-950/30 dark:border-red-800/50"
                    : "bg-amber-50 text-amber-600 border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-800/50"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    need.urgency === "HIGH" || need.urgency === "URGENT" || need.urgency === "High" || need.urgency === "Urgent"
                      ? "bg-red-500 animate-pulse"
                      : "bg-amber-500"
                  }`}
                />
                <span>{need.urgency ? `${need.urgency.toUpperCase()} PRIORITY` : "MEDIUM PRIORITY"}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200/80">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{need.status?.toUpperCase() || "OPEN"}</span>
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative aspect-[16/6.5] rounded-[1.25rem] overflow-hidden mb-4 shadow-sm bg-slate-100 dark:bg-slate-800">
              <img
                src={need.image || getCategoryImage(need.category)}
                alt={need.item_name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Title */}
            <div className="mb-4">
              <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight leading-snug mb-1">
                {need.item_name || "Community Need"}
              </h3>
              <div className="flex items-center gap-1.5">
                <Package size={15} className="text-[#22c55e]" />
                <span className="text-sm font-black text-[#22c55e]">
                  {need.quantity} {need.unit}
                </span>
                <span className="text-xs font-semibold text-slate-400">required</span>
              </div>
            </div>

            {/* Detail: Requested By & Category */}
            <div className="bg-slate-50/90 dark:bg-slate-800/40 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800/60 flex flex-col gap-3.5 mb-3">
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-[#22c55e] flex items-center justify-center shrink-0">
                  <Building2 size={15} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">
                    ORGANIZATION
                  </span>
                  <span className="text-xs font-black text-[var(--text-primary)]">
                    {need.ngo_name || "Authorized NGO"}
                  </span>
                </div>
              </div>
              <div className="h-[1px] bg-slate-200/60 dark:bg-slate-700/50 w-full" />
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-[#22c55e] flex items-center justify-center shrink-0">
                  <LayoutGrid size={15} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">
                    CATEGORY
                  </span>
                  <span className="text-xs font-black text-[var(--text-primary)]">
                    {need.category || "Cooked Food"}
                  </span>
                </div>
              </div>
            </div>

            {/* Detail: Progress & Location / Date */}
            <div className="bg-slate-50/90 dark:bg-slate-800/40 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800/60 flex flex-col gap-3.5 mb-5">
              <div className="flex items-start gap-3 w-full">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-[#22c55e] flex items-center justify-center shrink-0 mt-0.5">
                  <Box size={15} />
                </div>
                <div className="flex flex-col min-w-0 w-full">
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">
                    <span>PROGRESS</span>
                    <span className="text-[#22c55e] font-black">
                      {Math.round(((need.fulfilled_quantity || 0) / need.quantity) * 100)}%
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-250">
                    {need.fulfilled_quantity || 0} / {need.quantity} {need.unit}
                  </span>
                  <div className="w-full h-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-[#22c55e] rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(((need.fulfilled_quantity || 0) / need.quantity) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="h-[1px] bg-slate-200/60 dark:bg-slate-700/50 w-full" />
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
                  <CalendarDays size={15} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">
                    POSTED ON
                  </span>
                  <span className="text-xs font-black text-[var(--text-primary)] leading-tight">
                    {need.created_at
                      ? new Date(Number(need.created_at)).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Aug 9, 2026"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11px] leading-relaxed text-[var(--text-muted)] line-clamp-2 italic mb-4">
              "{need.description || "Help our organization gather resources for local communities in need."}"
            </p>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3.5 w-full mt-auto">
              <Button
                className={`w-full font-black text-xs uppercase tracking-widest h-12 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                  isMine
                    ? "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20"
                    : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                } text-white`}
                onPress={() => handleApplyToHelp(need, user)}
              >
                {isMine ? (
                  <>
                    <Clock size={14} className="shrink-0" />
                    <span>Track Progress</span>
                  </>
                ) : (
                  <>Support Need</>
                )}
              </Button>

              <div className="w-full flex justify-center mt-1">
                {renderSupportersStack(need.supporters, need)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const NgoPostsTable = ({ filteredNeeds }: { filteredNeeds: any[] }) => {
  const { user } = useAuthStore();
  return (
    <div className="border rounded-2xl shadow-sm p-4 overflow-hidden bg-[var(--bg-primary)] border-[var(--border-color)]">
      <ReusableTable
        data={filteredNeeds}
        enableSearch={false}
        enableFilters={false}
        showColumnSettings={false}
        topContent={null}
        onRowClick={(need: any) =>
          ngoPostsInputModel.update({ selectedNeed: need, isDrawerOpen: true })
        }
        columns={[
          { name: "Need ID", uid: "id", sortable: true },
          { name: "Required Item", uid: "item_name", sortable: true },
          { name: "Organization", uid: "ngo_name", sortable: true },
          { name: "Urgency", uid: "urgency", sortable: true },
          { name: "Help Location", uid: "location", sortable: true },
          { name: "Quantity", uid: "quantity", sortable: true },
          { name: "Deadline", uid: "required_by", sortable: true },
          { name: "Actions", uid: "actions", sortable: false },
        ]}
        renderCell={(need: any, columnKey: React.Key) => {
          switch (columnKey) {
            case "id":
              return (
                <span className="text-[10px] font-black border px-2 py-1 rounded-sm bg-[var(--bg-secondary)] border-[var(--border-color)]">
                  #NEED-{need.id}
                </span>
              );
            case "item_name":
              return (
                <TableChip
                  text={need.item_name}
                  icon={<Box size={14} className="text-emerald-500" />}
                />
              );
            case "ngo_name":
              return (
                <TableChip
                  text={need.ngo_name || "Authorized NGO"}
                  initials={(need.ngo_name || "AN").substring(0, 2)}
                />
              );
            case "urgency":
              return (
                <span
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    need.urgency === "URGENT" || need.urgency === "Urgent"
                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                      : need.urgency === "HIGH" || need.urgency === "High"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  }`}
                >
                  {need.urgency}
                </span>
              );
            case "location":
              return (
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-emerald-500" />
                  <span className="text-[11px] font-bold">
                    {need.distribution_address || "Service Zone"}
                  </span>
                </div>
              );
            case "quantity":
              return (
                <span className="text-[11px] font-bold tabular-nums">
                  {need.fulfilled_quantity && need.fulfilled_quantity > 0 ? (
                    <span className="text-emerald-500">
                      {need.quantity - need.fulfilled_quantity} {need.unit} left
                    </span>
                  ) : (
                    <span>
                      {need.quantity} {need.unit}
                    </span>
                  )}
                </span>
              );
            case "required_by":
              return (
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Clock size={12} />
                  <span className="text-[11px] font-bold">
                    {need.required_by || "Flexible"}
                  </span>
                </div>
              );
            case "actions":
              return (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className={`${
                      user &&
                      user.profile.role === "NGO" &&
                      (need.ngo === user.id || need.ngo === String(user.id))
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                    } text-white font-black text-[9px] uppercase tracking-widest px-4 h-8 rounded-lg`}
                    onPress={() => handleApplyToHelp(need, user)}
                  >
                    {user &&
                    user.profile.role === "NGO" &&
                    (need.ngo === user.id || need.ngo === String(user.id))
                      ? "Track"
                      : "Fulfill"}
                  </Button>
                </div>
              );
            default:
              return null;
          }
        }}
      />
    </div>
  );
};

export const NgoPostsModals = () => {
  const { user } = useAuthStore();
  const isDrawerOpen = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.isDrawerOpen
  );
  const isFulfillModalOpen = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.isFulfillModalOpen
  );
  const isFulfilling = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.isFulfilling
  );
  const fulfillForm = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.fulfillForm
  );
  const selectedNeed = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.selectedNeed
  );

  return (
    <>
      <ResuableDrawer
        isOpen={isDrawerOpen}
        onClose={() => ngoPostsInputModel.update({ isDrawerOpen: false })}
        title="Supporters Details"
      >
        {selectedNeed && (
          <div className="space-y-6 p-6 text-start bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tighter">
                {selectedNeed.item_name}
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
                Active Supporters ({selectedNeed.supporters?.length || 0})
              </h4>
              
              {selectedNeed.supporters && selectedNeed.supporters.length > 0 ? (
                <div className="space-y-3">
                  {selectedNeed.supporters.map(
                    (supporter: any, idx: number) => {
                      const contribution = (selectedNeed.supporters_details || []).find(
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
                    Be the first to support this need by clicking "Support Need"!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </ResuableDrawer>

      {/* --- CONFIRM ACCEPTANCE / SUPPORT THIS NEED MODAL --- */}
      <ResuableModal
        isOpen={isFulfillModalOpen}
        onOpenChange={(open) =>
          ngoPostsInputModel.update({ isFulfillModalOpen: open })
        }
        size="2xl"
        classNames={{
          header: "!hidden",
          body: "!p-6",
          base: "max-w-[580px] rounded-[32px]"
        }}
      >
        <form
          onSubmit={(e) => handleFulfillSubmit(e, user)}
          className="flex flex-col text-start space-y-5"
        >
          {/* Top Header Block */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-[#10B981] shrink-0 shadow-xs">
                <ShieldCheck size={22} className="stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                  Confirm Acceptance
                </h2>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                  Please review the donation details before accepting.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => ngoPostsInputModel.update({ isFulfillModalOpen: false })}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer border border-slate-100 dark:border-slate-800 shrink-0"
            >
              <X size={16} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Item Banner Card */}
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
            <img
              src={selectedNeed?.image || getCategoryImage(selectedNeed?.category || "cooked_food")}
              alt={selectedNeed?.item_name || "Surplus Item"}
              className="w-20 h-20 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-snug truncate">
                {selectedNeed?.item_name || "Disposable Eco Plates"}
              </h4>
              <p className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">
                <Building2 size={13} className="text-[#10B981] shrink-0" />
                <span className="truncate">{selectedNeed?.ngo_name || selectedNeed?.ngo || "Feed The Needy"}</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                  <AlertTriangle size={10} className="shrink-0" />
                  {selectedNeed?.category?.replace("_", " ") || "COOKED FOOD"}
                </span>
                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 px-2.5 py-1 rounded-lg border border-purple-100 dark:border-purple-900/30">
                  <Tag size={10} className="shrink-0" />
                  VEG
                </span>
              </div>
            </div>
          </div>

          {/* 3 Metric Cards Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Metric 1: Urgency */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 shrink-0">
                <AlertTriangle size={16} className="stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none mb-1">
                  URGENCY
                </span>
                <span className="text-xs font-black uppercase tracking-tight text-amber-500 truncate">
                  {selectedNeed?.urgency || "Medium"}
                </span>
              </div>
            </div>

            {/* Metric 2: Quantity */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500 shrink-0">
                <Box size={16} className="stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none mb-1">
                  QUANTITY
                </span>
                <span className="text-xs font-black uppercase tracking-tight text-slate-800 dark:text-slate-100 truncate">
                  {selectedNeed?.quantity || 450} {selectedNeed?.unit?.toUpperCase() || "PCS"}
                </span>
              </div>
            </div>

            {/* Metric 3: Expiry */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-500 shrink-0">
                <Clock size={16} className="stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none mb-1">
                  EXPIRY
                </span>
                <span className="text-xs font-black uppercase tracking-tight text-slate-800 dark:text-slate-100 truncate">
                  {selectedNeed?.required_by || "No Expiry"}
                </span>
              </div>
            </div>
          </div>

          {/* FULFILLMENT DETAILS Section Header */}
          <div className="pt-2">
            <span className="text-[#10B981] font-black text-xs uppercase tracking-wider block mb-3">
              FULFILLMENT DETAILS
            </span>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Enter Quantity to Accept */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  Enter quantity to accept
                  <Info size={12} className="text-slate-400 cursor-pointer" />
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const cur = parseInt(fulfillForm.quantity) || 1;
                      const nextVal = Math.max(1, cur - 10);
                      handleValueChange("quantity", nextVal.toString());
                    }}
                    className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 transition-colors flex items-center justify-center text-base shrink-0"
                  >
                    —
                  </button>

                  <div className="flex-1 relative flex items-center border border-slate-200/80 dark:border-slate-800 rounded-2xl px-3 py-2 bg-white dark:bg-slate-900 h-10 shadow-xs">
                    <Box size={14} className="text-slate-400 mr-2 shrink-0" />
                    <input
                      type="number"
                      min={1}
                      max={selectedNeed ? Math.max(1, (selectedNeed.quantity || 0) - (selectedNeed.fulfilled_quantity || 0)) : 450}
                      value={fulfillForm.quantity}
                      onChange={(e) => handleValueChange("quantity", e.target.value)}
                      className="w-full bg-transparent border-none text-sm font-extrabold text-slate-800 dark:text-slate-100 focus:outline-none"
                      placeholder="100"
                    />
                    <span className="ml-auto text-[10px] font-black uppercase text-[#10B981] bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md shrink-0">
                      {selectedNeed?.unit || "PCS"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const maxVal = selectedNeed ? Math.max(1, (selectedNeed.quantity || 0) - (selectedNeed.fulfilled_quantity || 0)) : 450;
                      const cur = parseInt(fulfillForm.quantity) || 0;
                      const nextVal = Math.min(maxVal, cur + 10);
                      handleValueChange("quantity", nextVal.toString());
                    }}
                    className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 transition-colors flex items-center justify-center text-base shrink-0"
                  >
                    +
                  </button>
                </div>
                <p className="text-[11px] font-bold text-slate-400 mt-1">
                  Max available: <span className="font-extrabold text-slate-600 dark:text-slate-300">
                    {selectedNeed ? Math.max(0, (selectedNeed.quantity || 0) - (selectedNeed.fulfilled_quantity || 0)) : 450} {selectedNeed?.unit || "PCS"}
                  </span>
                </p>
              </div>

              {/* Direct Contact Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Direct contact
                </label>
                <div className="relative flex items-center border border-slate-200/80 dark:border-slate-800 rounded-2xl px-3.5 py-2 bg-white dark:bg-slate-900 h-10 shadow-xs">
                  <Phone size={14} className="text-slate-400 mr-2 shrink-0" />
                  <input
                    type="tel"
                    value={fulfillForm.contactPhone || "9876543220"}
                    onChange={(e) => handleValueChange("contactPhone", e.target.value)}
                    className="w-full bg-transparent border-none text-sm font-extrabold text-slate-800 dark:text-slate-100 focus:outline-none"
                    placeholder="9876543220"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Impact Message Banner */}
          <div className="w-full bg-[#F2FBF6] dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 rounded-2xl p-4 flex items-center gap-3.5 text-start">
            <div className="w-10 h-10 rounded-full border border-dashed border-[#10B981] flex items-center justify-center text-[#10B981] shrink-0 bg-emerald-50 dark:bg-emerald-950/40">
              <HeartHandshake size={20} className="stroke-[2.2]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 leading-snug">
                Your acceptance helps reduce food waste and feeds those in need.
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Thank you for making a difference! 💚
              </p>
            </div>
          </div>

          {/* Footer Buttons Bar */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2">
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => ngoPostsInputModel.update({ isFulfillModalOpen: false })}
                className="h-11 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isFulfilling}
                className="h-11 px-7 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10 transition-all disabled:opacity-50"
              >
                {isFulfilling ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} strokeWidth={3} />
                )}
                <span>{isFulfilling ? "Saving..." : "Confirm Acceptance"}</span>
              </button>
            </div>

            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1">
              🔒 Secure & Confidential • Valid for this session only
            </span>
          </div>
        </form>
      </ResuableModal>
    </>
  );
};
