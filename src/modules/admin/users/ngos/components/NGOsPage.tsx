import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import ResuableDrawer from "../../../../../global/components/resuable-components/drawer";
import ImpactCards from "../../../../../global/components/resuable-components/ImpactCards";
import ReusableTable, {
  TableChip,
} from "../../../../../global/components/resuable-components/table";
import ResuableInput from "../../../../../global/components/resuable-components/input";
import {
  Plus,
  Filter,
  ChevronDown,
  X,
  Eye,
  Mail,
  Phone,
  MapPin,
  Target,
  Zap,
} from "lucide-react";
import { useNgos } from "../hooks/useNgos";
import type { Ngo, NgoStatus } from "../../store/user-schemas";

const STATUS_OPTIONS: NgoStatus[] = ["Active", "Pending", "Deactivated"];
const BENEFICIARY_OPTIONS = [
  "Children & Youth",
  "Local Communities",
  "Senior Citizens",
  "Stray Animals",
  "Low-Income Communities",
];

const NgoPage = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState<Ngo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNgo, setEditedNgo] = useState<Ngo | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterBeneficiaries, setFilterBeneficiaries] = useState("All");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { ngos, updateNgo } = useNgos();

  const handleViewNgo = (ngo: Ngo): void => {
    setSelectedNgo(ngo);
    setEditedNgo(ngo);
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  const toggleFilter = (filterType: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterType)
        ? prev.filter((f) => f !== filterType)
        : [...prev, filterType],
    );
    if (filterType === "status") setFilterStatus("All");
    if (filterType === "beneficiaries") setFilterBeneficiaries("All");
  };

  const handleSaveNgo = () => {
    if (editedNgo) {
      updateNgo(editedNgo);
      setSelectedNgo(editedNgo);
      setIsEditing(false);
    }
  };

  const filteredNgos = ngos.filter((ngo) => {
    const matchStatus =
      !activeFilters.includes("status") ||
      filterStatus === "All" ||
      ngo.status === filterStatus;
    const matchBeneficiaries =
      !activeFilters.includes("beneficiaries") ||
      filterBeneficiaries === "All" ||
      ngo.beneficiaries === filterBeneficiaries;
    return matchStatus && matchBeneficiaries;
  });

  const getStatusBadge = (status: NgoStatus): React.ReactElement => {
    const statusStyles: Record<
      NgoStatus,
      { backgroundColor: string; color: string; border: string }
    > = {
      Active: {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        color: "#22c55e",
        border: "1px solid rgba(34, 197, 94, 0.2)",
      },
      Pending: {
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        color: "#ca8a04",
        border: "1px solid rgba(234, 179, 8, 0.2)",
      },
      Deactivated: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "#ef4444",
        border: "1px solid rgba(239, 68, 68, 0.2)",
      },
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
        {status}
      </span>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col font-inter"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div
        className="sticky top-0 z-30 w-full border-b transition-all backdrop-blur-md px-4 md:px-8 py-4 md:py-6 mb-6"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--bg-primary), transparent 15%)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div className="text-left">
            <h1
              className="text-2xl sm:text-3xl font-black tracking-tighter italic break-words"
              style={{ color: "var(--text-primary)" }}
            >
              NGO Management
            </h1>
            <p
              className="mt-1 text-[10px] font-bold uppercase tracking-widest hidden sm:block"
              style={{ color: "var(--text-muted)" }}
            >
              Monitor and manage NGO registrations
            </p>
          </div>
          <Button
            color="primary"
            className="w-full sm:w-auto bg-[#22c55e] text-white rounded-xl h-11 px-6 font-bold hover:bg-[#1ea34a] transition-all active:scale-95 shrink-0 shadow-lg shadow-[#22c55e]/20"
            endContent={<Plus size={18} />}
            onPress={() => navigate("/admin/users/ngos/create")}
          >
            Add New NGO
          </Button>
        </div>
      </div>

      <div className="px-4 md:px-8 space-y-6 flex-1">
        <ImpactCards
          data={[
            {
              label: "Completion Rate",
              val: "92.5%",
              trend: "Program success rate",
              color: "bg-blue-500",
            },
            {
              label: "Avg. Response Time",
              val: "18 hrs",
              trend: "Application processing",
              color: "bg-[#22c55e]",
            },
            {
              label: "Total NGOs",
              val: filteredNgos.length.toString(),
              trend: "Current view results",
              color: "bg-purple-500",
            },
          ]}
        />

        <ReusableTable
          key={isMobile ? "mobile" : "desktop"}
          data={filteredNgos}
          enableFilters={false}
          onRowClick={handleViewNgo}
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
                    key="beneficiaries"
                    isDisabled={activeFilters.includes("beneficiaries")}
                    startContent={<Filter size={14} />}
                  >
                    BENEFICIARIES
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
                      selectedIcon: "text-[#22c55e] w-4 h-4 ml-auto",
                      title: "text-[var(--text-secondary)]",
                    }}
                  >
                    {(item: any) => (
                      <DropdownItem key={item.key}>{item.label}</DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>
              )}

              {activeFilters.includes("beneficiaries") && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      className="border border-blue-500/20 bg-blue-500/10 rounded-sm h-10 px-3 text-[11px] font-black text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all shadow-none"
                      endContent={<ChevronDown size={14} />}
                    >
                      BENEFICIARIES: {filterBeneficiaries.toUpperCase()}
                      <div
                        className="ml-2 hover:bg-blue-500/20 rounded-full p-0.5 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFilter("beneficiaries");
                        }}
                      >
                        <X size={12} />
                      </div>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Filter by Beneficiaries"
                    selectionMode="single"
                    selectedKeys={[filterBeneficiaries]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setFilterBeneficiaries(selected || "All");
                    }}
                    items={[
                      { key: "All", label: "All Beneficiaries" },
                      ...BENEFICIARY_OPTIONS.map((opt) => ({
                        key: opt,
                        label: opt,
                      })),
                    ]}
                    classNames={{
                      base: "rounded-sm min-w-[200px] p-1 border",
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
            {
              name: "Organization",
              uid: "name",
              sortable: true,
              align: "start",
            },
            { name: "Registration No", uid: "registrationNo", sortable: true },
            {
              name: "Service Areas",
              uid: "serviceAreas",
              sortable: false,
              align: "center",
            },
            { name: "Beneficiaries", uid: "beneficiaries", sortable: true },
            { name: "Status", uid: "status", sortable: false, align: "center" },
            { name: "Actions", uid: "actions", sortable: false },
          ]}
          renderCell={(ngo: Ngo, columnKey: React.Key) => {
            switch (columnKey) {
              case "name":
                return (
                  <div className="py-1">
                    <TableChip
                      text={ngo.name}
                      initials={ngo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                      iconClassName="bg-gradient-to-br from-indigo-400 to-blue-600"
                      onClick={(e?: React.MouseEvent) => {
                        e?.stopPropagation();
                        handleViewNgo(ngo);
                      }}
                      maxWidth="max-w-[140px]"
                    />
                  </div>
                );
              case "registrationNo":
                return (
                  <div
                    className="text-xs font-mono whitespace-nowrap"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {ngo.registrationNo}
                  </div>
                );
              case "status":
                return (
                  <div className="flex justify-center w-full">
                    {getStatusBadge(ngo.status)}
                  </div>
                );
              case "serviceAreas":
                return (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {ngo.serviceAreas.slice(0, 2).map((area, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border"
                        style={{
                          backgroundColor: "rgba(99, 102, 241, 0.1)",
                          color: "#6366f1",
                          borderColor: "rgba(99, 102, 241, 0.2)",
                        }}
                      >
                        {area.toUpperCase()}
                      </span>
                    ))}
                    {ngo.serviceAreas.length > 2 && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          color: "var(--text-muted)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        +{ngo.serviceAreas.length - 2}
                      </span>
                    )}
                  </div>
                );
              case "beneficiaries":
                return (
                  <span
                    className="text-xs font-medium whitespace-nowrap"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {ngo.beneficiaries}
                  </span>
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
                        handleViewNgo(ngo);
                      }}
                      className="!bg-transparent hover:!text-[#22c55e] transition-all min-w-0 h-8 w-8"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Eye size={14} />
                    </Button>
                  </div>
                );
              default:
                return (
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {String(ngo[columnKey as keyof Ngo])}
                  </span>
                );
            }
          }}
        />

        <ResuableDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="NGO Details"
          subtitle="View and edit organization profile"
          size="md"
          footer={
            selectedNgo && (
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md mx-auto">
                {!isEditing ? (
                  <Button
                    className="w-full bg-hf-green text-white font-black h-12 rounded-sm hover:bg-emerald-600 transition-all active:scale-95 text-[11px] uppercase tracking-widest order-1 sm:order-2"
                    startContent={<Target size={18} strokeWidth={2.5} />}
                    onPress={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      className="w-full sm:flex-[2] bg-hf-green text-white font-black h-12 rounded-sm hover:bg-emerald-600 transition-all active:scale-95 text-[11px] uppercase tracking-widest order-1 sm:order-2"
                      onPress={handleSaveNgo}
                    >
                      Update Details
                    </Button>
                    <Button
                      className="w-full sm:flex-1 border text-[11px] font-black h-12 rounded-sm transition-all active:scale-95 uppercase tracking-widest order-2 sm:order-1"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-muted)",
                      }}
                      onPress={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            )
          }
        >
          {selectedNgo && (
            <div className="flex flex-col relative z-10 text-start">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-hf-green/5 blur-[120px] rounded-sm -mr-48 -mt-48" />
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-sm -ml-32" />
                <div
                  className="absolute inset-0 opacity-[0.015] [mask-image:linear-gradient(to_bottom,white,transparent)]"
                  style={{
                    backgroundImage:
                      "radial-gradient(#000 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
              </div>

              <div className="pt-4 pb-1.5 px-3 sm:px-6 flex flex-col items-center">
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
                        {selectedNgo.name.charAt(0)}
                      </span>
                    </div>
                  </div>
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
                    {isEditing ? (
                      <input
                        className="text-2xl font-black leading-[1.05] tracking-tight border-2 rounded-sm px-4 py-2 focus:outline-none focus:border-hf-green text-center w-full placeholder:text-slate-400"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                          color: "var(--text-primary)",
                        }}
                        value={editedNgo?.name}
                        onChange={(e) =>
                          setEditedNgo((prev) =>
                            prev ? { ...prev, name: e.target.value } : null,
                          )
                        }
                        placeholder="NGO Name"
                      />
                    ) : (
                      <h3
                        className="text-2xl font-black leading-[1.05] tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {selectedNgo.name}
                      </h3>
                    )}
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.2em]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      NGO ID: #{selectedNgo.id.toString().padStart(4, "0")}
                    </p>
                  </div>
                </div>
              </div>

              {!isEditing ? (
                <div className="px-3 sm:px-6 space-y-8 relative z-10">
                  <section className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-sm border flex items-center justify-center text-hf-green shadow-sm shrink-0"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <Phone size={16} strokeWidth={2.5} />
                      </div>
                      <h4
                        className="text-xs font-black uppercase tracking-widest leading-none"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Contact Details
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        {
                          Icon: Mail,
                          label: "Email Address",
                          value: selectedNgo.email,
                        },
                        {
                          Icon: Phone,
                          label: "Phone Number",
                          value: selectedNgo.phone,
                        },
                        {
                          Icon: MapPin,
                          label: "Location",
                          value: selectedNgo.address,
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="group p-3 rounded-sm border transition-all hover:border-hf-green hover:bg-[var(--bg-secondary)] shadow-sm"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <item.Icon
                              size={18}
                              style={{ color: "var(--text-muted)" }}
                            />
                            <div>
                              <p
                                className="text-[9px] font-black uppercase tracking-[0.2em] mb-1"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {item.label}
                              </p>
                              <p
                                className="text-xs font-bold uppercase tracking-tight"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {item.value}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-sm border flex items-center justify-center text-indigo-600 shadow-sm shrink-0"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <Zap size={16} strokeWidth={2.5} />
                      </div>
                      <h4
                        className="text-xs font-black uppercase tracking-widest leading-none"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Service Details
                      </h4>
                    </div>
                    <div
                      className="rounded-sm border shadow-sm overflow-hidden"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div className="bg-hf-green p-3 text-white">
                        <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] mb-1">
                          Main Service
                        </p>
                        <h4 className="text-sm font-black tracking-tighter uppercase">
                          {selectedNgo.beneficiaries}
                        </h4>
                      </div>
                      <div className="p-3">
                        <p
                          className="text-[9px] font-black uppercase tracking-[0.2em] mb-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Service Areas
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedNgo.serviceAreas.map((area, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 rounded-sm text-[8px] font-black border uppercase tracking-widest"
                              style={{
                                backgroundColor: "var(--bg-secondary)",
                                color: "var(--text-muted)",
                                borderColor: "var(--border-color)",
                              }}
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              ) : (
                <div className="px-3 sm:px-6 space-y-4 relative z-10">
                  <ResuableInput
                    label="Organization Name"
                    value={editedNgo?.name || ""}
                    onChange={(v: string) =>
                      setEditedNgo((p) => (p ? { ...p, name: v } : null))
                    }
                  />
                  <ResuableInput
                    label="Official Email"
                    value={editedNgo?.email || ""}
                    onChange={(v: string) =>
                      setEditedNgo((p) => (p ? { ...p, email: v } : null))
                    }
                  />
                  <ResuableInput
                    label="Phone Number"
                    value={editedNgo?.phone || ""}
                    onChange={(v: string) =>
                      setEditedNgo((p) => (p ? { ...p, phone: v } : null))
                    }
                  />
                  <ResuableInput
                    label="Full Address"
                    value={editedNgo?.address || ""}
                    onChange={(v: string) =>
                      setEditedNgo((p) => (p ? { ...p, address: v } : null))
                    }
                  />
                </div>
              )}
            </div>
          )}
        </ResuableDrawer>
      </div>
    </div>
  );
};

export default NgoPage;
