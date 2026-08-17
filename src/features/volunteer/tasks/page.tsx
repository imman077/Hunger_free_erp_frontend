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
  Search,
  X,
  ChevronDown,
  RotateCcw,
  Tag,
} from "lucide-react";
import ResuableButton from "../../../global/components/reusable-components/Button";
import ReusableTable, {
  type ColumnDef,
} from "../../../global/components/reusable-components/Table";
import ResuableDrawer from "../../../global/components/reusable-components/Drawer";
import ResuableModal from "../../../global/components/reusable-components/Modal";
import Tabs from "../../../global/components/reusable-components/Tabs";
import React from "react";
import { Loader } from "../../../global/components/reusable-components/Loader";

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
  createdAt?: string;
  expiryTime?: string;
  category?: string;
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

// --- CARD VIEW COMPONENT ---
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

const TaskCard: React.FC<{
  task: Task;
  onDetails: (task: Task) => void;
}> = ({ task, onDetails }) => {
  return (
    <div
      onClick={() => onDetails(task)}
      className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[1.75rem] p-4 shadow-sm hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between h-full group/card cursor-pointer relative overflow-hidden text-start"
    >
      {/* Aspect Ratio Image Container */}
      <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden relative mb-3.5 bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shrink-0">
        <img
          src={getCategoryThumbnail(task.title)}
          alt={task.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
        
        {/* Badges on top of image */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-wider">
          #{task.routeNumber}
        </span>
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm bg-white/90 dark:bg-slate-950/90 ${getStatusStyle(task.status)}`}>
          {task.status}
        </span>
      </div>

      {/* Info Block */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-snug line-clamp-1 group-hover/card:text-[#22c55e] transition-colors mb-2">
          {task.title}
        </h4>
        <div className="flex flex-col gap-1 mb-3.5">
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500">
            <Hotel size={12} className="text-[#22c55e] shrink-0" />
            <span className="font-semibold text-slate-400 dark:text-slate-500 mr-0.5 select-none">From:</span>
            <span className="truncate text-slate-700 dark:text-slate-300 font-extrabold">{task.partnerOrg || "Private Donor"}</span>
          </p>
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500">
            <Building2 size={12} className="text-blue-500 shrink-0" />
            <span className="font-semibold text-slate-400 dark:text-slate-500 mr-0.5 select-none">To:</span>
            <span className="truncate text-slate-700 dark:text-slate-300 font-extrabold">{task.ngoOrgName || "Receiving NGO"}</span>
          </p>
        </div>
      </div>

      {/* 2-Column Metrics Box */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50/50 dark:bg-slate-950/15 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-2.5 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100/50 dark:border-emerald-900/30">
            <MapPin size={12} className="stroke-[2.2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-black text-slate-400 tracking-wider leading-none mb-0.5">STOPS</span>
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 truncate">{task.stops} pts</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-blue-100/50 dark:border-blue-900/30">
            <Package size={12} className="stroke-[2.2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-black text-slate-400 tracking-wider leading-none mb-0.5">LOAD</span>
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 truncate">{task.load}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 dark:bg-slate-800/80 w-full mb-3.5" />

      {/* Footer Row */}
      <div className="flex items-center justify-between gap-3 mt-auto">
        <div className="flex flex-col text-start justify-center">
          <span className="text-[8px] font-black text-slate-400 tracking-wider uppercase leading-none mb-1">
            EST. DURATION
          </span>
          <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-tight">
            {task.duration}
          </span>
        </div>

        <ResuableButton
          variant="primary"
          className="h-8.5 px-4.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-[#22c55e] hover:bg-green-600 text-white shadow-md shadow-emerald-500/10 transition-all duration-300 shrink-0"
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortFilter, setSortFilter] = useState("NEWEST");

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
        title: d?.foodType || d?.food_category || d?.title || "Donation Dispatch",
        routeNumber: d?.id ? `PK-${d.id}` : "TBD",
        stops: 1,
        duration: "Quick",
        load: (() => {
          const qty = String(d?.quantity || "").trim();
          const unit = String(d?.unit || "").trim();
          if (!qty) return "0";
          const qtyLower = qty.toLowerCase();
          if (qtyLower.includes("kg") || qtyLower.includes("meal") || qtyLower.includes("packet") || qtyLower.includes("loaves") || qtyLower.includes("bag") || qtyLower.includes("tin") || qtyLower.includes("litre") || qtyLower.includes("pc")) {
            return qty;
          }
          return unit ? `${qty} ${unit}` : `${qty} Kg`;
        })(),
        status: d?.status === "ACCEPTED" ? "AVAILABLE" : (d?.status === "ASSIGNED" || d?.status === "PICKED_UP" ? "IN PROGRESS" : (d?.status === "DELIVERED" ? "COMPLETED" : "AVAILABLE")),
        type: "delivery",
        description: d?.description || "High-priority food pickup for community distribution.",
        location: d?.pickupAddress || d?.pickup_address || "TBD",
        partnerOrg: d?.donor_name || d?.donor?.username || d?.donor || "Private Donor",
        contactPhone: d?.contactPhone || d?.contact_phone || d?.donor_phone || "Contact via App",
        donorHotel: d?.donor_name || d?.donor || "Food Source",
        ngoOrgName: d?.ngo_name || d?.accepted_ngo?.username || d?.ngo || "Receiving NGO",
        ngoPhone: d?.ngo_phone || d?.ngoPhone || "Contact via App",
        baseAddress: d?.pickupAddress || d?.pickup_address || "TBD",
        destinations: [d?.ngo_name || d?.ngo || "Assigned NGO Hub"],
        isPickupReached: d?.status === "PICKED_UP" || d?.status === "DELIVERED",
        completedDestinations: d?.status === "DELIVERED" ? [0] : [],
        trackingHistory: d?.tracking_history || [],
        pickupOtp: d?.pickup_otp || "123456",
        deliveryOtp: d?.delivery_otp || "123456",
        rawStatus: d?.status || "PENDING",
        createdAt: d?.createdAt || d?.created_at || new Date().toISOString(),
        expiryTime: d?.expiryTime || d?.expiry_time || "",
        category: d?.category || d?.food_category || "Dry Ration",
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
    console.log("🚀 performVerification started: type =", type, "code =", code, "selectedTask ID =", selectedTask?.id);
    if (!selectedTask) {
      toast.error("No task selected.");
      return;
    }

    const cleanCode = String(code || "").trim();
    if (!cleanCode || cleanCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    setIsVerifying(true);
    try {
        if (type === "pickup") {
            await volunteerTasksService.markAsPickedUp(selectedTask.id, cleanCode);
            toast.success("Food picked up successfully! NGO address details and delivery input are now unlocked.");
            setSelectedTask(prev => prev ? {
              ...prev,
              rawStatus: "PICKED_UP",
              status: "IN PROGRESS",
              isPickupReached: true
            } : null);
        } else {
            await volunteerTasksService.markAsDelivered(selectedTask.id, cleanCode);
            toast.success("Delivery confirmed! Great job hero.");
            setSelectedTask(prev => prev ? {
              ...prev,
              rawStatus: "DELIVERED",
              status: "COMPLETED",
              isPickupReached: true
            } : null);
        }
        
        setOtpValue("");
        await fetchTasks(); // Refresh state from backend
        
        if (type === "delivery") {
            setIsDrawerOpen(false);
        }
    } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || "Invalid security code. Please check with the coordinator.");
    } finally {
        setIsVerifying(false);
    }
  };



  const handleConfirmClaim = async () => {
    if (!selectedTask) return;
    setIsClaiming(true);
    try {
      await volunteerTasksService.acceptPickup(selectedTask.id);
      toast.success("Task accepted and added to your dispatch!");
      setIsClaimModalOpen(false);
      setIsDrawerOpen(false); // Close details drawer
      setActiveTab("active"); // Redirect/switch to Active tasks tab
      fetchTasks(); // Refresh
    } catch (error) {
      toast.error("Failed to accept task. It might already be taken.");
    } finally {
      setIsClaiming(false);
    }
  };


  const getCurrentTasks = () => {
    let list: Task[] = [];
    switch (activeTab) {
      case "active":
        list = tasks.active;
        break;
      case "opps":
        list = tasks.opps;
        break;
      case "past":
        list = tasks.past;
        break;
      default:
        list = [];
    }

    // Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((t) => 
        t.title?.toLowerCase().includes(q) ||
        t.partnerOrg?.toLowerCase().includes(q) ||
        t.routeNumber?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.load?.toLowerCase().includes(q)
      );
    }

    // Apply Status Filter
    if (statusFilter !== "ALL") {
      const target = statusFilter.toUpperCase();
      list = list.filter((t) => t.status === target || t.rawStatus === target);
    }

    // Apply Category/Type Filter
    if (typeFilter !== "ALL") {
      const target = typeFilter.toLowerCase();
      list = list.filter((t) => t.type === target);
    }

    // Apply Sorting
    return list.sort((a, b) => {
      const isANum = a.id && !isNaN(Number(a.id));
      const isBNum = b.id && !isNaN(Number(b.id));
      
      if (sortFilter === "OLDEST") {
        if (isANum && isBNum) {
          return Number(a.id) - Number(b.id);
        }
        return String(a.id || "").localeCompare(String(b.id || ""));
      }
      // Default / NEWEST
      if (isANum && isBNum) {
        return Number(b.id) - Number(a.id);
      }
      return String(b.id || "").localeCompare(String(a.id || ""));
    });
  };

  const tableColumns: ColumnDef[] = [
    { uid: "id", name: "ID", sortable: true },
    { uid: "title", name: "Task Details", align: "start" },
    { uid: "source", name: "Route Hubs", align: "start" },
    { uid: "load", name: "Inventory", align: "start" },
    { uid: "duration", name: "Est. Duration", align: "start" },
    { uid: "status", name: "Status", align: "start" },
    { uid: "actions", name: "Actions", align: "end" },
  ];

  const renderCell = useCallback((task: Task, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return (
          <div className="text-start">
            <span className="text-[10px] font-black tracking-widest uppercase border px-2 py-1 rounded-lg bg-slate-50/50 dark:bg-slate-950/20 border-slate-200/50 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              #{task.routeNumber}
            </span>
          </div>
        );
      case "title":
        return (
          <div className="flex items-center gap-3 text-start py-1.5">
            <img
              src={getCategoryThumbnail(task.title)}
              alt={task.title}
              className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800/80 shrink-0"
            />
            <div>
              <p
                className="text-xs font-black tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {task.title}
              </p>
              <span className="text-[9px] font-black text-[#22c55e] uppercase tracking-widest block mt-0.5">
                {task.type} Stop
              </span>
            </div>
          </div>
        );
      case "source":
        return (
          <div className="flex flex-col gap-1 text-start py-1">
            <div className="flex items-center gap-1.5">
              <Hotel size={12} className="text-[#22c55e] shrink-0" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mr-0.5 select-none">From:</span>
              <span className="text-xs font-extrabold truncate max-w-[140px] text-[var(--text-primary)]">
                {task.partnerOrg || "Private Donor"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 size={12} className="text-blue-500 shrink-0" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mr-0.5 select-none">To:</span>
              <span className="text-xs font-extrabold truncate max-w-[140px] text-[var(--text-primary)]">
                {task.ngoOrgName || "Receiving NGO"}
              </span>
            </div>
          </div>
        );
      case "load":
        return (
          <div className="text-start">
            <span className="px-2.5 py-1 border rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-50/50 dark:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/30 text-blue-600 dark:text-blue-400">
              {task.load}
            </span>
          </div>
        );
      case "duration":
        return (
          <div className="flex items-center gap-1.5 text-start py-1.5 text-xs font-black" style={{ color: "var(--text-secondary)" }}>
            <Clock size={13} className="text-[#22c55e]" />
            <span>{task.duration}</span>
          </div>
        );
      case "status":
        return (
          <div className="text-start py-1.5">
            <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg border shadow-sm bg-white/90 dark:bg-slate-950/90 ${getStatusStyle(task.status)}`}>
              {task.status}
            </span>
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end gap-2">
            <ResuableButton
              variant="primary"
              className="h-8 px-4 rounded-lg text-[9px] font-black tracking-widest uppercase shadow-sm bg-[#22c55e] hover:bg-green-600 text-white"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleDetailsClick(task);
              }}
            >
              {task.status === "AVAILABLE"
                ? "Accept"
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
    return <Loader text="Syncing Tasks..." minHeight="400px" />;
  }

  const isNgoLocked = selectedTask ? (selectedTask.rawStatus === "ASSIGNED" || selectedTask.rawStatus === "ACCEPTED" || selectedTask.status === "AVAILABLE") : false;

  const getExpiryDateTime = () => {
    if (!selectedTask) return { date: "--", time: "--" };
    const createdStr = selectedTask.createdAt;
    let expiryDate = new Date();
    if (createdStr) {
      const parsedCreated = new Date(createdStr);
      if (!isNaN(parsedCreated.getTime())) {
        expiryDate = parsedCreated;
      }
    }
    // Add 6 hours default
    expiryDate.setHours(expiryDate.getHours() + 6);
    
    const expiryTimeStr = selectedTask.expiryTime;
    if (expiryTimeStr && expiryTimeStr !== "No Expiry") {
      const parsed = new Date(expiryTimeStr);
      if (!isNaN(parsed.getTime())) {
        expiryDate = parsed;
      }
    }
    
    return {
      date: expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: expiryDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="w-full p-0 bg-transparent">
      {/* Header Section */}
      <div
        className="border-b shadow-sm relative"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] h-[300px] bg-[#22c55e] opacity-[0.03] blur-[100px] rounded-full" />
        </div>
        <div className="px-4 md:px-8 pt-6 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full mb-2">
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_#22c55e]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#22c55e]/70">Central Dispatch</span>
              </div>
              <h1
                className="text-3xl font-[1000] uppercase tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Volunteer <span className="text-[#22c55e]">Terminal</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1.5" style={{ color: "var(--text-muted)" }}>
                Central dispatch operations and task tracking manager
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3 shrink-0">
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-black/5 dark:bg-black/20"
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
        </div>

        {/* Filters Card */}
        <div className="px-4 md:px-8 pt-2 pb-6">
          <div className="relative z-10 p-4 sm:p-6 flex flex-col gap-4 border rounded-2xl shadow-sm w-full" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
              {/* Search input */}
              <div className="relative w-full sm:w-[320px]">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks, capacity, route..."
                  className="w-full pl-11 pr-10 py-2.5 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 transition-all shadow-sm border"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:text-red-500 transition-colors rounded-full"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* View Switcher using reusable Tabs */}
              <Tabs
                tabs={[
                  { id: "table", icon: ListIcon, label: "Table" },
                  { id: "grid", icon: LayoutGrid, label: "Cards" },
                ]}
                activeTab={viewMode}
                onTabChange={(v) => setViewMode(v as any)}
                layoutId="volunteerTasksViewMode"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {[
                {
                  label: "STATUS",
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    ["ALL", "All Statuses"],
                    ["AVAILABLE", "Available"],
                    ["IN PROGRESS", "In Progress"],
                    ["COMPLETED", "Completed"],
                  ],
                },
                {
                  label: "CATEGORY TYPE",
                  value: typeFilter,
                  onChange: setTypeFilter,
                  options: [
                    ["ALL", "All Types"],
                    ["delivery", "Delivery Stops"],
                    ["kitchen", "Kitchen Stops"],
                    ["shelter", "Shelter Stops"],
                  ],
                },
                {
                  label: "SORT BY",
                  value: sortFilter,
                  onChange: setSortFilter,
                  options: [
                    ["NEWEST", "Newest First"],
                    ["OLDEST", "Oldest First"],
                  ],
                },
              ].map(({ label, value, onChange, options }) => (
                <div key={label} className="relative inline-flex items-center shrink-0">
                  <div
                    className="flex items-center justify-between gap-3 rounded-2xl h-[46px] px-4 shadow-sm hover:border-emerald-500/60 transition-all cursor-pointer relative min-w-[140px] border"
                    style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}
                  >
                    <div className="flex flex-col text-left justify-center leading-tight">
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 select-none">{label}</span>
                      <span className="text-[12px] font-bold select-none mt-0.5" style={{ color: "var(--text-primary)" }}>
                        {(options.find(([v]) => v === value) || options[0])[1]}
                      </span>
                    </div>
                    <ChevronDown size={12} className="text-slate-400 pointer-events-none ml-1.5 shrink-0" />
                    <select
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>
              ))}

              {/* Reset Button */}
              {(searchQuery !== "" || statusFilter !== "ALL" || typeFilter !== "ALL" || sortFilter !== "NEWEST") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                    setTypeFilter("ALL");
                    setSortFilter("NEWEST");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-100 border border-red-200/80 transition-all shadow-sm ml-auto cursor-pointer"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs switch section (Active / Available / History) */}
      <div className="px-4 md:px-8 pt-6 pb-1 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-50/90 dark:bg-slate-900/90 border-slate-200/80 shadow-sm">
          {[
            { id: "active", label: "Active", count: tasks.active.length, icon: "⚡" },
            { id: "opps", label: "Available", count: tasks.opps.length, icon: "🌐" },
            { id: "past", label: "History", count: tasks.past.length, icon: "✅" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const btnColor = tab.id === "opps" ? "bg-[#22c55e]" : tab.id === "active" ? "bg-amber-500" : "bg-blue-500";
            const shadowColor = tab.id === "opps" ? "shadow-emerald-500/20" : tab.id === "active" ? "shadow-amber-500/20" : "shadow-blue-500/20";
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                  isActive ? `${btnColor} text-white shadow-sm ${shadowColor}` : "hover:text-[var(--text-primary)]"
                }`}
                style={{ color: isActive ? "white" : "var(--text-muted)" }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-200/60 dark:bg-slate-800 text-slate-500"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline" style={{ color: "var(--text-muted)" }}>
          {activeTab === "active" ? "Showing active dispatch missions" : activeTab === "opps" ? "Showing nearby open pickup opportunities" : "Showing past completed missions"}
        </span>
      </div>

      {/* Main Content List */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 pb-16">
        {getCurrentTasks().length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {viewMode === "table" ? (
              <div className="border rounded-md shadow-sm p-2 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
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
                  src="/empty card.png"
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
                  {activeTab === "active"
                    ? "You don't have any active tasks in progress."
                    : activeTab === "opps"
                      ? "Check back later for new pickup opportunities."
                      : "No past completed missions found."}
                </p>
              </div>

              {/* Button removed by user request */}
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
          selectedTask && (
            <div className="w-full">
              {selectedTask.status === "AVAILABLE" && (
                <ResuableButton
                  variant="primary"
                  className="w-full bg-[#22c55e] h-11 !rounded-sm text-xs font-black uppercase tracking-widest"
                  onClick={() => setIsClaimModalOpen(true)}
                >
                  Claim Task
                </ResuableButton>
              )}
              
              {selectedTask.rawStatus === "ASSIGNED" && (
                <div className="flex flex-col gap-2 w-full text-start">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#22c55e] leading-none mb-1">Enter Pickup Code</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      maxLength={6}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-center font-black tracking-widest text-lg h-11 outline-none focus:border-[#22c55e]/50 transition-all text-[var(--text-primary)] font-mono"
                      placeholder="------"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                    />
                    <ResuableButton
                      variant="primary"
                      disabled={otpValue.length !== 6 || isVerifying}
                      className="h-11 px-6 bg-[#22c55e] text-xs text-white font-black uppercase tracking-widest"
                      onClick={() => performVerification('pickup', otpValue)}
                      loading={isVerifying}
                    >
                      Unlock
                    </ResuableButton>
                  </div>
                </div>
              )}

              {selectedTask.rawStatus === "PICKED_UP" && (
                <div className="flex flex-col gap-2 w-full text-start">
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 leading-none mb-1">Enter Delivery Code</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      maxLength={6}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-center font-black tracking-widest text-lg h-11 outline-none focus:border-blue-500/50 transition-all text-[var(--text-primary)] font-mono"
                      placeholder="------"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                    />
                    <ResuableButton
                      variant="primary"
                      disabled={otpValue.length !== 6 || isVerifying}
                      className="h-11 px-6 bg-blue-500 text-xs text-white font-black uppercase tracking-widest"
                      onClick={() => performVerification('delivery', otpValue)}
                      loading={isVerifying}
                    >
                      Verify
                    </ResuableButton>
                  </div>
                </div>
              )}
            </div>
          )
        }
      >
        {selectedTask && (
          <div className="space-y-6 p-6">
            {/* 1. Header Info Card */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-5 bg-white dark:bg-slate-900 shadow-sm flex items-start gap-4 text-start">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100/50 dark:border-emerald-900/30">
                <Truck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                    Donation Dispatch
                  </h3>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStatusStyle(selectedTask.status)}`}>
                    {selectedTask.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-2">
                  ID: {selectedTask.id ? `TSK-${selectedTask.id}`.toUpperCase().substring(0, 24) : "TSK-TBD"}
                </p>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Created on {new Date(selectedTask.createdAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(selectedTask.createdAt || new Date()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* 2. Food Expiry Date & Time Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-3 text-start">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 shrink-0">
                  <Calendar size={18} className="stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-wider leading-none mb-1">Food Expiry Date</span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                    {getExpiryDateTime().date}
                  </span>
                </div>
              </div>
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-3 text-start">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 shrink-0">
                  <Clock size={18} className="stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-wider leading-none mb-1">Food Expiry Time</span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                    {getExpiryDateTime().time}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Task Progress Stepper */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-5 bg-white dark:bg-slate-900 shadow-sm text-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-6 block">Task Progress</span>
              
              <div className="flex justify-between items-center w-full relative px-2">
                {[
                  { label: "Requested", status: true, icon: "📋" },
                  { label: "Accepted", status: ["ACCEPTED", "ASSIGNED", "PICKED_UP", "DELIVERED"].includes(selectedTask.rawStatus || "") || selectedTask.status === "COMPLETED", icon: "✓" },
                  { label: "Dispatch", status: ["ASSIGNED", "PICKED_UP", "DELIVERED"].includes(selectedTask.rawStatus || "") || selectedTask.status === "COMPLETED", icon: "🚚" },
                  { label: "Picked Up", status: ["PICKED_UP", "DELIVERED"].includes(selectedTask.rawStatus || "") || selectedTask.status === "COMPLETED", icon: "📦" },
                  { label: "Completed", status: selectedTask.rawStatus === "DELIVERED" || selectedTask.status === "COMPLETED", icon: "✓" }
                ].map((step, idx, arr) => {
                  const isCurrent = (idx === 0 && (selectedTask.rawStatus === "PENDING")) ||
                                   (idx === 1 && selectedTask.rawStatus === "ACCEPTED") ||
                                   (idx === 2 && selectedTask.rawStatus === "ASSIGNED") ||
                                   (idx === 3 && selectedTask.rawStatus === "PICKED_UP") ||
                                   (idx === 4 && (selectedTask.rawStatus === "DELIVERED" || selectedTask.status === "COMPLETED"));
                  
                  return (
                    <div key={idx} className="flex flex-col items-center relative flex-1">
                      {/* Connecting Line */}
                      {idx < arr.length - 1 && (
                        <div 
                          className="absolute h-[2px] w-[calc(100%-40px)] left-[calc(50%+20px)] top-[19px]"
                          style={{ 
                            backgroundColor: step.status && arr[idx+1]?.status 
                              ? "#22c55e" 
                              : "var(--border-color)",
                            opacity: step.status && arr[idx+1]?.status ? 0.8 : 0.2,
                          }}
                        />
                      )}
                      
                      {/* Circle Node */}
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm border transition-all duration-300 relative flex-shrink-0 ${
                          step.status 
                            ? "bg-[#22c55e] border-[#22c55e] text-white shadow-sm" 
                            : "bg-black/[0.03] border-slate-200 text-slate-400 dark:border-slate-800"
                        } ${isCurrent ? "ring-4 ring-[#22c55e]/15 !border-[#22c55e]/45" : ""}`}
                      >
                        {step.status ? (
                          <span className="font-black text-sm">{step.icon === "✓" ? "✓" : step.icon}</span>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                        )}
                        {isCurrent && (
                          <div className="absolute inset-0 rounded-full animate-ping bg-[#22c55e]/25" />
                        )}
                      </div>
                      
                      <span className={`mt-2 text-[8px] font-black uppercase tracking-tight leading-none ${
                        step.status ? "text-[#22c55e]" : "text-[var(--text-muted)]"
                      } ${isCurrent ? "text-[var(--text-primary)]" : ""}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Card 1: PICK-UP & DONATION DETAILS */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-5 bg-white dark:bg-slate-900 shadow-sm text-start">
              <div className="flex items-center gap-2 mb-4 border-b pb-3 border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shrink-0">
                  <Package size={16} className="stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">PICK-UP & DONATION DETAILS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                {/* Vertical Divider Line */}
                <div className="hidden sm:block absolute left-1/2 top-2 bottom-2 w-px bg-slate-100 dark:bg-slate-800" />
                
                {/* Left Column: Pick-up Address */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-3 block">Pick-up Address</span>
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin size={16} className="text-[#22c55e] shrink-0 mt-0.5" />
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{selectedTask.partnerOrg}</h4>
                    </div>
                    <p className="text-xs font-bold leading-relaxed text-slate-500 dark:text-slate-400 pl-6">
                      {selectedTask.location || "Main Entrance / Reception"}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-dashed border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-300 pl-6">
                    <Phone size={12} className="text-[#22c55e]" />
                    {selectedTask.contactPhone}
                  </div>
                </div>

                {/* Right Column: Donation Details */}
                <div className="flex flex-col justify-between sm:pl-4">
                  <div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-wider mb-3 block">Donation Details</span>
                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-3">
                      {selectedTask.title}
                    </h4>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Package size={13} className="text-slate-400 shrink-0" />
                        <span>{selectedTask.load}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Clock size={13} className="text-slate-400 shrink-0" />
                        <span>{selectedTask.expiryTime ? `Expires: ${selectedTask.expiryTime}` : "No Expiry"}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>Prepared on {new Date(selectedTask.createdAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Tag size={13} className="text-slate-400 shrink-0" />
                        <span>Category: {selectedTask.category || "Dry Ration"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Card 2: TO DELIVER ADDRESS */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-5 bg-white dark:bg-slate-900 shadow-sm text-start relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 border-b pb-3 border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-[#22c55e] shrink-0">
                  <MapPin size={16} className="stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">TO DELIVER ADDRESS</span>
              </div>

              <div className="relative">
                <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-all duration-300 ${isNgoLocked ? "filter blur-[2px] select-none pointer-events-none opacity-45" : ""}`}>
                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <h4 className="text-base font-black text-slate-800 dark:text-slate-100 mb-1">{selectedTask.ngoOrgName}</h4>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                        {selectedTask.destinations[0] || "NGO Delivery Hub Center Address"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-300">
                        <Phone size={12} className="text-[#22c55e]" />
                        <span>{selectedTask.ngoPhone || "+91 98765 43210"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-300">
                        <User size={12} className="text-[#22c55e]" />
                        <span>Contact: Ravi Kumar</span>
                      </div>
                    </div>
                  </div>

                  {/* Building SVG Illustration */}
                  <div className="hidden sm:block">
                    <svg className="w-32 h-28 opacity-80 dark:opacity-60 shrink-0" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Clouds */}
                      <path d="M135 45a8 8 0 0 1 8 8 6 6 0 0 1 6 6 6 6 0 0 1-6 6h-20a6 6 0 0 1-6-6 8 8 0 0 1 8-8c1-4 5-6 10-6z" fill="#E2F2E9" />
                      <path d="M25 40a6 6 0 0 1 6 6 4 4 0 0 1 4 4 4 4 0 0 1-4 4H15a4 4 0 0 1-4-4 6 6 0 0 1 6-6c1-3 4-4 8-4z" fill="#E2F2E9" />
                      
                      {/* Trees */}
                      <circle cx="115" cy="85" r="10" fill="#69C894" />
                      <rect x="114" y="85" width="2" height="15" fill="#4AA072" />
                      <circle cx="123" cy="90" r="8" fill="#58B281" />
                      <rect x="122" y="90" width="2" height="10" fill="#4AA072" />

                      {/* Main NGO Building */}
                      <rect x="40" y="55" width="60" height="45" rx="4" fill="#A8DFBF" />
                      <rect x="50" y="45" width="40" height="15" rx="3" fill="#82CD9F" />
                      
                      {/* Heart on Building */}
                      <path d="M70 51.5c-1-1-2.5-1-3.5 0s-1 2.5 0 3.5l3.5 3.5 3.5-3.5c1-1 1-2.5 0-3.5s-2.5-1-3.5 0z" fill="#60B683" />
                      
                      {/* Windows */}
                      <rect x="48" y="65" width="8" height="8" rx="1.5" fill="#FFFFFF" />
                      <rect x="60" y="65" width="8" height="8" rx="1.5" fill="#FFFFFF" />
                      <rect x="72" y="65" width="8" height="8" rx="1.5" fill="#FFFFFF" />
                      <rect x="84" y="65" width="8" height="8" rx="1.5" fill="#FFFFFF" />
                      
                      <rect x="48" y="78" width="8" height="8" rx="1.5" fill="#FFFFFF" />
                      <rect x="84" y="78" width="8" height="8" rx="1.5" fill="#FFFFFF" />

                      {/* Door */}
                      <rect x="62" y="76" width="16" height="24" rx="2" fill="#E8F8F0" />
                      <rect x="66" y="80" width="8" height="20" rx="1" fill="#69C894" />
                    </svg>
                  </div>
                </div>

                {isNgoLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 dark:bg-slate-900/20 z-10 text-center p-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-500 mb-1.5 shadow-sm border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xs">
                      <span>🔒</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Locked until food is picked up
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-4">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">Delivery Instructions</span>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  "Please call before arrival. Deliver to the main office."
                </p>
              </div>
            </div>

            {/* 6. Dynamic OTP Handover Protocol display */}
            {selectedTask.status !== "COMPLETED" && selectedTask.rawStatus === "ASSIGNED" && (
              <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-900 shadow-sm text-center relative overflow-hidden flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 mb-3 border border-emerald-100/50 dark:border-emerald-900/30">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>

                <div className="flex items-center gap-1.5 mb-3 bg-emerald-500/[0.03] border border-emerald-500/10 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600">
                    ENCRYPTED KEY PROTOCOL
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight mb-1">
                  Secure Verification
                </h3>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 max-w-[280px] mx-auto mb-5">
                  {selectedTask.rawStatus === "ASSIGNED" 
                    ? "Enter the 6-digit code sent to confirm this action." 
                    : (selectedTask.rawStatus === "PICKED_UP" 
                        ? "Enter the 6-digit code sent to confirm this action." 
                        : "Awaiting next dispatch protocol stage")}
                </p>

                {/* OTP Digits boxes */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  {(() => {
                    const otpStr = String(
                      selectedTask.rawStatus === "ASSIGNED" 
                        ? selectedTask.pickupOtp 
                        : (selectedTask.rawStatus === "PICKED_UP" ? selectedTask.deliveryOtp : "")
                    );
                    
                    if (otpStr && (selectedTask.rawStatus === "ASSIGNED" || selectedTask.rawStatus === "PICKED_UP")) {
                      return otpStr
                        .padStart(6, "0")
                        .split("")
                        .map((digit, i) => (
                          <div 
                            key={i} 
                            className={`w-10 h-12 rounded-xl bg-white dark:bg-slate-900 border-2 ${
                              i === 0 ? "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "border-slate-100 dark:border-slate-800"
                            } flex items-center justify-center text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tighter`}
                          >
                            {digit}
                          </div>
                        ));
                    }
                    
                    return (
                      <div className="text-2xl font-black tracking-[0.5em] text-slate-300 dark:text-slate-700 font-mono italic select-none">
                        PENDING
                      </div>
                    );
                  })()}
                </div>

                {/* Expiry line */}
                {(selectedTask.rawStatus === "ASSIGNED" || selectedTask.rawStatus === "PICKED_UP") && (
                  <div className="flex items-center justify-center gap-1.5 text-xs font-black text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Code expires in <span className="text-emerald-500 font-mono">04:59</span></span>
                  </div>
                )}
              </div>
            )}

            {/* 7. Instructions */}
            <div className="space-y-2 text-start pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 select-none">
                Instructions
              </h4>
              <div className="p-4 rounded-2xl border bg-amber-500/[0.02] border-amber-500/10">
                <p className="text-xs font-bold text-amber-600 leading-relaxed italic">
                  "{selectedTask.description || "Follow standard procedure. Please update the task status as you complete each step."}"
                </p>
              </div>
            </div>
          </div>
        )}
      </ResuableDrawer>


      {/* Accept Task Modal */}
      <ResuableModal
        isOpen={isClaimModalOpen}
        onOpenChange={setIsClaimModalOpen}
        title="Task Acceptance"
        subtitle="Confirm Acceptance"
        size="md"
        classNames={{
          base: "!rounded-[24px] overflow-hidden bg-white dark:bg-slate-900",
          header: "border-b border-slate-100 dark:border-slate-800 px-6 py-4",
          body: "p-6 bg-white dark:bg-slate-900",
          footer: "border-t border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-slate-900"
        }}
        icon={
          <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 size={14} className="stroke-[2.5]" />
          </div>
        }
        footer={
          <div className="flex gap-3 w-full justify-end">
            <ResuableButton
              variant="secondary"
              className="h-10 px-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs font-black text-slate-700 dark:text-slate-300"
              onClick={() => setIsClaimModalOpen(false)}
            >
              Abort
            </ResuableButton>
            <ResuableButton
              variant="primary"
              className="h-10 px-6 bg-[#22c55e] hover:bg-green-600 rounded-xl text-xs font-black text-white flex items-center gap-1.5 justify-center"
              onClick={handleConfirmClaim}
              disabled={isClaiming}
            >
              {isClaiming ? (
                <span>Accepting...</span>
              ) : (
                <>
                  <CheckCircle2 size={14} className="stroke-[2.5]" />
                  <span>Confirm Acceptance</span>
                </>
              )}
            </ResuableButton>
          </div>
        }
      >
        {selectedTask && (
          <div className="text-center space-y-6">
            {/* Pulsing check circle illustration */}
            <div className="relative flex justify-center mt-2">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                  <CheckCircle2 size={20} className="stroke-[2.5]" />
                </div>
                <div className="absolute inset-0 rounded-full animate-ping bg-[#22c55e]/10 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-850 dark:text-slate-100 tracking-tight">
                Accept this task?
              </h3>
              <p className="text-xs font-bold leading-relaxed text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto">
                You are about to accept <span className="text-[#22c55e] font-black">"{selectedTask.title}"</span>. This task will be added to your active list.
              </p>
            </div>

            {/* Load and Duration Details Column Box */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/[0.3] dark:bg-slate-950/20 shadow-sm flex items-center justify-between text-start relative overflow-hidden">
              <div className="flex-1 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100/50">
                  <Package size={14} className="stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">LOAD</span>
                  <span className="text-sm font-black text-slate-850 dark:text-slate-100">{selectedTask.load}</span>
                  <span className="text-[9px] font-bold text-slate-450 block mt-0.5">Approximate</span>
                </div>
              </div>

              {/* Mini vertical separator */}
              <div className="w-px h-10 bg-slate-100 dark:bg-slate-800 mx-4" />

              <div className="flex-1 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100/50">
                  <Clock size={14} className="stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">EST. TIME</span>
                  <span className="text-sm font-black text-slate-850 dark:text-slate-100">{selectedTask.duration}</span>
                  <span className="text-[9px] font-bold text-slate-450 block mt-0.5">Pickup & delivery</span>
                </div>
              </div>
            </div>

            {/* Guidelines Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-500/10 flex items-start gap-3 text-start">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                <CheckCircle2 size={10} className="stroke-[2.5]" />
              </div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-normal">
                By accepting, you agree to follow the guidelines and ensure safe food handling and delivery.
              </p>
            </div>
          </div>
        )}
      </ResuableModal>


    </div>
  );
};

export default VolunteerTasks;
