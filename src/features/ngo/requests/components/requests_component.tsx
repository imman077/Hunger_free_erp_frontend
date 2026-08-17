import { addToast } from "@heroui/react";
import {
  MapPin,
  Clock,
  ShieldCheck,
  Package,
  User,
  Truck,
  Building2,
  Star,
  Phone,
  Check,
  Box,
  X,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Info,
  Tag,
} from "lucide-react";
import ResuableDrawer from "../../../../global/components/reusable-components/Drawer";
import ResuableModal from "../../../../global/components/reusable-components/Modal";
import { requestsInputModel } from "../store/requests_store";
import {
  closeDrawer,
  handleConfirmAccept,
  handleAcceptClick,
  handleMouseEnterSuccess,
  handleMouseLeaveSuccess,
  setRequestsStateValue,
} from "../controller/requests_controller";

interface RequestsComponentProps {
  user: any;
}

export const LiveTraceDrawer = ({ user }: RequestsComponentProps) => {
  const isOpen = requestsInputModel.useSelector((state) => state.requestsState.isDrawerOpen);
  const selectedRequest = requestsInputModel.useSelector((state) => state.requestsState.selectedRequest);

  if (!selectedRequest) return null;

  return (
    <ResuableDrawer
      isOpen={isOpen}
      onClose={closeDrawer}
      title="Donation Info"
      subtitle={`ID: #HF-${selectedRequest.id}2024`}
      size="md"
      hideHeaderBorder={true}
    >
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

        {/* Secure Delivery Verification Terminal (NGO Side) */}
        {selectedRequest.rawStatus === "PICKED_UP" && (
          <div
            className="p-3.5 rounded-sm border-2 border-hf-green relative overflow-hidden group animate-in slide-in-from-top-10 duration-1000 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.03)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-hf-green/10 border border-hf-green/20 flex items-center justify-center text-hf-green shrink-0">
                <ShieldCheck size={20} className="animate-pulse" />
              </div>
              <div className="text-start">
                <h4 className="text-[11px] font-[1000] uppercase tracking-widest text-hf-green">
                  Handover Protocol
                </h4>
                <p className="text-[9px] font-black text-hf-green/60 uppercase tracking-widest leading-none mt-0.5">
                  SHARE CODE WITH AGENT
                </p>
              </div>
            </div>

            {/* Delivery OTP code display boxes */}
            {selectedRequest?.deliveryOtp && (
              <div className="flex items-center gap-1.5 shrink-0 z-10">
                {selectedRequest.deliveryOtp.split("").map((digit: string, i: number) => (
                  <div
                    key={i}
                    className="w-8 h-10 bg-white border border-hf-green/30 rounded-sm flex items-center justify-center text-lg font-black text-hf-green font-mono shadow-sm"
                  >
                    {digit}
                  </div>
                ))}
              </div>
            )}
            
            <div className="absolute inset-0 pointer-events-none border border-hf-green/10 opacity-30" />
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

        {/* Progress Timeline Section */}
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
                  status: selectedRequest.isOwn ? "Mission Initialized" : "Donation Posted",
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
                      step.completed ? "border-[#22c55e]" : "border-[var(--border-color)]"
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
                          step.completed ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
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
                        step.completed ? "text-[#22c55e]" : "text-[var(--text-muted)]"
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
        {selectedRequest.status !== "Available" && selectedRequest.volunteer && (
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
              <div
                className="w-11 h-11 rounded-sm border flex items-center justify-center shrink-0 relative"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "rgba(34, 197, 128, 0.2)",
                }}
              >
                <span className="text-lg font-black text-hf-green uppercase">
                  {selectedRequest.volunteer?.name?.charAt(0) || "A"}
                </span>
                <div className="absolute -top-1 -right-1 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-hf-green border border-[var(--bg-primary)] shadow-sm" />
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="space-y-0.5">
                  <p
                    className="text-[13px] font-black uppercase tracking-tight leading-tight truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {selectedRequest.volunteer?.name || "Assigned Agent"}
                  </p>

                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-1 px-1 py-0.5 rounded-sm border shrink-0"
                      style={{
                        backgroundColor: "rgba(245, 158, 11, 0.05)",
                        borderColor: "rgba(245, 158, 11, 0.2)",
                      }}
                    >
                      <Star className="fill-yellow-400 text-yellow-400" size={8} />
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
                    <Phone size={9} className="text-hf-green opacity-60 shrink-0" />
                    <p
                      className="text-[10px] font-bold tracking-wider tabular-nums opacity-60 truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedRequest.volunteer.phone}
                    </p>
                  </div>
                )}
              </div>

              {selectedRequest.volunteer?.phone && (
                <a
                  href={`tel:${selectedRequest.volunteer.phone.replace(/\s+/g, "")}`}
                  className="w-10 h-10 rounded-sm bg-hf-green flex items-center justify-center shadow-lg shadow-hf-green/10 hover:bg-emerald-600 transition-all duration-300 group shrink-0"
                >
                  <Phone size={18} className="text-white group-hover:rotate-12 transition-transform" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Accept/Support Action inside Drawer for Available/Open requests */}
        {(selectedRequest.status === "Available" || selectedRequest.status === "Open") && (
          <div className="pt-4 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => {
                closeDrawer();
                handleAcceptClick(selectedRequest, user);
              }}
              className="w-full py-3.5 px-6 bg-[#22c55e] hover:bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
            >
              <CheckCircle2 size={18} />
              <span>
                {selectedRequest.origin === "NEED" ? "Support Community Need" : "Accept Food Donation"}
              </span>
            </button>
          </div>
        )}
      </div>
    </ResuableDrawer>
  );
};

export const AcceptDonationModal = ({ user }: RequestsComponentProps) => {
  const isOpen = requestsInputModel.useSelector((state) => state.requestsState.isAcceptModalOpen);
  const isAccepting = requestsInputModel.useSelector((state) => state.requestsState.isAccepting);
  const isAcceptSuccess = requestsInputModel.useSelector((state) => state.requestsState.isAcceptSuccess);
  const acceptingDonation = requestsInputModel.useSelector((state) => state.requestsState.acceptingDonation);
  const supportQty = requestsInputModel.useSelector((state) => state.requestsState.supportQty);
  const supportPhone = requestsInputModel.useSelector((state) => state.requestsState.supportPhone);
  const isTimerPaused = requestsInputModel.useSelector((state) => state.requestsState.isTimerPaused);
  const remainingTime = requestsInputModel.useSelector((state) => state.requestsState.remainingTime);

  const getCategoryThumbnail = (title?: string) => {
    const t = (title || "").toLowerCase();
    if (t.includes("cooked") || t.includes("rice") || t.includes("meal") || t.includes("biryani")) 
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
    if (t.includes("packaged") || t.includes("ration") || t.includes("grocery") || t.includes("wheat") || t.includes("atta")) 
      return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80";
    if (t.includes("water") || t.includes("beverage")) 
      return "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80";
    if (t.includes("bread") || t.includes("bakery")) 
      return "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80";
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";
  };

  const handleClose = () => {
    setRequestsStateValue("isAcceptModalOpen", false);
  };

  return (
    <ResuableModal
      isOpen={isOpen}
      onOpenChange={(open) => setRequestsStateValue("isAcceptModalOpen", open)}
      scrollBehavior="inside"
      classNames={{
        header: "!hidden",
        body: "!p-6",
        base: "max-w-[580px] !my-10 sm:!my-16"
      }}
    >
      <div>
        {/* Success View */}
        {isAcceptSuccess ? (
          <div
            className="relative flex flex-col items-center justify-center py-10 overflow-hidden animate-in fade-in zoom-in duration-500 cursor-default"
            onMouseEnter={handleMouseEnterSuccess}
            onMouseLeave={handleMouseLeaveSuccess}
          >
            {/* Close Button top-right */}
            <button
              onClick={handleClose}
              className="absolute top-0 right-0 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="relative mb-6">
              <div className="w-16 h-16 bg-[#22c55e] rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-green-500/20">
                <Check className="text-white" size={32} strokeWidth={3} />
              </div>
            </div>

            <div className="text-center space-y-3 z-10 w-full">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#22c55e] leading-none mb-1">
                Success
              </h3>
              <h2
                className="text-xl font-black tracking-tight leading-none uppercase text-slate-800 dark:text-slate-100"
              >
                Donation Accepted!
              </h2>
              <p
                className="text-[12px] font-bold max-w-[320px] leading-relaxed mx-auto text-slate-500 dark:text-slate-400"
              >
                Resource{" "}
                <span
                  className="font-black px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  #{acceptingDonation?.id}
                </span>{" "}
                has been successfully accepted. A volunteer will be notified
                for the pickup soon.
              </p>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 mt-6 w-full"
            >
              <div
                className={`h-full bg-[#22c55e] ${isTimerPaused ? "animate-none" : "animate-[progress-shrink_2.5s_linear_forwards]"}`}
                style={{
                  width: isTimerPaused ? `${(remainingTime / 2500) * 100}%` : undefined,
                  animationDuration: `${remainingTime}ms`,
                }}
              />
            </div>

            <p
              className="text-[9px] font-bold uppercase tracking-widest mt-6 text-slate-400"
            >
              {isTimerPaused ? "Timer Paused" : "Closing automatically..."}
            </p>

            <style>{`
              @keyframes progress-shrink {
                from { width: ${(remainingTime / 2500) * 100}%; }
                to { width: 0%; }
              }
            `}</style>
          </div>
        ) : (
          /* Input / Accept View */
          <div className="flex flex-col">
            {/* Header Block */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-[16px] bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm">
                  <ShieldCheck size={24} className="stroke-[2.2]" />
                </div>
                <div className="flex flex-col text-start">
                  <h2 className="text-xl font-[1000] text-slate-800 dark:text-slate-100 tracking-tight leading-snug">
                    Confirm Acceptance
                  </h2>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 leading-none">
                    Review the donation details before accepting.
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer border border-transparent shrink-0"
              >
                <X size={16} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Food Item Details Card */}
            <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[20px] p-4 flex items-center gap-4 shadow-sm mb-4 text-start">
              <img
                src={getCategoryThumbnail(acceptingDonation?.title)}
                alt={acceptingDonation?.title}
                className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/50 dark:border-slate-800/80"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-lg font-[1000] text-slate-800 dark:text-slate-100 leading-snug truncate">
                  {acceptingDonation?.title || "Surplus Food Item"}
                </h4>
                <p className="flex items-center gap-1.5 text-xs font-black text-slate-400 dark:text-slate-500 mt-1.5">
                  <Building2 size={13} className="text-emerald-500 shrink-0" />
                  <span className="truncate">{acceptingDonation?.source || "Private Donor"}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-100/50 dark:border-emerald-900/30">
                    <AlertTriangle size={10} className="shrink-0" />
                    {acceptingDonation?.category || "Dry Ration"}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-100/50 dark:border-purple-900/30">
                    <Tag size={10} className="shrink-0" />
                    {acceptingDonation?.dietaryType || "Veg"}
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Column Info Cards */}
            <div className="grid grid-cols-3 gap-2.5 mb-4 text-start">
              {/* Urgency */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-[20px] p-3 flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 shrink-0">
                  <AlertTriangle size={15} className="stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                    URGENCY
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-tight truncate ${acceptingDonation?.urgency?.toLowerCase().includes("high") || acceptingDonation?.urgency?.toLowerCase().includes("urgent") ? "text-red-500" : "text-amber-500"}`}>
                    {acceptingDonation?.urgency || "NORMAL"}
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-[20px] p-3 flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500 shrink-0">
                  <Box size={15} className="stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                    QUANTITY
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-tight text-slate-700 dark:text-slate-200 truncate">
                    {(() => {
                      if (acceptingDonation?.origin === "NEED") {
                        const remaining = Math.max(0, (acceptingDonation.quantity_num || 0) - (acceptingDonation.fulfilled_quantity || 0));
                        return `${remaining} ${(acceptingDonation.unit || "Units").toUpperCase()}`;
                      }
                      const qtyStr = acceptingDonation?.quantity || "";
                      const unitStr = acceptingDonation?.unit || "";
                      if (unitStr && qtyStr.toLowerCase().endsWith(unitStr.toLowerCase())) {
                        return qtyStr.toUpperCase();
                      }
                      return `${qtyStr} ${unitStr}`.trim().toUpperCase() || "10 BAGS";
                    })()}
                  </span>
                </div>
              </div>

              {/* Expiry */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-[20px] p-3 flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-500 shrink-0">
                  <Clock size={15} className="stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                    EXPIRY
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-tight text-slate-700 dark:text-slate-200 truncate">
                    {acceptingDonation?.expiryTime || "NO EXPIRY"}
                  </span>
                </div>
              </div>
            </div>

            {/* If NGO Resource Need, show inputs */}
            {acceptingDonation?.origin === "NEED" && (
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 mb-4 text-start">
                <p className="text-[10px] font-[1000] uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Fulfillment Details
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Enter Quantity to Accept Column */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1">
                      Enter Quantity to Accept
                      <span title="Enter the amount you wish to contribute" className="inline-flex cursor-pointer">
                        <Info size={11} className="text-slate-400" />
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      {/* Counter Decrement Button */}
                      <button
                        type="button"
                        onClick={() => setRequestsStateValue("supportQty", Math.max(1, (parseInt(supportQty) || 0) - 1).toString())}
                        className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 flex items-center justify-center font-black hover:bg-slate-100 transition-colors shadow-sm shrink-0"
                      >
                        —
                      </button>
                      
                      {/* Numeric Input container */}
                      <div className="flex-1 relative flex items-center border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 h-9">
                        <Box size={13} className="text-slate-400 mr-2 shrink-0" />
                        <input
                          type="number"
                          value={supportQty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const maxVal = Math.max(0, (acceptingDonation?.quantity_num || 0) - (acceptingDonation?.fulfilled_quantity || 0));
                            if (val > maxVal) {
                              addToast({
                                title: "Quantity Exceeded",
                                description: `Cannot exceed the maximum remaining quantity of ${maxVal} ${acceptingDonation?.unit || "Units"}!`,
                                color: "danger",
                                classNames: {
                                  base: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 border-l-4 border-l-red-500 dark:border-l-red-500 rounded-xl shadow-md p-4 flex items-start gap-3",
                                  title: "font-black text-slate-800 dark:text-slate-100 text-xs leading-none",
                                  description: "text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-bold leading-relaxed",
                                  closeButton: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-lg p-1",
                                },
                                icon: (
                                  <div className="w-7 h-7 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 shrink-0 shadow-sm border border-red-100/50">
                                    <AlertTriangle size={13} className="stroke-[2.5]" />
                                  </div>
                                ),
                              });
                              setRequestsStateValue("supportQty", maxVal.toString());
                            } else {
                              setRequestsStateValue("supportQty", val.toString());
                            }
                          }}
                          className="w-full bg-transparent border-none text-[12px] font-black text-slate-800 dark:text-slate-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                        <span className="ml-auto text-[8px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded shrink-0">
                          {acceptingDonation?.unit || "BAGS"}
                        </span>
                      </div>

                      {/* Counter Increment Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const maxVal = Math.max(0, (acceptingDonation?.quantity_num || 0) - (acceptingDonation?.fulfilled_quantity || 0));
                          const nextVal = (parseInt(supportQty) || 0) + 1;
                          if (nextVal > maxVal) {
                            addToast({
                              title: "Quantity Exceeded",
                              description: `Cannot exceed the maximum remaining quantity of ${maxVal} ${acceptingDonation?.unit || "Units"}!`,
                              color: "danger",
                              classNames: {
                                base: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 border-l-4 border-l-red-500 dark:border-l-red-500 rounded-xl shadow-md p-4 flex items-start gap-3",
                                title: "font-black text-slate-800 dark:text-slate-100 text-xs leading-none",
                                description: "text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-bold leading-relaxed",
                                closeButton: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-lg p-1",
                              },
                              icon: (
                                <div className="w-7 h-7 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 shrink-0 shadow-sm border border-red-100/50">
                                  <AlertTriangle size={13} className="stroke-[2.5]" />
                                </div>
                              ),
                            });
                            setRequestsStateValue("supportQty", maxVal.toString());
                          } else {
                            setRequestsStateValue("supportQty", nextVal.toString());
                          }
                        }}
                        className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 flex items-center justify-center font-black hover:bg-slate-100 transition-colors shadow-sm shrink-0"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 pl-1">
                      Max available: <span className="font-extrabold text-slate-500 dark:text-slate-400">
                        {(() => {
                          const remaining = Math.max(0, (acceptingDonation?.quantity_num || 0) - (acceptingDonation?.fulfilled_quantity || 0));
                          return `${remaining} ${acceptingDonation?.unit || "Units"}`;
                        })()}
                      </span>
                    </p>
                  </div>

                  {/* Direct Contact Column */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      Direct Contact
                    </label>
                    <div className="relative flex items-center border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 h-9">
                      <Phone size={13} className="text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={supportPhone}
                        onChange={(e) => setRequestsStateValue("supportPhone", e.target.value)}
                        disabled={Boolean(user?.ngoProfile?.phone || user?.phone)}
                        className={`w-full bg-transparent border-none text-[12px] font-black text-slate-700 dark:text-slate-200 focus:outline-none ${(user?.ngoProfile?.phone || user?.phone) ? "cursor-not-allowed text-slate-500" : ""}`}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Difference Note */}
            <div className="w-full bg-[#f4fbf7] dark:bg-emerald-950/5 border border-dashed border-emerald-200/80 dark:border-emerald-800/40 rounded-[20px] p-3.5 flex items-center gap-3.5 mb-5 text-start">
              <div className="w-10 h-10 rounded-full border border-dashed border-[#22c55e] dark:border-emerald-700 flex items-center justify-center text-[#22c55e] dark:text-emerald-400 shrink-0 bg-emerald-50/30 dark:bg-emerald-950/30">
                <HeartHandshake size={18} className="stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-[1000] text-emerald-800 dark:text-emerald-400 leading-tight">
                  Your acceptance helps reduce food waste and feeds those in need.
                </p>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                  Thank you for making a difference! 💚
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 dark:bg-slate-800/80 w-full mb-4" />

            {/* Footer Row */}
            <div className="flex items-center justify-end gap-3">
              <button
                disabled={isAccepting}
                onClick={handleClose}
                className="px-6 py-3 border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isAccepting}
                onClick={() => handleConfirmAccept(user)}
                className="px-6 py-3 bg-[#22c55e] hover:bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isAccepting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Accepting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} className="stroke-[2.5]" />
                    <span>Confirm Acceptance</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Secure Note */}
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">
              <span>🔒 Secure & Confidential • Valid for this session only</span>
            </div>
          </div>
        )}
      </div>
    </ResuableModal>
  );
};
