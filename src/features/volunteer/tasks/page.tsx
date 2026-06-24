// Task module for volunteer operations
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { volunteerTasksService } from "./api/tasks/tasks_api";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  ChefHat,
  Heart,
  Calendar,
  LayoutGrid,
  List as ListIcon,
  Navigation,
  User,
  CheckCircle2,
  Phone,
  Hotel,
  Building2,
  ShieldCheck,
} from "lucide-react";
import ResuableButton from "../../../global/components/reusable-components/Button";
import ReusableTable, {
  type ColumnDef,
} from "../../../global/components/reusable-components/Table";
import ResuableDrawer from "../../../global/components/reusable-components/Drawer";
import ResuableModal from "../../../global/components/reusable-components/Modal";
import React from "react";

interface Task {
  id: string;
  title: string;
  routeNumber: string;
  stops: number;
  duration: string;
  load: string;
  status: "IN PROGRESS" | "AVAILABLE" | "COMPLETED" | "ASSIGNED" | "PICKED_UP" | "DELIVERED" | "ACCEPTED";
  type: "delivery" | "kitchen" | "shelter";
  description?: string;
  location?: string;
  contactPerson?: string;
  partnerOrg: string;
  contactPhone: string;
  donorHotel?: string;
  ngoOrgName?: string;
  ngoPhone?: string;
  baseAddress: string;
  destinations: string[];
  isPickupReached: boolean;
  completedDestinations: number[];
  trackingHistory?: any[];
  currentStep?: number;
  pickupOtp?: string;
  deliveryOtp?: string;
  rawStatus?: string;
}

// Helper to get status styles
const getStatusStyle = (status: string) => {
  switch (status) {
    case "IN PROGRESS":
      return "text-amber-600 bg-amber-500/10 border-amber-500/20";
    case "AVAILABLE":
      return "text-[#22c55e] bg-green-500/10 border-green-500/20";
    case "COMPLETED":
      return "text-[#22c55e] bg-green-500/10 border-green-500/20";
    default:
      return "text-slate-500 bg-slate-500/10 border-slate-500/20";
  }
};

const getCategoryIcon = (type: string) => {
  switch (type) {
    case "delivery":
      return <Truck className="w-4 h-4" />;
    case "kitchen":
      return <ChefHat className="w-4 h-4" />;
    case "shelter":
      return <Heart className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

// --- CARD VIEW COMPONENT ---
const TaskCard: React.FC<{
  task: Task;
  onDetails: (task: Task) => void;
}> = ({ task, onDetails }) => {
  return (
    <div
      className="border rounded-sm p-4 space-y-4 group hover:border-[#22c55e]/40 hover:shadow-lg hover:shadow-[#22c55e]/5 transition-all duration-300 h-full flex flex-col cursor-pointer relative overflow-hidden"
      onClick={() => onDetails(task)}
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/0 to-[#22c55e]/0 group-hover:from-[#22c55e]/[0.02] group-hover:to-transparent transition-all duration-300 pointer-events-none" />

      {/* Header Section */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-sm flex items-center justify-center border shadow-sm transition-all duration-300 ${
              task.type === "delivery"
                ? "bg-green-500/10 text-[#22c55e] border-green-500/20 group-hover:shadow-[#22c55e]/20"
                : task.type === "kitchen"
                  ? "bg-orange-500/10 text-orange-600 border-orange-500/20 group-hover:shadow-orange-500/20"
                  : "bg-rose-500/10 text-rose-600 border-rose-500/20 group-hover:shadow-rose-500/20"
            }`}
          >
            {getCategoryIcon(task.type)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="text-[9px] font-black uppercase tracking-[0.1em] text-[#22c55e] px-2 py-0.5 rounded-sm border"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.05)",
                  borderColor: "rgba(34, 197, 94, 0.1)",
                }}
              >
                #{task.routeNumber}
              </span>
            </div>
            <h4
              className="text-sm font-black tracking-tight group-hover:text-[#22c55e] transition-colors line-clamp-1 leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {task.title}
            </h4>
            {task.partnerOrg && (
              <p
                className="text-[9px] font-bold uppercase tracking-wider truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {task.partnerOrg}
              </p>
            )}
          </div>
        </div>

        <span
          className={`text-[8px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-sm border shadow-sm whitespace-nowrap ${getStatusStyle(task.status)}`}
        >
          {task.status}
        </span>
      </div>

      {/* Metrics Section */}
      <div
        className="relative flex items-center gap-4 px-3 py-2 rounded-sm border"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div
          className="flex items-center gap-1.5 text-[10px] font-bold"
          style={{ color: "var(--text-secondary)" }}
        >
          <MapPin size={13} className="text-[#22c55e]" />
          <span>{task.stops} stops</span>
        </div>
        <div
          className="w-px h-3"
          style={{ backgroundColor: "var(--border-color)" }}
        />
        <div
          className="flex items-center gap-1.5 text-[10px] font-bold"
          style={{ color: "var(--text-secondary)" }}
        >
          <Clock size={13} className="text-[#22c55e]" />
          <span>{task.duration}</span>
        </div>
      </div>

      {/* Footer Section */}
      <div
        className="relative pt-3 border-t mt-auto flex items-center justify-between gap-3"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="flex flex-col">
          <span
            className="text-[8px] font-black uppercase tracking-[0.15em] mb-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            Load Capacity
          </span>
          <span
            className="text-xs font-black uppercase tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {task.load}
          </span>
        </div>

        <ResuableButton
          variant="primary"
          className="h-9 px-5 !rounded-sm text-[9px] font-black uppercase tracking-[0.12em] bg-[#22c55e] hover:bg-[#1ea34d] shadow-md shadow-[#22c55e]/25 hover:shadow-[#22c55e]/40 transition-all duration-300"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onDetails(task);
          }}
        >
          {task.status === "AVAILABLE"
            ? "Accept"
            : task.status === "IN PROGRESS"
              ? "Update"
              : "Details"}
        </ResuableButton>
      </div>
    </div>
  );
};


const VolunteerTasks = () => {
  const [activeTab, setActiveTab] = useState<"active" | "opps" | "past">(
    "active",
  );
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<{
    active: Task[];
    opps: Task[];
    past: Task[];
  }>({
    active: [],
    opps: [],
    past: [],
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const [oppsRaw, activeRaw] = await Promise.all([
        volunteerTasksService.getNearbyPickups(),
        volunteerTasksService.getMyTasks()
      ]);

      const mapTask = (d: any): Task => ({
        id: d?.id?.toString() || Math.random().toString(),
        title: d?.food_category || d?.title || "Donation Dispatch",
        routeNumber: d?.id ? `PK-${d.id}` : "TBD",
        stops: 1,
        duration: "Quick",
        load: `${d?.quantity} ${d?.unit || 'Kg'}` || "0",
        status: d?.status === "ACCEPTED" ? "AVAILABLE" : (d?.status === "ASSIGNED" || d?.status === "PICKED_UP" ? "IN PROGRESS" : (d?.status === "DELIVERED" ? "COMPLETED" : "AVAILABLE")),
        type: "delivery",
        description: d?.description || "High-priority food pickup for community distribution.",
        location: d?.pickup_address || "TBD",
        partnerOrg: d?.donor_name || d?.donor?.username || "Private Donor",
        contactPhone: d?.donor_phone || "Contact via App",
        donorHotel: d?.donor_name || "Food Source",
        ngoOrgName: d?.ngo_name || d?.accepted_ngo?.username || "Receiving NGO",
        ngoPhone: d?.ngo_phone || "Contact via App",
        baseAddress: d?.pickup_address || "TBD",
        destinations: [d?.ngo_name || "Assigned NGO Hub"],
        isPickupReached: d?.status === "PICKED_UP" || d?.status === "DELIVERED",
        completedDestinations: d?.status === "DELIVERED" ? [0] : [],
        trackingHistory: d?.tracking_history || [],
        pickupOtp: d?.pickup_otp,
        deliveryOtp: d?.delivery_otp,
        rawStatus: d?.status || "PENDING",
      });

      setTasks({
        active: Array.isArray(activeRaw) ? activeRaw.filter((d: any) => {
          const s = String(d?.status || "").toUpperCase();
          return s === "PICKED_UP" || s === "ASSIGNED" || s === "IN PROGRESS";
        }).map(mapTask) : [],
        opps: Array.isArray(oppsRaw) ? oppsRaw.map(mapTask) : [],
        past: Array.isArray(activeRaw) ? activeRaw.filter((d: any) => {
          const s = String(d?.status || "").toUpperCase();
          return s === "DELIVERED" || s === "COMPLETED";
        }).map(mapTask) : [],
      });
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);


  const handleDetailsClick = (task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };



  const performVerification = async (type: 'pickup' | 'delivery', code: string) => {
    if (!selectedTask) {
      toast.error("No task selected.");
      return;
    }

    if (!code || code.length < 4) {
      toast.error("Please enter a valid 4-digit code.");
      return;
    }

    try {
        if (type === "pickup") {
            await volunteerTasksService.markAsPickedUp(Number(selectedTask.id), code);
            toast.success("Food picked up successfully!");
        } else {
            await volunteerTasksService.markAsDelivered(Number(selectedTask.id), code);
            toast.success("Delivery confirmed! Great job hero.");
        }
        
        setOtpValue("");
        fetchTasks(); // Refresh state from backend
        
        if (type === "delivery") {
            setIsDrawerOpen(false);
        }
    } catch (error: any) {
        toast.error(error.response?.data?.error || "Invalid security code. Please check with the coordinator.");
    }
  };



  const handleConfirmClaim = async () => {
    if (!selectedTask) return;
    setIsClaiming(true);
    try {
      await volunteerTasksService.acceptPickup(Number(selectedTask.id));
      toast.success("Task accepted and added to your dispatch!");
      setIsClaimModalOpen(false);
      fetchTasks(); // Refresh
    } catch (error) {
      toast.error("Failed to accept task. It might already be taken.");
    } finally {
      setIsClaiming(false);
    }
  };


  const getCurrentTasks = () => {
    switch (activeTab) {
      case "active":
        return tasks.active;
      case "opps":
        return tasks.opps;
      case "past":
        return tasks.past;
      default:
        return [];
    }
  };

  const tableColumns: ColumnDef[] = [
    { uid: "title", name: "Task Details", align: "start" },
    { uid: "metrics", name: "Metrics", align: "start" },
    { uid: "load", name: "Inventory", align: "start" },
    { uid: "status", name: "Status", align: "start" },
    { uid: "actions", name: "Actions", align: "end" },
  ];

  const renderCell = useCallback((task: Task, columnKey: React.Key) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="flex items-center gap-3 text-start">
            <div
              className={`w-10 h-10 rounded-md border flex items-center justify-center shrink-0 ${
                task.type === "delivery"
                  ? "bg-emerald-500/10 text-[#22c55e] border-emerald-500/20"
                  : task.type === "kitchen"
                    ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    : "bg-rose-500/10 text-rose-500 border-rose-500/20"
              }`}
            >
              {getCategoryIcon(task.type)}
            </div>
            <div>
              <p
                className="text-sm font-black tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2">
                <p
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Route #{task.routeNumber}
                </p>
                {task.partnerOrg && (
                  <span className="text-[10px] font-black text-[#22c55e] uppercase tracking-widest">
                    • {task.partnerOrg}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      case "metrics":
        return (
          <div className="flex items-center gap-4 text-start">
            <div className="flex flex-col">
              <span
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Stops
              </span>
              <span
                className="text-[11px] font-bold uppercase"
                style={{ color: "var(--text-secondary)" }}
              >
                {task.stops} pts
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Est.
              </span>
              <span
                className="text-[11px] font-bold uppercase"
                style={{ color: "var(--text-secondary)" }}
              >
                {task.duration}
              </span>
            </div>
          </div>
        );
      case "load":
        return (
          <div className="text-start">
            <span
              className="px-2.5 py-1 border rounded-md text-[10px] font-black uppercase tracking-widest"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
                color: "var(--text-secondary)",
              }}
            >
              {task.load}
            </span>
          </div>
        );
      case "status":
        return (
          <div className="text-start">
            <span
              className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm border ${getStatusStyle(task.status)}`}
            >
              {task.status}
            </span>
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end gap-2 pr-4">
            <ResuableButton
              variant="primary"
              className="h-8 px-6 !rounded-sm text-[10px] font-black tracking-widest uppercase shadow-sm bg-[#22c55e] hover:bg-green-600"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleDetailsClick(task);
              }}
            >
              {task.status === "AVAILABLE"
                ? "Claim"
                : task.status === "IN PROGRESS"
                  ? "Update"
                  : "Details"}
            </ResuableButton>
          </div>
        );
      default:
        return null;
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-full flex flex-col"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Header Section */}
      <div
        className="sticky top-0 z-20 border-b shadow-sm"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_#22c55e]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#22c55e]/70">Central Dispatch</span>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-black tracking-tighter uppercase leading-none mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Volunteer <span className="text-[#22c55e] drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">Terminal</span>
              </h1>
              <div className="flex flex-wrap items-center justify-start gap-4">
                <div
                  className="flex items-center gap-2 px-3 py-1 rounded-sm border bg-black/20"
                  style={{
                    borderColor: "rgba(34, 197, 94, 0.2)",
                  }}
                >
                  <Navigation className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span className="text-[9px] font-black text-[#22c55e] uppercase tracking-widest leading-none">
                    Mission Control Active
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Calendar size={14} className="text-[#22c55e]/40" />{" "}
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
              {/* Tabs Switcher - Left Aligned */}
              <div
                className="flex items-center gap-1 p-1 rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                {[
                  { id: "active", label: "Active", count: tasks.active.length },
                  {
                    id: "opps",
                    label: "Available",
                    count: tasks.opps.length,
                  },
                  { id: "past", label: "History", count: tasks.past.length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 sm:px-4 py-2 rounded-md transition-all flex items-center gap-2 whitespace-nowrap flex-1 sm:flex-none justify-center ${
                      activeTab === tab.id ? "shadow-sm border" : ""
                    }`}
                    style={{
                      backgroundColor:
                        activeTab === tab.id
                          ? "var(--bg-primary)"
                          : "transparent",
                      borderColor:
                        activeTab === tab.id
                          ? "var(--border-color)"
                          : "transparent",
                      color:
                        activeTab === tab.id ? "#22c55e" : "var(--text-muted)",
                    }}
                  >
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                      {tab.label}
                    </span>
                    <span
                      className="text-[8px] sm:text-[9px] font-black px-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          activeTab === tab.id
                            ? "rgba(34, 197, 94, 0.1)"
                            : "rgba(148, 163, 184, 0.1)",
                        color:
                          activeTab === tab.id
                            ? "#22c55e"
                            : "var(--text-muted)",
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* View Switcher */}
              <div
                className="flex items-center gap-1 p-1 rounded-lg shrink-0"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition-all ${viewMode === "table" ? "shadow-sm" : ""}`}
                  style={{
                    backgroundColor:
                      viewMode === "table"
                        ? "var(--bg-primary)"
                        : "transparent",
                    color:
                      viewMode === "table" ? "#22c55e" : "var(--text-muted)",
                  }}
                >
                  <ListIcon size={16} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "shadow-sm" : ""}`}
                  style={{
                    backgroundColor:
                      viewMode === "grid" ? "var(--bg-primary)" : "transparent",
                    color:
                      viewMode === "grid" ? "#22c55e" : "var(--text-muted)",
                  }}
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 pb-16">
        {getCurrentTasks().length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {viewMode === "table" ? (
              <div className="w-full">
                <ReusableTable
                  data={getCurrentTasks()}
                  columns={tableColumns}
                  renderCell={renderCell}
                  onRowClick={(task: Task) => handleDetailsClick(task)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {getCurrentTasks().map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDetails={handleDetailsClick}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 md:py-24 px-6 bg-white border border-slate-100 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute top-10 left-10 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-60" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Illustration */}
              <div className="relative w-48 h-36 md:w-64 md:h-48 mb-8">
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  src="/empty_food.png"
                  alt="No Tasks Illustration"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Content */}
              <div className="space-y-4 mb-10">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800">
                  No relevant tasks found
                </h3>
                <p className="text-[var(--text-muted)] text-sm md:text-base max-w-sm mx-auto font-medium leading-relaxed uppercase tracking-widest">
                  You're all caught up! Check the available tab for new missions.
                </p>
              </div>

              <ResuableButton
                variant="primary"
                className="px-10 py-6 !rounded-2xl text-[12px] font-black uppercase tracking-widest bg-[#22c55e] hover:bg-[#16a34a] shadow-xl shadow-green-500/20 active:scale-95"
                onClick={() => setActiveTab("opps")}
              >
                Browse Available Missions
              </ResuableButton>
            </div>
          </motion.div>
        )}
      </div>
      <ResuableDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Task Details"
        subtitle={`Route #${selectedTask?.routeNumber} • Information`}
        size="md"
        footer={
          selectedTask &&
          selectedTask.status === "AVAILABLE" && (
            <ResuableButton
              variant="primary"
              className="w-full bg-[#22c55e] h-11 !rounded-sm text-xs font-black uppercase tracking-widest"
              onClick={() => setIsClaimModalOpen(true)}
            >
              Claim Task
            </ResuableButton>
          )
        }
      >
        {selectedTask && (
          <div className="space-y-6 p-6">
            <div
              className="flex items-start gap-5 p-5 rounded-md border"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div
                className={`w-12 h-12 rounded-sm flex items-center justify-center text-2xl border ${
                  selectedTask.type === "delivery"
                    ? "bg-emerald-500/10 text-[#22c55e] border-emerald-500/20"
                    : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                }`}
              >
                {getCategoryIcon(selectedTask.type || "delivery")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1 mb-2">
                  <h3
                    className="text-lg font-black leading-tight truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {selectedTask.title}
                  </h3>
                  {selectedTask.partnerOrg && (
                    <p className="text-[10px] font-black text-[#22c55e] uppercase tracking-widest leading-none">
                      {selectedTask.partnerOrg}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${getStatusStyle(selectedTask.status)}`}
                  >
                    {selectedTask.status}
                  </span>
                  <span
                    className="text-[9px] font-black uppercase tracking-widest opacity-40"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ID: {selectedTask.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="border p-4 rounded-md flex flex-col items-center text-center space-y-1 shadow-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <span
                  className="text-[8px] font-black uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Load Metrics
                </span>
                <p
                  className="text-sm font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  {selectedTask.load}
                </p>
              </div>
              <div
                className="border p-4 rounded-md flex flex-col items-center text-center space-y-1 shadow-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <span
                  className="text-[8px] font-black uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Est. Duration
                </span>
                <p
                  className="text-sm font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  {selectedTask.duration}
                </p>
              </div>
            </div>

            <div className="space-y-6">
                {/* Visual Tracker Stepper - Premium Mission Pulse */}
                <div className="relative py-8 px-2 overflow-hidden bg-[#22c55e]/[0.03] backdrop-blur-[2px] rounded-2xl border border-[#22c55e]/10 shadow-[inner_0_0_20px_rgba(34,197,94,0.02)]">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#22c55e]/5 to-transparent opacity-50" />
                   <div className="flex justify-between items-start w-full relative z-10 px-4">
                    {[
                      { label: "Food Posted", status: true },
                      { label: "NGO Matched", status: ["ACCEPTED", "ASSIGNED", "PICKED_UP", "DELIVERED"].includes(selectedTask.rawStatus || "") },
                      { 
                        label: "Volunteer Claim", 
                        status: ["ASSIGNED", "PICKED_UP", "DELIVERED"].includes(selectedTask.rawStatus || "") 
                      },
                      { label: "Pickup Verified", status: ["PICKED_UP", "DELIVERED"].includes(selectedTask.rawStatus || "") },
                      { label: "Mission Complete", status: selectedTask.rawStatus === "DELIVERED" }
                    ].map((step, idx, arr) => {
                      const isCurrent = (idx === 0 && (selectedTask.rawStatus === "PENDING")) ||
                                       (idx === 1 && selectedTask.rawStatus === "ACCEPTED") ||
                                       (idx === 2 && selectedTask.rawStatus === "ASSIGNED") ||
                                       (idx === 3 && selectedTask.rawStatus === "PICKED_UP") ||
                                       (idx === 4 && selectedTask.rawStatus === "DELIVERED");
                      
                      return (
                      <div key={idx} className="flex flex-col items-center relative flex-1">
                        {/* Connecting Line */}
                        {idx < arr.length - 1 && (
                          <div 
                            className="absolute h-[1.5px] w-[calc(100%-24px)] left-[calc(50%+12px)] top-[11px]"
                            style={{ 
                              backgroundColor: step.status && arr[idx+1]?.status 
                                ? "#22c55e" 
                                : "var(--border-color)",
                              opacity: step.status && arr[idx+1]?.status ? 0.8 : 0.2,
                              boxShadow: step.status && arr[idx+1]?.status ? "0 0 10px #22c55e" : "none"
                            }}
                          />
                        )}
                        
                        {/* Node */}
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-700 relative flex-shrink-0 ${
                            step.status 
                              ? "bg-[#22c55e] border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                              : "bg-black/[0.03] border-[#22c55e]/20"
                          } ${isCurrent ? "ring-4 ring-[#22c55e]/10 !border-[#22c55e]/40" : ""}`}
                        >
                          {step.status ? (
                            <CheckCircle2 size={12} className="text-white" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]/20" />
                          )}
                          
                          {/* Pulsing indicator for current step */}
                          {isCurrent && (
                            <div className="absolute inset-0 rounded-full animate-ping bg-[#22c55e]/30" />
                          )}
                        </div>
                        
                        <div className="mt-3 h-8 flex items-start justify-center text-center w-full px-1">
                          <span className={`text-[8px] font-black uppercase tracking-tight leading-[1.1] transition-colors duration-500 line-clamp-2 ${
                            step.status ? "text-[#22c55e]" : "text-[var(--text-muted)]"
                          } ${isCurrent ? "text-[var(--text-primary)]" : ""}`}>
                            {step.label}
                          </span>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>

                {/* Donor & NGO Context Cards - Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Donor (Who is donating) */}
                  <div 
                    className="p-4 rounded-xl border relative overflow-hidden group hover:border-[#22c55e]/30 transition-all duration-300"
                    style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-all duration-500">
                      <Hotel className="w-12 h-12 text-[#22c55e]" />
                    </div>
                    <div className="relative z-10">
                      <h5 className="text-[9px] font-black uppercase tracking-widest text-[#22c55e] mb-2">Source (Donor)</h5>
                      <p className="text-base font-black uppercase tracking-tighter text-[var(--text-primary)] leading-none mb-1">
                        {selectedTask.partnerOrg}
                      </p>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] mb-3 italic">
                        Authorized Donor
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-black text-[var(--text-primary)]">
                        <Phone size={12} className="text-[#22c55e]" />
                        {selectedTask.contactPhone}
                      </div>

                      {/* Pickup OTP Input Embedded */}
                      {selectedTask.rawStatus === "ASSIGNED" && (
                        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                           <p className="text-[8px] font-black uppercase tracking-widest text-[#22c55e] mb-2">Enter Pickup Code</p>
                           <div className="flex gap-2">
                             <input 
                               type="text" 
                               maxLength={4}
                               className="flex-1 bg-white/5 border border-[var(--border-color)] rounded-lg text-center font-black tracking-widest text-sm h-9 outline-none focus:border-[#22c55e]/50 transition-all"
                               placeholder="----"
                               value={otpValue}
                               onChange={(e) => setOtpValue(e.target.value)}
                             />
                             <ResuableButton 
                               className="h-9 px-3 bg-[#22c55e] !rounded-lg text-[9px]"
                               onClick={() => performVerification('pickup', otpValue)}
                             >
                               Unlock
                             </ResuableButton>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* NGO (Who is receiving) */}
                  <div 
                    className="p-4 rounded-xl border relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300"
                    style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-all duration-500">
                      <Building2 className="w-12 h-12 text-blue-500" />
                    </div>
                    <div className="relative z-10">
                      <h5 className="text-[9px] font-black uppercase tracking-widest text-blue-500 mb-2">Destination (NGO)</h5>
                      <p className="text-base font-black uppercase tracking-tighter text-[var(--text-primary)] leading-none mb-1">
                        {selectedTask.ngoOrgName}
                      </p>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] mb-3 italic">
                         Secure Handover Protocol
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-black text-[var(--text-primary)]">
                        <Phone size={12} className="text-blue-500" />
                        {selectedTask.ngoPhone || "987-654-3210"}
                      </div>

                      {/* Delivery OTP Input Embedded */}
                      {selectedTask.rawStatus === "PICKED_UP" && (
                        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                           <p className="text-[8px] font-black uppercase tracking-widest text-blue-500 mb-2">Enter Delivery Code</p>
                           <div className="flex gap-2">
                             <input 
                               type="text" 
                               maxLength={4}
                               className="flex-1 bg-white/5 border border-[var(--border-color)] rounded-lg text-center font-black tracking-widest text-sm h-9 outline-none focus:border-blue-500/50 transition-all"
                               placeholder="----"
                               value={otpValue}
                               onChange={(e) => setOtpValue(e.target.value)}
                             />
                             <ResuableButton 
                               className="h-9 px-3 bg-blue-500 !rounded-lg text-[9px]"
                               onClick={() => performVerification('delivery', otpValue)}
                             >
                               Verify
                             </ResuableButton>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pickup Location Card */}
                <div className="relative pl-10">
                  <div className="absolute left-[11px] top-0 bottom-0 w-px" style={{ backgroundColor: "var(--border-color)" }} />
                  <div className="absolute left-[4px] top-0 w-3.5 h-3.5 rounded-full border-2 ring-4 z-10" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", boxShadow: "0 0 0 4px var(--bg-secondary)" }} />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Navigation size={12} className="text-[#22c55e]" />
                       <p className="text-[11px] font-black uppercase tracking-tight text-[var(--text-primary)]">
                         Pickup from Donor Hub
                       </p>
                    </div>
                    <div className="p-4 rounded-xl border transition-all duration-300 bg-[var(--bg-primary)] border-[var(--border-color)]">
                      <h5 className="text-xs font-black mb-1 text-[var(--text-primary)]">
                        {selectedTask.location || "Main Entrance / Reception"}
                      </h5>
                      <p className="text-[10px] font-bold leading-relaxed text-[var(--text-secondary)] italic">
                        {selectedTask.baseAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tracking Progress Detail */}
                <div className="relative pl-10">
                   <div className="absolute left-[11px] top-0 bottom-0 w-px" style={{ backgroundColor: "var(--border-color)" }} />
                   <div className="absolute left-[4px] top-0 w-3.5 h-3.5 rounded-full border-2 ring-4 z-10" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", boxShadow: "0 0 0 4px var(--bg-secondary)" }} />
                   
                   <div className="space-y-4">
                      <div className="flex items-center gap-2">
                         <MapPin size={12} className="text-red-500" />
                         <p className="text-[11px] font-black uppercase tracking-tight text-[var(--text-primary)]">
                           Delivery Progress ({selectedTask.status})
                         </p>
                      </div>
                      
                      <div className="p-4 rounded-xl border bg-blue-500/5 border-blue-500/10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Truck size={14} className="text-blue-500" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-tight text-[var(--text-primary)]">
                              Current Destination: {selectedTask.ngoOrgName}
                            </p>
                            <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                              NGO Hub Distribution Point
                            </p>
                          </div>
                        </div>
                      </div>
                   </div>
                </div>

                {selectedTask.status === "COMPLETED" && (
                  <div className="p-4 rounded-xl border flex items-center gap-4 bg-green-500/5 border-green-500/10">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-green-100 shadow-sm text-[#22c55e] dark:bg-black dark:border-green-500/20">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="text-start">
                      <p className="text-[11px] font-black text-green-700 uppercase tracking-tight dark:text-green-400">
                        Delivery Protocol Successfully Verified
                      </p>
                      <p className="text-[9px] font-bold text-green-600/60 uppercase tracking-widest">
                        OTP Match • Jan 10, 2026 • 11:45 AM
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Dynamic OTP Display Code - Secure Handover */}
                {selectedTask.status !== "COMPLETED" && (
                  <div className="flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-dashed border-[#22c55e]/20 bg-[#22c55e]/[0.02] backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#22c55e]/5 rounded-full blur-3xl group-hover:bg-[#22c55e]/10 transition-all duration-700" />
                    
                    <div className="flex items-center gap-2 mb-2 bg-[#22c55e]/10 px-4 py-1.5 rounded-full border border-[#22c55e]/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                      <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#22c55e]">
                        Encrypted Key Protocol
                      </span>
                    </div>
                    
                    <div className="text-center relative z-10">
                       <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4 opacity-70">
                         {selectedTask.rawStatus === "ASSIGNED" 
                           ? "Handover Code for Donor pickup" 
                           : (selectedTask.rawStatus === "PICKED_UP" 
                               ? "Handover Code for NGO delivery" 
                               : "Awaiting Next Lifecycle Step")}
                       </p>
                       <div className="flex items-center justify-center gap-3">
                         {(selectedTask.rawStatus === "ASSIGNED" || selectedTask.rawStatus === "PICKED_UP") ? (
                           String(selectedTask.rawStatus === "ASSIGNED" ? selectedTask.pickupOtp : selectedTask.deliveryOtp)
                             .padStart(4, "0")
                             .split("")
                             .map((digit, i) => (
                               <div key={i} className="w-12 h-16 bg-[#22c55e]/5 border border-[#22c55e]/20 rounded-xl flex items-center justify-center text-4xl font-black text-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] transition-all duration-300 font-mono tracking-tighter">
                                 {digit}
                               </div>
                             ))
                         ) : (
                           <div className="text-3xl font-black tracking-[0.5em] text-[var(--text-primary)]/10 font-mono italic">
                             PENDING
                           </div>
                         )}
                       </div>
                    </div>
                    
                    <p className="mt-6 text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] text-center max-w-[200px] leading-relaxed">
                       Strictly Confidential • Valid for this session only • Do not share externally
                    </p>
                  </div>
                )}
            </div>

            <div className="space-y-2 text-start pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <h4
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Instructions
              </h4>
              <div
                className="p-4 rounded-sm border"
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.05)",
                  borderColor: "rgba(245, 158, 11, 0.1)",
                }}
              >
                <p className="text-xs font-bold text-amber-600 leading-relaxed italic">
                  "
                  {selectedTask.description ||
                    "Follow standard procedure. Please update the task status as you complete each step."}
                  "
                </p>
              </div>
            </div>

            {selectedTask.contactPerson && (
              <div
                className="p-4 rounded-sm border flex items-center justify-between"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border shadow-inner overflow-hidden"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <User size={16} style={{ color: "var(--text-muted)" }} />
                  </div>
                  <div className="text-start">
                    <p
                      className="text-[11px] font-black uppercase leading-none mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedTask.contactPerson}
                    </p>
                    <p
                      className="text-[9px] font-bold tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      ON-SITE COORDINATOR
                    </p>
                  </div>
                </div>
                {selectedTask.contactPhone && (
                  <ResuableButton
                    variant="secondary"
                    className="h-8 w-8 !p-0 !rounded-full"
                  >
                    <Phone size={14} className="text-[#22c55e]" />
                  </ResuableButton>
                )}
              </div>
            )}
          </div>
        )}
      </ResuableDrawer>


      {/* Accept Task Modal */}
      <ResuableModal
        isOpen={isClaimModalOpen}
        onOpenChange={setIsClaimModalOpen}
        title="Task Acceptance"
        subtitle="Confirm Acceptance"
        size="sm"
        footer={
          <div className="flex gap-2 w-full">
            <ResuableButton
              variant="secondary"
              className="flex-1"
              onClick={() => setIsClaimModalOpen(false)}
            >
              Abort
            </ResuableButton>
            <ResuableButton
              variant="primary"
              className="flex-1 bg-[#22c55e]"
              onClick={handleConfirmClaim}
              disabled={isClaiming}
            >
              {isClaiming ? "Accepting..." : "Confirm"}
            </ResuableButton>
          </div>
        }
      >
        {selectedTask && (
          <div className="p-6 text-center space-y-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.05)",
                borderColor: "rgba(34, 197, 94, 0.1)",
                color: "#22c55e",
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h3
                className="text-lg font-black uppercase tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Accept Task?
              </h3>
              <p
                className="text-xs font-bold leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                You are about to accept{" "}
                <span style={{ color: "var(--text-primary)" }}>
                  "{selectedTask.title}"
                </span>
                . This task will be added to your active list.
              </p>
            </div>
            <div
              className="flex items-center justify-center gap-4 pt-2 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex flex-col">
                <span
                  className="text-[8px] font-black uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  Load
                </span>
                <span
                  className="text-xs font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  {selectedTask.load}
                </span>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[8px] font-black uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  Est. Time
                </span>
                <span
                  className="text-xs font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  {selectedTask.duration}
                </span>
              </div>
            </div>
          </div>
        )}
      </ResuableModal>


    </div>
  );
};

export default VolunteerTasks;
