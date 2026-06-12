import { useState, useCallback, useEffect } from "react";
import { Filter, X, ChevronDown, Plus, UserCheck } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Spinner,
} from "@heroui/react";
import ReusableTable from "../../../../global/components/resuable-components/table";
import ImpactCards from "../../../../global/components/resuable-components/ImpactCards";

import { useDonations } from "../hooks/useDonations";
import {
  DONATION_COLUMNS,
  FOOD_TYPE_OPTIONS,
  STATUS_OPTIONS,
} from "../store/donation-constants";

const DonationOverview = () => {
  const {
    filteredDonations,
    availableVolunteers,
    stats,
    filters: {
      activeFilters,
      statusFilter,
      foodTypeFilter,
      setStatusFilter,
      setFoodTypeFilter,
      toggleFilter,
    },
    actions: { assignVolunteer, rejectAssignment },
    fetchDonations,
    isLoading,
  } = useDonations();

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDonation, setSelectedDonation] = useState<any>(null);

  const handleAssignClick = (donation: any) => {
    setSelectedDonation(donation);
    onOpen();
  };

  const handleAssignVolunteer = (volunteer: any) => {
    assignVolunteer(selectedDonation.id, volunteer);
    onClose();
  };

  const handleRejectAssignment = (donationId: string) => {
    rejectAssignment(donationId);
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "Pending":
        return "#ca8a04"; // yellow-600
      case "Assigned":
        return "#2563eb"; // blue-600
      case "In Progress":
        return "#ea580c"; // orange-600
      case "Completed":
        return "#22c55e"; // hf-green
      default:
        return "var(--text-muted)";
    }
  };

  const renderCell = useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as string];

    switch (columnKey) {
      case "donor":
        return (
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-full border transition-all cursor-pointer group w-fit min-w-0"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white bg-gradient-to-br from-amber-400 to-orange-600 shadow-sm shrink-0">
              {cellValue
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </div>
            <span
              className="font-bold text-xs whitespace-nowrap truncate max-w-[140px] pr-1 group-hover:text-amber-500 transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              {cellValue}
            </span>
          </div>
        );
      case "status":
        // Check if status is "Waiting for {name}"
        const isWaitingStatus = cellValue.startsWith("Waiting for");
        const color = isWaitingStatus ? "#7c3aed" : getStatusColor(cellValue); // purple for waiting

        if (isWaitingStatus) {
          return (
            <div className="flex justify-center w-full">
              <Chip
                className="capitalize border h-6 text-[10px] font-black shadow-none transition-colors pr-1"
                style={{
                  backgroundColor: `${color}10`,
                  color: color,
                  borderColor: `${color}20`,
                }}
                size="sm"
                variant="flat"
                startContent={<UserCheck size={12} />}
                onClose={() => handleRejectAssignment(item.id)}
              >
                {cellValue}
              </Chip>
            </div>
          );
        }

        return (
          <div className="flex justify-center w-full">
            <div
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${color}10`,
                color: color,
                borderColor: `${color}20`,
              }}
            >
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: color }}
              />
              {cellValue}
            </div>
          </div>
        );
      case "foodType":
      case "pickupTime":
        return (
          <span
            className="text-xs font-medium whitespace-nowrap"
            style={{ color: "var(--text-secondary)" }}
          >
            {cellValue}
          </span>
        );
      case "quantity":
        return (
          <span className="text-xs font-bold" style={{ color: "#d97706" }}>
            {cellValue}
          </span>
        );
      case "actions":
        // Only show assign button for truly pending donations (not waiting for volunteer)
        if (
          item.status === "Pending" &&
          !item.status.startsWith("Waiting for")
        ) {
          return (
            <div className="flex justify-center w-full">
              <Button
                size="sm"
                className="bg-hf-green text-white font-bold text-[10px] uppercase tracking-wider h-7 px-3 rounded-sm shadow-sm hover:shadow-md transition-all active:scale-95"
                startContent={<UserCheck size={12} />}
                onClick={() => handleAssignClick(item)}
              >
                Assign Volunteer
              </Button>
            </div>
          );
        }
        return null;
      default:
        return (
          <span className="text-xs" style={{ color: "var(--text-primary)" }}>
            {cellValue}
          </span>
        );
    }
  }, []);

  const additionalFilters = (
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
              <Filter size={14} style={{ color: "var(--text-muted)" }} />
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
              "data-[hover=true]:bg-[var(--bg-secondary)] data-[hover=true]:text-hf-green",
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
            key="foodType"
            isDisabled={activeFilters.includes("foodType")}
            startContent={<Filter size={14} />}
          >
            FOOD TYPE
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {activeFilters.includes("status") && (
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="border border-hf-green/20 bg-hf-green/10 rounded-sm h-10 px-3 text-[11px] font-black text-hf-green hover:bg-hf-green/20 transition-all shadow-none"
              endContent={<ChevronDown size={14} />}
            >
              STATUS: {statusFilter.toUpperCase()}
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
            aria-label="Status Filter Choices"
            selectionMode="single"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) =>
              setStatusFilter(Array.from(keys)[0] as string)
            }
            items={[
              { key: "all", label: "ALL STATUS" },
              ...STATUS_OPTIONS.map((s) => ({
                key: s,
                label: s.toUpperCase(),
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
                "data-[hover=true]:bg-[var(--bg-secondary)] data-[hover=true]:text-hf-green",
                "data-[selected=true]:bg-emerald-500/10 data-[selected=true]:text-hf-green",
                "rounded-sm",
                "px-3",
                "py-2.5",
                "transition-colors duration-200",
              ].join(" "),
              title: "text-[var(--text-secondary)]",
              selectedIcon: "text-hf-green w-4 h-4 ml-auto",
            }}
          >
            {(item: any) => (
              <DropdownItem key={item.key}>{item.label}</DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      )}

      {activeFilters.includes("foodType") && (
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="border border-blue-500/20 bg-blue-500/10 rounded-sm h-10 px-3 text-[11px] font-black text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all shadow-none"
              endContent={<ChevronDown size={14} />}
            >
              TYPE: {foodTypeFilter.toUpperCase()}
              <div
                className="ml-2 hover:bg-blue-500/20 rounded-full p-0.5 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFilter("foodType");
                }}
              >
                <X size={12} />
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Food Type Filter Choices"
            selectionMode="single"
            selectedKeys={[foodTypeFilter]}
            onSelectionChange={(keys) =>
              setFoodTypeFilter(Array.from(keys)[0] as string)
            }
            items={[
              { key: "all", label: "ALL TYPES" },
              ...FOOD_TYPE_OPTIONS.map((t) => ({
                key: t,
                label: t.toUpperCase(),
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
                "data-[hover=true]:bg-[var(--bg-secondary)] data-[hover=true]:text-blue-600",
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
            {(item: any) => (
              <DropdownItem key={item.key}>{item.label}</DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );

  return (
    <div
      className="p-6 space-y-6 min-h-screen relative"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-50">
          <Spinner color="success" size="lg" label="Syncing with SQL..." />
        </div>
      )}
      {/* Elite Header */}
      <div className="flex items-center justify-between w-full">
        <div className="text-left">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight break-words"
            style={{ color: "var(--text-primary)" }}
          >
            Donation Management
          </h1>
          <p
            className="mt-1 text-sm font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Real-time donation intelligence and distribution coordination
          </p>
        </div>
      </div>

      {/* Impact Metrics */}
      <ImpactCards data={stats} />

      {/* Donations Table */}
      <ReusableTable
        data={filteredDonations}
        columns={DONATION_COLUMNS}
        renderCell={renderCell}
        variant="compact"
        enableFilters={false}
        additionalFilters={additionalFilters}
        enablePagination={true}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="center"
        size="sm"
        classNames={{
          backdrop: "bg-[#0b1120]/80 backdrop-blur-sm",
          base: "border border-[var(--border-color)] bg-[var(--bg-primary)] rounded-sm overflow-hidden mx-4 max-h-[85vh]",
          header: "border-b border-[var(--border-color)] p-4 relative",
          body: "p-3 sm:p-4 overflow-y-auto custom-scrollbar",
          footer:
            "border-t border-[var(--border-color)] p-4 bg-[var(--bg-secondary)]/30",
          closeButton:
            "hover:bg-[var(--bg-secondary)] absolute right-4 top-4 rounded-sm transition-all text-[var(--text-muted)]",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-0.5 items-center text-center">
            <h3
              className="text-sm sm:text-base font-black uppercase tracking-[0.1em]"
              style={{ color: "var(--text-primary)" }}
            >
              Assign Volunteer
            </h3>
            <p
              className="text-[9px] sm:text-[10px] font-medium uppercase tracking-tight"
              style={{ color: "var(--text-muted)" }}
            >
              Select a responder for donation #{selectedDonation?.id}
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[8px] sm:text-[9px] font-black text-hf-green uppercase tracking-[0.3em]">
                  Recommended Force
                </span>
                <div className="h-0.5 w-6 bg-hf-green rounded-full opacity-50" />
              </div>
              <div className="grid gap-2">
                {availableVolunteers.map((vol) => (
                  <div
                    key={vol.id}
                    className="flex items-center justify-between p-2.5 sm:p-4 rounded-sm border transition-all hover:border-hf-green/30 hover:bg-[var(--bg-primary)] group gap-3"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-sm bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-[9px] sm:text-[11px] font-black text-white shadow-lg shrink-0">
                        {vol.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          className="text-[11px] sm:text-sm font-black tracking-tight underline-offset-2 decoration-hf-green/30 truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {vol.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <span className="text-hf-green text-[9px] font-black">
                              ★
                            </span>
                            <span
                              className="text-[10px] font-black"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {vol.rating}
                            </span>
                          </div>
                          <span
                            className="text-[9px] font-bold opacity-40 truncate max-w-[60px] sm:max-w-none"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            • {vol.vehicle.split(" ")[0]}
                          </span>
                          <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full border bg-amber-500/5 border-amber-500/10 text-amber-600/80 uppercase tracking-tighter">
                            {vol.distance}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-transparent text-hf-green border border-hf-green/20 font-black text-[9px] uppercase tracking-wider h-7 px-3 rounded-sm transition-all hover:bg-hf-green hover:text-white active:scale-95 shadow-none shrink-0"
                      onClick={() => handleAssignVolunteer(vol)}
                    >
                      Assign
                    </Button>
                  </div>
                ))}
                {availableVolunteers.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center bg-[var(--bg-tertiary)] rounded-sm border border-dashed border-[var(--border-color)]">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-2 sm:mb-3">
                      <X className="w-4 h-4 sm:w-5 h-5 text-[var(--text-muted)] rotate-45" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.1em] sm:tracking-[0.15em]">
                      All local responders are currently busy
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center">
            <Button
              variant="flat"
              className="w-full font-black text-[9px] uppercase tracking-[0.2em] h-8 px-6 rounded-sm transition-all border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DonationOverview;
