import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Package,
  MapPin,
  Clock,
  Phone,
  Info,
  ShieldCheck,
  CheckCircle2,
  Check,
  Plus,
  Leaf,
  Users,
  User,
  ShoppingBag,
  Utensils,
  ChevronDown,
  LayoutList,
  Hourglass,
  Search,
  Truck,
  Heart,
  Download,
  Share2,
  Copy,
  FileText,
  RotateCcw,
  XCircle,
  X,
  Trash2,
  LayoutGrid,
  Table,
  HeartHandshake,
  Eye,
} from "lucide-react";
import { Modal, ModalContent } from "@heroui/react";
import ResuableDrawer from "../../../../global/components/reusable-components/Drawer";
import ImpactCards from "../../../../global/components/reusable-components/ImpactCards";
import PageHeader from "../../../../global/components/reusable-components/PageHeader";
import ReusableTable from "../../../../global/components/reusable-components/Table";
import { getCategoryImage } from "../../../../global/constants/donation_config";
import { myDonationsInputModel } from "../store/my_donations_store";
import { getMyDonationsApiOutputModel } from "../api/get_my_donations/get_my_donations_store";
import { useDonorStore } from "../../store/donor-store";
import { LiveGPSMap } from "./LiveGPSMap";
import {
  refreshData,
  handleDetailsClick,
  handleLiveTrackClick,
  handleCancelClick,
  confirmCancellation,
  closeCancelModal,
  confirmDelete,
  onOtpSubmit,
  confirmRedonate,
  handleOtpDigitChange,
  handleOtpKeyDown,
  handleOtpPaste,
  handleOtpFocus,
} from "../controller/my_donations_controller";
import { toast } from "sonner";

export const MyDonationsHeader = () => {
  const navigate = useNavigate();
  return (
    <PageHeader
      title="My Donations"
      subtitle="Track and manage your community contributions"
      className="mb-8"
    >
      <button
        onClick={() => navigate("/donor/donations/create")}
        className="group relative w-full sm:w-auto px-7 py-3 bg-[#22c55e] text-white rounded-2xl text-[13px] md:text-[14px] font-bold hover:bg-[#16a34a] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-green-500/20 shrink-0"
      >
        <img
          src="/btn_style_left1.png"
          className="absolute -top-4 -left-4 w-6 h-auto pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 md:opacity-100"
          alt="Decoration Left"
        />
        <img
          src="/btn_style_right1.png"
          className="absolute -top-4 -right-4 w-6 h-auto pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 md:opacity-100"
          alt="Decoration Right"
        />
        <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-sm shrink-0">
          <Plus size={16} className="text-[#22c55e] stroke-[3.5]" />
        </div>
        <span className="tracking-tight">Create New Donation</span>
      </button>
    </PageHeader>
  );
};

export const MyDonationsStats = () => {
  const donationStats = useDonorStore((state) => state.donationStats);
  return (
    <ImpactCards
      data={[
        {
          label: "Total Donations",
          val: donationStats?.totalDonations?.toString() || "0",
          trend: "All time",
          color: "#22c55e",
          icon: Utensils,
        },
        {
          label: "Meals Donated",
          val: ((donationStats?.completedCount || 0) * 15).toString(),
          trend: "Delivered",
          color: "#3b82f6",
          icon: Users,
        },
        {
          label: "Food Saved",
          val: ((donationStats?.completedCount || 0) * 10.5).toFixed(1),
          trend: "kg (CO₂ Impact)",
          color: "#f59e0b",
          icon: Leaf,
        },
        {
          label: "Active Requests",
          val: donationStats?.inProgressCount?.toString() || "0",
          trend: "In progress",
          color: "#8b5cf6",
          icon: Package,
        },
      ]}
      className="mb-10 shrink-0"
    />
  );
};

export const MyDonationsList = () => {
  const navigate = useNavigate();
  const donationHistory = useDonorStore((state) => state.data.donationHistory);
  const viewMode = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.viewMode
  );
  const statusFilter = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.statusFilter
  );
  const sortOrder = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.sortOrder
  );
  const isSortDropdownOpen = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isSortDropdownOpen
  );
  const cancellingId = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.cancellingId
  );
  const searchText = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.searchText
  ) || "";
  const isFilterDropdownOpen = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isFilterDropdownOpen
  );
  const isLoading = getMyDonationsApiOutputModel.useSelector(
    (state) => state.getMyDonationsApiData?.loading
  );

  const [searchValue, setSearchValue] = useState(searchText);

  useEffect(() => {
    setSearchValue(searchText);
  }, [searchText]);



  const filtered = (donationHistory || [])
    .filter((donation: any) => {
      if (!statusFilter) return true;
      if (statusFilter === "Pending") return donation.status === "PENDING";
      if (statusFilter === "Accepted") return donation.status === "ACCEPTED";
      if (statusFilter === "Assigned") return donation.status === "ASSIGNED" || donation.status === "PICKED_UP";
      if (statusFilter === "Delivered") return donation.status === "DELIVERED";
      if (statusFilter === "Cancelled") return donation.status === "CANCELLED";
      return true;
    })
    .filter((donation: any) => {
      if (!searchText) return true;
      const term = searchText.toLowerCase();
      return (
        String(donation.foodType || "").toLowerCase().includes(term) ||
        String(donation.category || "").toLowerCase().includes(term) ||
        String(donation.description || "").toLowerCase().includes(term) ||
        String(donation.pickupAddress || "").toLowerCase().includes(term) ||
        String(donation.id || "").toLowerCase().includes(term)
      );
    })
    .sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "Newest First" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="w-full space-y-8">
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 mb-8 w-full">
          {/* Left Column: Title & Subtitle */}
          <div className="flex items-center gap-3">
            {/* Green logo icon (hands holding a heart) */}
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <HeartHandshake className="text-green-500" size={20} />
            </div>
            <div className="space-y-0.5 text-start">
              <h2 className="text-xl font-bold tracking-tight text-slate-800">
                Recent Contributions
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Track and manage all recent food donations
              </p>
            </div>
          </div>

          {/* Right Column: Search, Filter, Sort and View Switcher */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3.5 w-full lg:w-auto justify-start lg:justify-end">
            {/* Search Bar */}
            <div className="relative w-full sm:w-[240px]">
              <input
                type="text"
                placeholder="Search donations..."
                value={searchValue}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchValue(val);
                  if (val === "") {
                    myDonationsInputModel.update({ searchText: "" });
                    refreshData("");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    myDonationsInputModel.update({ searchText: searchValue });
                    refreshData(searchValue);
                  }
                }}
                className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 shadow-sm transition-all outline-none"
              />
              <Search
                onClick={() => {
                  myDonationsInputModel.update({ searchText: searchValue });
                  refreshData(searchValue);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
                size={16}
              />
            </div>

            {/* Dropdowns container for mobile grid alignment */}
            <div className="grid grid-cols-2 gap-3.5 w-full sm:w-auto">
              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() =>
                    myDonationsInputModel.update({
                      isFilterDropdownOpen: !isFilterDropdownOpen,
                    })
                  }
                  className="w-full sm:w-[150px] bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-3 px-4 flex flex-col items-start gap-0.5 shadow-sm text-start outline-none transition-all cursor-pointer relative"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                    Status
                  </span>
                  <div className="flex justify-between items-center w-full gap-2 mt-0.5">
                    <span className="text-xs font-black text-slate-700 leading-none truncate">
                      {statusFilter || "All"}
                    </span>
                    <ChevronDown
                      className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                        isFilterDropdownOpen ? "rotate-180 text-emerald-500" : ""
                      }`}
                      size={14}
                    />
                  </div>
                </button>

                {isFilterDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() =>
                        myDonationsInputModel.update({
                          isFilterDropdownOpen: false,
                        })
                      }
                    />
                    <div className="absolute left-0 sm:right-0 top-full mt-1.5 w-full sm:w-[150px] bg-white border border-slate-200 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {[
                        { value: "", label: "All" },
                        { value: "Pending", label: "Pending" },
                        { value: "Accepted", label: "Accepted" },
                        { value: "Assigned", label: "Assigned" },
                        { value: "Delivered", label: "Delivered" },
                        { value: "Cancelled", label: "Cancelled" },
                      ].map((opt) => {
                        const isSelected = statusFilter === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => {
                              myDonationsInputModel.update({
                                statusFilter: opt.value,
                                isFilterDropdownOpen: false,
                              });
                              refreshData();
                            }}
                            className={`w-full px-5 py-3 text-xs font-bold text-left transition-all ${
                              isSelected
                                ? "bg-[#22c55e] text-white font-black"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    myDonationsInputModel.update({
                      isSortDropdownOpen: !isSortDropdownOpen,
                    })
                  }
                  className="w-full sm:w-[150px] bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-3 px-4 flex flex-col items-start gap-0.5 shadow-sm text-start outline-none transition-all cursor-pointer relative"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                    Sort by
                  </span>
                  <div className="flex justify-between items-center w-full gap-2 mt-0.5">
                    <span className="text-xs font-black text-slate-700 leading-none truncate">
                      {sortOrder}
                    </span>
                    <ChevronDown
                      className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                        isSortDropdownOpen ? "rotate-180 text-emerald-500" : ""
                      }`}
                      size={14}
                    />
                  </div>
                </button>

                {isSortDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() =>
                        myDonationsInputModel.update({
                          isSortDropdownOpen: false,
                        })
                      }
                    />
                    <div className="absolute right-0 top-full mt-1.5 w-full sm:w-[150px] bg-white border border-slate-200 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {[
                        { label: "Newest First", value: "Newest First" },
                        { label: "Oldest First", value: "Oldest First" },
                      ].map((opt) => {
                        const isSelected = sortOrder === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => {
                              myDonationsInputModel.update({
                                sortOrder: opt.value,
                                isSortDropdownOpen: false,
                              });
                              refreshData();
                            }}
                            className={`w-full px-5 py-3 text-xs font-bold text-left transition-all ${
                              isSelected
                                ? "bg-[#22c55e] text-white font-black"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* View Switcher Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl shadow-sm border shrink-0 bg-slate-100/50 border-slate-200/60 w-full sm:w-auto">
              {[
                { id: "card", icon: LayoutGrid, label: "Cards" },
                { id: "table", icon: Table, label: "Table" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => myDonationsInputModel.update({ viewMode: mode.id as any })}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all w-1/2 sm:w-auto outline-none cursor-pointer ${
                    viewMode === mode.id
                      ? "bg-[#22c55e] text-white shadow-[0_2px_8px_rgba(34,197,94,0.2)]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <mode.icon size={14} />
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {isLoading ? (
          viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full pb-6 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="w-full border border-slate-100 rounded-[2.5rem] p-4 bg-white">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <div className="h-5 w-24 bg-slate-200 rounded-full" />
                    <div className="h-3 w-16 bg-slate-100 rounded-full" />
                  </div>
                  <div className="aspect-[16/10] rounded-[2rem] bg-slate-200 mb-4" />
                  <div className="px-1 space-y-4 mb-4 text-start">
                    <div className="h-6 w-2/3 bg-slate-200 rounded-lg" />
                    <div className="h-3.5 w-1/3 bg-slate-100 rounded-full" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200" />
                        <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200" />
                        <div className="h-3 w-1/3 bg-slate-100 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex gap-2.5">
                    <div className="h-10 flex-1 bg-slate-200 rounded-2xl" />
                    <div className="h-10 flex-1 bg-slate-200 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-white border border-slate-200 rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading donations...</span>
              </div>
            </div>
          )
        ) : filtered.length === 0 && donationHistory.length > 0 ? (
          <div className="w-full flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl text-center shadow-sm max-w-lg mx-auto py-16">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 animate-bounce">
              <Heart size={28} className="stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              No Donations Found
            </h3>
            <p className="text-xs text-slate-500 font-medium max-w-sm mt-2 leading-relaxed">
              We couldn't find any donations matching your current filters. Try searching for something else or adjusting your status filters.
            </p>
          </div>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full pb-6">
            {filtered.length > 0
              ? filtered.map((donation: any) => {
                  const isGreen = donation.status === "PICKED_UP" || donation.status === "DELIVERED";
                  const isBlue = donation.status === "ASSIGNED" || donation.status === "ACCEPTED";
                  const themeClass = isGreen
                    ? "border-green-100 bg-[#fcfdfc] hover:border-green-200"
                    : isBlue
                      ? "border-blue-100 bg-[#fcfhfc] hover:border-blue-200"
                      : "border-orange-100 bg-[#fffcfc] hover:border-orange-200";

                  const statusClass = isGreen
                    ? "bg-green-50 text-green-700"
                    : isBlue
                      ? "bg-blue-50 text-blue-700"
                      : donation.status === "CANCELLED"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-orange-50 text-orange-600";

                  const textThemeClass = isGreen ? "text-green-600" : isBlue ? "text-blue-600" : "text-orange-500";

                  return (
                    <div
                      key={donation.id}
                      className={`w-full border rounded-[2.5rem] p-4 transition-all duration-300 group/card relative shadow-sm hover:shadow-xl ${themeClass}`}
                    >
                      <div className="flex justify-between items-center mb-3 px-1">
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusClass}`}
                        >
                          {donation.status === "PENDING" ? (
                            <Clock size={12} strokeWidth={3} />
                          ) : donation.status === "CANCELLED" ? (
                            <XCircle size={12} strokeWidth={3} />
                          ) : (
                            <ShieldCheck size={12} strokeWidth={3} />
                          )}
                          <span>{donation.status === "PICKED_UP" ? "PICKED UP" : donation.status}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {donation.date}
                        </span>
                      </div>

                      <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-4 shadow-sm">
                        <img
                          src={
                            donation.image || getCategoryImage(donation.category)
                          }
                          className={`w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 ${
                            donation.status === "DELIVERED"
                              ? "saturate-[0.8] opacity-95"
                              : donation.status === "CANCELLED"
                                ? "saturate-[0.4] opacity-80"
                                : ""
                          }`}
                          alt={donation.foodType}
                        />
                        <div
                          className={`absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border border-white/50 ${
                            donation.status === "PENDING"
                              ? "text-orange-500"
                              : donation.status === "CANCELLED"
                                ? "text-rose-500 border-rose-100"
                                : "text-green-500"
                          }`}
                        >
                          {donation.status === "PENDING" ? (
                            <Hourglass size={20} strokeWidth={2.5} />
                          ) : donation.status === "CANCELLED" ? (
                            <XCircle size={20} strokeWidth={2.5} />
                          ) : (
                            <ShieldCheck size={20} strokeWidth={2.5} />
                          )}
                        </div>
                      </div>

                      <div className="px-1 space-y-4 mb-4">
                        <div className="space-y-1 text-start">
                          <h3
                            className={`text-[20px] font-black tracking-tight leading-none ${
                              donation.status === "DELIVERED"
                                ? "text-slate-700"
                                : "text-slate-800"
                            }`}
                          >
                            {donation.foodType}
                          </h3>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest border border-slate-200/50">
                              {donation.category}
                            </span>
                          </div>
                          <p className={`text-[10px] font-black uppercase tracking-widest pt-1 ${textThemeClass}`}>
                            {donation.quantity} · {donation.dietaryType} · {donation.preparationType}
                          </p>
                        </div>

                        <div className="space-y-3.5">
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                donation.status === "PENDING"
                                  ? "bg-orange-50 text-orange-500"
                                  : donation.status === "CANCELLED"
                                    ? "bg-orange-50 text-orange-500"
                                    : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              <MapPin size={16} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col text-start">
                              <span className="text-[13px] font-bold text-slate-700 truncate max-w-[220px]">
                                {donation.status === "PENDING"
                                  ? "Matching nearby NGOs..."
                                  : donation.status === "CANCELLED"
                                    ? "No match found"
                                    : donation.ngo || "N/A"}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400">
                                Pickup ID
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                donation.status === "PENDING"
                                  ? "bg-orange-50 text-orange-500"
                                  : donation.status === "CANCELLED"
                                    ? "bg-orange-50 text-orange-500"
                                    : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              <Clock size={16} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col text-start">
                              <span
                                className={`text-[13px] font-bold ${
                                  donation.status === "CANCELLED"
                                    ? "line-through text-slate-400 font-medium"
                                    : "text-slate-700"
                                }`}
                              >
                                {donation.date},{" "}
                                {donation.status === "DELIVERED"
                                  ? "6:25 PM"
                                  : "6:00 PM - 7:00 PM"}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400">
                                Pickup Time
                              </span>
                            </div>
                          </div>
                        </div>

                        {donation.status === "ASSIGNED" || donation.status === "PICKED_UP" ? (
                          <div className={`p-3 border rounded-2xl flex items-center justify-between ${
                            donation.status === "PICKED_UP"
                              ? "bg-green-500/10 border-green-500/20 text-green-700"
                              : "bg-blue-500/10 border-blue-500/20 text-blue-700"
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                                <Truck size={16} className={donation.status === "PICKED_UP" ? "text-green-600" : "text-blue-600"} />
                              </div>
                              <div className="flex flex-col text-start">
                                <span className="text-[11px] font-black uppercase tracking-wider">
                                  Volunteer on the way
                                </span>
                                <span className="text-[9px] font-bold text-slate-500">
                                  ETA: 20 mins • 2.4 km away
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-full shadow-sm border border-slate-100 shrink-0">
                              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                donation.status === "PICKED_UP" ? "bg-green-500" : "bg-blue-500"
                              }`} />
                              <span className={`text-[8px] font-black uppercase tracking-tighter ${
                                donation.status === "PICKED_UP" ? "text-green-600" : "text-blue-600"
                              }`}>
                                Live
                              </span>
                            </div>
                          </div>
                        ) : donation.status === "PENDING" ? (
                          <div className="p-3 bg-orange-50/50 border border-orange-100/50 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                              <Search size={16} />
                            </div>
                            <div className="flex flex-col text-start">
                              <span className="text-[11px] font-black text-orange-600">
                                We are finding the best NGO
                              </span>
                              <span className="text-[9px] font-bold text-slate-400">
                                Estimated acceptance in 10-15 min
                              </span>
                            </div>
                          </div>
                        ) : donation.status === "CANCELLED" ? (
                          <div className="p-3 bg-rose-50/50 border border-rose-100/50 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm shrink-0 border border-rose-100/50">
                              <XCircle size={16} />
                            </div>
                            <div className="flex flex-col text-start">
                              <span className="text-[11px] font-black text-rose-600">
                                Donation Cancelled
                              </span>
                              <span className="text-[9px] font-bold text-slate-400">
                                This donation has been cancelled.
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                              <Heart size={16} fill="currentColor" />
                            </div>
                            <div className="flex flex-col text-start">
                              <span className="text-[11px] font-black text-emerald-600">
                                Thank you!
                              </span>
                              <span className="text-[9px] font-bold text-slate-400">
                                Your donation will feed many in need 🎉
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100/50 space-y-4">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => handleDetailsClick(donation)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-2xl bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                          >
                            <Info size={14} />
                            <span>View Details</span>
                          </button>

                          {donation.status === "DELIVERED" ? (
                            <button
                              onClick={() => {
                                myDonationsInputModel.update({
                                  receiptDonation: donation,
                                  isReceiptModalOpen: true,
                                });
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-2xl bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-all text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                            >
                              <Download size={14} />
                              <span>Receipt</span>
                            </button>
                          ) : donation.status === "CANCELLED" ? (
                            <>
                              <button
                                onClick={() => {
                                  myDonationsInputModel.update({
                                    deletingDonationId: String(donation.id),
                                    isDeleteModalOpen: true,
                                  });
                                }}
                                className="flex-[0.35] flex items-center justify-center gap-2 px-3 py-3 rounded-2xl bg-red-50 text-red-500 border border-red-200/50 hover:bg-red-100 transition-all text-[10px] font-black uppercase tracking-wider"
                              >
                                <Trash2 size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  myDonationsInputModel.update({
                                    redonateDonation: donation,
                                    isRedonateModalOpen: true,
                                  });
                                }}
                                className="flex-[1.2] flex items-center justify-center gap-2 px-3 py-3 rounded-2xl font-black uppercase tracking-wider text-[10px] bg-[#ff6f00] hover:bg-[#e65100] transition-all active:scale-95 shadow-md shadow-orange-500/20 text-white whitespace-nowrap"
                              >
                                <RotateCcw size={14} className="stroke-[2.5]" />
                                <span>Redonate</span>
                              </button>
                            </>
                          ) : donation.status === "ASSIGNED" || donation.status === "PICKED_UP" ? (
                            <button
                              onClick={() => {
                                handleLiveTrackClick(donation);
                              }}
                              className={`flex-[1.2] flex items-center justify-center gap-2 px-3 py-3 rounded-2xl font-black uppercase tracking-wider text-[10px] transition-all active:scale-95 shadow-md whitespace-nowrap text-white ${
                                donation.status === "PICKED_UP"
                                  ? "bg-green-600 hover:bg-green-700 shadow-green-500/10"
                                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/10"
                              }`}
                            >
                              Live Track
                            </button>
                          ) : donation.status === "PENDING" ? (
                            <button
                              onClick={() =>
                                handleCancelClick(
                                  String(donation.id),
                                  donation.cancelReason || ""
                                )
                              }
                              disabled={cancellingId === String(donation.id)}
                              className="flex-[1.2] flex items-center justify-center gap-2 px-3 py-3 rounded-2xl font-black uppercase tracking-wider text-[10px] transition-all active:scale-95 shadow-md whitespace-nowrap text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300"
                            >
                              {cancellingId === String(donation.id) ? (
                                <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                              ) : (
                                "Cancel Donation"
                              )}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        ) : (
          <div
            className="border rounded-xl shadow-sm p-2 overflow-hidden bg-white"
            style={{
              borderColor: "var(--border-color)",
            }}
          >
            <ReusableTable
              variant="compact"
              data={filtered}
              enableSearch={false}
              enableFilters={false}
              showColumnSettings={false}
              columns={[
                { name: "DONATION ID", uid: "id", sortable: true },
                { name: "ITEM", uid: "foodType", align: "start" },
                { name: "QUANTITY", uid: "quantity" },
                { name: "DONATED BY", uid: "donatedBy" },
                { name: "ASSIGNED TO", uid: "assignedTo" },
                { name: "PICKUP DATE", uid: "pickupDate" },
                { name: "STATUS", uid: "status" },
                { name: "ACTIONS", uid: "actions", align: "end" },
              ]}
              renderCell={(donation: any, columnKey: React.Key) => {
                const formatDonationId = (d: any) => `#HF-${d.id}`;
                switch (columnKey) {
                  case "id":
                    return (
                      <div className="flex items-center gap-1.5 py-1">
                        <span className="text-[10px] font-black uppercase tracking-widest tabular-nums border px-2 py-1 rounded-md bg-slate-50 border-slate-200 text-slate-500">
                          {formatDonationId(donation)}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(formatDonationId(donation));
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                          title="Copy ID"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    );
                  case "foodType":
                    return (
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                          <img
                            src={donation.image || getCategoryImage(donation.category)}
                            alt={donation.foodType}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col text-start">
                          <span className="text-sm font-bold text-slate-800 leading-tight">
                            {donation.foodType}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 mt-0.5 bg-slate-50 border border-slate-200/50 rounded p-0.5 px-1.5 w-fit">
                            {donation.category}
                          </span>
                        </div>
                      </div>
                    );
                  case "quantity": {
                    const [qtyVal, qtyUnit] = String(donation.quantity).split(/\s+(.+)/);
                    return (
                      <div className="py-1 text-start">
                        <span className="text-sm font-extrabold text-slate-800">
                          {qtyVal}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {qtyUnit || "Items"}
                        </span>
                      </div>
                    );
                  }
                  case "donatedBy":
                    return (
                      <div className="py-1 text-start">
                        <span className="text-xs font-bold text-slate-800">Star Hotel</span>
                        <span className="text-[9px] text-slate-400 block font-medium">Donor</span>
                      </div>
                    );
                  case "assignedTo":
                    return (
                      <div className="py-1 text-start">
                        <span className="text-xs font-bold text-slate-800">
                          {donation.status === "PENDING"
                            ? "Matching nearby NGOs..."
                            : donation.status === "CANCELLED"
                              ? "No match found"
                              : "Helping Hands NGO"}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-medium">NGO</span>
                      </div>
                    );
                  case "pickupDate":
                    return (
                      <div className="py-1 text-start">
                        <span className="text-xs font-bold text-slate-800 block">
                          {donation.date}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-medium">
                          {donation.expiryTime || "6:00 PM - 7:00 PM"}
                        </span>
                      </div>
                    );
                  case "status": {
                    const isGreen = donation.status === "PICKED_UP" || donation.status === "DELIVERED";
                    const isBlue = donation.status === "ASSIGNED" || donation.status === "ACCEPTED";
                    const statusClass = isGreen
                      ? "bg-green-50 border-green-200 text-green-600"
                      : isBlue
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-orange-50 border-orange-200 text-orange-600";
                    return (
                      <div className="py-1">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit border ${statusClass}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${isGreen ? "bg-green-500" : isBlue ? "bg-blue-500" : "bg-orange-500"}`} />
                          {donation.status === "PICKED_UP" ? "PICKED UP" : donation.status}
                        </span>
                      </div>
                    );
                  }
                  case "actions":
                    return (
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleDetailsClick(donation)}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-slate-500 bg-white"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        {donation.status === "DELIVERED" && (
                          <button
                            onClick={() => {
                              myDonationsInputModel.update({
                                receiptDonation: donation,
                                isReceiptModalOpen: true,
                              });
                            }}
                            className="p-2 rounded-xl text-white bg-green-600 hover:bg-green-700 transition-all flex items-center justify-center"
                            title="Receipt"
                          >
                            <FileText size={14} />
                          </button>
                        )}
                        {(donation.status === "ASSIGNED" || donation.status === "PICKED_UP") && (
                          <button
                            onClick={() => handleLiveTrackClick(donation)}
                            className="p-2 rounded-xl border border-blue-500 bg-blue-600 text-white hover:bg-blue-700 transition-all"
                            title="Live Track"
                          >
                            <Truck size={14} />
                          </button>
                        )}
                        {donation.status === "CANCELLED" && (
                          <>
                            <button
                              onClick={() => {
                                myDonationsInputModel.update({
                                  deletingDonationId: String(donation.id),
                                  isDeleteModalOpen: true,
                                });
                              }}
                              className="p-2 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                            <button
                              onClick={() => {
                                myDonationsInputModel.update({
                                  redonateDonation: donation,
                                  isRedonateModalOpen: true,
                                });
                              }}
                              className="p-2 rounded-xl border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all"
                              title="Redonate"
                            >
                              <RotateCcw size={14} />
                            </button>
                          </>
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
      </div>

      {donationHistory.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center justify-center rounded-[24px] border border-slate-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-8 md:p-12 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-green-50/20 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative w-56 h-40 md:w-64 md:h-48 mb-4">
              <img
                src="/no_donation.png"
                alt="No Donations"
                className="w-full h-full object-contain opacity-90"
              />
            </div>

            <div className="space-y-2 mb-8">
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                No donations yet
              </h3>
              <p className="text-[13px] md:text-sm font-bold text-slate-500/70 max-w-sm leading-relaxed">
                You haven't created any donation requests yet. <br />
                Start sharing surplus food and help someone in need.
              </p>
            </div>

            <button
              onClick={() => navigate("/donor/donations/create")}
              className="px-10 py-4 bg-[#22c55e] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#16a34a] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-green-500/10"
            >
              <img
                src="/giving.png"
                className="w-5 h-5 object-contain"
                alt="Giving"
              />
              <span>Start Your Journey</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export const MyDonationsModals = () => {
  const isGeneralDetailsOpen = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isGeneralDetailsOpen
  );
  const isDetailsModalOpen = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isDetailsModalOpen
  );
  const isTrackingModalOpen = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isTrackingModalOpen
  );
  const isCancelModalOpen = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isCancelModalOpen
  );
  const isRedonateModalOpen = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isRedonateModalOpen
  );
  const isDeleteModalOpen = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isDeleteModalOpen
  );
  const isReceiptModalOpen = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isReceiptModalOpen
  );

  const selectedDonation = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.selectedDonation
  );
  const receiptDonation = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.receiptDonation
  );
  const redonateDonation = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.redonateDonation
  );

  const otpDigits = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.otpDigits
  );
  const otpValue = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.otpValue
  );
  const otpError = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.otpError
  );
  const isVerifying = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isVerifying
  );
  const isDeleting = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isDeleting
  );
  const cancelReason = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.cancelReason
  );

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <>
      {/* General Details Drawer */}
      <ResuableDrawer
        isOpen={isGeneralDetailsOpen}
        onClose={() =>
          myDonationsInputModel.update({ isGeneralDetailsOpen: false })
        }
        title="Donation Details"
        subtitle={
          <span className="block text-slate-400 mt-1 break-all">
            Tracking ID:{" "}
            <span className="text-[#22c55e] font-bold">
              #DON-{selectedDonation?.id}
            </span>
          </span>
        }
        size="md"
      >
        {selectedDonation ? (
          <div className="space-y-5 p-6 bg-white">
            <div className="relative rounded-3xl overflow-hidden shadow-lg min-h-[220px] bg-slate-950">
              <img
                src={
                  selectedDonation.image ||
                  getCategoryImage(selectedDonation.category)
                }
                className="absolute inset-0 w-full h-full object-cover"
                alt={selectedDonation.foodType}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/45 to-transparent" />
              <div className="relative z-10 min-h-[220px] p-6 flex flex-col justify-end text-start">
                <span className="w-fit px-2.5 py-1 rounded-full bg-white/90 text-emerald-700 text-[9px] font-black uppercase tracking-widest mb-3">
                  {selectedDonation.status}
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
                  {selectedDonation.foodType}
                </h3>
                <p className="text-[11px] font-black text-slate-200 uppercase tracking-[0.18em] mt-2">
                  {selectedDonation.quantity} - {selectedDonation.dietaryType} -{" "}
                  {selectedDonation.preparationType}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-start">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin size={17} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    NGO / Location
                  </p>
                  <p className="text-[13px] font-bold text-slate-800">
                    {selectedDonation.ngo || "Matching in progress"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-start">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock size={17} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    Pickup Window
                  </p>
                  <p className="text-[13px] font-bold text-slate-800">
                    {selectedDonation.date}, 6:00 PM - 7:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-start">
              <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-700">
                Recent Updates
              </h4>
              {(selectedDonation.timeline || []).map((step: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 text-start">
                    <p className="text-[12px] font-black text-slate-800 truncate">
                      {step.status}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 truncate">
                      {step.date}, {step.time}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${
                      step.completed
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {step.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </ResuableDrawer>

      {/* Assigned Donation Details Drawer */}
      <ResuableDrawer
        isOpen={isDetailsModalOpen}
        onClose={() =>
          myDonationsInputModel.update({ isDetailsModalOpen: false })
        }
        title="Donation Details"
        subtitle={
          <span className="block text-slate-400 mt-1 break-all">
            Tracking ID:{" "}
            <span className="text-[#22c55e] font-bold">
              #DON-{selectedDonation?.id}
            </span>
          </span>
        }
        size="md"
      >
        {selectedDonation ? (
          <div className="space-y-5 p-6 bg-white">
            <div className="relative rounded-3xl overflow-hidden shadow-lg min-h-[220px] bg-slate-950">
              <img
                src={
                  selectedDonation.image ||
                  getCategoryImage(selectedDonation.category)
                }
                className="absolute inset-0 w-full h-full object-cover"
                alt={selectedDonation.foodType}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/45 to-transparent" />
              <div className="relative z-10 min-h-[220px] p-6 flex flex-col justify-end text-start">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 text-emerald-700 text-[9px] font-black uppercase tracking-widest">
                    {selectedDonation.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest">
                    {selectedDonation.status}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
                  {selectedDonation.foodType}
                </h3>
                <p className="text-[11px] font-black text-slate-200 uppercase tracking-[0.18em] mt-2">
                  {selectedDonation.quantity} - {selectedDonation.dietaryType} -{" "}
                  {selectedDonation.preparationType}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-start">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                      NGO
                    </p>
                    <p className="text-[13px] font-bold text-slate-800 truncate">
                      {selectedDonation.ngo || "Matching in progress"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-start">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                      Pickup Window
                    </p>
                    <p className="text-[13px] font-bold text-slate-800 truncate">
                      {selectedDonation.date}, 6:00 PM - 7:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {(selectedDonation.volunteer ||
                selectedDonation.status === "ASSIGNED" ||
                selectedDonation.status === "PICKED_UP") && (
                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center overflow-hidden border border-[#f1f5f9] shrink-0">
                      <svg
                        className="w-10 h-10 text-[#10b981] translate-y-1.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-0.5">
                        Volunteer
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-black text-slate-700">
                          {selectedDonation.volunteer?.name || "Assigning..."}
                        </span>
                        {selectedDonation.volunteer?.name && (
                          <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#e8fcf0] text-[#10b981] text-[8px] font-black uppercase tracking-wider border border-[#d1fae5]">
                            Verified ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (selectedDonation.volunteer?.phone) {
                        window.location.href = `tel:${selectedDonation.volunteer.phone}`;
                      } else {
                        toast.info(
                          "Volunteer phone number is not available yet."
                        );
                      }
                    }}
                    className="w-11 h-11 rounded-full bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center shadow-md shadow-emerald-500/10 active:scale-90 transition-all cursor-pointer shrink-0"
                  >
                    <Phone size={15} fill="currentColor" />
                  </button>
                </div>
              )}

              {(selectedDonation.status === "ASSIGNED" || selectedDonation.status === "PICKED_UP") && (
                <div className="space-y-4">
                  <div className="p-5 rounded-[1.75rem] bg-[#f8fdf9] border border-emerald-100/50 space-y-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#e8fcf0] flex items-center justify-center text-[#10b981] border border-emerald-100/50 shrink-0">
                        <ShieldCheck size={22} strokeWidth={2.2} />
                      </div>
                      <div className="text-start">
                        <h4 className="text-[13px] font-black uppercase tracking-wider text-emerald-800">
                          Delivery Verification
                        </h4>
                        <p className="text-[11px] font-medium text-slate-500">
                          Confirm NGO handoff securely
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-start">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          Enter verification code
                        </label>
                        <span className="text-[10px] font-black text-slate-400 tracking-wider">
                          OTP
                        </span>
                      </div>

                      <div className="flex gap-2 justify-between items-center py-1">
                        {otpDigits.map((digit: string, index: number) => (
                          <input
                            key={index}
                            ref={(el) => {
                              otpRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleOtpDigitChange(e.target.value, index, otpRefs)
                            }
                            onKeyDown={(e) =>
                              handleOtpKeyDown(e, index, otpRefs)
                            }
                            onFocus={() => handleOtpFocus(index, otpRefs)}
                            onPaste={
                              index === 0
                                ? (e) => handleOtpPaste(e, otpRefs)
                                : undefined
                            }
                            autoFocus={index === 0}
                            className="w-10 h-12 sm:w-12 sm:h-14 rounded-2xl bg-white border border-slate-200 focus:border-[#10b981] outline-none text-center text-lg sm:text-xl font-black text-slate-800 transition-all shadow-sm focus:ring-4 focus:ring-emerald-500/10"
                            placeholder="0"
                          />
                        ))}
                      </div>
                    </div>

                    {otpError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-center">
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                          {otpError}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={onOtpSubmit}
                      disabled={isVerifying || otpValue.length !== 6}
                      className="w-full py-4 rounded-[1.25rem] bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-40 font-black uppercase tracking-widest text-[12px] shadow-lg shadow-emerald-500/15"
                    >
                      {isVerifying ? (
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck size={16} strokeWidth={2.5} />
                          <span>Verify Delivery</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/20 border border-emerald-100/30 flex items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/30 shrink-0">
                        <ShieldCheck size={17} strokeWidth={2.2} />
                      </div>
                      <div className="text-start leading-tight">
                        <p className="text-[12.5px] font-black text-slate-800 tracking-tight">
                          Your donation makes a difference!
                        </p>
                        <p className="text-[10.5px] font-bold text-slate-400">
                          Thank you for helping build a better tomorrow.
                        </p>
                      </div>
                    </div>
                    <div className="relative shrink-0 text-emerald-500 animate-[pulse_2s_infinite] mr-1 flex items-center">
                      <Heart size={18} fill="currentColor" />
                      <span className="absolute -top-1 -right-1 text-[8px] animate-pulse">
                        ✨
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </ResuableDrawer>

      {/* Live Tracking Modal */}
      <ResuableDrawer
        isOpen={isTrackingModalOpen}
        onClose={() =>
          myDonationsInputModel.update({ isTrackingModalOpen: false })
        }
        title="Donation Details"
        subtitle={
          <span className="block text-slate-400 mt-1 break-all">
            Tracking ID:{" "}
            <span className="text-[#22c55e] font-bold">
              #DON-{selectedDonation?.id}
            </span>
          </span>
        }
        size="md"
      >
        {selectedDonation ? (
          (() => {
            const d = selectedDonation;
            const lastCompletedIdx = [...d.timeline]
              .reverse()
              .findIndex((s) => s.completed);
            const currentActiveIdx =
              lastCompletedIdx !== -1
                ? d.timeline.length - 1 - lastCompletedIdx
                : 0;
            return (
              <div className="space-y-5 p-6 bg-white">
                <div className="space-y-5">
                  {(d.status === "ASSIGNED" || d.status === "PICKED_UP") && (
                    <div className="space-y-3">
                      <LiveGPSMap
                        pickupCoords={d.pickupCoords}
                        deliveryCoords={d.deliveryCoords}
                        volunteerLocation={d.volunteerLocation}
                        volunteerName={d.volunteer?.name}
                      />
                      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm text-start">
                        {[
                          {
                            label: "Volunteer",
                            value: d.volunteer?.name || "Assigned",
                            icon: User,
                          },
                          { label: "ETA", value: "20 mins", icon: Clock },
                          { label: "Distance", value: "2.4 km", icon: MapPin },
                          { label: "Status", value: "On the way", icon: Truck },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={item.label}
                              className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 min-w-0"
                            >
                              <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center shrink-0 border border-emerald-100/40">
                                <Icon size={18} strokeWidth={2.2} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">
                                  {item.label}
                                </p>
                                <p className="text-[13px] font-black text-slate-700 truncate leading-none">
                                  {item.value}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-[#22c55e] border border-emerald-100/40 shrink-0">
                          <LayoutList size={16} strokeWidth={2.5} />
                        </div>
                        <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-700">
                          Live Trip Progress
                        </h4>
                      </div>
                    </div>

                    <div className="relative space-y-0 px-1 text-start">
                      {d.timeline.map((step: any, idx: number) => {
                        const isCurrent = idx === currentActiveIdx;
                        const isPast = idx < currentActiveIdx;

                        return (
                          <div
                            key={idx}
                            className="relative flex items-start gap-4 group/step pb-6 last:pb-0"
                          >
                            {idx < d.timeline.length - 1 && (
                              <div
                                className={`absolute top-[46px] w-[2px] z-0 transition-colors duration-300 ${
                                  isPast || step.completed
                                    ? "bg-emerald-500"
                                    : "border-l-2 border-dashed border-slate-200"
                                }`}
                                style={{
                                  left: "12px",
                                  transform: "translateX(-50%)",
                                  bottom: "-22px",
                                }}
                              />
                            )}

                            <div className="relative flex flex-col items-center shrink-0 pt-[22px] w-6 z-10">
                              <div
                                className={`relative z-10 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center shadow-sm shrink-0 transition-all duration-300 ${
                                  isCurrent
                                    ? "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] bg-emerald-50"
                                    : isPast
                                      ? "border-emerald-500 bg-emerald-50"
                                      : "border-slate-200 bg-white"
                                }`}
                              >
                                {isCurrent ? (
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                ) : isPast ? (
                                  <Check className="w-3 text-emerald-500 stroke-[3.5]" />
                                ) : (
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                )}
                              </div>
                            </div>

                            <div
                              className={`flex-1 p-3.5 rounded-xl border flex items-start gap-4 min-w-0 transition-all duration-300 ${
                                isCurrent
                                  ? "bg-emerald-50/25 border-emerald-500/35 shadow-md shadow-emerald-500/5 hover:bg-emerald-50/30"
                                  : isPast
                                    ? "bg-slate-50/50 border-slate-100/50 hover:bg-white hover:border-slate-200/60 opacity-80"
                                    : "bg-slate-50/10 border-slate-100 border-dashed opacity-25"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border shadow-sm transition-all duration-300 ${
                                  isCurrent
                                    ? "text-emerald-500 border-emerald-200 bg-emerald-50/10 shadow-emerald-500/5"
                                    : isPast
                                      ? "text-emerald-600 border-emerald-100"
                                      : "text-slate-300 border-slate-100"
                                }`}
                              >
                                {step.status.toLowerCase().includes("pickup") ||
                                step.status.toLowerCase().includes("picked") ? (
                                  <ShoppingBag size={18} />
                                ) : step.status
                                    .toLowerCase()
                                    .includes("delivered") ? (
                                  <CheckCircle2 size={18} />
                                ) : step.status
                                    .toLowerCase()
                                    .includes("assigned") ? (
                                  <User size={18} />
                                ) : (
                                  <Clock size={18} />
                                )}
                              </div>

                              <div className="flex-1 min-w-0 pt-0.5 text-start">
                                <p
                                  className={`text-[13.5px] font-bold tracking-tight truncate transition-all duration-300 ${
                                    isCurrent
                                      ? "text-emerald-700 font-black"
                                      : isPast
                                        ? "text-slate-800"
                                        : "text-slate-400"
                                  }`}
                                >
                                  {step.status}
                                </p>
                                {step.description && (
                                  <p
                                    className={`text-[11px] font-medium mt-0.5 line-clamp-2 leading-relaxed transition-all duration-300 ${
                                      isCurrent
                                        ? "text-slate-600 font-semibold"
                                        : isPast
                                          ? "text-slate-500"
                                          : "text-slate-400/70"
                                    }`}
                                  >
                                    {step.description}
                                  </p>
                                )}
                                <p className="text-[10px] font-bold text-slate-400 mt-1">
                                  {step.date}, {step.time}
                                </p>
                              </div>

                              <div
                                className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase border shadow-sm shrink-0 whitespace-nowrap transition-all duration-300 mt-1 ${
                                  isCurrent
                                    ? "bg-emerald-500 text-white border-emerald-400"
                                    : isPast
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                      : "bg-slate-50 text-slate-400 border-slate-100"
                                }`}
                              >
                                {isCurrent
                                  ? "Active"
                                  : isPast
                                    ? "Completed"
                                    : "Pending"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : null}
      </ResuableDrawer>

      {/* Cancellation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onOpenChange={(open) =>
          myDonationsInputModel.update({ isCancelModalOpen: open })
        }
        size="md"
        backdrop="blur"
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-slate-900/60 backdrop-blur-sm",
          base: "bg-transparent shadow-none border-none outline-none",
          body: "p-0",
          wrapper: "z-[9999]",
        }}
      >
        <ModalContent className="bg-transparent border-none outline-none shadow-none ring-0 p-0">
          {() => (
            <div className="bg-white w-full max-w-[390px] rounded-[2rem] p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100/50 flex flex-col items-center relative overflow-visible mx-auto">
              <button
                onClick={closeCancelModal}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all border border-slate-100 z-50 shadow-sm"
              >
                <X size={14} strokeWidth={2.35} />
              </button>

              <div className="w-40 h-40 mb-4 flex items-center justify-center shrink-0">
                <img
                  src="/cancel_order1.png"
                  className="w-full h-full object-contain drop-shadow-sm"
                  alt="Cancel Donation Illustration"
                />
              </div>

              <div className="text-center space-y-1 mb-4">
                <h3 className="text-[22px] font-black text-slate-800 tracking-tight leading-none">
                  Cancel this donation?
                </h3>
                <p className="text-[12.5px] font-bold text-slate-500 max-w-[300px] leading-normal mx-auto">
                  Are you sure you want to cancel this donation? This action{" "}
                  <span className="text-[#d32f2f] font-black">
                    cannot be undone.
                  </span>
                </p>
              </div>

              <div className="w-full bg-[#fff5f5] border border-rose-100/50 rounded-2xl p-4 space-y-3 mb-4 text-start">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center shrink-0 text-[#d32f2f]">
                    <Clock size={12} strokeWidth={2.5} />
                  </div>
                  <p className="text-[10.5px] font-bold text-slate-700 leading-tight">
                    Matching with NGOs will be stopped.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center shrink-0 text-[#d32f2f]">
                    <ShoppingBag size={12} strokeWidth={2.5} />
                  </div>
                  <p className="text-[10.5px] font-bold text-slate-700 leading-tight">
                    This food may not reach someone in need.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center shrink-0 text-[#d32f2f]">
                    <Heart size={12} strokeWidth={2.5} />
                  </div>
                  <p className="text-[10.5px] font-bold text-slate-700 leading-tight">
                    Please cancel only if absolutely necessary.
                  </p>
                </div>
              </div>

              <div className="w-full space-y-1 mb-5 text-start">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">
                  Why do you want to cancel?{" "}
                  <span className="text-slate-300 font-bold">(Optional)</span>
                </label>
                <div className="relative">
                  <select
                    value={cancelReason}
                    onChange={(e) =>
                      myDonationsInputModel.update({
                        cancelReason: e.target.value,
                      })
                    }
                    className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200/50 rounded-xl text-[11px] font-bold text-slate-700 outline-none appearance-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all cursor-pointer"
                  >
                    <option value="">Select a reason</option>
                    <option value="Incorrect quantity entered">
                      Incorrect quantity entered
                    </option>
                    <option value="Incorrect food items listed">
                      Incorrect food items listed
                    </option>
                    <option value="Food quality concerns">
                      Food quality concerns
                    </option>
                    <option value="NGO matching is taking too long">
                      NGO matching is taking too long
                    </option>
                    <option value="No longer wish to donate">
                      No longer wish to donate
                    </option>
                    <option value="Other reason">Other reason</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown size={14} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mb-4">
                <button
                  onClick={closeCancelModal}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-[0.98] text-[9px] font-black uppercase tracking-wide whitespace-nowrap shadow-sm"
                >
                  <XCircle size={12} className="stroke-[2.5]" />
                  <span>NO, Keep Donation</span>
                </button>

                <button
                  onClick={confirmCancellation}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-white shadow-md shadow-red-500/10 hover:shadow-lg transition-all active:scale-[0.98] text-[9px] font-black uppercase tracking-wide whitespace-nowrap"
                >
                  <Trash2 size={12} className="stroke-[2.5]" />
                  <span>Yes, Cancel Donation</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-slate-400">
                <ShieldCheck
                  size={12}
                  className="text-[#10b981] stroke-[2.5]"
                />
                <span className="text-[9px] font-bold">
                  Your data is safe with us. This action is secure.
                </span>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Redonate Modal */}
      <Modal
        isOpen={isRedonateModalOpen}
        onOpenChange={(open) =>
          myDonationsInputModel.update({ isRedonateModalOpen: open })
        }
        size="md"
        backdrop="blur"
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-slate-900/60 backdrop-blur-sm",
          base: "bg-transparent shadow-none border-none outline-none",
          body: "p-0",
          wrapper: "z-[9999]",
        }}
      >
        <ModalContent className="bg-transparent border-none outline-none shadow-none ring-0 p-0">
          {() => (
            <div className="bg-white w-full max-w-[390px] rounded-[2.5rem] p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100/50 flex flex-col items-center relative overflow-visible mx-auto">
              <button
                onClick={() =>
                  myDonationsInputModel.update({ isRedonateModalOpen: false })
                }
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all border border-slate-100/80 z-50 shadow-sm active:scale-90"
              >
                <X size={14} strokeWidth={2.35} />
              </button>

              <div className="relative w-32 h-32 mb-4 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-pulse" />
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500/10 via-emerald-100/20 to-emerald-400/5 flex items-center justify-center">
                  <div className="absolute -top-1 left-3 text-emerald-500/40 animate-[bounce_3s_infinite_1s]">
                    <Leaf size={12} fill="currentColor" />
                  </div>
                  <div className="absolute top-6 -left-2 text-emerald-400/50 -rotate-45 animate-pulse">
                    <Leaf size={14} fill="currentColor" />
                  </div>
                  <div className="absolute -bottom-1 left-5 text-emerald-500/40 rotate-45 animate-[bounce_4s_infinite]">
                    <Leaf size={10} fill="currentColor" />
                  </div>
                  <div className="absolute top-3 -right-1 text-emerald-400/60 rotate-[30deg] animate-pulse">
                    <Leaf size={14} fill="currentColor" />
                  </div>
                  <div className="absolute bottom-4 -right-1 text-emerald-500/50 -rotate-12 animate-[bounce_3.5s_infinite_0.5s]">
                    <Leaf size={12} fill="currentColor" />
                  </div>

                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10">
                    <img
                      src={
                        redonateDonation?.image ||
                        getCategoryImage(redonateDonation?.category)
                      }
                      className="w-full h-full object-cover"
                      alt="Food Bowl"
                    />
                  </div>

                  <div className="absolute top-1 right-1 w-8 h-8 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-lg z-20 hover:scale-110 transition-transform cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                      <RotateCcw
                        size={12}
                        className="stroke-[2.5] animate-[spin_8s_linear_infinite]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-1 mb-4">
                <h3 className="text-[22px] font-black text-slate-800 tracking-tight leading-none">
                  Redonate this cancelled donation?
                </h3>
                <p className="text-[12.5px] font-bold text-slate-500 max-w-[300px] leading-relaxed mx-auto">
                  Your donation can still make a difference. Redonate to find a
                  new match and help someone in need.
                </p>
              </div>

              <div className="w-full bg-[#f4faf6]/80 border border-emerald-100/40 rounded-[1.5rem] p-4 space-y-3 mb-4 text-start">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100/50 text-[#16a34a] flex items-center justify-center shrink-0 mt-0.5">
                    <Leaf size={12} fill="currentColor" />
                  </div>
                  <div className="flex flex-col space-y-0.5 text-start">
                    <p className="text-[12px] font-black text-slate-800 tracking-tight leading-none">
                      Fresh opportunity
                    </p>
                    <p className="text-[10.5px] font-bold text-slate-500/80 leading-normal">
                      We'll find new NGOs near you.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100/50 text-[#16a34a] flex items-center justify-center shrink-0 mt-0.5">
                    <Users size={12} fill="currentColor" />
                  </div>
                  <div className="flex flex-col space-y-0.5 text-start">
                    <p className="text-[12px] font-black text-slate-800 tracking-tight leading-none">
                      More impact
                    </p>
                    <p className="text-[10.5px] font-bold text-slate-500/80 leading-normal">
                      Your food can reach someone who truly needs it.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100/50 text-[#16a34a] flex items-center justify-center shrink-0 mt-0.5">
                    <Heart size={12} fill="currentColor" />
                  </div>
                  <div className="flex flex-col space-y-0.5 text-start">
                    <p className="text-[12px] font-black text-slate-800 tracking-tight leading-none">
                      Zero waste, more good
                    </p>
                    <p className="text-[10.5px] font-bold text-slate-500/80 leading-normal">
                      Together we can reduce food waste.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full bg-[#fffbf6] border border-orange-100/40 rounded-2xl p-3.5 flex items-center gap-3 mb-5 text-start">
                <div className="w-7 h-7 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 shadow-sm border border-orange-100/10">
                  <Clock size={14} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col space-y-0.5 text-start">
                  <span className="text-[10px] font-black text-orange-600/85 uppercase tracking-wide leading-none">
                    Original donation time
                  </span>
                  <span className="text-[12px] font-black text-slate-700">
                    {redonateDonation?.date}, 6:00 PM – 7:00 PM
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mb-3">
                <button
                  onClick={() =>
                    myDonationsInputModel.update({ isRedonateModalOpen: false })
                  }
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-[0.98] text-[9.5px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm"
                >
                  <XCircle size={12} className="stroke-[2.5]" />
                  <span>NO, DON'T REDONATE</span>
                </button>

                <button
                  onClick={confirmRedonate}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#1b803c] hover:bg-[#156d32] text-white shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all active:scale-[0.98] text-[9.5px] font-black uppercase tracking-wider whitespace-nowrap"
                >
                  <RotateCcw size={12} className="stroke-[2.5]" />
                  <span>YES, REDONATE</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-slate-400/90">
                <ShieldCheck
                  size={12}
                  className="text-[#10b981] stroke-[2.5]"
                />
                <span className="text-[9px] font-bold tracking-tight">
                  Your data is safe with us. This action is secure.
                </span>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onOpenChange={(open) =>
          myDonationsInputModel.update({ isDeleteModalOpen: open })
        }
        size="sm"
        backdrop="blur"
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-slate-900/60 backdrop-blur-sm",
          base: "bg-transparent shadow-none border-none outline-none",
          body: "p-0",
        }}
      >
        <ModalContent className="bg-transparent border-none outline-none shadow-none ring-0 p-0">
          {() => (
            <div className="bg-white w-full max-w-[360px] rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100/50 flex flex-col items-center relative overflow-hidden mx-auto">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-5 border border-red-100/50 shadow-inner">
                <Trash2 size={24} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">
                Delete Donation?
              </h3>
              <p className="text-[13px] font-bold text-slate-500/80 text-center mb-6 max-w-[280px]">
                Are you sure you want to delete this cancelled donation from
                your history? This action cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() =>
                    myDonationsInputModel.update({ isDeleteModalOpen: false })
                  }
                  className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-black uppercase tracking-wider shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="w-full py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider disabled:opacity-50"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Receipt Details Modal */}
      <Modal
        isOpen={isReceiptModalOpen}
        onOpenChange={(open) =>
          myDonationsInputModel.update({ isReceiptModalOpen: open })
        }
        size="md"
        backdrop="blur"
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-slate-900/60 backdrop-blur-sm",
          base: "bg-transparent shadow-none border-none outline-none",
          body: "p-0",
          wrapper: "z-[9999]",
        }}
      >
        <ModalContent className="bg-transparent border-none outline-none shadow-none ring-0 p-0 m-0">
          {(onClose) => {
            if (!receiptDonation) return null;
            const d = receiptDonation;
            const deliveredStep = d.timeline?.find((s: any) =>
              s.status.toUpperCase().includes("DELIVERED")
            );
            const deliveredDate = deliveredStep
              ? `${deliveredStep.date}, ${deliveredStep.time}`
              : `${d.date}, 6:25 PM`;
            const receiptId = `HF-${
              d.date.replace(/[^0-9]/g, "-") || "2026-05-15"
            }-${d.id || 6821}`;

            return (
              <div className="bg-white w-full max-w-[440px] rounded-[2rem] p-6 md:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-slate-100/50 flex flex-col relative max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] overflow-y-auto thin-scrollbar mx-auto">
                <button
                  onClick={onClose}
                  className="absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 transition-all duration-300 group z-50 border border-slate-100"
                >
                  <X
                    size={16}
                    className="text-slate-400 group-hover:text-slate-600 transition-colors"
                  />
                </button>

                <div className="mt-2 mb-2 shrink-0">
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto overflow-visible"
                  >
                    <circle cx="60" cy="60" r="50" fill="#f0fdf4" />
                    <circle cx="60" cy="60" r="38" fill="#dcfce7" />
                    <path
                      d="M22 62C18 58 20 48 20 48C20 48 30 46 34 50C34 50 26 52 25 57C24 62 22 62 22 62Z"
                      fill="#22c55e"
                      className="animate-pulse"
                    />
                    <path
                      d="M98 62C102 58 100 48 100 48C100 48 90 46 86 50C86 50 94 52 95 57C96 62 98 62 98 62Z"
                      fill="#22c55e"
                      className="animate-pulse"
                    />
                    <g filter="drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.06))">
                      <path
                        d="M40 25H80V87L75 83L70 87L65 83L60 87L55 83L50 87L45 83L40 87V25Z"
                        fill="white"
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </g>
                    <line
                      x1="48"
                      y1="38"
                      x2="72"
                      y2="38"
                      stroke="#cbd5e1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="48"
                      y1="48"
                      x2="64"
                      y2="48"
                      stroke="#e2e8f0"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="48"
                      y1="58"
                      x2="72"
                      y2="58"
                      stroke="#e2e8f0"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="48"
                      y1="68"
                      x2="56"
                      y2="68"
                      stroke="#e2e8f0"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="80"
                      cy="76"
                      r="13"
                      fill="#22c55e"
                      stroke="white"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M75 76L78.5 79.5L85 73"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="text-center space-y-1 mb-5">
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">
                    Receipt
                  </h2>
                  <p className="text-[11px] font-bold text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                    Thank you! Your donation has created an impact.
                  </p>
                  <div className="flex justify-center pt-0.5 text-emerald-500 animate-bounce">
                    <Heart size={14} fill="currentColor" />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f4faf6] border border-emerald-500/10 flex items-center gap-3.5 mb-5 shrink-0 text-start">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
                    <img
                      src={d.image || getCategoryImage(d.category)}
                      className="w-full h-full object-cover"
                      alt={d.foodType}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-black text-slate-800 truncate leading-tight mb-0.5">
                      {d.foodType}
                    </h4>
                    <div className="flex flex-wrap items-center gap-1 mb-1">
                      <span className="px-1.5 py-0.5 bg-[#e8fcf0] text-[#1b803c] rounded-full text-[7.5px] font-black uppercase tracking-wider">
                        {d.category}
                      </span>
                    </div>
                    <p className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider">
                      {d.quantity.toUpperCase()} • {d.dietaryType.toUpperCase()}{" "}
                      • {d.preparationType.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-5 overflow-y-auto max-h-[220px] pr-1 thin-scrollbar text-start">
                  <div className="flex items-start justify-between gap-4 py-1 border-b border-dashed border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7.5 h-7.5 rounded-full bg-[#f4faf6] text-emerald-600 flex items-center justify-center border border-emerald-100/50 shrink-0">
                        <MapPin size={13} />
                      </div>
                      <div className="flex flex-col text-start">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                          NGO / Recipient
                        </span>
                        <span className="text-[11.5px] font-bold text-slate-800">
                          {d.ngo}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-md text-[8px] font-black uppercase tracking-widest self-center">
                      DELIVERED
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-1 border-b border-dashed border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7.5 h-7.5 rounded-full bg-[#f4faf6] text-emerald-600 flex items-center justify-center border border-emerald-100/50 shrink-0">
                        <Clock size={13} />
                      </div>
                      <div className="flex flex-col text-start">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                          Delivered On
                        </span>
                        <span className="text-[11.5px] font-bold text-slate-800">
                          {deliveredDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-1 border-b border-dashed border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7.5 h-7.5 rounded-full bg-[#f4faf6] text-emerald-600 flex items-center justify-center border border-emerald-100/50 shrink-0">
                        <User size={13} />
                      </div>
                      <div className="flex flex-col text-start">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                          Received By
                        </span>
                        <span className="text-[11.5px] font-bold text-slate-800">
                          {d.ngo} Team
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7.5 h-7.5 rounded-full bg-[#f4faf6] text-emerald-600 flex items-center justify-center border border-emerald-100/50 shrink-0">
                        <FileText size={13} />
                      </div>
                      <div className="flex flex-col text-start">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                          Receipt ID
                        </span>
                        <span className="text-[11.5px] font-bold text-slate-800">
                          {receiptId}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(receiptId);
                        toast.success("Receipt ID copied to clipboard!");
                      }}
                      className="w-7 h-7 rounded-lg hover:bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition-all self-center shadow-sm"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#e8fcf0]/50 border border-[#e8fcf0] flex items-center gap-3.5 mb-3 shrink-0 text-start">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0 border border-emerald-50">
                    <Heart size={12} fill="currentColor" />
                  </div>
                  <div className="flex flex-col text-start">
                    <span className="text-[11px] font-black text-emerald-800">
                      Thank you for your generosity!
                    </span>
                    <span className="text-[9.5px] font-bold text-emerald-600/90 leading-tight">
                      Your donation will feed many in need 💐
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3.5 mb-5 shrink-0 text-start">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0 border border-slate-100">
                    <ShieldCheck size={14} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col text-start">
                    <span className="text-[11px] font-black text-slate-700">
                      Verified Donation
                    </span>
                    <span className="text-[9.5px] font-bold text-slate-500 leading-tight">
                      This donation is verified and has been recorded
                      successfully.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mt-auto shrink-0">
                  <button
                    onClick={() => toast.success("Downloading receipt PDF...")}
                    className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 text-[10.5px] font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "Donation Receipt",
                          text: `Donation of ${d.foodType} verified successfully. Receipt ID: ${receiptId}`,
                          url: window.location.href,
                        }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(
                          `Donation of ${d.foodType} verified successfully. Receipt ID: ${receiptId}`
                        );
                        toast.success("Share link copied!");
                      }
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 text-[10.5px] font-black uppercase tracking-wider active:scale-95 transition-all"
                  >
                    <Share2 size={13} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
};
