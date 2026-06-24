import {
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Package,
  User,
  Truck,
  Building2,
  Star,
  Phone,
  AlertTriangle,
  Loader2,
  Check,
  Navigation,
  Box,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import ResuableDrawer from "../../../../global/components/reusable-components/Drawer";
import ResuableModal from "../../../../global/components/reusable-components/Modal";
import ResuableButton from "../../../../global/components/reusable-components/Button";
import { requestsInputModel } from "../store/requests_store";
import {
  closeDrawer,
  handleVerifyOTP,
  handleConfirmAccept,
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
  const otpValue = requestsInputModel.useSelector((state) => state.requestsState.otpValue);
  const isVerifying = requestsInputModel.useSelector((state) => state.requestsState.isVerifying);
  const otpError = requestsInputModel.useSelector((state) => state.requestsState.otpError);

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
            className="p-5 rounded-sm border-2 border-hf-green space-y-4 relative overflow-hidden group animate-in slide-in-from-top-10 duration-1000"
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.03)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-sm bg-hf-green/10 border border-hf-green/20 flex items-center justify-center text-hf-green shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <ShieldCheck size={24} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-[11px] font-[1000] uppercase tracking-widest text-hf-green">
                  Handover Protocol
                </h4>
                <p className="text-[9px] font-black text-hf-green/60 uppercase tracking-widest">
                  AGENT IS AT DESTINATION | ENTER CODE
                </p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex gap-3">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="----"
                  value={otpValue}
                  onChange={(e) => setRequestsStateValue("otpValue", e.target.value.replace(/\D/g, ""))}
                  className={`flex-1 h-16 bg-white border-2 text-center text-3xl font-black tracking-[0.5em] rounded-sm focus:outline-none transition-all ${
                    otpError ? "border-red-500 text-red-600 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-hf-green/30 text-hf-green focus:border-hf-green"
                  }`}
                />
                <ResuableButton
                  variant="primary"
                  onClick={() => handleVerifyOTP(user)}
                  disabled={otpValue.length < 4 || isVerifying}
                  className="h-16 w-16 !rounded-sm bg-hf-green hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-90"
                >
                  {isVerifying ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={24} />
                  )}
                </ResuableButton>
              </div>

              {otpError && (
                <div className="flex items-center justify-center gap-2 text-red-600 animate-bounce">
                  <AlertTriangle size={12} />
                  <p className="text-[10px] font-[1000] uppercase tracking-widest">
                    {otpError}
                  </p>
                </div>
              )}

              <p className="text-[9px] font-black text-center opacity-40 uppercase tracking-[0.2em] leading-relaxed">
                Verify the handover by entering the 4-digit code <br /> from the delivery agent.
              </p>
            </div>
            
            <div className="absolute inset-0 pointer-events-none border border-hf-green/10 opacity-50" />
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
                  {selectedRequest.volunteer.name.charAt(0)}
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
                    {selectedRequest.volunteer.name}
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
                        {selectedRequest.volunteer.rating}
                      </span>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.1em] text-hf-green/60 px-2 border-l border-[var(--border-color)] truncate">
                      Verified Expert
                    </span>
                  </div>
                </div>

                {selectedRequest.volunteer.phone && (
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

              {selectedRequest.volunteer.phone && (
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

  return (
    <ResuableModal
      isOpen={isOpen}
      onOpenChange={(open) => setRequestsStateValue("isAcceptModalOpen", open)}
      title="Confirm Acceptance"
      footer={
        !isAcceptSuccess && (
          <div className="flex items-center justify-end gap-3">
            <ResuableButton
              variant="ghost"
              size="sm"
              disabled={isAccepting}
              onClick={() => setRequestsStateValue("isAcceptModalOpen", false)}
            >
              Cancel
            </ResuableButton>
            <ResuableButton
              variant="primary"
              size="md"
              disabled={isAccepting}
              onClick={() => handleConfirmAccept(user)}
              className="bg-[#22c55e] hover:bg-green-600 shadow-lg shadow-green-500/20 px-5 py-1.5 !rounded-lg"
            >
              {isAccepting ? (
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider">
                  <Loader2 size={13} className="animate-spin" />
                  <span>Accepting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider">
                  <CheckCircle2 size={13} />
                  <span>Confirm Acceptance</span>
                </div>
              )}
            </ResuableButton>
          </div>
        )
      }
    >
      <div className="py-4">
        {isAcceptSuccess ? (
          <div
            className="relative flex flex-col items-center justify-center py-12 overflow-hidden animate-in fade-in zoom-in duration-500 cursor-default"
            onMouseEnter={handleMouseEnterSuccess}
            onMouseLeave={handleMouseLeaveSuccess}
          >
            <div className="relative mb-8">
              <div className="w-16 h-16 bg-[#22c55e] rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-green-500/20">
                <Check className="text-white" size={32} strokeWidth={3} />
              </div>
            </div>

            <div className="text-center space-y-3 z-10">
              <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#22c55e] leading-none mb-1">
                Success
              </h3>
              <h2
                className="text-xl font-black tracking-tight leading-none uppercase"
                style={{ color: "var(--text-primary)" }}
              >
                Donation Accepted!
              </h2>
              <p
                className="text-[12px] font-bold max-w-[320px] leading-relaxed mx-auto"
                style={{ color: "var(--text-secondary)" }}
              >
                Resource{" "}
                <span
                  className="font-black px-1.5 py-0.5 rounded-sm"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                  }}
                >
                  #{acceptingDonation?.id}
                </span>{" "}
                has been successfully accepted. A volunteer will be notified
                for the pickup soon.
              </p>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: "var(--bg-secondary)" }}
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
              className="absolute bottom-2 text-[9px] font-bold uppercase tracking-widest mt-4"
              style={{ color: "var(--text-muted)" }}
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
          <div className="space-y-2">
            <div
              className="p-2.5 border rounded-2xl flex items-start gap-2.5"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl shadow-sm border flex items-center justify-center text-lg shrink-0"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                {acceptingDonation?.icon}
              </div>
              <div className="min-w-0">
                <h4
                  className="text-[13px] font-black uppercase tracking-tight leading-tight mb-0.5 truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {acceptingDonation?.title}
                </h4>
                <p
                  className="text-[9px] font-black flex items-center gap-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Building2 size={10} className="opacity-50" />
                  {acceptingDonation?.source}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div
                className="flex items-start gap-2.5 p-2.5 rounded-xl border"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.08)",
                  borderColor: "rgba(34, 197, 94, 0.2)",
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "rgba(34, 197, 94, 0.2)",
                  }}
                >
                  <Navigation size={12} className="text-[#22c55e]" />
                </div>
                <div className="space-y-0.5">
                  <p
                    className="text-[9px] font-black uppercase tracking-[0.1em]"
                    style={{ color: "var(--color-emerald-dark)" }}
                  >
                    Acceptance Policy
                  </p>
                  <p
                    className="text-[9px] font-bold leading-relaxed opacity-80"
                    style={{ color: "var(--color-emerald-dark)" }}
                  >
                    By confirming, you agree to receive and distribute this
                    food donation to your registered beneficiaries.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div
                  className="p-2.5 border rounded-xl space-y-1 shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <p
                    className="text-[8px] font-black uppercase tracking-[0.1em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Urgency
                  </p>
                  <div className="flex items-center gap-1.5 pt-1 border-t border-[var(--border-color)]">
                    <AlertTriangle
                      size={10}
                      className={acceptingDonation?.urgency === "High" ? "text-red-500" : "text-amber-500"}
                    />
                    <p
                      className={`text-[12px] font-black uppercase tracking-tight ${acceptingDonation?.urgency === "High" ? "text-red-500" : "text-amber-600"}`}
                    >
                      {acceptingDonation?.urgency}
                    </p>
                  </div>
                </div>
                <div
                  className="p-2.5 border rounded-xl space-y-1 shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <p
                    className="text-[8px] font-black uppercase tracking-[0.1em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Quantity
                  </p>
                  <div className="pt-1 border-t border-[var(--border-color)] flex items-center gap-1">
                    <Box size={10} style={{ color: "var(--text-muted)" }} />
                    <p
                      className="text-[12px] font-black uppercase tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {acceptingDonation?.quantity || "Units"}
                    </p>
                  </div>
                </div>
                <div
                  className="p-2.5 border rounded-xl space-y-1 shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <p
                    className="text-[8px] font-black uppercase tracking-[0.1em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Expiry
                  </p>
                  <div className="pt-1 border-t border-[var(--border-color)] flex items-center gap-1">
                    <Clock size={10} style={{ color: "var(--text-muted)" }} />
                    <p
                      className="text-[12px] font-black uppercase tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {acceptingDonation?.expiryTime || "Soon"}
                    </p>
                  </div>
                </div>
              </div>

              {acceptingDonation?.origin === "NEED" && (
                <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    Fulfillment Details
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-bold uppercase text-[var(--text-muted)] tracking-wider">
                        Amount to Donate
                      </label>
                      <div className="relative group">
                        <Box size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          type="number"
                          value={supportQty}
                          onChange={(e) => setRequestsStateValue("supportQty", e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-2 pl-9 pr-10 text-[12px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                          <button
                            onClick={() => setRequestsStateValue("supportQty", ((parseInt(supportQty) || 0) + 1).toString())}
                            className="p-0.5 hover:bg-emerald-50 rounded text-[var(--text-muted)] hover:text-emerald-600 transition-colors"
                          >
                            <ChevronUp size={10} />
                          </button>
                          <button
                            onClick={() => setRequestsStateValue("supportQty", Math.max(0, (parseInt(supportQty) || 0) - 1).toString())}
                            className="p-0.5 hover:bg-emerald-50 rounded text-[var(--text-muted)] hover:text-emerald-600 transition-colors"
                          >
                            <ChevronDown size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-bold uppercase text-[var(--text-muted)] tracking-wider">
                        Direct Contact
                      </label>
                      <div className="relative group">
                        <Phone size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          type="text"
                          value={supportPhone}
                          onChange={(e) => setRequestsStateValue("supportPhone", e.target.value)}
                          disabled={Boolean(user?.ngo_profile?.contact_number)}
                          className={`w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-2 pl-9 pr-4 text-[12px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all ${user?.ngo_profile?.contact_number ? "opacity-70 cursor-not-allowed grayscale-[0.5]" : ""}`}
                          placeholder="+1..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ResuableModal>
  );
};
