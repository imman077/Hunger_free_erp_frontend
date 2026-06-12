import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import ResuableDrawer from "../../../../../global/components/resuable-components/drawer";
import ReusableTable, {
  TableChip,
} from "../../../../../global/components/resuable-components/table";
import { ImpactCards } from "../../../../../global/components/resuable-components/ImpactCards";
import ReusableButton from "../../../../../global/components/resuable-components/button";
import ReusableInput from "../../../../../global/components/resuable-components/input";
import MultiSelectDropdown from "../../../../../global/components/resuable-components/multi_select_dropdown";
import {
  Plus,
  Filter,
  X,
  Eye,
  Phone,
  Settings,
  AlertTriangle,
  BarChart,
  RotateCcw,
  Save,
  User,
  Activity,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useVolunteers } from "../hooks/useVolunteers";
import type { Volunteer, VolunteerStatus } from "../../store/user-schemas";

const STATUS_OPTIONS: VolunteerStatus[] = ["available", "on-leave", "busy"];
const ZONE_OPTIONS = ["North", "East", "South", "West", "Central"];

const VOLUNTEER_AREAS_OPTIONS = [
  { value: "Anna Nagar", label: "Anna Nagar" },
  { value: "Ambattur", label: "Ambattur" },
  { value: "T Nagar", label: "T Nagar" },
  { value: "Velachery", label: "Velachery" },
  { value: "Adyar", label: "Adyar" },
  { value: "Mylapore", label: "Mylapore" },
  { value: "Nungambakkam", label: "Nungambakkam" },
  { value: "Porur", label: "Porur" },
];

const TASK_TYPES_OPTIONS = [
  { value: "Food Delivery", label: "Food Delivery" },
  { value: "Bulk Pickup", label: "Bulk Pickup" },
  { value: "Event Support", label: "Event Support" },
  { value: "Distribution", label: "Distribution" },
  { value: "Packaging", label: "Packaging" },
  { value: "Transport", label: "Transport" },
];

const VolunteersPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    isOpen: isSuspenseOpen,
    onOpen: onSuspenseOpen,
    onClose: onSuspenseClose,
  } = useDisclosure();
  const { volunteers, updateVolunteer } = useVolunteers();

  const [activeVolunteer, setActiveVolunteer] = useState<Volunteer | null>(
    volunteers[0] || null,
  );
  const [weeklyHours, setWeeklyHours] = useState(
    activeVolunteer?.tasksCompleted || 45,
  );
  const [onLeaveToggle, setOnLeaveToggle] = useState(
    activeVolunteer?.onLeave || false,
  );
  const [isEditMode, setIsEditMode] = useState(false);

  // Editable fields state
  const [selectedVolunteerAreas, setSelectedVolunteerAreas] = useState<
    string[]
  >([]);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<string[]>([]);
  const [editablePhone, setEditablePhone] = useState("");
  const [editableAddress, setEditableAddress] = useState("");
  const [editableEmergencyPhone, setEditableEmergencyPhone] = useState("");
  const [editableVehicle, setEditableVehicle] = useState("");
  const [editableVehicleNumber, setEditableVehicleNumber] = useState("");

  // Suspension Duration State
  const [suspensionValue, setSuspensionValue] = useState(1);
  const [suspensionUnit, setSuspensionUnit] = useState("DAYS");

  // Filter States
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterZone, setFilterZone] = useState("All");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Responsive check
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const toggleFilter = (filterType: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterType)
        ? prev.filter((f) => f !== filterType)
        : [...prev, filterType],
    );
    if (filterType === "status") setFilterStatus("All");
    if (filterType === "zone") setFilterZone("All");
  };

  const filteredVolunteers = volunteers.filter((vol) => {
    const matchStatus =
      !activeFilters.includes("status") ||
      filterStatus === "All" ||
      vol.status === filterStatus.toLowerCase();
    const matchZone =
      !activeFilters.includes("zone") ||
      filterZone === "All" ||
      vol.zone === filterZone;
    return matchStatus && matchZone;
  });

  const openDrawer = (vol: Volunteer) => {
    setActiveVolunteer(vol);
    setWeeklyHours(40); // Reset or use vol data
    setOnLeaveToggle(vol.onLeave);
    setIsEditMode(false); // Always start in view mode
    setSelectedVolunteerAreas(vol.volunteerAreas);
    setSelectedTaskTypes(vol.allowedTaskTypes);
    setEditablePhone(vol.phone);
    setEditableAddress(vol.address);
    setEditableEmergencyPhone(vol.emergencyPhone);
    setEditableVehicle(vol.vehicle);
    setEditableVehicleNumber(vol.license);
    setIsDrawerOpen(true);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeeklyHours(Number(e.target.value));
  };

  const toggleOnLeave = () => {
    setOnLeaveToggle((prev: boolean) => !prev);
  };

  const handleToggleSuspension = () => {
    if (!activeVolunteer) return;

    const isCurrentlySuspended = activeVolunteer.isSuspended;
    const newSuspendedState = !isCurrentlySuspended;

    let suspensionEndTime: number | undefined = undefined;

    if (newSuspendedState) {
      // Calculate the end time based on suspension duration
      const now = Date.now();
      let durationInMs = 0;

      switch (suspensionUnit) {
        case "HRS":
          durationInMs = suspensionValue * 60 * 60 * 1000;
          break;
        case "DAYS":
          durationInMs = suspensionValue * 24 * 60 * 60 * 1000;
          break;
        case "MONTHS":
          durationInMs = suspensionValue * 30 * 24 * 60 * 60 * 1000;
          break;
      }

      suspensionEndTime = now + durationInMs;
    }

    updateVolunteer({
      ...activeVolunteer,
      isSuspended: newSuspendedState,
      suspensionValue: newSuspendedState ? suspensionValue : undefined,
      suspensionUnit: newSuspendedState ? suspensionUnit : undefined,
      suspensionEndTime: newSuspendedState ? suspensionEndTime : undefined,
    });

    onSuspenseClose();
  };

  // Auto-reactivation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let hasChanges = false;

      volunteers.forEach((v) => {
        if (
          v.isSuspended &&
          v.suspensionEndTime &&
          now >= v.suspensionEndTime
        ) {
          hasChanges = true;
          updateVolunteer({
            ...v,
            isSuspended: false,
            suspensionValue: undefined,
            suspensionUnit: undefined,
            suspensionEndTime: undefined,
          });
        }
        return v;
      });

      if (hasChanges) {
        // Update active volunteer if they were auto-reactivated
        if (
          activeVolunteer?.isSuspended &&
          activeVolunteer.suspensionEndTime &&
          now >= activeVolunteer.suspensionEndTime
        ) {
          setActiveVolunteer({
            ...activeVolunteer,
            isSuspended: false,
            suspensionValue: undefined,
            suspensionUnit: undefined,
            suspensionEndTime: undefined,
          });
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [volunteers, activeVolunteer]);

  const getStatusBadge = (status: VolunteerStatus): React.ReactElement => {
    const statusStyles: Record<
      VolunteerStatus,
      { backgroundColor: string; color: string; border: string }
    > = {
      available: {
        backgroundColor: "rgba(34, 197, 94, 0.08)",
        color: "#4ade80",
        border: "1px solid rgba(34, 197, 94, 0.2)",
      },
      "on-leave": {
        backgroundColor: "rgba(239, 68, 68, 0.08)",
        color: "#f87171",
        border: "1px solid rgba(239, 68, 68, 0.2)",
      },
      busy: {
        backgroundColor: "rgba(245, 158, 11, 0.08)",
        color: "#fbbf24",
        border: "1px solid rgba(245, 158, 11, 0.2)",
      },
    };

    const statusLabels: Record<VolunteerStatus, string> = {
      available: "Available",
      "on-leave": "On Leave",
      busy: "Busy",
    };

    const style = statusStyles[status];

    return (
      <span
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: style.backgroundColor,
          color: style.color,
          border: style.border,
        }}
      >
        {statusLabels[status]}
      </span>
    );
  };

  const volunteerStats = useMemo(() => {
    const totalVolunteers = volunteers.length;
    const activeVolunteers = volunteers.filter(
      (v) => v.status === "available",
    ).length;
    const totalImpact = volunteers.reduce(
      (acc, v) => acc + v.tasksCompleted,
      0,
    );

    return [
      {
        label: "Total Force",
        val: totalVolunteers.toLocaleString(),
        trend: "Registered",
        color: "bg-hf-green",
      },
      {
        label: "Duty Ready",
        val: activeVolunteers.toLocaleString(),
        trend: "Available",
        color: "bg-hf-green",
      },
      {
        label: "Global Impact",
        val: totalImpact.toLocaleString(),
        trend: "Completed",
        color: "bg-hf-green",
      },
    ];
  }, [volunteers]);

  const renderStars = (rating: string) => {
    return (
      <div className="flex items-center">
        <div className="inline-flex gap-1">
          <span className="text-amber-400 text-sm">★</span>
          <span className="text-amber-400 text-sm">★</span>
          <span className="text-amber-400 text-sm">★</span>
          <span className="text-amber-400 text-sm">★</span>
          <span className="text-sm" style={{ color: "var(--border-color)" }}>
            ★
          </span>
        </div>
        <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>
          {rating}
        </span>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Sticky Header Wrapper */}
      <div
        className="sticky top-0 z-30 w-full border-b transition-all backdrop-blur-md px-4 md:px-8 py-4 md:py-6 mb-6"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--bg-primary), transparent 15%)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
          <div className="text-left">
            <h1
              className="text-2xl sm:text-3xl font-black tracking-tighter italic break-words"
              style={{ color: "var(--text-primary)" }}
            >
              Volunteer Management
            </h1>
            <p
              className="mt-1 text-[10px] font-bold uppercase tracking-widest hidden sm:block"
              style={{ color: "var(--text-muted)" }}
            >
              Manage and track volunteer profiles
            </p>
          </div>
          <Button
            color="primary"
            className="w-full sm:w-auto bg-[#22c55e] text-white rounded-xl h-11 px-6 font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-[#22c55e]/20"
            endContent={<Plus size={18} />}
            onPress={() => navigate("/admin/users/volunteers/create")}
          >
            Add New Volunteer
          </Button>
        </div>
      </div>

      <div className="px-4 md:px-8 space-y-6 flex-1">
        {/* Stats Cards */}
        <ImpactCards data={volunteerStats} />

        {/* Volunteer Table */}
        <ReusableTable
          key={isMobile ? "mobile" : "desktop"}
          data={filteredVolunteers}
          enableFilters={false}
          onRowClick={openDrawer}
          additionalFilters={
            <div className="flex items-center gap-2 flex-wrap">
              <Dropdown placement="bottom">
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    className="border rounded-sm h-10 px-4 flex-shrink-0 text-[11px] font-bold transition-all shadow-none"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-muted)",
                    }}
                    startContent={
                      <Filter
                        size={14}
                        style={{ color: "var(--text-muted)" }}
                      />
                    }
                    endContent={
                      <Plus size={14} style={{ color: "var(--text-muted)" }} />
                    }
                  >
                    <span className="hidden sm:inline ml-1">ADD FILTER</span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Add Filter Options"
                  onAction={(key) => toggleFilter(key as string)}
                  classNames={{
                    base: "border rounded-sm min-w-[180px] p-1 shadow-2xl",
                  }}
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                  itemClasses={{
                    base: [
                      "text-[11px] font-bold uppercase tracking-tight",
                      "data-[hover=true]:bg-[var(--bg-secondary)] data-[hover=true]:text-[#22c55e]",
                      "rounded-sm",
                      "px-3",
                      "py-2.5",
                      "transition-colors duration-200",
                    ].join(" "),
                    title: "text-[var(--text-secondary)]",
                  }}
                >
                  <DropdownItem
                    key="status"
                    isDisabled={activeFilters.includes("status")}
                    startContent={<Filter size={14} />}
                  >
                    STATUS
                  </DropdownItem>
                  <DropdownItem
                    key="zone"
                    isDisabled={activeFilters.includes("zone")}
                    startContent={<Filter size={14} />}
                  >
                    ZONE
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {activeFilters.includes("status") && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      className="border border-hf-green/20 bg-hf-green/10 rounded-sm h-10 px-3 text-[11px] font-black text-[#22c55e] hover:bg-hf-green/20 transition-all shadow-none"
                      endContent={<ChevronDown size={14} />}
                    >
                      STATUS: {filterStatus.toUpperCase()}
                      <div
                        className="ml-2 hover:bg-hf-green/20 rounded-full p-0.5 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFilter("status");
                        }}
                      >
                        <X size={12} />
                      </div>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Filter by Status"
                    selectionMode="single"
                    selectedKeys={[filterStatus]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setFilterStatus(selected || "All");
                    }}
                    items={[
                      { key: "All", label: "All Status" },
                      ...STATUS_OPTIONS.map((status) => ({
                        key: status,
                        label: status.toUpperCase(),
                      })),
                    ]}
                    classNames={{
                      base: "rounded-sm min-w-[160px] p-1 border",
                    }}
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                    itemClasses={{
                      base: [
                        "text-[11px] font-bold uppercase tracking-tight",
                        "data-[hover=true]:bg-[var(--bg-secondary)] data-[hover=true]:text-[#22c55e]",
                        "data-[selected=true]:bg-emerald-500/10 data-[selected=true]:text-[#22c55e]",
                        "rounded-sm",
                        "px-3",
                        "py-2.5",
                        "transition-colors duration-200",
                      ].join(" "),
                      title: "text-[var(--text-secondary)]",
                      selectedIcon: "text-[#22c55e] w-4 h-4 ml-auto",
                    }}
                  >
                    {(item: any) => (
                      <DropdownItem key={item.key}>{item.label}</DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>
              )}

              {activeFilters.includes("zone") && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      className="border border-blue-500/20 bg-blue-500/10 rounded-sm h-10 px-3 text-[11px] font-black text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all shadow-none"
                      endContent={<ChevronDown size={14} />}
                    >
                      ZONE: {filterZone.toUpperCase()}
                      <div
                        className="ml-2 hover:bg-blue-500/20 rounded-full p-0.5 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFilter("zone");
                        }}
                      >
                        <X size={12} />
                      </div>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Filter by Zone"
                    selectionMode="single"
                    selectedKeys={[filterZone]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setFilterZone(selected || "All");
                    }}
                    items={[
                      { key: "All", label: "All Zones" },
                      ...ZONE_OPTIONS.map((zone) => ({
                        key: zone,
                        label: zone.toUpperCase(),
                      })),
                    ]}
                    classNames={{
                      base: "rounded-sm min-w-[160px] p-1 border",
                    }}
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                    itemClasses={{
                      base: [
                        "text-[11px] font-bold uppercase tracking-tight",
                        "data-[hover=true]:bg-[var(--bg-secondary)] data-[hover=true]:text-[#22c55e]",
                        "data-[selected=true]:bg-emerald-500/10 data-[selected=true]:text-[#22c55e]",
                        "rounded-sm",
                        "px-3",
                        "py-2.5",
                        "transition-colors duration-200",
                      ].join(" "),
                      title: "text-[var(--text-secondary)]",
                      selectedIcon: "text-[#22c55e] w-4 h-4 ml-auto",
                    }}
                  >
                    {(item: any) => (
                      <DropdownItem key={item.key}>{item.label}</DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          }
          columns={[
            { name: "Volunteer", uid: "name", sortable: true, align: "start" },
            {
              name: "Areas",
              uid: "volunteerAreas",
              sortable: false,
              align: "center",
            },
            {
              name: "Status",
              uid: "status",
              sortable: false,
              align: "center",
            },
            { name: "Email", uid: "email", sortable: true },
            { name: "Phone", uid: "phone" },
            { name: "Actions", uid: "actions", sortable: false },
          ]}
          initialVisibleColumns={
            isMobile
              ? ["name", "status"]
              : ["name", "volunteerAreas", "status", "email", "actions"]
          }
          renderCell={(vol: Volunteer, columnKey: React.Key) => {
            switch (columnKey) {
              case "name":
                return (
                  <TableChip
                    text={vol.name}
                    initials={vol.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                    className="md:scale-100"
                    onClick={() => openDrawer(vol)}
                    iconClassName="bg-gradient-to-br from-emerald-400 to-teal-600"
                  />
                );
              case "volunteerAreas":
                return (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {vol.volunteerAreas.map((area, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border"
                        style={{
                          backgroundColor: "rgba(34, 197, 94, 0.1)",
                          color: "#22c55e",
                          borderColor: "rgba(34, 197, 94, 0.2)",
                        }}
                      >
                        {area.toUpperCase()}
                      </span>
                    ))}
                  </div>
                );
              case "zone":
                return (
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {vol.zone}
                  </span>
                );
              case "tasksCompleted":
                return (
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {vol.tasksCompleted}
                  </span>
                );
              case "rating":
                return renderStars(vol.rating);
              case "status":
                return (
                  <div className="flex justify-center w-full">
                    {getStatusBadge(vol.status)}
                  </div>
                );
              case "actions":
                return (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDrawer(vol);
                      }}
                      className="!bg-transparent hover:!text-[#22c55e] transition-all min-w-0 h-8 w-8"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Eye size={14} />
                    </Button>
                  </div>
                );
              case "email":
              case "phone":
                return (
                  <span
                    className="text-xs whitespace-nowrap"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {String(vol[columnKey as keyof Volunteer])}
                  </span>
                );
              default:
                return (
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {String(vol[columnKey as keyof Volunteer])}
                  </span>
                );
            }
          }}
          actionConfig={undefined}
        />

        <ResuableDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Volunteer Details"
          subtitle={`Volunteer ID: #VOL-${activeVolunteer?.id?.toString().padStart(4, "0") || "0000"}`}
          size="md"
          footer={
            activeVolunteer && (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                {isEditMode ? (
                  <>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="w-full sm:flex-1 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 order-2 sm:order-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <RotateCcw size={14} />
                      Cancel
                    </button>
                    <ReusableButton
                      variant="primary"
                      className="w-full sm:flex-[2] !bg-hf-green hover:!bg-emerald-600 px-8 py-3 !rounded-sm text-[10px] font-black uppercase tracking-widest order-1 sm:order-2"
                      onClick={() => {
                        setIsEditMode(false);
                      }}
                      startContent={<Save size={14} />}
                    >
                      Save Changes
                    </ReusableButton>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="w-full sm:flex-1 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-colors order-2 sm:order-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Dismiss
                    </button>
                    <div className="w-full sm:flex-[2] relative order-1 sm:order-2">
                      <ReusableButton
                        variant="primary"
                        className="w-full !bg-hf-green hover:!bg-emerald-600 px-8 py-4 !rounded-sm text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 flex items-center justify-center gap-2"
                        onClick={() => setIsEditMode(true)}
                      >
                        <div className="p-1 rounded-full bg-white/20">
                          <Settings size={12} className="text-white" />
                        </div>
                        EDIT PROFILE
                      </ReusableButton>
                    </div>
                  </>
                )}
              </div>
            )
          }
        >
          {activeVolunteer && (
            <div className="flex flex-col relative z-10 text-start pb-8 px-3 sm:px-6">
              {/* Immersive Background Decorations */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-hf-green/5 blur-[120px] rounded-sm -mr-48 -mt-48" />
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-sm -ml-32" />
              </div>

              {/* Elite Hero Section */}
              <div className="pt-4 pb-1.5 flex flex-col items-center">
                <div className="relative mb-4 group">
                  <div className="absolute inset-[-10px] bg-hf-green/5 blur-2xl rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div
                    className="relative w-24 h-24 p-1.5 rounded-sm transform transition-transform duration-500 group-hover:scale-105 border"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="w-full h-full rounded-sm bg-hf-green flex items-center justify-center relative overflow-hidden">
                      <span className="text-4xl font-black text-white italic">
                        {activeVolunteer.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  {/* Status Float */}
                  <div
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 p-1 rounded-sm border shadow-sm z-20 whitespace-nowrap"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-hf-green/10 rounded-sm">
                      <div className="w-1.5 h-1.5 rounded-sm bg-hf-green animate-pulse" />
                      <span className="text-[9px] font-black text-hf-green uppercase tracking-tighter">
                        Live Portal
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-3 max-w-sm">
                  <div className="space-y-0.5 w-full flex flex-col items-center">
                    <h3
                      className="text-2xl font-black leading-[1.05] tracking-tight break-words"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {activeVolunteer.name}
                    </h3>
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.2em]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Volunteer ID: #VOL-
                      {activeVolunteer.id.toString().padStart(4, "0")}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {getStatusBadge(activeVolunteer.status)}
                  </div>
                </div>
              </div>

              <div className="p-0 space-y-8 relative z-10">
                {/* Identity & Timeline Block */}
                <section className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-sm border flex items-center justify-center text-blue-500 shadow-sm shrink-0"
                      style={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                        borderColor: "rgba(59, 130, 246, 0.1)",
                      }}
                    >
                      <User size={16} strokeWidth={2.5} />
                    </div>
                    <h4
                      className="text-xs font-black uppercase tracking-widest"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Personal Information
                    </h4>
                  </div>
                  <div
                    className="px-4 py-1.5 rounded-sm border shadow-sm divide-y"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                      borderBottomColor: "var(--border-color)",
                    }}
                  >
                    <div
                      className="flex justify-between items-center py-2"
                      style={{ borderBottomColor: "var(--border-color)" }}
                    >
                      <span
                        className="text-[8px] font-black uppercase"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Verification
                      </span>
                      <span
                        className={`text-[10px] font-black ${activeVolunteer.verificationStatus === "Verified" ? "text-emerald-500" : "text-amber-500"} uppercase`}
                      >
                        {activeVolunteer.verificationStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span
                        className="text-[8px] font-black uppercase"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Onboarded
                      </span>
                      <span
                        className="text-[10px] font-black uppercase"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {activeVolunteer.createdDate}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Performance Metrics Section */}
                {!isEditMode && (
                  <section className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-sm border flex items-center justify-center text-emerald-500 shadow-sm shrink-0"
                        style={{
                          backgroundColor: "rgba(34, 197, 94, 0.05)",
                          borderColor: "rgba(34, 197, 94, 0.1)",
                        }}
                      >
                        <BarChart size={16} strokeWidth={2.5} />
                      </div>
                      <h4
                        className="text-xs font-black uppercase tracking-widest"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Performance Metrics
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 min-[450px]:grid-cols-2 gap-1.5">
                      <div
                        className="p-3 rounded-sm border shadow-sm"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <p
                          className="text-[8px] font-black uppercase tracking-widest mb-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Success Rate
                        </p>
                        <p
                          className="text-[11px] font-black uppercase"
                          style={{ color: "var(--text-primary)" }}
                        >
                          92%
                        </p>
                      </div>
                      <div
                        className="p-3 rounded-sm border shadow-sm"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <p
                          className="text-[8px] font-black uppercase tracking-widest mb-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Total Tasks
                        </p>
                        <p
                          className="text-[11px] font-black uppercase"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {activeVolunteer.totalTasks}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {/* Operational Control block */}
                <section className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-sm border flex items-center justify-center text-purple-600 shadow-sm shrink-0"
                      style={{
                        backgroundColor: "rgba(147, 51, 234, 0.05)",
                        borderColor: "rgba(147, 51, 234, 0.1)",
                      }}
                    >
                      <Activity size={16} strokeWidth={2.5} />
                    </div>
                    <h4
                      className="text-xs font-black uppercase tracking-widest"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Work & Schedule
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 min-[450px]:grid-cols-2 gap-1.5">
                    {isEditMode ? (
                      <div
                        className="col-span-2 space-y-4 p-4 rounded-sm border shadow-sm"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <div className="space-y-3">
                          <label
                            className="text-[8px] font-black uppercase tracking-widest"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Weekly Target
                          </label>
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min={0}
                              max={60}
                              value={weeklyHours}
                              onChange={handleHoursChange}
                              className="flex-1 h-1.5 bg-[var(--bg-secondary)] rounded-sm appearance-none accent-hf-green"
                            />
                            <span className="text-[10px] font-black text-hf-green min-w-[50px]">
                              {weeklyHours}h/wk
                            </span>
                          </div>
                        </div>
                        <div
                          className="flex items-center justify-between p-3 border rounded-sm"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <span
                            className="text-[8px] font-black uppercase tracking-widest"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Status
                          </span>
                          <button
                            onClick={toggleOnLeave}
                            className={`p-1 transition-all ${onLeaveToggle ? "text-hf-green" : "text-rose-500"}`}
                          >
                            {onLeaveToggle ? (
                              <ToggleRight size={24} />
                            ) : (
                              <ToggleLeft size={24} />
                            )}
                          </button>
                        </div>
                        <MultiSelectDropdown
                          label="Preferred Areas"
                          value={selectedVolunteerAreas}
                          onChange={setSelectedVolunteerAreas}
                          options={VOLUNTEER_AREAS_OPTIONS}
                        />
                        <MultiSelectDropdown
                          label="Task Types"
                          value={selectedTaskTypes}
                          onChange={setSelectedTaskTypes}
                          options={TASK_TYPES_OPTIONS}
                        />
                      </div>
                    ) : (
                      <>
                        <div
                          className="p-3 rounded-sm border shadow-sm"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <p
                            className="text-[8px] font-black uppercase tracking-widest mb-1"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Hours per Week
                          </p>
                          <p
                            className="text-[11px] font-black uppercase"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {weeklyHours}h/wk
                          </p>
                        </div>
                        <div
                          className="p-3 rounded-sm border shadow-sm"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <p
                            className="text-[8px] font-black uppercase tracking-widest mb-1"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Attendance
                          </p>
                          <p
                            className={`text-[11px] font-black uppercase ${onLeaveToggle ? "text-hf-green" : "text-rose-500"}`}
                          >
                            {onLeaveToggle ? "Active" : "On Leave"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </section>

                {/* Connectivity and Logistics */}
                <section className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-sm border flex items-center justify-center text-amber-500 shadow-sm shrink-0"
                      style={{
                        backgroundColor: "rgba(245, 158, 11, 0.05)",
                        borderColor: "rgba(245, 158, 11, 0.1)",
                      }}
                    >
                      <Phone size={16} strokeWidth={2.5} />
                    </div>
                    <h4
                      className="text-xs font-black uppercase tracking-widest"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Contact & Transport
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {isEditMode ? (
                      <div
                        className="p-4 rounded-sm border shadow-sm space-y-4"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <ReusableInput
                          label="Phone Number"
                          value={editablePhone}
                          onChange={setEditablePhone}
                        />
                        <ReusableInput
                          label="Address"
                          value={editableAddress}
                          onChange={setEditableAddress}
                        />
                        <ReusableInput
                          label="Emergency Contact"
                          value={editableEmergencyPhone}
                          onChange={setEditableEmergencyPhone}
                        />
                        <ReusableInput
                          label="Vehicle Model"
                          value={editableVehicle}
                          onChange={setEditableVehicle}
                        />
                        <ReusableInput
                          label="Vehicle Number"
                          value={editableVehicleNumber}
                          onChange={setEditableVehicleNumber}
                        />
                      </div>
                    ) : (
                      <div
                        className="p-1 rounded-sm border shadow-sm divide-y"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                          borderBottomColor: "var(--border-color)",
                        }}
                      >
                        <div className="p-3">
                          <p
                            className="text-[8px] font-black uppercase tracking-widest mb-1"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Contact Details
                          </p>
                          <p
                            className="text-[11px] font-black uppercase"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {activeVolunteer.phone}
                          </p>
                          <p
                            className="text-[11px] font-black uppercase mt-1"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {activeVolunteer.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Action - Suspension */}
                {!isEditMode && (
                  <section className="pb-6">
                    <button
                      onClick={onSuspenseOpen}
                      className={`w-full px-4 py-3 ${activeVolunteer.isSuspended ? "bg-rose-500 hover:bg-rose-600" : "bg-hf-green hover:bg-emerald-600"} text-white rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2`}
                    >
                      {activeVolunteer.isSuspended ? (
                        <RotateCcw size={14} />
                      ) : (
                        <AlertTriangle size={14} />
                      )}
                      {activeVolunteer.isSuspended
                        ? "REACTIVATE VOLUNTEER"
                        : "SUSPEND VOLUNTEER"}
                    </button>
                  </section>
                )}
              </div>
            </div>
          )}
        </ResuableDrawer>

        {/* Suspension Confirmation Modal */}
        <Modal
          isOpen={isSuspenseOpen}
          onClose={onSuspenseClose}
          placement="center"
          hideCloseButton={false}
          classNames={{
            base: "w-full max-w-[420px] mx-4 rounded-3xl p-6 bg-[var(--bg-primary)] shadow-2xl border border-[var(--border-color)] animate-in fade-in zoom-in duration-300",
            backdrop: "bg-black/60 backdrop-blur-md",
            closeButton:
              "hover:bg-[var(--bg-secondary)] absolute right-4 top-4 rounded-full transition-colors",
          }}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1 text-center items-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border"
                style={{
                  backgroundColor: "rgba(225, 29, 72, 0.05)",
                  borderColor: "rgba(225, 29, 72, 0.1)",
                  color: "#e11d48",
                }}
              >
                {activeVolunteer?.isSuspended ? (
                  <ShieldCheck size={28} />
                ) : (
                  <AlertTriangle size={28} />
                )}
              </div>
              <h3
                className={`text-lg font-black uppercase tracking-tight ${
                  activeVolunteer?.isSuspended
                    ? "text-rose-600"
                    : "text-rose-600"
                }`}
              >
                {activeVolunteer?.isSuspended
                  ? "Reactivate Volunteer"
                  : "Suspend Volunteer"}
              </h3>
            </ModalHeader>
            <ModalBody className="text-center pb-6 space-y-4">
              <p className="text-sm text-[var(--text-secondary)] font-medium px-2">
                Are you sure you want to{" "}
                <span
                  className={
                    activeVolunteer?.isSuspended
                      ? "text-rose-600 font-bold"
                      : "text-rose-600 font-bold"
                  }
                >
                  {activeVolunteer?.isSuspended ? "REACTIVATE" : "SUSPEND"}
                </span>{" "}
                <span className="font-bold text-[var(--text-primary)]">
                  {activeVolunteer?.name}
                </span>
                ?
              </p>

              {!activeVolunteer?.isSuspended && (
                <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-left mb-3">
                    Suspension Duration
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="number"
                      min={1}
                      value={suspensionValue}
                      onChange={(e) =>
                        setSuspensionValue(Number(e.target.value))
                      }
                      className="w-full sm:w-24 h-12 sm:h-auto px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl text-base font-bold text-[var(--text-primary)] focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all text-center sm:text-left"
                    />
                    <div className="flex-1 flex bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-1 gap-1 h-12 sm:h-auto">
                      {["HRS", "DAYS", "MONTHS"].map((unit) => (
                        <button
                          key={unit}
                          onClick={() => setSuspensionUnit(unit)}
                          className={`flex-1 py-1.5 text-[10px] font-black rounded-xl transition-all ${
                            suspensionUnit === unit
                              ? "bg-rose-500 text-white shadow-lg shadow-rose-200"
                              : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
                          }`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs text-[var(--text-muted)] font-black uppercase">
                {activeVolunteer?.isSuspended
                  ? "This will allow them to be assigned to new tasks again."
                  : `THIS WILL PREVENT THEM FROM BEING ASSIGNED TO ANY NEW TASKS FOR ${suspensionValue} ${suspensionUnit}.`}
              </p>
            </ModalBody>
            <ModalFooter className="flex flex-col gap-3 pt-6 border-t border-[var(--border-color)]">
              <Button
                className="w-full text-white rounded-2xl h-14 text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-500/20 order-1"
                onPress={handleToggleSuspension}
              >
                Confirm &{" "}
                {activeVolunteer?.isSuspended ? "Reactivate" : "Suspend"}
              </Button>
              <Button
                variant="flat"
                className="w-full rounded-2xl h-14 text-[11px] font-black uppercase tracking-[0.2em] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all order-2"
                onPress={onSuspenseClose}
              >
                Cancel Action
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default VolunteersPage;
