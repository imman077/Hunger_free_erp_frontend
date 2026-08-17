import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import {
  Package,
  MapPin,
  Clock,
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
  Eye,
  Building2,
  Calendar,
  Zap,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import { Modal, ModalContent } from "@heroui/react";
import ResuableDrawer from "../../../../global/components/reusable-components/Drawer";
import ImpactCards from "../../../../global/components/reusable-components/ImpactCards";
import PageHeader from "../../../../global/components/reusable-components/PageHeader";
import ReusableTable from "../../../../global/components/reusable-components/Table";
import Tabs from "../../../../global/components/reusable-components/Tabs";
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

export const formatDonationExpiry = (donation: any) => {
  if (!donation) return "";
  if (donation.expiryTime) {
    if (donation.expiryTime.includes("T")) {
      const [datePart, timePart] = donation.expiryTime.split("T");
      if (datePart && timePart) {
        const [year, month, day] = datePart.split("-");
        const [hourStr, minStr] = timePart.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        const formattedTime = `${hour}:${minStr || "00"} ${ampm}`;
        const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
        const monthName = isNaN(dateObj.getTime())
          ? datePart
          : dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return `${monthName}, ${formattedTime}`;
      }
    }
    if (donation.expiryTime.includes("AM") || donation.expiryTime.includes("PM")) {
      return donation.expiryTime.includes(",")
        ? donation.expiryTime
        : `${donation.date || ""}, ${donation.expiryTime}`;
    }
    return `${donation.date || ""}, ${donation.expiryTime}`;
  }
  return donation.date ? `${donation.date}, 7:00 PM` : "No Expiry Set";
};

export const getNgoDetails = (donation: any) => {
  if (!donation) {
    return {
      name: "Not Assigned",
      address: "Not Available",
      phone: "N/A",
      email: "N/A",
      verified: false,
      rating: "N/A",
      impact: "N/A",
    };
  }

  if (typeof donation.ngoDetails === "object" && donation.ngoDetails !== null) {
    return {
      name: donation.ngoDetails.name || "Matched NGO Partner",
      address: donation.ngoDetails.address || donation.deliveryAddress || donation.pickupAddress || "Address Not Available",
      phone: donation.ngoDetails.phone || "N/A",
      email: donation.ngoDetails.email || "N/A",
      verified: Boolean(donation.ngoDetails.verified ?? true),
      rating: donation.ngoDetails.rating || "N/A",
      impact: donation.ngoDetails.impact || "Community Food Relief Partner",
    };
  }

  const rawNgo = donation.ngo;
  const isMongoId = typeof rawNgo === "string" && Boolean(rawNgo.match(/^[0-9a-fA-F]{24}$/));
  const ngoName = rawNgo && !isMongoId ? rawNgo : (donation.status === "PENDING" ? "Matching nearby NGOs..." : "Verified NGO Partner");

  return {
    name: ngoName,
    address: donation.deliveryAddress || donation.pickupAddress || "Address Not Available",
    phone: donation.phone || "N/A",
    email: donation.email || "N/A",
    verified: true,
    rating: donation.rating || "N/A",
    impact: "Community Food Relief Partner",
  };
};

export const getFormattedTimeline = (donation: any) => {
  if (!donation) return [];
  const allStatuses = ["Pending", "Accepted", "Assigned", "Picked Up", "Delivered"];
  const statusUpper = (donation.status || "").toUpperCase();
  const currentStatusIndex =
    statusUpper === "DELIVERED"
      ? 4
      : statusUpper === "PICKED_UP"
        ? 3
        : statusUpper === "ASSIGNED"
          ? 2
          : statusUpper === "ACCEPTED"
            ? 1
            : statusUpper === "CANCELLED"
              ? -1
              : 0;

  const timelineData = donation.timeline || [];

  return allStatuses.map((statusName, idx) => {
    const existingStep = timelineData.find(
      (t: any) => t.status?.toLowerCase() === statusName.toLowerCase()
    );

    const isCompleted = idx <= currentStatusIndex;
    const isCurrent = idx === currentStatusIndex;

    const stepDate = existingStep?.date || (isCompleted ? donation.date || "N/A" : "N/A");
    const stepTime = existingStep?.time || (isCompleted ? "Recorded" : "Pending");

    return {
      status: statusName,
      date: stepDate,
      time: stepTime,
      completed: isCompleted,
      isCurrent: isCurrent,
    };
  });
};

export const getReceiptMetrics = (donation: any) => {
  if (!donation) return {} as any;

  const ngo = getNgoDetails(donation);
  const volunteerName = donation.volunteer?.name || "Not Assigned";
  const volunteerPhone = donation.volunteer?.phone || "N/A";
  const volunteerRating = donation.volunteer?.rating || "N/A";

  const qtyStr = String(donation.quantity || "");
  let peopleFedStr = "N/A";
  const numMatch = qtyStr.match(/\d+/);
  if (numMatch) {
    const val = parseInt(numMatch[0], 10);
    if (qtyStr.toLowerCase().includes("kg")) {
      peopleFedStr = `~${val * 4} People`;
    } else if (qtyStr.toLowerCase().includes("meal")) {
      peopleFedStr = `~${val} People`;
    } else {
      peopleFedStr = `~${val * 3} People`;
    }
  }

  const expiry = formatDonationExpiry(donation);

  const timeline = donation.timeline || [];
  const assignedStep = timeline.find((t: any) => t.status?.toUpperCase().includes("ASSIGNED"));
  const pickedStep = timeline.find((t: any) => t.status?.toUpperCase().includes("PICKED"));
  const deliveredStep = timeline.find((t: any) => t.status?.toUpperCase().includes("DELIVERED"));

  const createdTimeStr = donation.createdAt
    ? new Date(donation.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
    : donation.date || "N/A";

  const volunteerReceivedTime = pickedStep
    ? `${pickedStep.date || ""}${pickedStep.time ? `, ${pickedStep.time}` : ""}`.trim()
    : assignedStep
      ? `${assignedStep.date || ""}${assignedStep.time ? `, ${assignedStep.time}` : ""}`.trim()
      : "N/A";

  const deliveredTime = deliveredStep
    ? `${deliveredStep.date || ""}${deliveredStep.time ? `, ${deliveredStep.time}` : ""}`.trim()
    : donation.status === "DELIVERED"
      ? `${donation.date || "Recorded"}`
      : "Pending";

  let hoursTakenStr = "N/A";
  if (donation.createdAt && deliveredStep?.timestamp) {
    const diffMs = new Date(deliveredStep.timestamp).getTime() - new Date(donation.createdAt).getTime();
    if (diffMs > 0) {
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      hoursTakenStr = hours > 0 ? `${hours} hr ${mins} mins` : `${mins} mins`;
    }
  } else if (donation.status === "DELIVERED") {
    hoursTakenStr = "Completed";
  }

  return {
    ngoName: ngo.name,
    ngoAddress: ngo.address,
    ngoPhone: ngo.phone,
    ngoEmail: ngo.email,
    volunteerName,
    volunteerPhone,
    volunteerRating,
    peopleFed: peopleFedStr,
    expiry,
    volunteerReceivedTime: volunteerReceivedTime || "N/A",
    deliveredTime: deliveredTime || "N/A",
    createdTimeStr,
    hoursTakenStr,
  };
};

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
      if (statusFilter === "Assigned") return donation.status === "ASSIGNED";
      if (statusFilter === "Picked Up") return donation.status === "PICKED_UP";
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
        {/* NGO-Style Control Bar Container with Highlighted Header Background */}
        <div className="flex flex-col gap-4 mb-8 w-full p-4 sm:p-5 bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
          {/* Top Row: Search Bar & View Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            {/* Search Bar */}
            <div className="relative w-full sm:w-[320px]">
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

            {/* View Switcher Toggle */}
            <Tabs
              tabs={[
                { id: "card", icon: LayoutGrid, label: "Cards" },
                { id: "table", icon: Table, label: "Table" },
              ]}
              activeTab={viewMode}
              onTabChange={(mode) => myDonationsInputModel.update({ viewMode: mode as any })}
              layoutId="myDonationsViewModeTab"
            />
          </div>

          {/* Bottom Row: Inline Filter Controls (Next Row like NGO Table) */}
          <div className="flex flex-wrap items-center gap-3.5 border-t border-slate-100 pt-3.5 w-full">
            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() =>
                  myDonationsInputModel.update({
                    isFilterDropdownOpen: !isFilterDropdownOpen,
                  })
                }
                className="w-full sm:w-[160px] bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-3 px-4 flex flex-col items-start gap-0.5 shadow-sm text-start outline-none transition-all cursor-pointer relative"
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
                  <div className="absolute left-0 top-full mt-1.5 w-full sm:w-[160px] bg-white border border-slate-200 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {[
                      { value: "", label: "All" },
                      { value: "Pending", label: "Pending" },
                      { value: "Accepted", label: "Accepted" },
                      { value: "Assigned", label: "Assigned" },
                      { value: "Picked Up", label: "Picked Up" },
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
                className="w-full sm:w-[160px] bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-3 px-4 flex flex-col items-start gap-0.5 shadow-sm text-start outline-none transition-all cursor-pointer relative"
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
                  <div className="absolute left-0 top-full mt-1.5 w-full sm:w-[160px] bg-white border border-slate-200 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
                            {(() => {
                              const ngo = getNgoDetails(donation);
                              return (
                                <div className="flex flex-col text-start">
                                  <span className="text-[13px] font-bold text-slate-700 truncate max-w-[220px]">
                                    {donation.status === "PENDING"
                                      ? "Matching nearby NGOs..."
                                      : donation.status === "CANCELLED"
                                        ? "No match found"
                                        : ngo.name}
                                  </span>
                                  <span className="text-[9px] font-bold text-slate-400 truncate max-w-[220px]">
                                    {ngo.address !== "Address Not Available" ? ngo.address : "Assigned NGO Partner"}
                                  </span>
                                </div>
                              );
                            })()}
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
                                  {donation.volunteer?.name
                                    ? `Volunteer: ${donation.volunteer.name} (${donation.volunteer.phone || ""})`
                                    : "Volunteer: John V (+91 98765 43210)"}
                                </span>
                                <span className="text-[9.5px] font-bold text-slate-500">
                                  {donation.status === "PICKED_UP" ? "Food Picked Up • En route to NGO" : "Volunteer assigned • ETA: 20 mins"}
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
          <span className="block text-emerald-200 mt-0.5 break-all">
            Tracking ID:{" "}
            <span className="text-[#4ade80] font-bold">
              #DON-{selectedDonation?.id || "6a788280868de415dc77cc53"}
            </span>
          </span>
        }
        size="md"
      >
        {selectedDonation ? (
          <div className="space-y-4 p-5 md:p-6 bg-white text-start">
            {/* 1. Hero Image Banner Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-sm h-48 md:h-52 bg-slate-950">
              <img
                src={
                  selectedDonation.image ||
                  getCategoryImage(selectedDonation.category)
                }
                className="absolute inset-0 w-full h-full object-cover"
                alt={selectedDonation.foodType}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10 h-full p-5 flex flex-col justify-end text-start">
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block mb-2 shadow-xs ${
                      selectedDonation.status?.toUpperCase() === "CANCELLED"
                        ? "bg-rose-500 text-white"
                        : selectedDonation.status?.toUpperCase() === "PENDING"
                          ? "bg-amber-500 text-white"
                          : "bg-white/90 text-[#16a34a]"
                    }`}
                  >
                    {selectedDonation.status}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight mb-0.5">
                  {selectedDonation.foodType}
                </h3>
                <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {selectedDonation.quantity} • {selectedDonation.dietaryType} • {selectedDonation.preparationType || "RAW"}
                </p>
              </div>
            </div>

            {/* 2. NGO / Location Info Card */}
            {(() => {
              const ngo = getNgoDetails(selectedDonation);
              return (
                <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-100 flex items-center gap-3.5 text-start">
                  <div className="w-10 h-10 rounded-full bg-[#e8fccf]/60 text-[#16a34a] flex items-center justify-center shrink-0 border border-emerald-100/50">
                    <Building2 size={18} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">
                      NGO PARTNER & LOCATION
                    </span>
                    <p className="font-bold text-slate-800 text-[13px] truncate">
                      {ngo.name}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 truncate">
                      {ngo.address}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* 3. Expiry Date & Time Card */}
            <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-100 flex items-center gap-3.5 text-start">
              <div className="w-10 h-10 rounded-full bg-[#e8fccf]/60 text-[#16a34a] flex items-center justify-center shrink-0 border border-emerald-100/50">
                <Clock size={18} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">
                  EXPIRY DATE & TIME
                </span>
                <p className="font-bold text-slate-800 text-[13px] truncate">
                  {formatDonationExpiry(selectedDonation)}
                </p>
              </div>
            </div>

            {/* 4. CURRENT STATUS Card */}
            {(() => {
              const statusUpper = (selectedDonation.status || "").toUpperCase();
              const isCancelled = statusUpper === "CANCELLED";
              const isPending = statusUpper === "PENDING";

              const containerClass = isCancelled
                ? "p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 flex items-center justify-between text-start"
                : isPending
                  ? "p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-start"
                  : "p-4 rounded-2xl bg-[#f2faf5] border border-[#d3ebd9] flex items-center justify-between text-start";

              const textClass = isCancelled
                ? "text-lg font-black text-rose-600 tracking-tight uppercase"
                : isPending
                  ? "text-lg font-black text-amber-600 tracking-tight uppercase"
                  : "text-lg font-black text-[#16a34a] tracking-tight uppercase";

              const badgeClass = isCancelled
                ? "w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0 shadow-2xs"
                : isPending
                  ? "w-11 h-11 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0 shadow-2xs"
                  : "w-11 h-11 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center border border-[#bbf7d0] shrink-0 shadow-2xs";

              const Icon = isCancelled ? XCircle : isPending ? Clock : CheckCircle2;

              return (
                <div className={containerClass}>
                  <div>
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">
                      CURRENT STATUS
                    </span>
                    <p className={textClass}>
                      {selectedDonation.status}
                    </p>
                  </div>
                  <div className={badgeClass}>
                    <Icon size={22} strokeWidth={2.5} />
                  </div>
                </div>
              );
            })()}

            {/* 5. Delivery Timeline Section */}
            <div className="pt-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-4 block text-start">
                DELIVERY TIMELINE
              </span>

              <div className="space-y-4 relative px-3.5 sm:px-5 text-start">
                {getFormattedTimeline(selectedDonation).map((step: any, idx: number, arr: any[]) => {
                  const isLastCompleted = step.completed && (idx === arr.length - 1 || !arr[idx + 1]?.completed);
                  return (
                    <div key={idx} className="relative flex items-center justify-between gap-3 text-start">
                      {/* Vertical line connector */}
                      {idx < arr.length - 1 && (
                        <div
                          className={`absolute left-[9px] top-4 bottom-[-16px] w-[2px] z-0 ${
                            step.completed && arr[idx + 1]?.completed
                              ? "bg-[#16a34a]"
                              : "bg-slate-200"
                          }`}
                        />
                      )}

                      {/* Left timeline node */}
                      <div className="flex items-center gap-3 min-w-0 flex-1 z-10">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-white">
                          {isLastCompleted ? (
                            <div className="w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center text-white shadow-xs">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          ) : step.completed ? (
                            <div className="w-5 h-5 rounded-full border-2 border-[#16a34a] bg-white flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`text-[13.5px] font-bold ${step.completed ? "text-slate-800" : "text-slate-500"}`}>
                            {step.status}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                            {step.date || "Pending"}
                          </p>
                        </div>
                      </div>

                      {/* Right side status badge */}
                      <div className="shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-[9.5px] font-black uppercase tracking-wider ${
                            step.completed
                              ? "bg-[#e8fccf] text-[#16a34a]"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {step.completed ? "COMPLETED" : "PENDING"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. Volunteer Call Handoff Card (if volunteer is assigned or status is ASSIGNED/PICKED_UP/DELIVERED) */}
            {(selectedDonation.volunteer || selectedDonation.status === "ASSIGNED" || selectedDonation.status === "PICKED_UP" || selectedDonation.status === "DELIVERED") && (
              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8fccf]/60 text-[#16a34a] flex items-center justify-center border border-emerald-100/50 shrink-0">
                    <User size={18} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col text-start">
                    <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider mb-0.5">
                      Delivery Volunteer
                    </span>
                    <span className="text-[13px] font-bold text-slate-800">
                      {selectedDonation.volunteer?.name || "John V"} ({selectedDonation.volunteer?.phone || "+91 98765 43210"})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const phone = selectedDonation.volunteer?.phone || "+919876543210";
                    window.location.href = `tel:${phone}`;
                  }}
                  className="w-10 h-10 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer shrink-0"
                >
                  <Phone size={15} />
                </button>
              </div>
            )}

            {/* 7. Bottom Thank You Card */}
            <div className="p-4 rounded-2xl bg-[#f2faf5] border border-[#d3ebd9] flex items-center justify-between gap-3 text-start">
              <div className="w-9 h-9 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0 border border-[#bbf7d0]">
                <ShieldCheck size={18} strokeWidth={2.2} />
              </div>
              <p className="text-[11.5px] font-bold text-slate-700 leading-snug flex-1">
                Thank you for your generous contribution. You're making a real difference!
              </p>
              <Heart size={18} className="text-[#16a34a] fill-[#16a34a]/20 shrink-0" />
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
          <span className="block text-emerald-200 mt-0.5 break-all">
            Tracking ID:{" "}
            <span className="text-[#4ade80] font-bold">
              #DON-{selectedDonation?.id || "6a788280868de415dc77cc53"}
            </span>
          </span>
        }
        size="md"
      >
        {selectedDonation ? (
          <div className="space-y-4 p-5 md:p-6 bg-white text-start">
            {/* 1. Hero Image Banner Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-sm h-48 md:h-52 bg-slate-950">
              <img
                src={
                  selectedDonation.image ||
                  getCategoryImage(selectedDonation.category)
                }
                className="absolute inset-0 w-full h-full object-cover"
                alt={selectedDonation.foodType}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10 h-full p-5 flex flex-col justify-end text-start">
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block mb-2 shadow-xs ${
                      selectedDonation.status?.toUpperCase() === "CANCELLED"
                        ? "bg-rose-500 text-white"
                        : selectedDonation.status?.toUpperCase() === "PENDING"
                          ? "bg-amber-500 text-white"
                          : "bg-white/90 text-[#16a34a]"
                    }`}
                  >
                    {selectedDonation.status}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight mb-0.5">
                  {selectedDonation.foodType}
                </h3>
                <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {selectedDonation.quantity} • {selectedDonation.dietaryType} • {selectedDonation.preparationType || "RAW"}
                </p>
              </div>
            </div>

            {/* 2. NGO / Location Info Card */}
            {(() => {
              const ngo = getNgoDetails(selectedDonation);
              return (
                <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-100 flex items-center gap-3.5 text-start">
                  <div className="w-10 h-10 rounded-full bg-[#e8fccf]/60 text-[#16a34a] flex items-center justify-center shrink-0 border border-emerald-100/50">
                    <Building2 size={18} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">
                      NGO PARTNER & LOCATION
                    </span>
                    <p className="font-bold text-slate-800 text-[13px] truncate">
                      {ngo.name}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 truncate">
                      {ngo.address}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* 3. Expiry Date & Time Card */}
            <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-100 flex items-center gap-3.5 text-start">
              <div className="w-10 h-10 rounded-full bg-[#e8fccf]/60 text-[#16a34a] flex items-center justify-center shrink-0 border border-emerald-100/50">
                <Clock size={18} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">
                  EXPIRY DATE & TIME
                </span>
                <p className="font-bold text-slate-800 text-[13px] truncate">
                  {formatDonationExpiry(selectedDonation)}
                </p>
              </div>
            </div>

            {/* 4. CURRENT STATUS Card */}
            {(() => {
              const statusUpper = (selectedDonation.status || "").toUpperCase();
              const isCancelled = statusUpper === "CANCELLED";
              const isPending = statusUpper === "PENDING";

              const containerClass = isCancelled
                ? "p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 flex items-center justify-between text-start"
                : isPending
                  ? "p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-start"
                  : "p-4 rounded-2xl bg-[#f2faf5] border border-[#d3ebd9] flex items-center justify-between text-start";

              const textClass = isCancelled
                ? "text-lg font-black text-rose-600 tracking-tight uppercase"
                : isPending
                  ? "text-lg font-black text-amber-600 tracking-tight uppercase"
                  : "text-lg font-black text-[#16a34a] tracking-tight uppercase";

              const badgeClass = isCancelled
                ? "w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0 shadow-2xs"
                : isPending
                  ? "w-11 h-11 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0 shadow-2xs"
                  : "w-11 h-11 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center border border-[#bbf7d0] shrink-0 shadow-2xs";

              const Icon = isCancelled ? XCircle : isPending ? Clock : CheckCircle2;

              return (
                <div className={containerClass}>
                  <div>
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">
                      CURRENT STATUS
                    </span>
                    <p className={textClass}>
                      {selectedDonation.status}
                    </p>
                  </div>
                  <div className={badgeClass}>
                    <Icon size={22} strokeWidth={2.5} />
                  </div>
                </div>
              );
            })()}

            {/* 5. Delivery Timeline Section */}
            <div className="pt-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-4 block text-start">
                DELIVERY TIMELINE
              </span>

              <div className="space-y-4 relative px-3.5 sm:px-5 text-start">
                {getFormattedTimeline(selectedDonation).map((step: any, idx: number, arr: any[]) => {
                  const isLastCompleted = step.completed && (idx === arr.length - 1 || !arr[idx + 1]?.completed);
                  return (
                    <div key={idx} className="relative flex items-center justify-between gap-3 text-start">
                      {/* Vertical line connector */}
                      {idx < arr.length - 1 && (
                        <div
                          className={`absolute left-[9px] top-4 bottom-[-16px] w-[2px] z-0 ${
                            step.completed && arr[idx + 1]?.completed
                              ? "bg-[#16a34a]"
                              : "bg-slate-200"
                          }`}
                        />
                      )}

                      {/* Left timeline node */}
                      <div className="flex items-center gap-3 min-w-0 flex-1 z-10">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-white">
                          {isLastCompleted ? (
                            <div className="w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center text-white shadow-xs">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          ) : step.completed ? (
                            <div className="w-5 h-5 rounded-full border-2 border-[#16a34a] bg-white flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`text-[13.5px] font-bold ${step.completed ? "text-slate-800" : "text-slate-500"}`}>
                            {step.status}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                            {step.date || "Pending"}
                          </p>
                        </div>
                      </div>

                      {/* Right side status badge */}
                      <div className="shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-[9.5px] font-black uppercase tracking-wider ${
                            step.completed
                              ? "bg-[#e8fccf] text-[#16a34a]"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {step.completed ? "COMPLETED" : "PENDING"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. Volunteer Call Handoff Card (if volunteer is assigned or status is ASSIGNED/PICKED_UP/DELIVERED) */}
            {(selectedDonation.volunteer || selectedDonation.status === "ASSIGNED" || selectedDonation.status === "PICKED_UP" || selectedDonation.status === "DELIVERED") && (
              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8fccf]/60 text-[#16a34a] flex items-center justify-center border border-emerald-100/50 shrink-0">
                    <User size={18} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col text-start">
                    <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider mb-0.5">
                      Delivery Volunteer
                    </span>
                    <span className="text-[13px] font-bold text-slate-800">
                      {selectedDonation.volunteer?.name || "John V"} ({selectedDonation.volunteer?.phone || "+91 98765 43210"})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const phone = selectedDonation.volunteer?.phone || "+919876543210";
                    window.location.href = `tel:${phone}`;
                  }}
                  className="w-10 h-10 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer shrink-0"
                >
                  <Phone size={15} />
                </button>
              </div>
            )}

            {/* 7. Verification / OTP Section */}
            {(selectedDonation.status === "ASSIGNED" || selectedDonation.status === "PICKED_UP") && (
              selectedDonation.volunteer ? (
                /* CASE A: Volunteer Assigned -> Display Pickup Verification Code for Donor to read to Volunteer */
                <div className="p-5 rounded-2xl bg-[#f2faf5] border border-[#d3ebd9] space-y-3 shadow-xs text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#16a34a] border border-[#bbf7d0] shrink-0">
                      <ShieldCheck size={20} strokeWidth={2.2} />
                    </div>
                    <div className="text-start">
                      <h4 className="text-[13px] font-black uppercase tracking-wider text-[#056839]">
                        Pickup Verification Code
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500">
                        Share this 6-digit code with the volunteer upon pickup
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#d3ebd9] flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        OTP CODE:
                      </span>
                      <span className="text-xl font-black text-[#16a34a] font-mono tracking-[0.25em]">
                        {selectedDonation.pickupOtp || selectedDonation.otp || "482910"}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#e8fccf] text-[#16a34a] text-[9.5px] font-black uppercase tracking-wider border border-[#bbf7d0]">
                      Active
                    </span>
                  </div>
                </div>
              ) : (
                /* CASE B: Self-Delivery (No Volunteer) -> Donor enters NGO Verification OTP */
                <div className="p-5 rounded-2xl bg-[#f8fdf9] border border-emerald-100/50 space-y-4 shadow-xs text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#e8fcf0] flex items-center justify-center text-[#16a34a] border border-emerald-100/50 shrink-0">
                      <ShieldCheck size={20} strokeWidth={2.2} />
                    </div>
                    <div className="text-start">
                      <h4 className="text-[13px] font-black uppercase tracking-wider text-emerald-800">
                        NGO Delivery Verification
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500">
                        Enter the code from NGO upon self-delivery
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
                          className="w-10 h-12 sm:w-12 sm:h-14 rounded-2xl bg-white border border-slate-200 focus:border-[#16a34a] outline-none text-center text-lg sm:text-xl font-black text-slate-800 transition-all shadow-sm focus:ring-4 focus:ring-emerald-500/10"
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
                    className="w-full py-3.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 font-black uppercase tracking-widest text-[12px] shadow-lg shadow-emerald-500/15"
                  >
                    {isVerifying ? (
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={16} strokeWidth={2.5} />
                        <span>Verify NGO Delivery</span>
                      </>
                    )}
                  </button>
                </div>
              )
            )}

            {/* 8. Bottom Thank You Card */}
            <div className="p-4 rounded-2xl bg-[#f2faf5] border border-[#d3ebd9] flex items-center justify-between gap-3 text-start">
              <div className="w-9 h-9 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0 border border-[#bbf7d0]">
                <ShieldCheck size={18} strokeWidth={2.2} />
              </div>
              <p className="text-[11.5px] font-bold text-slate-700 leading-snug flex-1">
                Thank you for your generous contribution. You're making a real difference!
              </p>
              <Heart size={18} className="text-[#16a34a] fill-[#16a34a]/20 shrink-0" />
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
        title="Live Order Tracking"
        subtitle={
          <span className="block text-emerald-200 mt-0.5 break-all">
            Tracking ID:{" "}
            <span className="text-[#4ade80] font-bold">
              #DON-{selectedDonation?.id || "6a788280868de415dc77cc53"}
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
                        volunteerName={d.volunteer?.name || "John V"}
                      />
                      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm text-start">
                        {[
                          {
                            label: "Volunteer",
                            value: d.volunteer?.name ? `${d.volunteer.name} (${d.volunteer.phone || ""})` : "John V (+91 98765 43210)",
                            icon: User,
                          },
                          { label: "ETA", value: d.status === "PICKED_UP" ? "15 mins" : "20 mins", icon: Clock },
                          {
                            label: "Destination",
                            value: d.status === "PICKED_UP" ? "NGO Shelter" : "Donor Pickup",
                            icon: MapPin,
                          },
                          {
                            label: "Status",
                            value: d.status === "PICKED_UP" ? "En route to NGO" : "On the way for pickup",
                            icon: Truck,
                          },
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

      {/* Receipt Details Modal (Full Screen Photo Preview) */}
      <Modal
        isOpen={isReceiptModalOpen}
        onOpenChange={(open) =>
          myDonationsInputModel.update({ isReceiptModalOpen: open })
        }
        size="full"
        backdrop="blur"
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-slate-900/40 backdrop-blur-xl",
          base: "bg-slate-50 text-slate-900 shadow-none border-none outline-none w-screen h-screen max-w-none m-0 p-0 rounded-none overflow-hidden",
          body: "p-0 h-full flex flex-col justify-between overflow-hidden",
          wrapper: "z-[9999] p-0 m-0 w-screen h-screen overflow-hidden",
        }}
      >
        <ModalContent className="bg-slate-50 border-none outline-none shadow-none ring-0 p-0 m-0 w-screen h-screen max-w-none rounded-none flex flex-col overflow-hidden">
          {(onClose) => {
            if (!receiptDonation) return null;
            const d = receiptDonation;
            const metrics = getReceiptMetrics(d);
            const receiptId = `HF-${d.date ? d.date.replace(/[^0-9]/g, "-") : "2026-06-25"}-${d.id || 6821}`;

            const handleDownloadPdf = async () => {
              const element = document.getElementById("receipt-card-printable");
              if (!element) return;
              toast.loading("Generating professional PDF receipt...", { id: "pdf-gen" });

              try {
                const canvas = await html2canvas(element, {
                  scale: 2,
                  useCORS: true,
                  allowTaint: true,
                  backgroundColor: "#ffffff",
                  logging: false,
                });

                let imgData: string;
                try {
                  imgData = canvas.toDataURL("image/png");
                } catch {
                  const cleanCanvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: false,
                    allowTaint: false,
                    backgroundColor: "#ffffff",
                    ignoreElements: (el: Element) => el.tagName === "IMG",
                  });
                  imgData = cleanCanvas.toDataURL("image/png");
                }

                const pdf = new jsPDF("p", "mm", "a4");
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, Math.min(pdfHeight, 270));
                pdf.save(`HungerFree_Receipt_${receiptId}.pdf`);
                toast.success("Professional PDF downloaded!", { id: "pdf-gen" });
              } catch (err) {
                console.error("PDF export error:", err);
                try {
                  const pdf = new jsPDF("p", "mm", "a4");
                  pdf.setFontSize(16);
                  pdf.setTextColor(34, 197, 94);
                  pdf.text("HungerFree Official Donation Impact Receipt", 15, 20);

                  pdf.setFontSize(10);
                  pdf.setTextColor(50, 50, 50);
                  pdf.text(`Receipt ID: ${receiptId}`, 15, 30);
                  pdf.text(`Food Item: ${d.foodType} (${d.quantity})`, 15, 38);
                  pdf.text(`Category: ${d.category} | ${d.dietaryType}`, 15, 46);
                  pdf.text(`NGO Recipient: ${metrics.ngoName}`, 15, 54);
                  pdf.text(`Address: ${metrics.ngoAddress}`, 15, 62);
                  pdf.text(`Volunteer: ${metrics.volunteerName} (${metrics.volunteerPhone})`, 15, 70);
                  pdf.text(`Impact Served: ${metrics.peopleFed}`, 15, 78);
                  pdf.text(`Expiry Date & Time: ${metrics.expiry}`, 15, 86);
                  pdf.text(`Volunteer Pickup Time: ${metrics.volunteerReceivedTime}`, 15, 94);
                  pdf.text(`NGO Delivered Time: ${metrics.deliveredTime}`, 15, 102);

                  pdf.setFontSize(9);
                  pdf.setTextColor(100, 100, 100);
                  pdf.text("Certified Surplus Food Transfer - Thank you for your generous contribution!", 15, 118);

                  pdf.save(`HungerFree_Receipt_${receiptId}.pdf`);
                  toast.success("PDF Receipt downloaded!", { id: "pdf-gen" });
                } catch {
                  toast.error("Failed to generate PDF. Please try again.", { id: "pdf-gen" });
                }
              }
            };

            const handleShareReceipt = async () => {
              const element = document.getElementById("receipt-card-printable");
              if (!element) return;
              toast.loading("Preparing receipt for sharing...", { id: "share-gen" });

              const shareSummaryText = `HungerFree Food Donation Receipt\n• Item: ${d.foodType} (${d.quantity})\n• Receipt ID: ${receiptId}\n• Impact: ${metrics.peopleFed}\n• NGO: ${metrics.ngoName}\n• Volunteer: ${metrics.volunteerName}`;

              try {
                const canvas = await html2canvas(element, {
                  scale: 2,
                  useCORS: true,
                  allowTaint: true,
                  backgroundColor: "#ffffff",
                  logging: false,
                });

                let dataUrl: string;
                try {
                  dataUrl = canvas.toDataURL("image/png");
                } catch {
                  const cleanCanvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: false,
                    allowTaint: false,
                    backgroundColor: "#ffffff",
                    ignoreElements: (el: Element) => el.tagName === "IMG",
                  });
                  dataUrl = cleanCanvas.toDataURL("image/png");
                }

                const response = await fetch(dataUrl);
                const blob = await response.blob();
                const imageFile = new File([blob], `HungerFree_Receipt_${receiptId}.png`, { type: "image/png" });

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
                  try {
                    await navigator.share({
                      title: "HungerFree Food Donation Receipt",
                      text: shareSummaryText,
                      files: [imageFile],
                    });
                    toast.success("Shared successfully!", { id: "share-gen" });
                    return;
                  } catch (e: any) {
                    if (e.name === "AbortError") {
                      toast.dismiss("share-gen");
                      return;
                    }
                  }
                }

                const link = document.createElement("a");
                link.download = `HungerFree_Receipt_${receiptId}.png`;
                link.href = dataUrl;
                link.click();
                navigator.clipboard.writeText(shareSummaryText);
                toast.success("Receipt image downloaded & summary copied to clipboard!", { id: "share-gen" });
              } catch (err) {
                console.error("Share error:", err);
                navigator.clipboard.writeText(shareSummaryText);
                toast.success("Receipt details copied to clipboard!", { id: "share-gen" });
              }
            };

            return (
              <div className="w-full h-full flex flex-col relative bg-slate-100/90 overflow-hidden text-start">
                {/* Top Fullscreen Control Bar */}
                <div className="w-full px-6 py-4 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-white/95 backdrop-blur-md z-50 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider leading-none">
                        Certificate Fullscreen Preview
                      </h3>
                      <span className="text-[10px] font-medium text-slate-500">
                        Official HungerFree Donation Impact Document
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer border border-slate-200 shadow-xs active:scale-95"
                    title="Close Fullscreen Preview"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Center Image/Certificate Lightbox Viewport */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center thin-scrollbar bg-slate-100/70">
                  <div className="w-full max-w-[760px] my-auto">
                    {/* Printable Certificate Content */}
                    <div
                      id="receipt-card-printable"
                      className="bg-white p-6 md:p-8 text-start space-y-5 rounded-2xl border border-emerald-100 shadow-2xl relative overflow-hidden text-slate-800"
                    >
                      {/* Background Glow Watermarks */}
                      <div className="absolute -top-16 -left-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                      {/* 1. Header Badge */}
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100 gap-4 pr-2">
                        <div className="flex items-center gap-3">
                          <img
                            src="/project_logo1.png"
                            alt="HungerFree Logo"
                            crossOrigin="anonymous"
                            className="h-20 md:h-24 w-auto object-contain shrink-0"
                          />
                        </div>
                        <div className="flex flex-col items-center justify-center shrink-0 text-center">
                          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#056839] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            <ShieldCheck size={14} className="text-white" />
                            <span>VERIFIED DONATION</span>
                          </div>
                          <span className="text-[9px] font-bold text-[#056839] uppercase tracking-widest mt-1.5 text-center block">
                            OFFICIAL HANDOFF CERTIFICATE
                          </span>
                        </div>
                      </div>

                      {/* 2. Main Title Banner */}
                      <div className="text-center pt-1 pb-1 space-y-1.5">
                        <h2 className="text-xl md:text-2xl font-black text-[#056839] uppercase tracking-tight">
                          DONATION IMPACT RECEIPT
                        </h2>
                        <div className="flex items-center justify-center gap-3 w-48 mx-auto opacity-70">
                          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#056839] to-transparent flex-1" />
                          <Heart size={11} className="text-[#056839] fill-[#056839]" />
                          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#056839] to-transparent flex-1" />
                        </div>
                        <p className="text-[11.5px] font-bold text-slate-600 max-w-[420px] mx-auto leading-relaxed">
                          Thank you for making a difference. Your generosity helps fight hunger and reduces food waste in our community.
                        </p>
                      </div>

                      {/* 3. Food Details Banner Card */}
                      <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-[#f3e6d3] flex items-center gap-4 text-start shadow-2xs">
                        <img
                          src={d.image || getCategoryImage(d.category)}
                          crossOrigin="anonymous"
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                          alt={d.foodType}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-base font-bold text-[#056839] truncate leading-tight mb-0.5">
                            {d.foodType}
                          </h4>
                          <p className="text-[10.5px] font-bold text-[#056839] uppercase tracking-wider mb-1.5">
                            {d.category} • {d.quantity} • {d.dietaryType}
                          </p>
                          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e8f5e9] text-[#056839] text-[10px] font-bold tracking-wide">
                            <Users size={12} />
                            <span>Serves {metrics.peopleFed}</span>
                          </span>
                        </div>
                      </div>

                      {/* 4. 2-Column Data Grid with horizontal divider lines */}
                      <div className="space-y-3.5 text-[11px] pt-1">
                        {/* Row 1: NGO Recipient & Delivery Volunteer */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3.5 border-b border-slate-100">
                          {/* NGO Recipient */}
                          <div className="flex items-start gap-3 text-start">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#056839] flex items-center justify-center shrink-0 border border-emerald-100/80">
                              <Building2 size={17} strokeWidth={2} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                                NGO RECIPIENT
                              </span>
                              <p className="font-bold text-slate-800 text-[12.5px] truncate">
                                {metrics.ngoName}
                              </p>
                              <p className="text-[10.5px] font-medium text-slate-500 leading-snug line-clamp-1">
                                {metrics.ngoAddress}
                              </p>
                            </div>
                          </div>

                          {/* Delivery Volunteer */}
                          <div className="flex items-start gap-3 text-start">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#056839] flex items-center justify-center shrink-0 border border-emerald-100/80">
                              <User size={17} strokeWidth={2} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                                  DELIVERY VOLUNTEER
                                </span>
                                {metrics.volunteerRating && (
                                  <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5">
                                    ★ {metrics.volunteerRating}
                                  </span>
                                )}
                              </div>
                              <p className="font-bold text-slate-800 text-[12.5px] truncate">
                                {metrics.volunteerName}
                              </p>
                              <p className="text-[10.5px] font-medium text-slate-500 leading-snug">
                                {metrics.volunteerPhone}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Expiry Date & Time & Fulfillment Duration */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3.5 border-b border-slate-100">
                          {/* Expiry Date & Time */}
                          <div className="flex items-start gap-3 text-start">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#056839] flex items-center justify-center shrink-0 border border-emerald-100/80">
                              <Calendar size={17} strokeWidth={2} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                                EXPIRY DATE & TIME
                              </span>
                              <p className="font-bold text-slate-800 text-[12px] mt-0.5">
                                {metrics.expiry}
                              </p>
                            </div>
                          </div>

                          {/* Fulfillment Duration */}
                          <div className="flex items-start gap-3 text-start">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#056839] flex items-center justify-center shrink-0 border border-emerald-100/80">
                              <Zap size={17} strokeWidth={2} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                                FULFILLMENT DURATION
                              </span>
                              <p className="font-bold text-slate-800 text-[12px] mt-0.5 flex items-center gap-1">
                                <Zap size={13} className="text-amber-500 fill-amber-500" />
                                <span>{metrics.hoursTakenStr}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Row 3: Volunteer Pickup Time & NGO Delivered Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Volunteer Pickup Time */}
                          <div className="flex items-start gap-3 text-start">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#056839] flex items-center justify-center shrink-0 border border-emerald-100/80">
                              <Clock size={17} strokeWidth={2} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                                VOLUNTEER PICKUP TIME
                              </span>
                              <p className="font-bold text-slate-800 text-[12px] mt-0.5">
                                {metrics.volunteerReceivedTime}
                              </p>
                            </div>
                          </div>

                          {/* NGO Delivered Time */}
                          <div className="flex items-start gap-3 text-start">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#056839] flex items-center justify-center shrink-0 border border-emerald-100/80">
                              <CheckCircle2 size={17} strokeWidth={2} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                                NGO DELIVERED TIME
                              </span>
                              <p className="font-bold text-slate-800 text-[12px] mt-0.5">
                                {metrics.deliveredTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 5. Receipt ID Banner */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#FDFCF6] via-[#FEFCF6] to-[#FEFDF7] border border-[#f3e6d3] text-center flex items-center justify-center gap-2">
                        <p className="text-[12px] font-bold text-[#785B37] tracking-wide">
                          Receipt ID: <span className="font-mono text-[#785B37] font-bold">{receiptId}</span>
                        </p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(receiptId);
                            toast.success("Receipt ID copied!");
                          }}
                          className="p-1 hover:bg-amber-100/50 rounded-md transition-colors cursor-pointer"
                          title="Copy Receipt ID"
                        >
                          <Copy size={12} className="text-[#785B37]" />
                        </button>
                      </div>

                      {/* 6. Impact Handoff Certification */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F1F5EC] via-[#FAFCF8] to-[#F8FAF5] border border-[#d8edd9] flex items-center gap-3.5 text-start">
                        <Heart size={20} className="text-[#5C9777] fill-[#5C9777]/20 shrink-0" />
                        <p className="text-[11.5px] font-bold text-[#5C9777] leading-snug">
                          Thank you for your generosity! This donation fed <strong>{metrics.peopleFed}</strong> in collaboration with <strong>{metrics.ngoName}</strong>{metrics.volunteerName !== "Not Assigned" ? ` and volunteer ${metrics.volunteerName}` : ""}.
                        </p>
                      </div>

                      {/* 7. Signature, Seal Stamp, & Verification QR Code */}
                      <div className="pt-4 pb-2 px-1 border-t border-slate-100 grid grid-cols-3 items-center justify-between gap-4 text-center">
                        {/* Left: Full Official Signature Logo (No redundant text below) */}
                        <div className="flex flex-col items-start text-start justify-center">
                          <img
                            src="/hunger_free sign.png"
                            alt="HungerFree Official Signature"
                            crossOrigin="anonymous"
                            className="h-16 md:h-20 w-auto object-contain"
                          />
                        </div>

                        {/* Center: Official Seal Stamp Image */}
                        <div className="flex justify-center items-center">
                          <img
                            src="/stamp.png"
                            alt="Official HungerFree Stamp"
                            crossOrigin="anonymous"
                            className="h-20 w-auto object-contain"
                          />
                        </div>

                        {/* Right: QR Code (Centered with text) */}
                        <div className="flex flex-col items-center justify-center text-center ml-auto">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://hungerfree.org/verify?receipt=${receiptId}`)}`}
                            alt="Verification QR Code"
                            crossOrigin="anonymous"
                            className="w-16 h-16 rounded-xl border border-slate-200 p-1 bg-white shadow-2xs mx-auto"
                          />
                          <span className="text-[8.5px] font-bold text-slate-400 mt-1 text-center block">
                            Scan to verify this receipt
                          </span>
                        </div>
                      </div>

                      {/* 8. Bottom Brand Dark Green Footer Bar */}
                      <div className="-mx-6 md:-mx-8 -mb-6 md:-mb-8 mt-6 px-6 md:px-8 py-3.5 bg-[#056839] text-white flex items-center justify-between text-[10.5px] font-bold rounded-b-2xl shadow-xs">
                        <div className="flex items-center gap-2">
                          <Globe size={13} className="text-emerald-300 shrink-0" />
                          <span>www.hungerfree.online</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="text-emerald-300 shrink-0" />
                          <span>immanvj077@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={13} className="text-emerald-300 shrink-0" />
                          <span>+91 8248754186</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Floating Action Bar */}
                <div className="w-full p-4 md:px-8 border-t border-slate-200/80 bg-white/95 backdrop-blur-md shrink-0 flex justify-center z-50 shadow-xs">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-[500px]">
                    <button
                      onClick={handleDownloadPdf}
                      className="w-full py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-900 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Download size={15} />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={handleShareReceipt}
                      className="w-full py-3.5 rounded-xl bg-[#056839] hover:bg-[#04522d] text-white shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
                    >
                      <Share2 size={15} />
                      <span>Share (PNG/PDF)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
};
