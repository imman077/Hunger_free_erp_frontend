import React, { useState } from "react";
import ImpactCards from "../../../../global/components/resuable-components/ImpactCards";
import ReusableTable, {
  TableChip,
} from "../../../../global/components/resuable-components/table";
import type { ColumnDef } from "../../../../global/components/resuable-components/table";
import ResuableInput from "../../../../global/components/resuable-components/input";
import { Clock, AlertTriangle, Package, MapPin, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Tooltip,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

const PendingDonationsPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [pointsToAward, setPointsToAward] = useState("50");
  const [donations, setDonations] = useState([
    {
      id: "DON-001",
      donor: "Hotel Saravana Bhavan",
      type: "Meals (Veg)",
      quantity: "50 KG",
      location: "T. Nagar, Chennai",
      status: "urgent",
      expiry: "4 hours",
      assignedVolunteer: null,
    },
    {
      id: "DON-002",
      donor: "Anjappar Chettinad",
      type: "Rice & Curry",
      quantity: "30 KG",
      location: "Anna Nagar, Chennai",
      status: "pending",
      expiry: "8 hours",
      assignedVolunteer: null,
    },
    {
      id: "DON-003",
      donor: "Private Donor - Rajesh",
      type: "Bread & Jam",
      quantity: "15 KG",
      location: "Adyar, Chennai",
      status: "pending",
      expiry: "12 hours",
      assignedVolunteer: null,
    },
    {
      id: "DON-004",
      donor: "SM Wedding Hall",
      type: "Full Meals",
      quantity: "120 KG",
      location: "Velachery, Chennai",
      status: "urgent",
      expiry: "2 hours",
      assignedVolunteer: null,
    },
    {
      id: "DON-005",
      donor: "Corporate Canteen - TCS",
      type: "Variety Rice",
      quantity: "45 KG",
      location: "Siruseri, Chennai",
      status: "pending",
      expiry: "6 hours",
      assignedVolunteer: null,
    },
  ]);

  const nearbyVolunteers = [
    {
      id: "V001",
      name: "Arun Vijay",
      rating: "4.8",
      vehicle: "Car (Swift)",
      distance: "1.2 km",
      tasks: 45,
    },
    {
      id: "V002",
      name: "Manikandan",
      rating: "4.9",
      vehicle: "Bike (Xpulse)",
      distance: "0.8 km",
      tasks: 60,
    },
    {
      id: "V003",
      name: "Siddarth",
      rating: "4.2",
      vehicle: "SUV (Thar)",
      distance: "2.5 km",
      tasks: 22,
    },
    {
      id: "V004",
      name: "Janani Iyer",
      rating: "4.7",
      vehicle: "Car (Baleno)",
      distance: "1.5 km",
      tasks: 50,
    },
  ];

  // Derived state to find busy volunteers
  const busyVolunteerNames = donations
    .filter((d) => d.status.startsWith("Waiting for"))
    .map((d) => d.status.replace("Waiting for ", "").split(" (")[0]);

  const availableVolunteers = nearbyVolunteers.filter(
    (v) => !busyVolunteerNames.includes(v.name),
  );

  const handleAssignClick = (donation: any) => {
    setSelectedDonation(donation);
    onOpen();
  };

  const handleAssignVolunteer = (volunteer: any) => {
    // Update the donation status to show waiting for volunteer
    setDonations((prevDonations) =>
      prevDonations.map((donation) =>
        donation.id === selectedDonation.id
          ? {
              ...donation,
              status: `Waiting for ${volunteer.name} (+${pointsToAward} Pts)`,
              assignedVolunteer: volunteer.name,
              points: pointsToAward,
            }
          : donation,
      ),
    );
    console.log(
      `Assigned ${volunteer.name} to donation ${selectedDonation.id} with ${pointsToAward} points`,
    );
    onClose();
  };

  const handleRejectAssignment = (donationId: string) => {
    setDonations((prevDonations) =>
      prevDonations.map((donation) =>
        donation.id === donationId
          ? {
              ...donation,
              status:
                donation.id.includes("DON-001") ||
                donation.id.includes("DON-004")
                  ? "urgent"
                  : "pending",
              assignedVolunteer: null,
              points: null,
            }
          : donation,
      ),
    );
  };

  const stats = [
    {
      label: "Total Pending",
      val: "42",
      trend: "Across all regions",
      color: "bg-amber-500",
    },
    {
      label: "Urgent Pickup",
      val: "12",
      trend: "Expires < 24 hrs",
      color: "bg-red-500",
    },
    {
      label: "New Today",
      val: "08",
      trend: "+3 from yesterday",
      color: "bg-emerald-500",
    },
    {
      label: "Avg. Wait Time",
      val: "4.2h",
      trend: "Processing speed",
      color: "var(--bg-tertiary)",
    },
  ];

  const columns: ColumnDef[] = [
    { uid: "id", name: "ID", sortable: true },
    { uid: "donor", name: "DONOR", sortable: true, align: "start" },
    { uid: "type", name: "FOOD TYPE", sortable: true },
    { uid: "quantity", name: "QUANTITY", sortable: true },
    { uid: "location", name: "LOCATION", sortable: true },
    { uid: "status", name: "STATUS", sortable: false, align: "center" },
    { uid: "expiry", name: "EXPIRY", sortable: true },
    { uid: "actions", name: "ACTIONS", align: "center" },
  ];

  const renderCell = (item: any, columnKey: React.Key) => {
    const value = item[columnKey as string];

    switch (columnKey) {
      case "id":
        return (
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>
            {value}
          </span>
        );
      case "donor":
        const initials = value
          .split(" ")
          .filter((word: string) => /^[a-zA-Z0-9]/.test(word))
          .map((n: string) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return (
          <div className="py-1">
            <TableChip
              text={value}
              initials={initials}
              maxWidth="max-w-[160px]"
            />
          </div>
        );
      case "status":
        // Check if status is "Waiting for {name}"
        const isWaitingStatus =
          typeof value === "string" && value.startsWith("Waiting for");

        if (isWaitingStatus) {
          return (
            <div className="flex justify-center w-full">
              <Chip
                className="capitalize border h-6 text-[10px] font-black shadow-none transition-colors pr-1"
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  color: "#3b82f6",
                  borderColor: "rgba(59, 130, 246, 0.2)",
                }}
                size="sm"
                variant="flat"
                startContent={
                  <UserCheck size={12} style={{ color: "#3b82f6" }} />
                }
                onClose={() => handleRejectAssignment(item.id)}
              >
                {value}
              </Chip>
            </div>
          );
        }

        return (
          <div className="flex justify-center w-full">
            <Chip
              className="capitalize border h-6 text-[10px] font-black"
              style={{
                backgroundColor:
                  value === "urgent"
                    ? "rgba(239, 68, 68, 0.15)"
                    : "rgba(245, 158, 11, 0.15)",
                color: value === "urgent" ? "#f87171" : "#fbbf24",
                borderColor:
                  value === "urgent"
                    ? "rgba(239, 68, 68, 0.3)"
                    : "rgba(245, 158, 11, 0.3)",
              }}
              size="sm"
              variant="flat"
              startContent={
                value === "urgent" ? (
                  <AlertTriangle size={12} />
                ) : (
                  <Clock size={12} />
                )
              }
            >
              {value}
            </Chip>
          </div>
        );
      case "quantity":
        return (
          <div className="flex items-center justify-center gap-1">
            <Package size={14} style={{ color: "var(--text-muted)" }} />
            <span
              className="font-bold"
              style={{ color: "var(--text-secondary)" }}
            >
              {value}
            </span>
          </div>
        );
      case "location":
        return (
          <div className="flex items-center gap-1.5 px-2">
            <MapPin size={12} style={{ color: "var(--text-muted)" }} />
            <span
              className="text-xs font-medium whitespace-nowrap"
              style={{ color: "var(--text-secondary)" }}
            >
              {value}
            </span>
          </div>
        );
      case "expiry":
        return (
          <span
            className="font-bold"
            style={{
              color:
                item.status === "urgent" ? "#ef4444" : "var(--text-secondary)",
            }}
          >
            {value}
          </span>
        );
      case "actions":
        // Check if status is "Waiting for {name}"
        const hasAssignedVolunteer =
          typeof item.status === "string" &&
          item.status.startsWith("Waiting for");

        return (
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center justify-center w-[80px]">
              <Tooltip
                content={
                  hasAssignedVolunteer
                    ? "Volunteer Assigned"
                    : "Assign Volunteer"
                }
              >
                <div className="flex items-center justify-center">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className={`w-8 h-8 min-w-0 ${
                      hasAssignedVolunteer
                        ? "cursor-not-allowed opacity-30"
                        : "hover:text-purple-500"
                    }`}
                    style={{
                      color: hasAssignedVolunteer
                        ? "var(--text-muted)"
                        : "var(--text-secondary)",
                    }}
                    onClick={() =>
                      !hasAssignedVolunteer && handleAssignClick(item)
                    }
                    isDisabled={hasAssignedVolunteer}
                  >
                    <UserCheck size={18} />
                  </Button>
                </div>
              </Tooltip>
            </div>
          </div>
        );
      default:
        return value;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div>
          <h1
            className="text-xl md:text-2xl font-black capitalize tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Pending Donations
          </h1>
          <p
            className="text-xs md:text-sm mt-1 font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Review and approve incoming food donations for distribution
          </p>
        </div>
      </div>

      <ImpactCards data={stats} />

      <div className="overflow-x-auto">
        <ReusableTable
          columns={columns}
          data={donations}
          renderCell={renderCell}
          enablePagination={true}
        />
      </div>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="center"
        size="sm"
        classNames={{
          backdrop: "bg-[#0b1120]/80 backdrop-blur-sm",
          base: "border border-[var(--border-color)] bg-[var(--bg-primary)] rounded-sm mx-4",
          header: "border-b border-[var(--border-color)] p-4 relative",
          body: "p-3 sm:p-5 overflow-y-auto custom-scrollbar max-h-[70vh]",
          footer:
            "border-t border-[var(--border-color)] p-4 bg-[var(--bg-secondary)]/30",
          closeButton:
            "hover:bg-[var(--bg-secondary)] absolute right-4 top-4 rounded-sm transition-all text-[var(--text-muted)]",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 items-center text-center py-6">
            <h3
              className="text-sm font-black uppercase tracking-widest"
              style={{ color: "var(--text-primary)" }}
            >
              Assign Volunteer
            </h3>
            <p
              className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight"
              style={{ color: "var(--text-muted)" }}
            >
              Select nearby responder for #{selectedDonation?.id}
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div
                className="p-3 sm:p-4 rounded-sm border shadow-inner"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <ResuableInput
                  type="number"
                  label="REWARD POINTS"
                  placeholder="Set extra points for this donation"
                  value={pointsToAward}
                  onChange={setPointsToAward}
                  align="left"
                  inputClassName="!bg-[var(--bg-primary)]"
                  startContent={
                    <span className="text-blue-400 text-xs font-black">+</span>
                  }
                  endContent={
                    <span
                      className="text-[10px] font-bold uppercase tracking-tighter"
                      style={{ color: "var(--text-muted)" }}
                    >
                      pts
                    </span>
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex flex-col items-center gap-1 mb-2">
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.25em]">
                    Available Responders ({availableVolunteers.length})
                  </span>
                  <div className="h-0.5 w-6 bg-emerald-500/20 rounded-full" />
                </div>
                <div className="grid gap-2.5 min-h-[100px]">
                  <AnimatePresence mode="popLayout">
                    {availableVolunteers.map((vol) => (
                      <motion.div
                        key={vol.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="flex items-center justify-between p-2.5 sm:p-4 rounded-sm border transition-all hover:border-emerald-500/30 group gap-3"
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
                              className="text-[11px] sm:text-[13px] font-black truncate"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {vol.name}
                            </span>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                              <span className="text-[9px] font-bold text-emerald-500">
                                ★ {vol.rating}
                              </span>
                              <span
                                className="text-[9px] font-medium opacity-60"
                                style={{ color: "var(--text-muted)" }}
                              >
                                • {vol.vehicle}
                              </span>
                              <span className="text-[8px] font-black px-1 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                {vol.distance}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-black text-[9px] uppercase tracking-wider h-7 px-3 rounded-sm transition-all hover:bg-emerald-500 hover:text-white active:scale-95 shadow-none shrink-0"
                          onClick={() => handleAssignVolunteer(vol)}
                        >
                          Assign
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {availableVolunteers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                      >
                        <Clock
                          className="w-5 h-5"
                          style={{ color: "var(--text-muted)" }}
                        />
                      </div>
                      <p
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        All local responders are currently busy
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter
            className="flex justify-center border-t p-4"
            style={{ borderColor: "var(--border-color)" }}
          >
            <Button
              variant="flat"
              className="font-black text-[10px] uppercase tracking-wider h-9 px-8 rounded-sm transition-all"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
              }}
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

export default PendingDonationsPage;
