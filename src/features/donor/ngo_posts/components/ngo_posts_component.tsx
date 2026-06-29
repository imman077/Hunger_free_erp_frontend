import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Eye,
  LayoutGrid,
  Table,
  Clock,
  Building2,
  Loader2,
  Box,
  Heart,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  TrendingUp,
} from "lucide-react";
import { Button } from "@heroui/react";
import ReusableTable, {
  TableChip,
} from "../../../../global/components/reusable-components/Table";
import ResuableDrawer from "../../../../global/components/reusable-components/Drawer";
import ResuableModal from "../../../../global/components/reusable-components/Modal";
import PageHeader from "../../../../global/components/reusable-components/PageHeader";
import { getCategoryImage } from "../../../../global/constants/donation_config";
import ResuableInput from "../../../../global/components/reusable-components/Input";
import ResuableButton from "../../../../global/components/reusable-components/Button";
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

  const needs = getNeedsApiOutputModel.useSelector(
    (state) => state.getNeedsApiData?.data?.needs || EMPTY_ARRAY
  );

  const priorities = [
    { id: "ALL", label: "All Priorities" },
    { id: "HIGH", label: "High Priority" },
    { id: "MEDIUM", label: "Medium Priority" },
    { id: "LOW", label: "Low Priority" },
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 mb-8 w-full">
      {/* Left Column: Title & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
          <Heart className="text-green-500" size={20} />
        </div>
        <div className="space-y-0.5 text-start">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            NGO Needs Marketplace
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Discover urgent food requirements posted by local NGOs and support them
          </p>
        </div>
      </div>

      {/* Right Column: Search, Filter and View Switcher */}
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3.5 w-full lg:w-auto justify-start lg:justify-end">
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
            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 shadow-sm transition-all outline-none"
          />
          <Search
            onClick={() => {
              ngoPostsInputModel.update({ searchQuery: searchValue });
              fetchNeeds(searchValue);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
            size={16}
          />
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [filteredNeeds]);

  return (
    <div className="relative group">
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 0.8,
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0 0px rgba(34, 197, 94, 0)",
                "0 0 0 8px rgba(34, 197, 94, 0.1)",
                "0 0 0 0px rgba(34, 197, 94, 0)",
              ],
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              opacity: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (sliderRef.current)
                sliderRef.current.scrollBy({ left: -460, behavior: "smooth" });
            }}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-emerald-50 flex items-center justify-center text-[#22c55e] z-20 hover:text-white hover:bg-[#22c55e] transition-all cursor-pointer group/arrow"
          >
            <ChevronLeft
              size={28}
              className="transition-transform group-hover/arrow:-translate-x-0.5"
              strokeWidth={3}
            />
          </motion.button>
        )}
      </AnimatePresence>

      <div
        ref={sliderRef}
        onScroll={checkScroll}
        className="ngo-needs-slider flex overflow-x-auto no-scrollbar gap-8 pb-10"
      >
        {filteredNeeds.map((need) => {
          const isMine = user
            ? need.ngo === user.id ||
              need.ngo === String(user.id) ||
              need.is_mine
            : false;
          return (
            <div
              key={need.id}
              className="flex-shrink-0 w-full sm:w-[420px] group relative flex flex-col bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden bg-[var(--bg-secondary)]">
                <img
                  src={need.image || getCategoryImage(need.category)}
                  alt={need.item_name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-xl backdrop-blur-md border ${
                      need.urgency === "URGENT" || need.urgency === "Urgent"
                        ? "bg-red-500 text-white border-red-400/50 animate-pulse"
                        : need.urgency === "HIGH" || need.urgency === "High"
                          ? "bg-amber-500 text-white border-amber-400/50"
                          : "bg-emerald-500 text-white border-emerald-400/50"
                    }`}
                  >
                    {need.urgency}
                  </span>

                  {need.status === "Fulfilling" && (
                    <span className="px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-xl backdrop-blur-md border bg-blue-500 text-white border-blue-400/50">
                      In Progress
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 z-20">
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/20">
                    <MapPin size={10} className="text-white" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">
                      {need.distribution_address || "Service Zone"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col gap-5 text-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none bg-emerald-500/5 px-2 py-1 rounded">
                      {need.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-emerald-500 transition-colors">
                    {need.item_name}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[9px]">
                      Organization
                    </span>
                    <span className="font-black text-emerald-500">
                      {need.ngo_name || "Validated NGO"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[9px]">
                      Requirement
                    </span>
                    <span className="font-black">
                      {need.fulfilled_quantity && need.fulfilled_quantity > 0 ? (
                        <span className="flex flex-col items-end">
                          <span className="text-emerald-500">
                            {need.quantity - need.fulfilled_quantity}{" "}
                            {need.unit} left
                          </span>
                          <span className="text-[9px] text-[var(--text-muted)] font-normal uppercase">
                            of {need.quantity} {need.unit}
                          </span>
                        </span>
                      ) : (
                        <span>
                          {need.quantity} {need.unit}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed text-[var(--text-muted)] line-clamp-2 italic">
                  "
                  {need.description ||
                    "Help our organization gather resources for local communities in need."}
                  "
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    className={`flex-1 font-black text-[10px] uppercase tracking-widest px-6 h-12 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                      user && user.profile.role === "NGO" && need.ngo === user.id
                        ? "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20"
                        : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                    } text-white`}
                    onPress={() => handleApplyToHelp(need, user)}
                  >
                    {isMine ? (
                      <>
                        <Clock size={14} />
                        Track Progress
                      </>
                    ) : (
                      <>Support Need</>
                    )}
                  </Button>
                  <Button
                    isIconOnly
                    className="bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-emerald-500 h-12 w-12 rounded-2xl transition-all"
                    onPress={() =>
                      ngoPostsInputModel.update({
                        selectedNeed: need,
                        isDrawerOpen: true,
                      })
                    }
                  >
                    <Eye size={18} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 0.8,
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0 0px rgba(34, 197, 94, 0)",
                "0 0 0 8px rgba(34, 197, 94, 0.1)",
                "0 0 0 0px rgba(34, 197, 94, 0)",
              ],
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              opacity: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (sliderRef.current)
                sliderRef.current.scrollBy({ left: 460, behavior: "smooth" });
            }}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-emerald-50 flex items-center justify-center text-[#22c55e] z-20 hover:text-white hover:bg-[#22c55e] transition-all cursor-pointer group/arrow"
          >
            <ChevronRight
              size={28}
              className="transition-transform group-hover/arrow:translate-x-0.5"
              strokeWidth={3}
            />
          </motion.button>
        )}
      </AnimatePresence>
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
        title="Need Details"
      >
        {selectedNeed && (
          <div className="space-y-8 p-6 text-start bg-white">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Box size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">
                    {selectedNeed.item_name}
                  </h2>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    {selectedNeed.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">
                  Amount Needed
                </span>
                <span className="text-lg font-black">
                  {selectedNeed.quantity} {selectedNeed.unit}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">
                  Urgency Level
                </span>
                <span
                  className={`text-lg font-black ${
                    selectedNeed.urgency === "Urgent"
                      ? "text-red-500"
                      : "text-emerald-500"
                  }`}
                >
                  {selectedNeed.urgency}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                <Building2 size={12} /> Organization
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[var(--text-muted)]">
                    Organization
                  </span>
                  <span className="text-[11px] font-black">
                    {selectedNeed.ngo_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[var(--text-muted)]">
                    Help Location
                  </span>
                  <span className="text-[11px] font-black">
                    {selectedNeed.distribution_address ||
                      "Sector 4, Central Region"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
                Description
              </h4>
              <p className="text-xs leading-relaxed text-[var(--text-muted)] font-medium bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] italic">
                "
                {selectedNeed.description ||
                  "The organization is seeking urgent food supplies to support local families in the designated region. Your contribution directly impacts the well-being of our beneficiaries."}
                "
              </p>
            </div>

            {selectedNeed.supporters_details &&
              selectedNeed.supporters_details.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                    <Heart
                      size={12}
                      fill="currentColor"
                      className="text-red-500"
                    />{" "}
                    Supporters ({selectedNeed.supporters_details.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedNeed.supporters_details.map(
                      (supporter: any, idx: number) => (
                        <div
                          key={supporter.id || idx}
                          className="flex justify-between items-center bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)]"
                        >
                          <span className="text-[11px] font-bold text-[var(--text-muted)]">
                            {supporter.name}
                          </span>
                          <span className="text-[11px] font-black text-emerald-500">
                            {supporter.quantity}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        )}
      </ResuableDrawer>

      <ResuableModal
        isOpen={isFulfillModalOpen}
        onOpenChange={(open) =>
          ngoPostsInputModel.update({ isFulfillModalOpen: open })
        }
        title="Help with this request"
        size="2xl"
      >
        <form
          onSubmit={(e) => handleFulfillSubmit(e, user)}
          className="space-y-6 text-start"
        >
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4 text-start">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Heart size={20} fill="currentColor" />
            </div>
            <div className="text-start">
              <h3 className="text-[10px] font-black uppercase tracking-tight text-emerald-600">
                Helping NGO
              </h3>
              <p className="text-[11px] font-bold text-emerald-700/80 uppercase tracking-widest mt-0.5">
                Providing {selectedNeed?.item_name}
              </p>
            </div>
          </div>

          {selectedNeed && (
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-between text-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                How much they need remaining
              </span>
              <span className="text-sm font-black text-emerald-500">
                {selectedNeed.quantity -
                  (selectedNeed.fulfilled_quantity || 0)}{" "}
                {selectedNeed.unit}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
            <ResuableInput
              label="How many can you give?"
              type="number"
              value={fulfillForm.quantity}
              onChange={(val) => handleValueChange("quantity", val)}
              required
              placeholder={`Max ${
                selectedNeed
                  ? selectedNeed.quantity -
                    (selectedNeed.fulfilled_quantity || 0)
                  : 0
              }`}
              min={1}
              max={
                selectedNeed
                  ? selectedNeed.quantity -
                    (selectedNeed.fulfilled_quantity || 0)
                  : 0
              }
              align="left"
            />
            <ResuableInput
              label="Your phone number"
              type="tel"
              value={fulfillForm.contactPhone}
              onChange={(val) => handleValueChange("contactPhone", val)}
              required
              placeholder="9876543210"
              align="left"
            />
          </div>

          <div className="pt-4 flex justify-end gap-4 border-t border-[var(--border-color)]">
            <ResuableButton
              variant="secondary"
              onClick={() =>
                ngoPostsInputModel.update({ isFulfillModalOpen: false })
              }
              className="font-black text-[10px] uppercase tracking-widest"
            >
              Go back
            </ResuableButton>
            <ResuableButton
              type="submit"
              variant="dark"
              disabled={isFulfilling}
              className="min-w-[180px] !bg-emerald-500 hover:!bg-emerald-600"
              startContent={
                isFulfilling && <Loader2 size={16} className="animate-spin" />
              }
            >
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isFulfilling ? "Saving..." : "I will help"}
              </span>
            </ResuableButton>
          </div>
        </form>
      </ResuableModal>
    </>
  );
};
