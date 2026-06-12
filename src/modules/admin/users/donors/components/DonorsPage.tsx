import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import ImpactCards from "../../../../../global/components/resuable-components/ImpactCards";
import ReusableTable from "../../../../../global/components/resuable-components/table";
import ReusableInput from "../../../../../global/components/resuable-components/input";
import ResuableDrawer from "../../../../../global/components/resuable-components/drawer";
import {
  Plus,
  Eye,
  ChevronDown,
  Filter,
  X,
  User,
  Mail,
  MapPin,
  History as HistoryIcon,
  Save,
  RotateCcw,
  Settings,
} from "lucide-react";

import { useDonors } from "../hooks/useDonors";
import type { Donor } from "../../store/user-schemas";

const DonorPage = () => {
  const navigate = useNavigate();
  const { donors, updateDonor } = useDonors();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableBusinessName, setEditableBusinessName] = useState("");
  const [editableContactPerson, setEditableContactPerson] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [editableAddress, setEditableAddress] = useState("");

  const getStatusColor = (
    status: string,
  ): { backgroundColor: string; color: string; border?: string } => {
    switch (status) {
      case "Active":
        return {
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          color: "#f59e0b",
          border: "1px solid rgba(245, 158, 11, 0.2)",
        };
      case "Pending":
        return {
          backgroundColor: "rgba(245, 158, 11, 0.05)",
          color: "#d97706",
          border: "1px solid rgba(245, 158, 11, 0.1)",
        };
      case "Inactive":
        return {
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-muted)",
          border: "1px solid var(--border-color)",
        };
      default:
        return {
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-muted)",
          border: "1px solid var(--border-color)",
        };
    }
  };

  const getStatusBadge = (status: string): React.ReactElement => {
    const style = getStatusColor(status);

    return (
      <span
        className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
        style={{
          backgroundColor: style.backgroundColor,
          color: style.color,
          border: style.border || `1px solid ${style.color}20`,
        }}
      >
        {status}
      </span>
    );
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewProfile = (donor: Donor): void => {
    setSelectedDonor(donor);
    setEditableBusinessName(donor.businessName);
    setEditableContactPerson(donor.contactPerson);
    setEditableEmail(donor.email);
    setEditableAddress(donor.address);
    setIsEditMode(false);
    setIsDrawerOpen(true);
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
    if (filter === "type") setFilterType("All");
    if (filter === "status") setFilterStatus("All");
  };

  const closeDrawer = () => {
    setIsEditMode(false);
    setIsDrawerOpen(false);
  };

  const handleUpdateDonor = () => {
    if (!selectedDonor) return;

    const updatedDonor: Donor = {
      ...selectedDonor,
      businessName: editableBusinessName,
      contactPerson: editableContactPerson,
      email: editableEmail,
      address: editableAddress,
    };

    updateDonor(updatedDonor);
    setSelectedDonor(updatedDonor);
    setIsEditMode(false);
  };

  const filteredDonors = donors.filter((donor: Donor) => {
    const matchType =
      !activeFilters.includes("type") ||
      filterType === "All" ||
      donor.type === filterType;
    const matchStatus =
      !activeFilters.includes("status") ||
      filterStatus === "All" ||
      donor.status === filterStatus;
    return matchType && matchStatus;
  });

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
              Donor Management
            </h1>
            <p
              className="mt-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Manage your donors and their contributions
            </p>
          </div>
          <Button
            color="primary"
            className="bg-[#22c55e] text-white rounded-xl h-11 px-6 font-bold hover:bg-[#1ea34a] transition-all active:scale-95 self-start sm:self-center shrink-0 shadow-lg shadow-[#22c55e]/20"
            endContent={<Plus size={18} />}
            onPress={() => navigate("/admin/users/donors/create")}
          >
            Add New Donor
          </Button>
        </div>
      </div>

      <div className="px-4 md:px-8 w-full flex-1">
        <ImpactCards
          data={[
            {
              label: "Total Donors",
              val: donors.length.toString(),
              trend: "All registered donors",
              color: "bg-[#22c55e]",
            },
            {
              label: "Total Donations",
              val: formatCurrency(
                donors.reduce(
                  (sum: number, donor: Donor) => sum + donor.totalDonations,
                  0,
                ),
              ),
              trend: "Cumulative contributions",
              color: "bg-[#22c55e]",
            },
            {
              label: "Total Points",
              val: donors
                .reduce((sum: number, donor: Donor) => sum + donor.points, 0)
                .toLocaleString(),
              trend: "Reward points earned",
              color: "bg-[#22c55e]",
            },
            {
              label: "Active Donors",
              val: donors
                .filter((donor: Donor) => donor.status === "Active")
                .length.toString(),
              trend: "Currently active",
              color: "bg-[#22c55e]",
            },
          ]}
        />

        <ReusableTable
          enableFilters={false}
          onRowClick={handleViewProfile}
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
                    key="type"
                    isDisabled={activeFilters.includes("type")}
                    startContent={<Filter size={14} />}
                  >
                    TYPE
                  </DropdownItem>
                  <DropdownItem
                    key="status"
                    isDisabled={activeFilters.includes("status")}
                    startContent={<Filter size={14} />}
                  >
                    STATUS
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {activeFilters.includes("type") && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      className="border border-hf-green/20 bg-hf-green/10 rounded-sm h-10 px-3 text-[11px] font-black text-[#22c55e] hover:bg-hf-green/20 transition-all shadow-none"
                      endContent={<ChevronDown size={14} />}
                    >
                      TYPE: {filterType.toUpperCase()}
                      <div
                        className="ml-2 hover:bg-hf-green/20 rounded-full p-0.5 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFilter("type");
                        }}
                      >
                        <X size={12} />
                      </div>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Filter by Type"
                    selectionMode="single"
                    selectedKeys={[filterType]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setFilterType(selected || "All");
                    }}
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
                    <DropdownItem key="All">All Types</DropdownItem>
                    <DropdownItem key="Restaurant">Restaurant</DropdownItem>
                    <DropdownItem key="Hotel">Hotel</DropdownItem>
                    <DropdownItem key="Household">Household</DropdownItem>
                    <DropdownItem key="Event">Event</DropdownItem>
                    <DropdownItem key="Corporate">Corporate</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}

              {activeFilters.includes("status") && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      className="border border-blue-500/20 bg-blue-500/10 rounded-sm h-10 px-3 text-[11px] font-black text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all shadow-none"
                      endContent={<ChevronDown size={14} />}
                    >
                      STATUS: {filterStatus.toUpperCase()}
                      <div
                        className="ml-2 hover:bg-blue-500/20 rounded-full p-0.5 cursor-pointer"
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
                        "data-[selected=true]:bg-blue-500/10 data-[selected=true]:text-blue-600",
                        "rounded-sm",
                        "px-3",
                        "py-2.5",
                        "transition-colors duration-200",
                      ].join(" "),
                      title: "text-[var(--text-secondary)]",
                      selectedIcon: "text-blue-600 w-4 h-4 ml-auto",
                    }}
                  >
                    <DropdownItem key="All">All Status</DropdownItem>
                    <DropdownItem key="Active">Active</DropdownItem>
                    <DropdownItem key="Pending">Pending</DropdownItem>
                    <DropdownItem key="Inactive">Inactive</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          }
          data={filteredDonors}
          columns={[
            {
              name: "Business Name",
              uid: "businessName",
              sortable: true,
              align: "start",
            },
            { name: "Type", uid: "type", sortable: false, align: "center" },
            {
              name: "Total Donations",
              uid: "totalDonations",
              sortable: false,
            },
            { name: "Points", uid: "points", sortable: true },
            {
              name: "Status",
              uid: "status",
              sortable: false,
              align: "center",
            },
            { name: "Actions", uid: "actions", sortable: false },
          ]}
          renderCell={(donor: Donor, columnKey: React.Key) => {
            switch (columnKey) {
              case "businessName":
                return (
                  <div
                    className="flex items-center gap-2 px-2 py-1 rounded-full border transition-all cursor-pointer group w-fit min-w-0"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProfile(donor);
                    }}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br from-amber-400 to-orange-600 shadow-sm shrink-0">
                      {donor.businessName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                    <span
                      className="font-bold text-xs whitespace-nowrap truncate max-w-[140px] pr-1 group-hover:text-hf-green transition-colors"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {donor.businessName}
                    </span>
                  </div>
                );
              case "type":
                return (
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {donor.type}
                  </span>
                );
              case "totalDonations":
                return (
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {formatCurrency(donor.totalDonations)}
                  </div>
                );
              case "points":
                return (
                  <div className="text-xs font-bold text-amber-600 whitespace-nowrap">
                    {donor.points.toLocaleString()}
                  </div>
                );
              case "status":
                const statusStyle = getStatusColor(donor.status);
                return (
                  <div className="flex justify-center w-full">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border"
                      style={{
                        backgroundColor: statusStyle.backgroundColor,
                        color: statusStyle.color,
                        borderColor: statusStyle.border
                          ? "transparent"
                          : statusStyle.color + "20",
                      }}
                    >
                      {donor.status.toUpperCase()}
                    </span>
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
                        handleViewProfile(donor);
                      }}
                      className="!bg-transparent hover:!text-[#22c55e] transition-all min-w-0 h-8 w-8"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Eye size={14} />
                    </Button>
                  </div>
                );
              default:
                return <span>{String(donor[columnKey as keyof Donor])}</span>;
            }
          }}
        />

        <ResuableDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          title="Donor Details"
          subtitle={`Donor ID: #DON-${selectedDonor?.id?.toString().padStart(4, "0") || "0000"}`}
          size="md"
        >
          {selectedDonor && (
            <div className="space-y-6 pb-10 px-3 sm:px-6">
              <div
                className="p-4 sm:p-6 rounded-md border shadow-sm space-y-4"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 w-full">
                    <h3
                      className="text-2xl font-black tracking-tighter break-words"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedDonor.businessName}
                    </h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedDonor.status)}
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: "var(--text-muted)" }}
                      >
                        • {selectedDonor.type}
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-12 h-12 rounded-md flex items-center justify-center border shrink-0"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="w-full h-full rounded-sm bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-xl font-black text-white shadow-sm overflow-hidden uppercase italic">
                      {selectedDonor.businessName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-4">
                  <div
                    className="p-3 rounded-sm border"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <p
                      className="text-[9px] font-black uppercase tracking-widest mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Total Donated
                    </p>
                    <p
                      className="text-sm font-black"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {formatCurrency(selectedDonor.totalDonations)}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-sm border"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <p
                      className="text-[9px] font-black uppercase tracking-widest mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Points Earned
                    </p>
                    <p className="text-sm font-black text-hf-green">
                      {selectedDonor.points.toLocaleString()} PTS
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4
                  className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <User size={14} className="text-hf-green" />
                  Contact Information
                </h4>

                {isEditMode ? (
                  <div
                    className="p-5 rounded-md border shadow-sm space-y-4"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <ReusableInput
                      label="Business Name"
                      value={editableBusinessName}
                      onChange={setEditableBusinessName}
                      placeholder="Enter business name"
                    />
                    <ReusableInput
                      label="Contact Person"
                      value={editableContactPerson}
                      onChange={setEditableContactPerson}
                      placeholder="Enter contact person name"
                    />
                    <ReusableInput
                      label="Email Address"
                      value={editableEmail}
                      onChange={setEditableEmail}
                      placeholder="Enter email address"
                      type="email"
                    />
                    <ReusableInput
                      label="Physical Address"
                      value={editableAddress}
                      onChange={setEditableAddress}
                      placeholder="Enter physical address"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        Icon: User,
                        label: "Contact Person",
                        value: selectedDonor.contactPerson,
                      },
                      {
                        Icon: Mail,
                        label: "Email Address",
                        value: selectedDonor.email,
                      },
                      {
                        Icon: MapPin,
                        label: "Street Address",
                        value: selectedDonor.address,
                        span: true,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-md border shadow-sm ${item.span ? "md:col-span-2" : ""}`}
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <item.Icon
                            size={12}
                            style={{ color: "var(--text-muted)" }}
                          />
                          <span
                            className="text-[9px] font-black uppercase tracking-widest"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {item.label}
                          </span>
                        </div>
                        <p
                          className="text-[11px] font-bold leading-relaxed uppercase tracking-tight"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!isEditMode && (
                <div className="space-y-4">
                  <h4
                    className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <HistoryIcon size={14} className="text-hf-green" />
                    Recent Donations
                  </h4>
                  <div className="space-y-2">
                    {selectedDonor.donationHistory.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col min-[400px]:flex-row justify-between items-start min-[400px]:items-center p-4 rounded-md border shadow-sm hover:border-hf-green/30 transition-all gap-3"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <div className="space-y-1">
                          <p
                            className="text-[11px] font-black uppercase tracking-wider"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {item.event}
                          </p>
                          <p
                            className="text-[9px] font-bold uppercase"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {item.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-black text-hf-green">
                            {formatCurrency(item.amount)}
                          </p>
                          <p
                            className="text-[8px] font-bold uppercase"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Received
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-dashed"
                style={{ borderColor: "var(--border-color)" }}
              >
                {isEditMode ? (
                  <>
                    <Button
                      className="flex-1 bg-hf-green text-white font-black uppercase tracking-widest py-6"
                      onPress={handleUpdateDonor}
                      startContent={<Save size={18} />}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="flat"
                      className="flex-1 font-black uppercase tracking-widest py-6"
                      onPress={() => setIsEditMode(false)}
                      startContent={<RotateCcw size={18} />}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full bg-hf-green text-white font-black uppercase tracking-widest py-6"
                    onPress={() => setIsEditMode(true)}
                    startContent={<Settings size={18} />}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          )}
        </ResuableDrawer>
      </div>
    </div>
  );
};

export default DonorPage;
