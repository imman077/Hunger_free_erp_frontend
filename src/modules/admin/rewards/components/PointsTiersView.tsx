import React, { useState, useCallback, useMemo } from "react";
import {
  Gem,
  Wallet,
  Users,
  Settings,
  RotateCcw,
  Plus,
  ShieldCheck,
  Save,
  Search,
  AlertTriangle,
  Eye,
  Trash2,
} from "lucide-react";
import { useDisclosure, Button } from "@heroui/react";
import { toast } from "sonner";
import ResuableModal from "../../../../global/components/resuable-components/modal";

import type { ColumnDef } from "../../../../global/components/resuable-components/table";
import ReusableTable from "../../../../global/components/resuable-components/table";
import { ImpactCards } from "../../../../global/components/resuable-components/ImpactCards";
import ResuableInput from "../../../../global/components/resuable-components/input";
import ResuableButton from "../../../../global/components/resuable-components/button";
import ResuableDrawer from "../../../../global/components/resuable-components/drawer";
import { INITIAL_TIERS as DEFAULT_TIERS } from "../../../../global/constants/milestone_config";

const INITIAL_TIERS = DEFAULT_TIERS;

const tierColumns: ColumnDef[] = [
  { name: "TIER NAME", uid: "name", sortable: true, align: "start" },
  {
    name: "UPGRADE THRESHOLD",
    uid: "pointsRequired",
    sortable: true,
    align: "center",
  },
  { name: "POINT RANGE", uid: "range", sortable: false, align: "center" },
  { name: "EARNING BONUS", uid: "bonus", sortable: true, align: "center" },
  { name: "ACTIONS", uid: "actions", sortable: false, align: "center" },
];

const PointsTiersView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tiers, setTiers] = useState(INITIAL_TIERS);
  const [newTier, setNewTier] = useState({
    name: "",
    minPoints: "",
    maxPoints: "",
    bonus: "",
    perks: "",
  });

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [previewTier, setPreviewTier] = useState<string>("Beginner");
  const [isTierEditMode, setIsTierEditMode] = useState(false);
  const [editableTierName, setEditableTierName] = useState("");
  const [editableTierRange, setEditableTierRange] = useState("");
  const [editableTierBonus, setEditableTierBonus] = useState("");
  const [editableTierPerks, setEditableTierPerks] = useState("");

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tierToDelete, setTierToDelete] = useState<any>(null);

  const [baseRates, setBaseRates] = useState({
    donor: { first: "300", perKg: "25", milestone: "600" },
    volunteer: { delivery: "150", streak: "500", emergency: "1000" },
    ngo: { accept: "50", waste: "10", impact: "500" },
  });

  const rewardsImpactMetrics = [
    {
      label: "Active Points Hub",
      val: "8.4M",
      trend: "+15%",
      color: "bg-[#22c55e]",
    },
    {
      label: "Reward Value Dist.",
      val: "₹4.2L",
      trend: "+22%",
      color: "bg-[#22c55e]",
    },
    {
      label: "Redemption Rate",
      val: "68%",
      trend: "+5%",
      color: "bg-[#22c55e]",
    },
    {
      label: "Global Multiplier",
      val: "3.0X",
      trend: "Active",
      color: "bg-[#22c55e]",
    },
  ];

  const sortedTiers = useMemo(() => {
    return [...tiers].sort((a, b) => a.pointsRequired - b.pointsRequired);
  }, [tiers]);

  const handleAddTier = () => {
    if (!newTier.name || !newTier.minPoints || !newTier.bonus) {
      toast.error("Please fill in required fields (Name, Min Points, Bonus)");
      return;
    }

    const range = newTier.maxPoints
      ? `${newTier.minPoints} - ${newTier.maxPoints}`
      : `${newTier.minPoints}+`;

    const tierToAdd = {
      name: newTier.name,
      range,
      pointsRequired: parseInt(newTier.minPoints, 10) || 0,
      bonus: newTier.bonus.endsWith("%") ? newTier.bonus : `${newTier.bonus}%`,
      perks: newTier.perks || "No perks defined",
      color: "#64748b", // Default slate color for new tiers
    };

    setTiers([...tiers, tierToAdd]);
    setNewTier({
      name: "",
      minPoints: "",
      maxPoints: "",
      bonus: "",
      perks: "",
    });
    toast.success(`Tier "${newTier.name}" added successfully!`);
    setIsModalOpen(false);
  };

  const handleViewTier = useCallback(
    (tier: any) => {
      setSelectedTier(tier);
      setEditableTierName(tier.name);
      setEditableTierRange(tier.range);
      setEditableTierBonus(tier.bonus);
      setEditableTierPerks(tier.perks);
      setIsTierEditMode(false);
      onDrawerOpen();
    },
    [onDrawerOpen],
  );

  const handleConfirmDelete = useCallback((tier: any) => {
    setTierToDelete(tier);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteTier = useCallback(() => {
    if (tierToDelete) {
      setTiers((prevTiers) =>
        prevTiers.filter((t) => t.name !== tierToDelete.name),
      );
      toast.success(`Tier "${tierToDelete.name}" deleted successfully!`);
      setIsDeleteModalOpen(false);
      setTierToDelete(null);
    }
  }, [tierToDelete]);

  const handleUpdateTier = useCallback(() => {
    if (!selectedTier) return;

    setTiers((prevTiers) =>
      prevTiers.map((t) =>
        t.name === selectedTier.name
          ? {
              ...t,
              name: editableTierName,
              range: editableTierRange,
              bonus: editableTierBonus,
              perks: editableTierPerks,
            }
          : t,
      ),
    );

    setSelectedTier((prev: any) => ({
      ...prev,
      name: editableTierName,
      range: editableTierRange,
      bonus: editableTierBonus,
      perks: editableTierPerks,
    }));
    setIsTierEditMode(false);
    toast.success("Tier updated successfully!");
  }, [
    selectedTier,
    editableTierName,
    editableTierRange,
    editableTierBonus,
    editableTierPerks,
  ]);

  const closeDrawer = useCallback(() => {
    setIsTierEditMode(false);
    onDrawerClose();
  }, [onDrawerClose]);

  const renderTierCell = (tier: any, columnKey: React.Key) => {
    const value = tier[columnKey as string];
    switch (columnKey) {
      case "name":
        return (
          <div
            className="flex items-center gap-2 px-2 py-0.5 rounded-full border w-fit min-w-0"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${
                tier.name === "Legend"
                  ? "bg-emerald-500 animate-pulse"
                  : tier.name === "Platinum" || tier.name === "Diamond"
                    ? "bg-blue-500"
                    : "bg-slate-400"
              }`}
            />
            <span
              className="font-bold text-[11px] whitespace-nowrap truncate max-w-[140px] pr-1"
              style={{ color: "var(--text-primary)" }}
            >
              {tier.name}
            </span>
          </div>
        );
      case "pointsRequired":
        return (
          <span
            className="font-black text-xs tabular-nums px-3 py-1 rounded-sm"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
            }}
          >
            {tier.pointsRequired.toLocaleString()} PTS
          </span>
        );
      case "bonus":
        return (
          <span className="font-black text-emerald-600 text-xs tabular-nums">
            +{value}
          </span>
        );
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => handleViewTier(tier)}
              className="!bg-transparent !text-slate-400 hover:!text-[#22c55e] transition-all min-w-0 h-8 w-8"
            >
              <Eye size={15} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => handleConfirmDelete(tier)}
              className="!bg-transparent !text-slate-400 hover:!text-red-500 transition-all min-w-0 h-8 w-8"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        );
      default:
        return (
          <span
            className="font-bold text-[11px] whitespace-nowrap px-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {value}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-6 text-start">
      <div className="flex flex-col gap-0.5 max-w-2xl">
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase"
          style={{ color: "var(--text-primary)" }}
        >
          Rewards Dashboard
        </h1>
        <p
          className="font-medium mt-1 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          Configure point systems, tiers, and manage user redemptions
        </p>
      </div>

      <ImpactCards data={rewardsImpactMetrics} />

      {/* Reward Tiers Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="p-2.5 sm:p-3 rounded-sm border shrink-0"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <Users
                style={{ color: "var(--text-muted)" }}
                size={18}
                className="sm:w-5 sm:h-5"
              />
            </div>
            <div className="flex flex-col text-start">
              <h4
                className="font-black text-lg sm:text-xl tracking-tight uppercase leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                Reward Tiers
              </h4>
              <p
                className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Manage user thresholds and benefits
              </p>
            </div>
          </div>
          <ResuableButton
            variant="primary"
            className="w-full sm:w-auto rounded-sm h-11 sm:h-12 px-6 sm:px-8 font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all active:scale-95 shadow-sm"
            onClick={() => setIsModalOpen(true)}
            startContent={<Plus size={16} />}
          >
            Add New Tier
          </ResuableButton>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-hide">
          <div className="min-w-[600px]">
            <ReusableTable
              data={sortedTiers}
              columns={tierColumns}
              renderCell={renderTierCell}
              enableSorting={false}
            />
          </div>
        </div>
      </div>

      <ResuableDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title="Tier Details"
        subtitle="System Tier Identifier"
        size="md"
      >
        {selectedTier && (
          <div className="space-y-4 p-3 sm:p-4 lg:p-5">
            <>
              {/* Hero Section */}
              <div
                className="relative pb-6 border-b"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-24 h-24 mb-4 group transition-transform duration-500 hover:scale-105">
                    <div
                      className="w-full h-full p-1.5 rounded-sm border"
                      style={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                        borderColor: "rgba(59, 130, 246, 0.2)",
                      }}
                    >
                      <div className="w-full h-full rounded-sm bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-sm overflow-hidden uppercase italic">
                        {selectedTier.name.slice(0, 2)}
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-3 max-w-sm">
                    <div className="space-y-0.5 w-full flex flex-col items-center">
                      <h3
                        className="text-2xl font-black leading-[1.05] tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {selectedTier.name}
                      </h3>
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.2em]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        LOYALTY LEVEL
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2">
                <div
                  className="p-3 rounded-sm border shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.08))",
                    borderColor: "rgba(59, 130, 246, 0.2)",
                  }}
                >
                  <div className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">
                    Point Range
                  </div>
                  <div
                    className="text-sm font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {selectedTier.range}
                  </div>
                </div>
                <div
                  className="p-3 rounded-sm border shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(20, 184, 166, 0.08))",
                    borderColor: "rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <div className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">
                    Earning Bonus
                  </div>
                  <div
                    className="text-sm font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {selectedTier.bonus}
                  </div>
                </div>
              </div>

              {/* Configuration Section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-sm border flex items-center justify-center shadow-sm shrink-0"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Settings size={16} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-xs font-black uppercase tracking-widest leading-none"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Configuration
                    </h4>
                    <p
                      className="text-[8px] font-bold uppercase tracking-tight mt-1 leading-none"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Tier Properties & Benefits
                    </p>
                  </div>
                </div>

                {isTierEditMode ? (
                  <div
                    className="p-2.5 rounded-sm border shadow-sm space-y-2.5"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <ResuableInput
                      label="Tier Name"
                      value={editableTierName}
                      onChange={setEditableTierName}
                      placeholder="e.g. Bronze, Gold"
                    />
                    <ResuableInput
                      label="Point Range"
                      value={editableTierRange}
                      onChange={setEditableTierRange}
                      placeholder="e.g. 500 - 1000"
                    />
                    <ResuableInput
                      label="Earning Bonus"
                      value={editableTierBonus}
                      onChange={setEditableTierBonus}
                      placeholder="e.g. 10%"
                    />
                    <ResuableInput
                      label="Perks & Benefits"
                      value={editableTierPerks}
                      onChange={setEditableTierPerks}
                      placeholder="Detailed perks..."
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {[
                      {
                        Icon: Gem,
                        label: "Tier Name",
                        value: selectedTier.name,
                        color: "rgb(59, 130, 246)",
                        bg: "rgba(59, 130, 246, 0.1)",
                      },
                      {
                        Icon: Search,
                        label: "Point Range",
                        value: selectedTier.range,
                        color: "rgb(99, 102, 241)",
                        bg: "rgba(99, 102, 241, 0.1)",
                      },
                      {
                        Icon: Wallet,
                        label: "Bonus Multiplier",
                        value: selectedTier.bonus,
                        color: "rgb(16, 185, 129)",
                        bg: "rgba(16, 185, 129, 0.1)",
                      },
                      {
                        Icon: ShieldCheck,
                        label: "Perks & Benefits",
                        value: selectedTier.perks,
                        color: "rgb(168, 85, 247)",
                        bg: "rgba(168, 85, 247, 0.1)",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="group p-2.5 rounded-sm border transition-all duration-300 border-b-2 border-b-transparent hover:border-b-[#22c55e] shadow-sm"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500`}
                            style={{
                              backgroundColor: item.bg,
                              color: item.color,
                            }}
                          >
                            <item.Icon size={16} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[8px] font-black uppercase tracking-[0.2em] mb-1 leading-none"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {item.label}
                            </p>
                            <p
                              className="text-[11px] font-black leading-tight truncate uppercase tracking-tight mt-1"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {item.value}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Actions Area */}
              <div className="pt-2 flex gap-2">
                {isTierEditMode ? (
                  <>
                    <ResuableButton
                      variant="secondary"
                      onClick={() => setIsTierEditMode(false)}
                      className="flex-1 !px-6 !py-3 !text-[10px] !font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 !rounded-sm !border"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-muted)",
                      }}
                      startContent={<RotateCcw size={14} />}
                    >
                      Cancel
                    </ResuableButton>
                    <ResuableButton
                      variant="primary"
                      className="flex-1 !bg-[#22c55e] hover:!bg-[#1ea34a] !text-white !font-black !px-4 !py-3 !text-[10px] uppercase tracking-widest !rounded-sm shadow-lg shadow-[#22c55e]/20"
                      onClick={handleUpdateTier}
                    >
                      <Save size={14} />
                      Update Details
                    </ResuableButton>
                  </>
                ) : (
                  <ResuableButton
                    variant="primary"
                    className="flex-1 !bg-[#22c55e] hover:!bg-[#1ea34a] !text-white !font-black !px-4 !py-3 !text-[10px] uppercase tracking-widest !rounded-sm shadow-lg shadow-[#22c55e]/20"
                    onClick={() => setIsTierEditMode(true)}
                  >
                    <Settings size={14} />
                    Edit Profile
                  </ResuableButton>
                )}
              </div>
            </>
          </div>
        )}
      </ResuableDrawer>

      {/* Configuration Section */}
      <div
        className="rounded-sm border p-4 sm:p-6 shadow-sm overflow-hidden"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 pb-4 border-b gap-4"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-2.5 bg-[#22c55e] rounded-sm shadow-sm shrink-0">
              <Settings className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col text-start">
              <h4
                className="text-lg sm:text-xl font-black tracking-tight uppercase leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                Ultra Reward Base Rates
              </h4>
              <p
                className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Configure ecosystem multipliers and rewards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <p
              className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest whitespace-nowrap"
              style={{ color: "var(--text-muted)" }}
            >
              Select Tier:
            </p>
            <select
              value={previewTier}
              onChange={(e) => setPreviewTier(e.target.value)}
              className="flex-1 sm:flex-none rounded-sm px-3 py-1.5 text-[10px] sm:text-[11px] font-black uppercase focus:outline-none focus:ring-1 focus:ring-[#22c55e] cursor-pointer"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              {tiers.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donor Points */}
          <div
            className="p-4 sm:p-6 border rounded-sm space-y-6 sm:space-y-8"
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.03)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="w-1 h-6 bg-blue-500 rounded-full" />
              <h5
                className="font-black text-[13px] uppercase tracking-widest"
                style={{ color: "var(--text-primary)" }}
              >
                Donors
              </h5>
            </div>
            <div className="space-y-6">
              {isEditing ? (
                <>
                  <ResuableInput
                    label="First Donation"
                    value={baseRates.donor.first}
                    onChange={(val) =>
                      setBaseRates({
                        ...baseRates,
                        donor: { ...baseRates.donor, first: val },
                      })
                    }
                    align="left"
                  />
                  <ResuableInput
                    label="Per KG Food"
                    value={baseRates.donor.perKg}
                    onChange={(val) =>
                      setBaseRates({
                        ...baseRates,
                        donor: { ...baseRates.donor, perKg: val },
                      })
                    }
                    align="left"
                  />
                  <ResuableInput
                    label="Milestone Bonus"
                    value={baseRates.donor.milestone}
                    onChange={(val) =>
                      setBaseRates({
                        ...baseRates,
                        donor: { ...baseRates.donor, milestone: val },
                      })
                    }
                    align="left"
                  />
                </>
              ) : (
                <>
                  {[
                    { label: "First Donation", val: baseRates.donor.first },
                    { label: "Per KG Food", val: baseRates.donor.perKg },
                    {
                      label: "Milestone Bonus",
                      val: baseRates.donor.milestone,
                    },
                  ].map((field, idx) => {
                    const currentTierBonus =
                      tiers.find((t) => t.name === previewTier)?.bonus || "0%";
                    const bonusVal = parseInt(
                      currentTierBonus.replace("%", ""),
                      10,
                    );
                    const basePoints = parseInt(field.val, 10);
                    const multipliedPoints = Math.floor(
                      basePoints * (1 + bonusVal / 100),
                    );

                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-center border-b pb-3 group"
                        style={{ borderColor: "var(--border-color)" }}
                      >
                        <p
                          className="text-[10px] font-black uppercase tracking-[0.1em] transition-colors"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {field.label}
                        </p>
                        <div className="text-right">
                          <p
                            className={`text-sm font-black tabular-nums ${bonusVal > 0 ? "text-emerald-500" : ""}`}
                            style={{
                              color:
                                bonusVal > 0
                                  ? undefined
                                  : "var(--text-primary)",
                            }}
                          >
                            {multipliedPoints} PTS
                          </p>
                          {bonusVal > 0 && (
                            <p
                              className="text-[9px] font-black uppercase tracking-tighter mt-0.5"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Base: {basePoints} + {bonusVal}%
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Volunteer Points */}
          <div
            className="p-4 sm:p-6 border rounded-sm space-y-6 sm:space-y-8"
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.03)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="w-1 h-6 bg-emerald-500 rounded-full" />
              <h5
                className="font-black text-[13px] uppercase tracking-widest"
                style={{ color: "var(--text-primary)" }}
              >
                Volunteers
              </h5>
            </div>
            <div className="space-y-6">
              {isEditing ? (
                <>
                  <ResuableInput
                    label="Per Delivery"
                    value={baseRates.volunteer.delivery}
                    onChange={(val) =>
                      setBaseRates({
                        ...baseRates,
                        volunteer: { ...baseRates.volunteer, delivery: val },
                      })
                    }
                    align="left"
                  />
                  <ResuableInput
                    label="Weekly Streak"
                    value={baseRates.volunteer.streak}
                    onChange={(val) =>
                      setBaseRates({
                        ...baseRates,
                        volunteer: { ...baseRates.volunteer, streak: val },
                      })
                    }
                    align="left"
                  />
                  <ResuableInput
                    label="Emergency Bonus"
                    value={baseRates.volunteer.emergency}
                    onChange={(val) =>
                      setBaseRates({
                        ...baseRates,
                        volunteer: { ...baseRates.volunteer, emergency: val },
                      })
                    }
                    align="left"
                  />
                </>
              ) : (
                <>
                  {[
                    {
                      label: "Per Delivery",
                      val: baseRates.volunteer.delivery,
                    },
                    { label: "Weekly Streak", val: baseRates.volunteer.streak },
                    {
                      label: "Emergency Bonus",
                      val: baseRates.volunteer.emergency,
                    },
                  ].map((field, idx) => {
                    const currentTierBonus =
                      tiers.find((t) => t.name === previewTier)?.bonus || "0%";
                    const bonusVal = parseInt(
                      currentTierBonus.replace("%", ""),
                      10,
                    );
                    const basePoints = parseInt(field.val, 10);
                    const multipliedPoints = Math.floor(
                      basePoints * (1 + bonusVal / 100),
                    );

                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-center border-b pb-3 group"
                        style={{ borderColor: "var(--border-color)" }}
                      >
                        <p
                          className="text-[10px] font-black uppercase tracking-[0.1em] transition-colors"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {field.label}
                        </p>
                        <div className="text-right">
                          <p
                            className={`text-sm font-black tabular-nums ${bonusVal > 0 ? "text-emerald-500" : ""}`}
                            style={{
                              color:
                                bonusVal > 0
                                  ? undefined
                                  : "var(--text-primary)",
                            }}
                          >
                            {multipliedPoints} PTS
                          </p>
                          {bonusVal > 0 && (
                            <p
                              className="text-[9px] font-black uppercase tracking-tighter mt-0.5"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Base: {basePoints} + {bonusVal}%
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* NGO Points */}
          <div
            className="p-4 sm:p-6 border rounded-sm space-y-6 sm:space-y-8"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.03)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="w-1 h-6 bg-amber-500 rounded-full" />
              <h5
                className="font-black text-[13px] uppercase tracking-widest"
                style={{ color: "var(--text-primary)" }}
              >
                NGOs
              </h5>
            </div>
            <div className="space-y-6">
              {isEditing ? (
                <>
                  <ResuableInput
                    label="Request Approval Points"
                    value={baseRates.ngo.accept}
                    onChange={(val) =>
                      setBaseRates({
                        ...baseRates,
                        ngo: { ...baseRates.ngo, accept: val },
                      })
                    }
                    align="left"
                  />
                  <ResuableInput
                    label="Waste Handling Points"
                    value={baseRates.ngo.waste}
                    onChange={(val) =>
                      setBaseRates({
                        ...baseRates,
                        ngo: { ...baseRates.ngo, waste: val },
                      })
                    }
                    align="left"
                  />
                  <ResuableInput
                    label="Impact Bonus"
                    value={baseRates.ngo.impact}
                    onChange={(val) =>
                      setBaseRates({
                        ...baseRates,
                        ngo: { ...baseRates.ngo, impact: val },
                      })
                    }
                    align="left"
                  />
                </>
              ) : (
                <>
                  {[
                    {
                      label: "Request Approval Points",
                      val: baseRates.ngo.accept,
                    },
                    {
                      label: "Waste Handling Points",
                      val: baseRates.ngo.waste,
                    },
                    { label: "Impact Bonus", val: baseRates.ngo.impact },
                  ].map((field, idx) => {
                    const currentTierBonus =
                      tiers.find((t) => t.name === previewTier)?.bonus || "0%";
                    const bonusVal = parseInt(
                      currentTierBonus.replace("%", ""),
                      10,
                    );
                    const basePoints = parseInt(field.val, 10);
                    const multipliedPoints = Math.floor(
                      basePoints * (1 + bonusVal / 100),
                    );

                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-center border-b pb-3 group"
                        style={{ borderColor: "var(--border-color)" }}
                      >
                        <p
                          className="text-[10px] font-black uppercase tracking-[0.1em] transition-colors"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {field.label}
                        </p>
                        <div className="text-right">
                          <p
                            className={`text-sm font-black tabular-nums ${bonusVal > 0 ? "text-emerald-500" : ""}`}
                            style={{
                              color:
                                bonusVal > 0
                                  ? undefined
                                  : "var(--text-primary)",
                            }}
                          >
                            {multipliedPoints} PTS
                          </p>
                          {bonusVal > 0 && (
                            <p
                              className="text-[9px] font-black uppercase tracking-tighter mt-0.5"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Base: {basePoints} + {bonusVal}%
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <ResuableButton
            variant="primary"
            onClick={() => {
              if (isEditing) {
                toast.success("Ecosystem Rates Updated Successfully!");
                setIsEditing(false);
              } else {
                setIsEditing(true);
              }
            }}
            className="w-full sm:w-auto !bg-[#22c55e] hover:!bg-emerald-600 px-10 font-black uppercase tracking-widest text-[11px] text-white h-11 transition-all active:scale-95"
          >
            {isEditing ? "Save Ecosystem Rates" : "Update Ecosystem Rates"}
          </ResuableButton>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ResuableModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Reward Tier"
        subtitle="Permanent System Modification"
        size="sm"
        footer={
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <ResuableButton
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              className="w-full sm:flex-1 font-black uppercase tracking-widest text-[10px] border whitespace-nowrap h-11"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-muted)",
              }}
            >
              Cancel
            </ResuableButton>
            <ResuableButton
              variant="primary"
              onClick={handleDeleteTier}
              className="w-full sm:flex-1 !bg-red-500 hover:!bg-red-600 font-black uppercase tracking-widest text-[10px] text-white shadow-lg shadow-red-500/20 whitespace-nowrap h-11"
            >
              Confirm Delete
            </ResuableButton>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-red-100/10 border border-red-500/20 flex items-center justify-center text-red-500 animate-pulse">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-1">
            <p
              className="text-sm font-bold uppercase tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Are you absolutely sure?
            </p>
            <p
              className="text-[11px] font-semibold leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              You are about to remove the{" "}
              <span className="text-red-500 font-black">
                {tierToDelete?.name}
              </span>{" "}
              tier. This action cannot be undone and may affect active users.
            </p>
          </div>
        </div>
      </ResuableModal>

      {/* Modal for Adding New Tier */}
      <ResuableModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Create New Reward Tier"
        subtitle="Define thresholds and benefits"
        size="md"
        footer={
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <ResuableButton
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:flex-1 font-black uppercase tracking-widest text-[10px] h-11"
            >
              Cancel
            </ResuableButton>
            <ResuableButton
              variant="primary"
              onClick={handleAddTier}
              className="w-full sm:flex-1 !bg-[#22c55e] hover:!bg-emerald-600 font-black uppercase tracking-widest text-[10px] text-white h-11"
            >
              Save Tier
            </ResuableButton>
          </div>
        }
      >
        <div className="space-y-6">
          <ResuableInput
            label="Tier Name"
            placeholder="e.g. Platinum Elite"
            value={newTier.name}
            onChange={(val) => setNewTier({ ...newTier, name: val })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResuableInput
              label="Min Points"
              placeholder="0"
              value={newTier.minPoints}
              onChange={(val) => setNewTier({ ...newTier, minPoints: val })}
            />
            <ResuableInput
              label="Max Points (Optional)"
              placeholder="Leaving empty means '+'"
              value={newTier.maxPoints}
              onChange={(val) => setNewTier({ ...newTier, maxPoints: val })}
            />
          </div>
          <ResuableInput
            label="Earning Bonus (%)"
            placeholder="e.g. 15"
            value={newTier.bonus}
            onChange={(val) => setNewTier({ ...newTier, bonus: val })}
          />
          <ResuableInput
            label="Tier Perks"
            placeholder="e.g. Priority Support, Exclusive Events"
            value={newTier.perks}
            onChange={(val) => setNewTier({ ...newTier, perks: val })}
          />
        </div>
      </ResuableModal>
    </div>
  );
};

export default PointsTiersView;
