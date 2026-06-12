import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  ChevronLeft,
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
} from "lucide-react";
import { Modal, ModalContent } from "@heroui/react";
import ResuableDrawer from "../../../../global/components/resuable-components/drawer";
import ImpactCards from "../../../../global/components/resuable-components/ImpactCards";
import { useDonorDonations } from "../hooks/useDonorDonations";
import type { DonationDetail } from "../../store/donor-schemas";
import { useDonorStore } from "../../store/donor-store";
import { toast } from "sonner";
import { LiveGPSMap } from "./LiveGPSMap";
import { getCategoryImage } from "../../../../global/constants/donation_config";

const MyDonations = () => {
  const navigate = useNavigate();
  const { donationHistory, donationStats, verifyPickup, cancelDonation, deleteDonation, refreshData } = useDonorDonations();
  const [selectedDonation, setSelectedDonation] =
    useState<DonationDetail | null>(null);
  const [isGeneralDetailsOpen, setIsGeneralDetailsOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingDonationId, setCancellingDonationId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  
  // Redonate Modal States
  const [isRedonateModalOpen, setIsRedonateModalOpen] = useState(false);
  const [redonateDonation, setRedonateDonation] = useState<DonationDetail | null>(null);

  const confirmRedonate = () => {
    if (!redonateDonation) return;
    setIsRedonateModalOpen(false);
    useDonorStore.getState().setRedonatePayload(redonateDonation);
    navigate("/donor/donations/create");
    setRedonateDonation(null);
  };

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDonationId, setDeletingDonationId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Receipt Modal States
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptDonation, setReceiptDonation] = useState<DonationDetail | null>(null);

  // OTP Verification States for 6-digit inputs
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpDigitChange = (val: string, index: number) => {
    const cleanVal = val.replace(/\D/g, "");
    if (!cleanVal) {
      const newDigits = [...otpDigits];
      newDigits[index] = "";
      setOtpDigits(newDigits);
      setOtpValue(newDigits.join(""));
      return;
    }

    const digit = cleanVal.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpValue(newDigits.join(""));

    // Move to next input
    if (index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0 && otpRefs.current[index - 1]) {
        const newDigits = [...otpDigits];
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
        setOtpValue(newDigits.join(""));
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasteData.length === 6) {
      const newDigits = pasteData.split("");
      setOtpDigits(newDigits);
      setOtpValue(pasteData);
      otpRefs.current[5]?.focus();
    }
  };

  const handleOtpFocus = (index: number) => {
    const firstEmptyIndex = otpRefs.current.findIndex((ref) => ref && ref.value === "");
    if (firstEmptyIndex !== -1 && index > firstEmptyIndex) {
      otpRefs.current[firstEmptyIndex]?.focus();
    }
  };

  const confirmDelete = async () => {
    if (!deletingDonationId) return;
    setIsDeleting(true);
    const result = await deleteDonation(deletingDonationId, statusFilter);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setDeletingDonationId(null);
    if (result.success) {
      toast.success("Food donation deleted successfully.");
    } else {
      toast.error("Failed to delete donation. Please try again.");
    }
  };

  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

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
  }, [donationHistory]);

  useEffect(() => {
    refreshData(statusFilter, sortOrder);
  }, [statusFilter, sortOrder]);

  // Keep selectedDonation in sync with refreshed donationHistory data (for live GPS coordinate updates)
  useEffect(() => {
    if ((isGeneralDetailsOpen || isDetailsModalOpen || isTrackingModalOpen) && selectedDonation) {
      const updated = donationHistory.find(d => String(d.id) === String(selectedDonation.id));
      if (updated) {
        setSelectedDonation(updated);
      }
    }
  }, [donationHistory, isGeneralDetailsOpen, isDetailsModalOpen, isTrackingModalOpen]);

  // Auto-refresh donation details for active tracking every 5 seconds when tracking drawer is open
  useEffect(() => {
    let intervalId: any;
    if (isTrackingModalOpen && selectedDonation && (selectedDonation.status === "ASSIGNED" || selectedDonation.status === "PICKED_UP")) {
      intervalId = setInterval(() => {
        refreshData(statusFilter, sortOrder);
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTrackingModalOpen, selectedDonation, statusFilter, sortOrder]);

  const handleDetailsClick = (donation: DonationDetail) => {
    setSelectedDonation(donation);
    setOtpValue("");
    setOtpDigits(Array(6).fill(""));
    setOtpError("");
    if (donation.status === "ASSIGNED") {
      setIsDetailsModalOpen(true);
    } else {
      setIsGeneralDetailsOpen(true);
    }
  };

  const handleLiveTrackClick = (donation: DonationDetail) => {
    if (donation.status !== "ASSIGNED") return;
    setSelectedDonation(donation);
    setIsTrackingModalOpen(true);
  };
  const handleCancelClick = async (donationId: string, status?: string) => {
    if (status && status !== "PENDING") {
      toast.error("Only pending food donations can be cancelled.");
      return;
    }
    setCancellingDonationId(donationId);
    setCancelReason("");
    setIsCancelModalOpen(true);
  };

  const confirmCancellation = async () => {
    if (!cancellingDonationId) return;
    setIsCancelModalOpen(false);
    setCancellingId(cancellingDonationId);
    const result = await cancelDonation(cancellingDonationId, cancelReason, statusFilter);
    setCancellingId(null);
    setCancellingDonationId(null);
    if (result.success) {
      toast.success("Food donation cancelled successfully.");
    } else {
      toast.error("Failed to cancel donation. Please try again.");
    }
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setCancellingDonationId(null);
  };

  const onOtpSubmit = async () => {
    if (!selectedDonation || otpValue.length !== 6) return;
    setIsVerifying(true);
    setOtpError("");
    const result = await verifyPickup(String(selectedDonation.id), otpValue, statusFilter);
    if (result.success) {
      setIsDetailsModalOpen(false);
      setIsTrackingModalOpen(false);
      setOtpValue("");
    } else {
      setOtpError("Invalid verification code. Please try again.");
    }
    setIsVerifying(false);
  };

  return (
    <div className="w-full min-h-full flex flex-col space-y-6 max-w-[1600px] mx-auto p-6 md:p-10 bg-transparent pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0 mb-8">
        <div className="text-start space-y-2">
          <h1
            className="text-4xl md:text-5xl font-black tracking-tighter leading-none flex items-center"
            style={{ color: "var(--text-primary)" }}
          >
            <span className="mr-3">
              <span className="relative">
                M
                <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#22c55e] rounded-full opacity-80" />
              </span>
              y
            </span>
            <span className="relative mr-12 md:mr-14">
              Donations
              <img
                src="/heart_dec1.png"
                className="absolute left-full -bottom-1 w-12 h-auto md:w-14 animate-in fade-in zoom-in duration-700"
                alt="Heart Decoration"
              />
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <p
              className="text-[12px] md:text-[13px] mt-1 font-medium tracking-normal opacity-60"
              style={{ color: "var(--text-secondary)" }}
            >
              Track and manage your community contributions
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/donor/donations/create")}
          className="group relative w-full sm:w-auto px-7 py-3 bg-[#22c55e] text-white rounded-2xl text-[13px] md:text-[14px] font-bold hover:bg-[#16a34a] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-green-500/20 shrink-0"
        >
          {/* Decorative Sparks Left */}
          <img
            src="/btn_style_left1.png"
            className="absolute -top-4 -left-4 w-6 h-auto pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 md:opacity-100"
            alt="Decoration Left"
          />

          {/* Decorative Sparks Right */}
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
      </div>

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
            // Only counts donations that have successfully been DELIVERED
            val: ((donationStats?.completedCount || 0) * 15).toString(), 
            trend: "Delivered",
            color: "#3b82f6",
            icon: Users,
          },
          {
            label: "Food Saved",
            // Only counts DELIVERED food. Estimates 10.5kg of CO2 prevented per successful delivery
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

      <div className="w-full space-y-8">
        {/* Recent Contributions Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="relative">
              <h2 className="text-[13px] font-black uppercase tracking-[0.3em] text-[#22c55e]">
                Recent Contributions
              </h2>
              <div className="absolute -bottom-2 left-0 w-8 h-[3px] bg-[#22c55e] rounded-full" />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative group w-full md:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 rounded-xl px-5 py-2.5 pr-10 text-[11px] font-bold uppercase tracking-wider text-slate-600 outline-none hover:border-emerald-200 transition-all cursor-pointer w-full"
                >
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Assigned</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-emerald-500 transition-colors"
                  size={14}
                />
              </div>
              <div className="relative w-full md:w-auto">
                {/* Trigger Button */}
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="bg-white border border-slate-200 hover:border-emerald-500 rounded-xl px-5 py-2.5 flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-600 transition-all cursor-pointer w-full md:w-[160px] outline-none"
                >
                  <span>{sortOrder}</span>
                  <ChevronDown
                    className={`text-slate-400 transition-transform duration-300 ${isSortDropdownOpen ? 'rotate-180 text-emerald-500' : ''}`}
                    size={14}
                  />
                </button>

                {/* Dropdown Options Menu */}
                {isSortDropdownOpen && (
                  <>
                    {/* Transparent Click-outside Overlay */}
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setIsSortDropdownOpen(false)} 
                    />
                    
                    {/* Dropdown Box */}
                    <div className="absolute right-0 top-full mt-1.5 w-full md:w-[160px] bg-white border border-slate-200 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {[
                        { label: "Newest First", value: "Newest First" },
                        { label: "Oldest First", value: "Oldest First" }
                      ].map((opt) => {
                        const isSelected = sortOrder === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSortOrder(opt.value);
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-left transition-all ${
                              isSelected 
                                ? "bg-[#1976d2] text-white font-black" 
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
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const container =
                      sliderRef.current ||
                      document.querySelector(".donation-history-slider");
                    if (container)
                      container.scrollBy({ left: -420, behavior: "smooth" });
                  }}
                  className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-[0_12px_40px_rgba(34,197,94,0.15)] border-2 border-emerald-100 flex items-center justify-center text-[#22c55e] z-[100] hover:text-white hover:bg-[#22c55e] transition-all cursor-pointer group/arrow active:scale-90"
                >
                  <ChevronLeft
                    size={32}
                    className="transition-transform group-hover/arrow:-translate-x-1"
                    strokeWidth={3}
                  />
                </motion.button>
              )}
            </AnimatePresence>

            <div
              ref={sliderRef}
              onScroll={checkScroll}
              className="donation-history-slider flex overflow-x-auto no-scrollbar gap-6 pb-6"
            >
              {(() => {
                const filtered = (donationHistory || [])
                  .sort((a: DonationDetail, b: DonationDetail) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    return sortOrder === "Newest First"
                      ? dateB - dateA
                      : dateA - dateB;
                  });

                return filtered.length > 0 ? (
                  filtered.map((donation: DonationDetail) => (
                    <div
                      key={donation.id}
                      className={`flex-shrink-0 w-full sm:w-[380px] border rounded-[2.5rem] p-4 transition-all duration-300 group/card relative shadow-sm hover:shadow-xl ${
                        donation.status === "PENDING" ? "border-orange-100/50" :
                        donation.status === "ACCEPTED" ? "border-blue-100/50" :
                        donation.status === "DELIVERED" ? "border-emerald-100/50 bg-[#fcfdfc]" :
                        donation.status === "CANCELLED" ? "border-rose-100 bg-[#fffcfc]" :
                        "border-slate-100 hover:border-emerald-100"
                      }`}
                    >
                      {/* Top Info - Theme Driven */}
                      <div className="flex justify-between items-center mb-3 px-1">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          donation.status === "PENDING" ? "bg-orange-50 text-orange-600" :
                          donation.status === "ACCEPTED" ? "bg-blue-50 text-blue-600" :
                          donation.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700" :
                          donation.status === "CANCELLED" ? "bg-rose-50 text-rose-500" :
                          "bg-emerald-50 text-emerald-600"
                        }`}>
                          {donation.status === "PENDING" ? <Clock size={12} strokeWidth={3} /> :
                           donation.status === "ACCEPTED" ? <CheckCircle2 size={12} strokeWidth={3} /> :
                           donation.status === "DELIVERED" ? <CheckCircle2 size={12} strokeWidth={3} /> :
                           donation.status === "CANCELLED" ? <XCircle size={12} strokeWidth={3} /> :
                           <User size={12} strokeWidth={3} />}
                          <span>{donation.status}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {donation.date}
                        </span>
                      </div>

                      {/* Image Hub - Theme Driven */}
                      <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-4 shadow-sm">
                        <img
                          src={
                            donation.image || 
                            getCategoryImage(donation.category)
                          }
                          className={`w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 ${
                            donation.status === "DELIVERED" ? "saturate-[0.8] opacity-95" : 
                            donation.status === "CANCELLED" ? "saturate-[0.4] opacity-80" : ""
                          }`}
                          alt={donation.foodType}
                        />
                        {/* Floating Status Icon - Hub Style */}
                        <div className={`absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border border-white/50 ${
                          donation.status === "PENDING" ? "text-orange-500" :
                          donation.status === "ACCEPTED" ? "text-blue-600" :
                          donation.status === "CANCELLED" ? "text-rose-500 border-rose-100" :
                          "text-[#22c55e]"
                        }`}>
                          {donation.status === "PENDING" ? <Hourglass size={20} strokeWidth={2.5} /> :
                           donation.status === "ACCEPTED" ? <ShieldCheck size={20} strokeWidth={2.5} /> :
                           donation.status === "DELIVERED" ? <CheckCircle2 size={20} strokeWidth={2.5} /> :
                           donation.status === "CANCELLED" ? <XCircle size={20} strokeWidth={2.5} /> :
                           <ShieldCheck size={20} strokeWidth={2.5} />}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="px-1 space-y-4 mb-4">
                        <div className="space-y-1">
                          <h3 className={`text-[24px] font-black tracking-tight leading-none ${
                            donation.status === "DELIVERED" ? "text-slate-700" : "text-slate-800"
                          }`}>
                            {donation.foodType}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest">
                              {donation.category}
                            </span>
                          </div>
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            {donation.quantity} • {donation.dietaryType} • {donation.preparationType}
                          </p>
                        </div>

                        {/* Status Specific Info Lines */}
                        <div className="space-y-3.5">
                          {/* NGO Line */}
                          <div className="flex items-start gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              donation.status === "PENDING" ? "bg-orange-50 text-orange-500" :
                              donation.status === "ACCEPTED" ? "bg-blue-50 text-blue-500" :
                              donation.status === "CANCELLED" ? "bg-orange-50 text-orange-500" :
                              "bg-emerald-50 text-emerald-600"
                            }`}>
                              <MapPin size={16} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[14px] font-bold text-slate-700">
                                {donation.status === "PENDING" ? "Matching nearby NGOs..." : 
                                 donation.status === "CANCELLED" ? "No match found" : 
                                 donation.ngo}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">
                                {donation.status === "PENDING" ? "Searching for the best match" :
                                 donation.status === "ACCEPTED" ? "NGO has accepted your donation" :
                                 donation.status === "CANCELLED" ? "The donation has been cancelled and is no longer active." :
                                 donation.status === "DELIVERED" ? "Donation received successfully" : "Pickup in progress"}
                              </span>
                            </div>
                          </div>

                          {/* Date/Time Line */}
                          <div className="flex items-start gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              donation.status === "PENDING" ? "bg-orange-50 text-orange-500" :
                              donation.status === "ACCEPTED" ? "bg-blue-50 text-blue-500" :
                              donation.status === "CANCELLED" ? "bg-orange-50 text-orange-500" :
                              "bg-emerald-50 text-emerald-600"
                            }`}>
                              <Clock size={16} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-[14px] font-bold ${donation.status === "CANCELLED" ? "line-through text-slate-400 font-medium" : "text-slate-700"}`}>
                                {donation.date}, {donation.status === "DELIVERED" ? "6:25 PM" : "6:00 PM - 7:00 PM"}
                              </span>
                            </div>
                          </div>

                          {/* Extra Status Rows (Volunteer / Delivery Team) */}
                          {donation.status === "DELIVERED" ? (
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <User size={16} strokeWidth={2.5} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400">Received by</span>
                                <span className="text-[14px] font-bold text-slate-700">{donation.ngo} Team</span>
                              </div>
                            </div>
                          ) : null}

                          {/* Green Leaf Thank You Banner for CANCELLED Orders */}
                          {donation.status === "CANCELLED" && (
                            <div className="p-3 bg-emerald-50/30 border border-emerald-100/30 rounded-[1.5rem] flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#22c55e] shadow-sm shrink-0 border border-emerald-50">
                                <Leaf size={16} strokeWidth={2.5} />
                              </div>
                              <div className="flex flex-col text-start">
                                <span className="text-[11px] font-black text-emerald-800">Thank you for thinking to share!</span>
                                <span className="text-[9px] font-bold text-slate-400 leading-tight">Your intent to reduce food waste makes a big difference.</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Banners */}
                        {donation.status === "PENDING" ? (
                          <div className="p-3 bg-orange-50/50 border border-orange-100/50 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                              <Search size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black text-orange-600">We are finding the best NGO</span>
                              <span className="text-[9px] font-bold text-slate-400">Estimated acceptance in 10-15 min</span>
                            </div>
                          </div>
                        ) : donation.status === "CANCELLED" ? (
                          <div className="p-3 bg-rose-50/50 border border-rose-100/50 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm shrink-0 border border-rose-100/50">
                              <XCircle size={16} />
                            </div>
                            <div className="flex flex-col text-start">
                              <span className="text-[11px] font-black text-rose-600">Donation Cancelled</span>
                              <span className="text-[9px] font-bold text-slate-400">This donation has been cancelled.</span>
                            </div>
                          </div>
                        ) : donation.status === "ACCEPTED" ? (
                          <div className="p-3 bg-blue-50/50 border border-blue-100/50 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                              <Truck size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black text-blue-600">Preparing for pickup</span>
                              <span className="text-[9px] font-bold text-slate-400">NGO is arranging a volunteer</span>
                            </div>
                          </div>
                        ) : donation.status === "DELIVERED" ? (
                          <div className="p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                              <Heart size={16} fill="currentColor" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black text-emerald-600">Thank you!</span>
                              <span className="text-[9px] font-bold text-slate-400">Your donation will feed many in need 🎉</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                                <Truck size={16} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-black text-emerald-600">Volunteer on the way</span>
                                <span className="text-[9px] font-bold text-slate-400">ETA: 20 mins • 2.4 km away</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-full shadow-sm border border-emerald-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[8px] font-black uppercase text-emerald-600 tracking-tighter">Live</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Footer Actions & Stats - Theme Driven */}
                      <div className="pt-4 border-t border-slate-100/50 space-y-4">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => handleDetailsClick(donation)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-2xl bg-slate-50 text-slate-500 border border-slate-200/50 hover:bg-slate-100 transition-all text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                          >
                            <Info size={14} />
                            <span>View Details</span>
                          </button>

                          {donation.status === "DELIVERED" ? (
                            <button
                              onClick={() => {
                                setReceiptDonation(donation);
                                setIsReceiptModalOpen(true);
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
                                  setDeletingDonationId(String(donation.id));
                                  setIsDeleteModalOpen(true);
                                }}
                                className="flex-[0.35] flex items-center justify-center gap-2 px-3 py-3 rounded-2xl bg-red-50 text-red-500 border border-red-200/50 hover:bg-red-100 transition-all text-[10px] font-black uppercase tracking-wider"
                              >
                                <Trash2 size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  setRedonateDonation(donation);
                                  setIsRedonateModalOpen(true);
                                }}
                                className="flex-[1.2] flex items-center justify-center gap-2 px-3 py-3 rounded-2xl font-black uppercase tracking-wider text-[10px] bg-[#ff6f00] hover:bg-[#e65100] transition-all active:scale-95 shadow-md shadow-orange-500/20 text-white whitespace-nowrap"
                              >
                                <RotateCcw size={14} className="stroke-[2.5]" />
                                <span>Redonate</span>
                              </button>
                            </>
                          ) : donation.status === "ASSIGNED" ? (
                            <button
                              onClick={() => {
                                handleLiveTrackClick(donation);
                              }}
                              className="flex-[1.2] flex items-center justify-center gap-2 px-3 py-3 rounded-2xl font-black uppercase tracking-wider text-[10px] transition-all active:scale-95 shadow-md whitespace-nowrap text-white bg-[#2e7d32] hover:bg-[#1b5e20]"
                            >
                              Live Track
                            </button>
                          ) : donation.status === "PENDING" ? (
                            <button
                              onClick={() => handleCancelClick(String(donation.id), donation.status)}
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
                  ))
                ) : null;
              })()}
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
                  whileTap={{ scale: 0.8 }}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    const container =
                      sliderRef.current ||
                      (document.querySelector(".donation-history-slider") as HTMLElement);
                    if (container)
                      container.scrollBy({ left: 420, behavior: "smooth" });
                  }}
                  className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-[0_12px_40px_rgba(34,197,94,0.15)] border-2 border-emerald-100 flex items-center justify-center text-[#22c55e] z-[100] hover:text-white hover:bg-[#22c55e] transition-all cursor-pointer group/arrow active:scale-90"
                >
                  <ChevronRight
                    size={32}
                    className="transition-transform group-hover/arrow:translate-x-1"
                    strokeWidth={3}
                  />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Empty State Illustration (Only if history is empty) */}
        {donationHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center justify-center rounded-[24px] border border-slate-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-8 md:p-12 relative overflow-hidden group"
          >
            {/* Subtle Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-green-50/20 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Illustration */}
              <div className="relative w-56 h-40 md:w-64 md:h-48 mb-4">
                <img
                  src="/no_donation.png"
                  alt="No Donations"
                  className="w-full h-full object-contain opacity-90"
                />
              </div>

              {/* Content */}
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

      {/* General Details Drawer for non-assigned cards */}
      <ResuableDrawer
        isOpen={isGeneralDetailsOpen}
        onClose={() => setIsGeneralDetailsOpen(false)}
        title="Donation Details"
        subtitle={
          <span className="block text-slate-400 mt-1 break-all">
            Tracking ID: <span className="text-[#22c55e] font-bold">#DON-{selectedDonation?.id}</span>
          </span>
        }
        size="md"
      >
        {selectedDonation ? (
          <div className="space-y-5 p-6 bg-white">
            <div className="relative rounded-3xl overflow-hidden shadow-lg min-h-[220px] bg-slate-950">
              <img
                src={selectedDonation.image || getCategoryImage(selectedDonation.category)}
                className="absolute inset-0 w-full h-full object-cover"
                alt={selectedDonation.foodType}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/45 to-transparent" />
              <div className="relative z-10 min-h-[220px] p-6 flex flex-col justify-end">
                <span className="w-fit px-2.5 py-1 rounded-full bg-white/90 text-emerald-700 text-[9px] font-black uppercase tracking-widest mb-3">
                  {selectedDonation.status}
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
                  {selectedDonation.foodType}
                </h3>
                <p className="text-[11px] font-black text-slate-200 uppercase tracking-[0.18em] mt-2">
                  {selectedDonation.quantity} - {selectedDonation.dietaryType} - {selectedDonation.preparationType}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin size={17} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">NGO / Location</p>
                  <p className="text-[13px] font-bold text-slate-800">{selectedDonation.ngo || "Matching in progress"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock size={17} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Pickup Window</p>
                  <p className="text-[13px] font-bold text-slate-800">{selectedDonation.date}, 6:00 PM - 7:00 PM</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-700">Recent Updates</h4>
              {(selectedDonation.timeline || []).map((step, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[12px] font-black text-slate-800 truncate">{step.status}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate">{step.date}, {step.time}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${step.completed ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
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
        onClose={() => setIsDetailsModalOpen(false)}
        title="Donation Details"
        subtitle={
          <span className="block text-slate-400 mt-1 break-all">
            Tracking ID: <span className="text-[#22c55e] font-bold">#DON-{selectedDonation?.id}</span>
          </span>
        }
        size="md"
      >
          {selectedDonation ? (
            (() => {
            if (!selectedDonation) return null;
            const d = selectedDonation;

            return (
              <div className="space-y-5 p-6 bg-white">
                <div className="relative rounded-3xl overflow-hidden shadow-lg min-h-[220px] bg-slate-950">
                  <img
                    src={d.image || getCategoryImage(d.category)}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={d.foodType}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/45 to-transparent" />
                  <div className="relative z-10 min-h-[220px] p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 text-emerald-700 text-[9px] font-black uppercase tracking-widest">
                        {d.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest">
                        {d.status}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
                      {d.foodType}
                    </h3>
                    <p className="text-[11px] font-black text-slate-200 uppercase tracking-[0.18em] mt-2">
                      {d.quantity} - {d.dietaryType} - {d.preparationType}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <MapPin size={17} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">NGO</p>
                        <p className="text-[13px] font-bold text-slate-800 truncate">{d.ngo || "Matching in progress"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Clock size={17} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Pickup Window</p>
                        <p className="text-[13px] font-bold text-slate-800 truncate">{d.date}, 6:00 PM - 7:00 PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Volunteer Row */}
                  {(d.volunteer || d.status === "ASSIGNED" || d.status === "PICKED_UP") && (
                    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center overflow-hidden border border-[#f1f5f9] shrink-0">
                          <svg className="w-10 h-10 text-[#10b981] translate-y-1.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                        <div className="flex flex-col text-start">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-0.5">
                            Volunteer
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-black text-slate-700">
                              {d.volunteer?.name || "Assigning..."}
                            </span>
                            {d.volunteer?.name && (
                              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#e8fcf0] text-[#10b981] text-[8px] font-black uppercase tracking-wider border border-[#d1fae5]">
                                Verified ✓
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (d.volunteer?.phone) {
                            window.location.href = `tel:${d.volunteer.phone}`;
                          } else {
                            toast.info("Volunteer phone number is not available yet.");
                          }
                        }}
                        className="w-11 h-11 rounded-full bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center shadow-md shadow-emerald-500/10 active:scale-90 transition-all cursor-pointer shrink-0"
                      >
                        <Phone size={15} fill="currentColor" />
                      </button>
                    </div>
                  )}

                  {d.status === "ASSIGNED" && (
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

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              Enter verification code
                            </label>
                            <span className="text-[10px] font-black text-slate-400 tracking-wider">OTP</span>
                          </div>
                          
                          {/* 6 Digit Individual Inputs */}
                          <div className="flex gap-2 justify-between items-center py-1">
                             {otpDigits.map((digit, index) => (
                              <input
                                key={index}
                                ref={(el) => {
                                  otpRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpDigitChange(e.target.value, index)}
                                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                onFocus={() => handleOtpFocus(index)}
                                onPaste={index === 0 ? handleOtpPaste : undefined}
                                autoFocus={index === 0}
                                className="w-10 h-12 sm:w-12 sm:h-14 rounded-2xl bg-white border border-slate-200 focus:border-[#10b981] outline-none text-center text-lg sm:text-xl font-black text-slate-800 transition-all shadow-sm focus:ring-4 focus:ring-emerald-500/10"
                                placeholder="0"
                              />
                            ))}
                          </div>
                        </div>

                        {otpError && (
                          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-center">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{otpError}</p>
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

                      {/* Encouragement bottom banner card */}
                      <div className="p-4 rounded-2xl bg-emerald-50/20 border border-emerald-100/30 flex items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/30 shrink-0">
                            <ShieldCheck size={17} strokeWidth={2.2} />
                          </div>
                          <div className="text-start leading-tight">
                            <p className="text-[12.5px] font-black text-slate-800 tracking-tight">Your donation makes a difference!</p>
                            <p className="text-[10.5px] font-bold text-slate-400">Thank you for helping build a better tomorrow.</p>
                          </div>
                        </div>
                        <div className="relative shrink-0 text-emerald-500 animate-[pulse_2s_infinite] mr-1 flex items-center">
                          <Heart size={18} fill="currentColor" />
                          <span className="absolute -top-1 -right-1 text-[8px] animate-pulse">✨</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        ) : null}
      </ResuableDrawer>

      {/* Live Tracking Modal */}
      <ResuableDrawer
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        title="Donation Details"
        subtitle={
          <span className="block text-slate-400 mt-1 break-all">
            Tracking ID: <span className="text-[#22c55e] font-bold">#DON-{selectedDonation?.id}</span>
          </span>
        }
        size="md"
      >
        {selectedDonation ? (
          (() => {
            const d = selectedDonation!;
            const lastCompletedIdx = [...d.timeline].reverse().findIndex(s => s.completed);
            const currentActiveIdx = lastCompletedIdx !== -1 ? (d.timeline.length - 1 - lastCompletedIdx) : 0;
            return (
              <div className="space-y-5 p-6 bg-white">


                <div className="space-y-5">

                  {/* GPS Route Map Tracker */}
                  {(d.status === "ASSIGNED" || d.status === "PICKED_UP") && (
                    <div className="space-y-3">
                      <LiveGPSMap
                        pickupCoords={d.pickupCoords}
                        deliveryCoords={d.deliveryCoords}
                        volunteerLocation={d.volunteerLocation}
                        volunteerName={d.volunteer?.name}
                      />
                      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm">
                        {[
                          { label: "Volunteer", value: d.volunteer?.name || "Assigned", icon: User },
                          { label: "ETA", value: "20 mins", icon: Clock },
                          { label: "Distance", value: "2.4 km", icon: MapPin },
                          { label: "Status", value: "On the way", icon: Truck },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <div key={item.label} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 min-w-0">
                              <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center shrink-0 border border-emerald-100/40">
                                <Icon size={18} strokeWidth={2.2} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">{item.label}</p>
                                <p className="text-[13px] font-black text-slate-700 truncate leading-none">{item.value}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recent Updates Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-[#22c55e] border border-emerald-100/40 shrink-0">
                          <LayoutList size={16} strokeWidth={2.5} />
                        </div>
                        <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-700">
                          Live Trip Progress
                        </h4>
                      </div>
                    </div>

                    <div className="relative space-y-0 px-1">
                      {d.timeline.map((step, idx) => {
                        const isCurrent = idx === currentActiveIdx;
                        const isPast = idx < currentActiveIdx;

                        return (
                          <div key={idx} className="relative flex items-start gap-4 group/step pb-6 last:pb-0">
                            {/* Segment Line (Centered under the circle) */}
                            {idx < d.timeline.length - 1 && (
                              <div className={`absolute top-[46px] w-[2px] z-0 transition-colors duration-300 ${
                                isPast || step.completed
                                  ? "bg-emerald-500"
                                  : "border-l-2 border-dashed border-slate-200"
                              }`} style={{ left: "12px", transform: "translateX(-50%)", bottom: "-22px" }} />
                            )}

                            {/* Left Indicator Column */}
                            <div className="relative flex flex-col items-center shrink-0 pt-[22px] w-6 z-10">
                              {/* Circle */}
                              <div className={`relative z-10 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center shadow-sm shrink-0 transition-all duration-300 ${
                                isCurrent
                                  ? "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] bg-emerald-50"
                                  : isPast
                                    ? "border-emerald-500 bg-emerald-50"
                                    : "border-slate-200 bg-white"
                              }`}>
                                {isCurrent ? (
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                ) : isPast ? (
                                  <Check className="w-3 text-emerald-500 stroke-[3.5]" />
                                ) : (
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                )}
                              </div>
                            </div>

                            {/* Card Content */}
                            <div className={`flex-1 p-3.5 rounded-xl border flex items-start gap-4 min-w-0 transition-all duration-300 ${
                              isCurrent
                                ? "bg-emerald-50/25 border-emerald-500/35 shadow-md shadow-emerald-500/5 hover:bg-emerald-50/30"
                                : isPast
                                  ? "bg-slate-50/50 border-slate-100/50 hover:bg-white hover:border-slate-200/60 opacity-80"
                                  : "bg-slate-50/10 border-slate-100 border-dashed opacity-25"
                            }`}>
                              <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border shadow-sm transition-all duration-300 ${
                                isCurrent
                                  ? "text-emerald-500 border-emerald-200 bg-emerald-50/10 shadow-emerald-500/5"
                                  : isPast
                                    ? "text-emerald-600 border-emerald-100"
                                    : "text-slate-300 border-slate-100"
                              }`}>
                                {step.status.toLowerCase().includes("pickup") || step.status.toLowerCase().includes("picked") ? (
                                  <ShoppingBag size={18} />
                                ) : step.status.toLowerCase().includes("delivered") ? (
                                  <CheckCircle2 size={18} />
                                ) : step.status.toLowerCase().includes("assigned") ? (
                                  <User size={18} />
                                ) : (
                                  <Clock size={18} />
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0 pt-0.5">
                                <p className={`text-[13.5px] font-bold tracking-tight truncate transition-all duration-300 ${
                                  isCurrent
                                    ? "text-emerald-700 font-black"
                                    : isPast
                                      ? "text-slate-800"
                                      : "text-slate-400"
                                }`}>
                                  {step.status}
                                </p>
                                {step.description && (
                                  <p className={`text-[11px] font-medium mt-0.5 line-clamp-2 leading-relaxed transition-all duration-300 ${
                                    isCurrent
                                      ? "text-slate-600 font-semibold"
                                      : isPast
                                        ? "text-slate-500"
                                        : "text-slate-400/70"
                                  }`}>
                                    {step.description}
                                  </p>
                                )}
                                <p className="text-[10px] font-bold text-slate-400 mt-1">
                                  {step.date}, {step.time}
                                </p>
                              </div>

                              <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase border shadow-sm shrink-0 whitespace-nowrap transition-all duration-300 mt-1 ${
                                isCurrent
                                  ? "bg-emerald-500 text-white border-emerald-400"
                                  : isPast
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    : "bg-slate-50 text-slate-400 border-slate-100"
                              }`}>
                                {isCurrent ? "Active" : isPast ? "Completed" : "Pending"}
                              </div>
                            </div>
                          </div>
                        );
                      })}


                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {/* <button
                      onClick={() => {
                        setIsTrackingModalOpen(false);
                        handleDetailsClick(d);
                      }}
                      className="w-full py-4 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider active:scale-95 transition-all"
                    >
                      <Info size={15} />
                      <span>View Details</span>
                    </button> */}
                  </div>

                </div>
              </div>
            );
          })()
        ) : null}
      </ResuableDrawer>

      {/* Premium Cancellation Confirmation Modal */}
      <Modal 
        isOpen={isCancelModalOpen} 
        onOpenChange={setIsCancelModalOpen}
        size="md"
        backdrop="blur"
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-slate-900/60 backdrop-blur-sm",
          base: "bg-transparent shadow-none border-none outline-none",
          body: "p-0",
          wrapper: "z-[9999]"
        }}
      >
        <ModalContent className="bg-transparent border-none outline-none shadow-none ring-0 p-0">
          {() => (
            <div className="bg-white w-full max-w-[390px] rounded-[2rem] p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100/50 flex flex-col items-center relative overflow-visible">
              {/* Close Button Top Right */}
              <button 
                onClick={closeCancelModal}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all border border-slate-100 z-50"
              >
                <X size={14} strokeWidth={2.35} />
              </button>

              {/* Premium Illustration cancel_order1.png */}
              <div className="w-40 h-40 mb-4 flex items-center justify-center shrink-0">
                <img 
                  src="/cancel_order1.png" 
                  className="w-full h-full object-contain drop-shadow-sm" 
                  alt="Cancel Donation Illustration" 
                />
              </div>

              {/* Typography Content */}
              <div className="text-center space-y-1 mb-4">
                <h3 className="text-[22px] font-black text-slate-800 tracking-tight leading-none">
                  Cancel this donation?
                </h3>
                <p className="text-[12.5px] font-bold text-slate-500 max-w-[300px] leading-normal">
                  Are you sure you want to cancel this donation? This action <span className="text-[#d32f2f] font-black">cannot be undone.</span>
                </p>
              </div>

              {/* Warning Bullets Container */}
              <div className="w-full bg-[#fff5f5] border border-rose-100/50 rounded-2xl p-4 space-y-3 mb-4">
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

              {/* Cancellation Reason Dropdown */}
              <div className="w-full space-y-1 mb-5 text-start">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">
                  Why do you want to cancel? <span className="text-slate-300 font-bold">(Optional)</span>
                </label>
                <div className="relative">
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200/50 rounded-xl text-[11px] font-bold text-slate-700 outline-none appearance-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all cursor-pointer"
                  >
                    <option value="">Select a reason</option>
                    <option value="Incorrect quantity entered">Incorrect quantity entered</option>
                    <option value="Incorrect food items listed">Incorrect food items listed</option>
                    <option value="Food quality concerns">Food quality concerns</option>
                    <option value="NGO matching is taking too long">NGO matching is taking too long</option>
                    <option value="No longer wish to donate">No longer wish to donate</option>
                    <option value="Other reason">Other reason</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown size={14} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-2 gap-3 w-full mb-4">
                {/* Keep Donation Button */}
                <button
                  onClick={closeCancelModal}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-[0.98] text-[9px] font-black uppercase tracking-wide whitespace-nowrap"
                >
                  <XCircle size={12} className="stroke-[2.5]" />
                  <span>NO, Keep Donation</span>
                </button>

                {/* Yes, Cancel Donation Button */}
                <button
                  onClick={confirmCancellation}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-white shadow-md shadow-red-500/10 hover:shadow-lg transition-all active:scale-[0.98] text-[9px] font-black uppercase tracking-wide whitespace-nowrap animate-pulse hover:animate-none"
                >
                  <Trash2 size={12} className="stroke-[2.5]" />
                  <span>Yes, Cancel Donation</span>
                </button>
              </div>

              {/* Trust Footer */}
              <div className="flex items-center justify-center gap-1.5 text-slate-400">
                <ShieldCheck size={12} className="text-[#10b981] stroke-[2.5]" />
                <span className="text-[9px] font-bold">Your data is safe with us. This action is secure.</span>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Premium Redonate Confirmation Modal */}
      <Modal 
        isOpen={isRedonateModalOpen} 
        onOpenChange={setIsRedonateModalOpen}
        size="md"
        backdrop="blur"
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-slate-900/60 backdrop-blur-sm",
          base: "bg-transparent shadow-none border-none outline-none",
          body: "p-0",
          wrapper: "z-[9999]"
        }}
      >
        <ModalContent className="bg-transparent border-none outline-none shadow-none ring-0 p-0">
          {() => (
            <div className="bg-white w-full max-w-[390px] rounded-[2.5rem] p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100/50 flex flex-col items-center relative overflow-visible">
              {/* Close Button Top Right */}
              <button 
                onClick={() => setIsRedonateModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all border border-slate-100/80 z-50 shadow-sm active:scale-90"
              >
                <X size={14} strokeWidth={2.35} />
              </button>

              {/* Glowing Green Circular Illustration */}
              <div className="relative w-32 h-32 mb-4 flex items-center justify-center shrink-0">
                {/* Outer pulsing glow */}
                <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-pulse" />
                
                {/* Radial Glow Container */}
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500/10 via-emerald-100/20 to-emerald-400/5 flex items-center justify-center">
                  {/* Floating Leaves using SVGs for premium look */}
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

                  {/* Circular Image of Bowl */}
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

                  {/* Overlapping circular arrows badge */}
                  <div className="absolute top-1 right-1 w-8 h-8 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-lg z-20 hover:scale-110 transition-transform cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                      <RotateCcw size={12} className="stroke-[2.5] animate-[spin_8s_linear_infinite]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography Content */}
              <div className="text-center space-y-1 mb-4">
                <h3 className="text-[22px] font-black text-slate-800 tracking-tight leading-none">
                  Redonate this cancelled donation?
                </h3>
                <p className="text-[12.5px] font-bold text-slate-500 max-w-[300px] leading-relaxed mx-auto">
                  Your donation can still make a difference. Redonate to find a new match and help someone in need.
                </p>
              </div>

              {/* Three Benefits Container */}
              <div className="w-full bg-[#f4faf6]/80 border border-emerald-100/40 rounded-[1.5rem] p-4 space-y-3 mb-4 text-start">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100/50 text-[#16a34a] flex items-center justify-center shrink-0 mt-0.5">
                    <Leaf size={12} fill="currentColor" />
                  </div>
                  <div className="flex flex-col space-y-0.5">
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
                  <div className="flex flex-col space-y-0.5">
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
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-[12px] font-black text-slate-800 tracking-tight leading-none">
                      Zero waste, more good
                    </p>
                    <p className="text-[10.5px] font-bold text-slate-500/80 leading-normal">
                      Together we can reduce food waste.
                    </p>
                  </div>
                </div>
              </div>

              {/* Original Donation Time Box */}
              <div className="w-full bg-[#fffbf6] border border-orange-100/40 rounded-2xl p-3.5 flex items-center gap-3 mb-5 text-start">
                <div className="w-7 h-7 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 shadow-sm border border-orange-100/10">
                  <Clock size={14} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col space-y-0.5">
                  <span className="text-[10px] font-black text-orange-600/85 uppercase tracking-wide leading-none">
                    Original donation time
                  </span>
                  <span className="text-[12px] font-black text-slate-700">
                    {redonateDonation?.date}, 6:00 PM – 7:00 PM
                  </span>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-2 gap-3 w-full mb-3">
                {/* No, Don't Redonate */}
                <button
                  onClick={() => setIsRedonateModalOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-[0.98] text-[9.5px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm"
                >
                  <XCircle size={12} className="stroke-[2.5]" />
                  <span>NO, DON'T REDONATE</span>
                </button>

                {/* Yes, Redonate */}
                <button
                  onClick={confirmRedonate}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#1b803c] hover:bg-[#156d32] text-white shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all active:scale-[0.98] text-[9.5px] font-black uppercase tracking-wider whitespace-nowrap"
                >
                  <RotateCcw size={12} className="stroke-[2.5]" />
                  <span>YES, REDONATE</span>
                </button>
              </div>

              {/* Trust Footer */}
              <div className="flex items-center justify-center gap-1.5 text-slate-400/90">
                <ShieldCheck size={12} className="text-[#10b981] stroke-[2.5]" />
                <span className="text-[9px] font-bold tracking-tight">Your data is safe with us. This action is secure.</span>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onOpenChange={setIsDeleteModalOpen}
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
            <div className="bg-white w-full max-w-[360px] rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100/50 flex flex-col items-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-5">
                <Trash2 size={24} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Delete Donation?</h3>
              <p className="text-[13px] font-bold text-slate-500/80 text-center mb-6 max-w-[280px]">
                Are you sure you want to delete this cancelled donation from your history? This action cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-black uppercase tracking-wider"
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
        onOpenChange={setIsReceiptModalOpen}
        size="md"
        backdrop="blur"
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-slate-900/60 backdrop-blur-sm",
          base: "bg-transparent shadow-none border-none outline-none",
          body: "p-0",
          wrapper: "z-[9999]"
        }}
      >
        <ModalContent className="bg-transparent border-none outline-none shadow-none ring-0 p-0 m-0">
          {(onClose) => {
            if (!receiptDonation) return null;
            const d = receiptDonation;

            // Find delivered timestamp if possible from timeline, otherwise fallback to d.date + time
            const deliveredStep = d.timeline?.find(s => s.status.toUpperCase().includes("DELIVERED"));
            const deliveredDate = deliveredStep ? `${deliveredStep.date}, ${deliveredStep.time}` : `${d.date}, 6:25 PM`;
            const receiptId = `HF-${d.date.replace(/[^0-9]/g, "-") || "2026-05-15"}-${d.id || 6821}`;

            return (
              <div className="bg-white w-full max-w-[440px] rounded-[2rem] p-6 md:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-slate-100/50 flex flex-col relative max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] overflow-y-auto thin-scrollbar mx-auto">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 transition-all duration-300 group z-50 border border-slate-100"
                >
                  <X size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                </button>

                {/* SVG Illustration Container */}
                <div className="mt-2 mb-2 shrink-0">
                  <svg width="100" height="100" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto overflow-visible">
                    {/* Background glow effects */}
                    <circle cx="60" cy="60" r="50" fill="#f0fdf4" />
                    <circle cx="60" cy="60" r="38" fill="#dcfce7" />
                    
                    {/* Decorative Leaves */}
                    <path d="M22 62C18 58 20 48 20 48C20 48 30 46 34 50C34 50 26 52 25 57C24 62 22 62 22 62Z" fill="#22c55e" className="animate-pulse" />
                    <path d="M98 62C102 58 100 48 100 48C100 48 90 46 86 50C86 50 94 52 95 57C96 62 98 62 98 62Z" fill="#22c55e" className="animate-pulse" />
                    
                    {/* Receipt Document */}
                    <g filter="drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.06))">
                      <path d="M40 25H80V87L75 83L70 87L65 83L60 87L55 83L50 87L45 83L40 87V25Z" fill="white" stroke="#e2e8f0" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                    
                    {/* Receipt Lines */}
                    <line x1="48" y1="38" x2="72" y2="38" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="48" y1="48" x2="64" y2="48" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="48" y1="58" x2="72" y2="58" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="48" y1="68" x2="56" y2="68" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round"/>
                    
                    {/* Circle and Checkmark */}
                    <circle cx="80" cy="76" r="13" fill="#22c55e" stroke="white" strokeWidth="2.5"/>
                    <path d="M75 76L78.5 79.5L85 73" stroke="white" strokeWidth="2.5" strokeLinecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>

                {/* Header Title */}
                <div className="text-center space-y-1 mb-5">
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Receipt</h2>
                  <p className="text-[11px] font-bold text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                    Thank you! Your donation has created an impact.
                  </p>
                  <div className="flex justify-center pt-0.5 text-emerald-500 animate-bounce">
                    <Heart size={14} fill="currentColor" />
                  </div>
                </div>

                {/* Donation Card Box */}
                <div className="p-3.5 rounded-2xl bg-[#f4faf6] border border-emerald-500/10 flex items-center gap-3.5 mb-5 shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
                    <img 
                      src={
                        d.image || 
                        getCategoryImage(d.category)
                      }
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
                      {d.quantity.toUpperCase()} • {d.dietaryType.toUpperCase()} • {d.preparationType.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Details List */}
                <div className="space-y-3 mb-5 overflow-y-auto max-h-[220px] pr-1 thin-scrollbar">
                  {/* NGO Row */}
                  <div className="flex items-start justify-between gap-4 py-1 border-b border-dashed border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7.5 h-7.5 rounded-full bg-[#f4faf6] text-emerald-600 flex items-center justify-center border border-emerald-100/50 shrink-0">
                        <MapPin size={13} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">NGO / Recipient</span>
                        <span className="text-[11.5px] font-bold text-slate-800">{d.ngo}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-md text-[8px] font-black uppercase tracking-widest self-center">
                      DELIVERED
                    </span>
                  </div>

                  {/* Delivered On Row */}
                  <div className="flex items-start justify-between gap-4 py-1 border-b border-dashed border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7.5 h-7.5 rounded-full bg-[#f4faf6] text-emerald-600 flex items-center justify-center border border-emerald-100/50 shrink-0">
                        <Clock size={13} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Delivered On</span>
                        <span className="text-[11.5px] font-bold text-slate-800">{deliveredDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Received By Row */}
                  <div className="flex items-start justify-between gap-4 py-1 border-b border-dashed border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7.5 h-7.5 rounded-full bg-[#f4faf6] text-emerald-600 flex items-center justify-center border border-emerald-100/50 shrink-0">
                        <User size={13} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Received By</span>
                        <span className="text-[11.5px] font-bold text-slate-800">{d.ngo} Team</span>
                      </div>
                    </div>
                  </div>

                  {/* Receipt ID Row */}
                  <div className="flex items-start justify-between gap-4 py-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7.5 h-7.5 rounded-full bg-[#f4faf6] text-emerald-600 flex items-center justify-center border border-emerald-100/50 shrink-0">
                        <FileText size={13} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Receipt ID</span>
                        <span className="text-[11.5px] font-bold text-slate-800">{receiptId}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(receiptId);
                        toast.success("Receipt ID copied to clipboard!");
                      }}
                      className="w-7 h-7 rounded-lg hover:bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition-all self-center"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>

                {/* Thank You Generosity Box */}
                <div className="p-3.5 rounded-xl bg-[#e8fcf0]/50 border border-[#e8fcf0] flex items-center gap-3.5 mb-3 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0 border border-emerald-50">
                    <Heart size={12} fill="currentColor" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-emerald-800">Thank you for your generosity!</span>
                    <span className="text-[9.5px] font-bold text-emerald-600/90 leading-tight">Your donation will feed many in need 💐</span>
                  </div>
                </div>

                {/* Verified Donation Alert Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3.5 mb-5 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0 border border-slate-100">
                    <ShieldCheck size={14} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-slate-700">Verified Donation</span>
                    <span className="text-[9.5px] font-bold text-slate-500 leading-tight">This donation is verified and has been recorded successfully.</span>
                  </div>
                </div>

                {/* Actions Footer */}
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
                        navigator.clipboard.writeText(`Donation of ${d.foodType} verified successfully. Receipt ID: ${receiptId}`);
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
    </div>
  );
};


export default MyDonations;

// Providing Backend Donation Samples
