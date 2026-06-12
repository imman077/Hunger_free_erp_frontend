import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Package,
  Zap,
  Flame,
  Users as UsersIcon,
} from "lucide-react";
import { useDisclosure } from "@heroui/react";
import ResuableModal from "../../../../global/components/resuable-components/modal";
import ResuableInput from "../../../../global/components/resuable-components/input";
import ResuableDropdown from "../../../../global/components/resuable-components/dropdown";
import ResuableTabs from "../../../../global/components/resuable-components/tabs";
import { toast } from "sonner";
import ResuableButton from "../../../../global/components/resuable-components/button";
import {
  INITIAL_MILESTONES as DEFAULT_MILESTONES,
  getIcon,
} from "../../../../global/constants/milestone_config";

const INITIAL_MILESTONES = DEFAULT_MILESTONES;

const getRequirementOptions = (category: string) => {
  const options = [
    { value: "points", label: "Points" },
    { value: "streaks", label: "Streaks" },
  ];

  if (category === "donors") {
    options.unshift({ value: "donations", label: "Donations" });
  } else if (category === "ngos") {
    options.unshift({ value: "deliveries", label: "KG Food Saved" });
  } else if (category === "volunteers") {
    options.unshift({ value: "deliveries", label: "Deliveries" });
  }

  return options;
};

const categoryOptions = [
  { value: "donors", label: "Donors" },
  { value: "ngos", label: "NGOs" },
  { value: "volunteers", label: "Volunteers" },
];

const MilestonesConfig: React.FC = () => {
  const [milestones, setMilestones] = useState(INITIAL_MILESTONES);
  const [activeCategory, setActiveCategory] = useState("donors");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingMilestone, setEditingMilestone] = useState<any>(null);

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onOpenChange: onAddOpenChange,
  } = useDisclosure();
  const [newMilestone, setNewMilestone] = useState({
    name: "",
    desc: "",
    requirementType: "donations",
    threshold: 0,
    icon: "Award",
    category: "donors",
  });

  const handleAddMilestone = () => {
    if (!newMilestone.name || !newMilestone.desc) {
      toast.error("Please fill in all required fields");
      return;
    }

    const id = Date.now();
    setMilestones((prev) => [...prev, { ...newMilestone, id, active: true }]);
    toast.success(`Successfully added ${newMilestone.name} milestone`);
    onAddOpenChange();
    setNewMilestone({
      name: "",
      desc: "",
      requirementType: "donations",
      threshold: 0,
      icon: "Award",
      category: "donors",
    });
  };

  const handleEditOpen = (milestone: any) => {
    setEditingMilestone({ ...milestone });
    onOpen();
  };

  const handleUpdateMilestone = () => {
    if (!editingMilestone) return;
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === editingMilestone.id ? { ...editingMilestone } : m,
      ),
    );
    toast.success(`Successfully updated ${editingMilestone.name}`);
    onOpenChange();
  };

  const toggleActive = (id: number) => {
    const milestone = milestones.find((m) => m.id === id);
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)),
    );
    toast.success(
      `${milestone?.name} ${milestone?.active ? "disabled" : "enabled"}`,
    );
  };

  const deleteMilestone = (id: number) => {
    const milestone = milestones.find((m) => m.id === id);
    setMilestones((prev) => prev.filter((m) => m.id !== id));
    toast.success(`Deleted milestone "${milestone?.name}"`);
  };

  return (
    <div className="space-y-8 pb-6 text-start">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-0.5">
          <h1
            className="text-3xl md:text-4xl font-black tracking-tight uppercase leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Impact Milestones
          </h1>
          <p
            className="font-semibold mt-1 text-sm md:text-base"
            style={{ color: "var(--text-muted)" }}
          >
            Define and manage badges rewarded for user achievements
          </p>
        </div>
        <ResuableButton
          variant="primary"
          className="rounded-sm h-12 px-4 md:px-8 font-black uppercase tracking-widest text-[9px] md:text-xs transition-all active:scale-95 shadow-lg shadow-emerald-500/10 !bg-[#22c55e] text-white w-full md:w-auto flex items-center justify-center whitespace-nowrap"
          onClick={onAddOpen}
        >
          <Plus size={16} className="mr-2 shrink-0" /> CREATE NEW MILESTONE
        </ResuableButton>
      </div>

      <div className="flex flex-col gap-6">
        <ResuableTabs
          tabs={[
            {
              label: "Donor Milestones",
              value: "donors",
              count: milestones.filter((m) => m.category === "donors").length,
              showCount: true,
            },
            {
              label: "NGO Milestones",
              value: "ngos",
              count: milestones.filter((m) => m.category === "ngos").length,
              showCount: true,
            },
            {
              label: "Volunteer Milestones",
              value: "volunteers",
              count: milestones.filter((m) => m.category === "volunteers")
                .length,
              showCount: true,
            },
          ]}
          activeTab={activeCategory}
          onTabChange={setActiveCategory}
          activeColor="#22c55e"
        />

        <div className="space-y-12">
          {(() => {
            const sections = {
              donors: [
                {
                  type: "donations",
                  label: "Donation Milestones",
                  color: "blue",
                  Icon: Package,
                },
                {
                  type: "points",
                  label: "Point Milestones",
                  color: "emerald",
                  Icon: Zap,
                },
                {
                  type: "streaks",
                  label: "Streak Milestones",
                  color: "orange",
                  Icon: Flame,
                },
                {
                  type: "others",
                  label: "Community & Others",
                  color: "purple",
                  Icon: UsersIcon,
                },
              ],
              ngos: [
                {
                  type: "deliveries",
                  label: "Food Rescue Milestones",
                  color: "blue",
                  Icon: Package,
                },
                {
                  type: "points",
                  label: "Point Milestones",
                  color: "emerald",
                  Icon: Zap,
                },
                {
                  type: "streaks",
                  label: "Streak Milestones",
                  color: "orange",
                  Icon: Flame,
                },
              ],
              volunteers: [
                {
                  type: "deliveries",
                  label: "Delivery Milestones",
                  color: "blue",
                  Icon: Package,
                },
                {
                  type: "points",
                  label: "Point Milestones",
                  color: "emerald",
                  Icon: Zap,
                },
                {
                  type: "streaks",
                  label: "Streak Milestones",
                  color: "orange",
                  Icon: Flame,
                },
              ],
            };

            const activeSections =
              sections[activeCategory as keyof typeof sections] || [];

            return activeSections.map((section) => {
              const sectionMilestones = milestones.filter((m) => {
                if (m.category !== activeCategory) return false;

                if (activeCategory === "donors") {
                  if (section.type === "others") {
                    return (
                      !["donations", "points", "streaks"].includes(
                        m.requirementType || "",
                      ) ||
                      ["Community Glue", "Local Guardian"].includes(
                        m.name || "",
                      )
                    );
                  }
                  if (
                    section.type === "donations" &&
                    ["Community Glue", "Local Guardian"].includes(m.name)
                  )
                    return false;
                }

                return m.requirementType === section.type;
              });

              if (sectionMilestones.length === 0) return null;

              return (
                <div key={section.type} className="space-y-6 md:space-y-8">
                  <div className="relative pt-4 md:pt-6">
                    <div
                      className="flex items-center justify-between p-3 md:p-4 rounded-sm border"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div className="flex items-center gap-3 md:gap-4 text-start">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-sm bg-[#22c55e] flex items-center justify-center border border-emerald-500 shadow-md shadow-emerald-500/10 transition-all duration-300">
                          <section.Icon
                            className="text-white"
                            size={18}
                            strokeWidth={2.5}
                          />
                        </div>
                        <div className="flex flex-col">
                          <h2
                            className="text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] leading-none"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {section.label}
                          </h2>
                          <p
                            className="text-[9px] md:text-[10px] font-bold mt-1.5 md:mt-2 uppercase tracking-widest"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {sectionMilestones.length} ACTIVE BADGES
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectionMilestones.map((milestone) => (
                      <MilestoneCard
                        key={milestone.id}
                        milestone={milestone}
                        handleEditOpen={handleEditOpen}
                        toggleActive={toggleActive}
                        deleteMilestone={deleteMilestone}
                      />
                    ))}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      <ResuableModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Edit Milestone"
        subtitle="Update achievement rules and display details"
        size="md"
        footer={
          <div className="flex items-center gap-3">
            <ResuableButton
              variant="ghost"
              onClick={() => onOpenChange()}
              className="font-black uppercase tracking-[0.2em] text-[10px] px-8 h-9 border"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-muted)",
              }}
            >
              Cancel
            </ResuableButton>
            <ResuableButton
              variant="primary"
              onClick={handleUpdateMilestone}
              className="font-black uppercase tracking-[0.2em] text-[10px] px-10 h-9 !bg-[#22c55e] text-white shadow-lg shadow-emerald-500/10 hover:!bg-emerald-600 active:scale-[0.98]"
            >
              Save Changes
            </ResuableButton>
          </div>
        }
      >
        <div className="space-y-6">
          <ResuableInput
            label="Milestone Name"
            placeholder="e.g. Impact Champion"
            value={editingMilestone?.name || ""}
            onChange={(val) =>
              setEditingMilestone((prev: any) => ({
                ...prev,
                name: val,
              }))
            }
          />
          <ResuableInput
            label="Description"
            placeholder="Describe how to earn this badge"
            value={editingMilestone?.desc || ""}
            onChange={(val) =>
              setEditingMilestone((prev: any) => ({
                ...prev,
                desc: val,
              }))
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <ResuableDropdown
              label="Category"
              value={editingMilestone?.category}
              options={categoryOptions}
              onChange={(val) =>
                setEditingMilestone((prev: any) => ({
                  ...prev,
                  category: val,
                }))
              }
            />
            <ResuableInput
              label="Points"
              type="number"
              value={String(editingMilestone?.threshold || "")}
              onChange={(val) =>
                setEditingMilestone((prev: any) => ({
                  ...prev,
                  threshold: Number(val),
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1">
            <ResuableDropdown
              label="Requirement Type"
              value={editingMilestone?.requirementType}
              options={getRequirementOptions(editingMilestone?.category)}
              onChange={(val) =>
                setEditingMilestone((prev: any) => ({
                  ...prev,
                  requirementType: val,
                }))
              }
            />
          </div>
        </div>
      </ResuableModal>

      <ResuableModal
        isOpen={isAddOpen}
        onOpenChange={onAddOpenChange}
        title="New Milestone Entry"
        subtitle="Define a new badge achievement for the ecosystem"
        size="md"
        footer={
          <div className="flex items-center gap-3">
            <ResuableButton
              variant="ghost"
              onClick={() => onAddOpenChange()}
              className="font-black uppercase tracking-[0.2em] text-[10px] px-8 h-9 border"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-muted)",
              }}
            >
              Cancel
            </ResuableButton>
            <ResuableButton
              variant="primary"
              onClick={handleAddMilestone}
              className="font-black uppercase tracking-[0.2em] text-[10px] px-10 h-9 !bg-[#22c55e] text-white shadow-lg shadow-emerald-500/10 hover:!bg-emerald-600 active:scale-[0.98]"
            >
              Create Milestone
            </ResuableButton>
          </div>
        }
      >
        <div className="space-y-8">
          <div className="space-y-6">
            <ResuableInput
              label="Milestone Name"
              placeholder="e.g. Master Donor"
              value={newMilestone.name}
              onChange={(val) =>
                setNewMilestone({ ...newMilestone, name: val })
              }
            />
            <ResuableInput
              label="Description"
              placeholder="e.g. Consistently donated for 12 months"
              value={newMilestone.desc}
              onChange={(val) =>
                setNewMilestone({ ...newMilestone, desc: val })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <ResuableDropdown
                label="Category"
                value={newMilestone.category}
                options={categoryOptions}
                onChange={(val) =>
                  setNewMilestone({ ...newMilestone, category: val })
                }
              />
              <ResuableInput
                label="Threshold"
                type="number"
                placeholder="0"
                value={String(newMilestone.threshold || "")}
                onChange={(val) =>
                  setNewMilestone({
                    ...newMilestone,
                    threshold: Number(val),
                  })
                }
              />
            </div>
            <div className="grid grid-cols-1">
              <ResuableDropdown
                label="Requirement Type"
                value={newMilestone.requirementType}
                options={getRequirementOptions(newMilestone.category)}
                onChange={(val) =>
                  setNewMilestone({
                    ...newMilestone,
                    requirementType: val,
                  })
                }
              />
            </div>

            <div className="space-y-3">
              <label
                className="text-[10px] font-black uppercase tracking-widest px-1"
                style={{ color: "var(--text-muted)" }}
              >
                Display Icon
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  "Heart",
                  "Package",
                  "Trophy",
                  "Zap",
                  "Target",
                  "Award",
                  "Shield",
                  "Crown",
                  "Star",
                  "Flame",
                  "Globe",
                  "ZapOff",
                  "Users",
                ].map((iconName) => {
                  const IconComp = getIcon(iconName);
                  return (
                    <button
                      key={iconName}
                      onClick={() =>
                        setNewMilestone({
                          ...newMilestone,
                          icon: iconName,
                        })
                      }
                      className={`flex flex-col items-center justify-center p-3 rounded-sm border transition-all gap-2 ${
                        newMilestone.icon === iconName
                          ? "bg-[#22c55e]/10 border-emerald-500 text-emerald-500 shadow-sm shadow-emerald-500/10"
                          : "hover:bg-[var(--bg-secondary)] transition-colors"
                      }`}
                      style={{
                        borderColor:
                          newMilestone.icon === iconName
                            ? undefined
                            : "var(--border-color)",
                        color:
                          newMilestone.icon === iconName
                            ? undefined
                            : "var(--text-muted)",
                      }}
                    >
                      <IconComp
                        size={18}
                        strokeWidth={newMilestone.icon === iconName ? 2.5 : 2}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </ResuableModal>
    </div>
  );
};

// Extracted MilestoneCard for cleaner grouping
const MilestoneCard = ({
  milestone,
  handleEditOpen,
  toggleActive,
  deleteMilestone,
}: any) => {
  const MilestoneIcon = getIcon(milestone.icon || "Award");
  return (
    <div
      className={`group relative p-6 rounded-sm border transition-all duration-300 ${
        !milestone.active ? "opacity-60 border-dashed" : "shadow-none"
      }`}
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      {(() => {
        const getRequirementUnit = () => {
          const type = milestone.requirementType;
          const category = milestone.category;

          if (type === "donations") return "Donations";
          if (type === "deliveries") {
            return category === "ngos" ? "KG Saved" : "Deliveries";
          }
          if (type === "points") return "Points";
          if (type === "streaks") return "Days";
          return type;
        };
        const unit = getRequirementUnit();

        return (
          <>
            {/* Action pill - responsive visibility */}
            <div
              className="absolute top-4 md:top-6 right-4 md:right-6 flex items-center gap-1 border rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10 transition-opacity"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <button
                className="p-1.5 rounded-full hover:bg-emerald-500/10 transition-colors"
                style={{ color: "var(--text-muted)" }}
                onClick={() => handleEditOpen(milestone)}
                title="Edit Policy"
              >
                <Edit2 size={11} />
              </button>
              <button
                className={`p-1.5 rounded-full hover:bg-emerald-500/10 transition-colors ${
                  milestone.active ? "text-emerald-500" : "var(--text-muted)"
                }`}
                style={{
                  color: milestone.active ? undefined : "var(--text-muted)",
                }}
                onClick={() => toggleActive(milestone.id)}
                title={
                  milestone.active ? "Pause Visibility" : "Restore Visibility"
                }
              >
                {milestone.active ? <Eye size={11} /> : <EyeOff size={11} />}
              </button>
              <div
                className="w-px h-3 mx-0.5"
                style={{ backgroundColor: "var(--border-color)" }}
              />
              <button
                className="p-1.5 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
                onClick={() => deleteMilestone(milestone.id)}
                title="Decommission"
              >
                <Trash2 size={11} />
              </button>
            </div>

            <div className="flex flex-col h-full">
              {/* Header Section */}
              <div className="mb-4 md:mb-6 flex flex-col gap-3 md:gap-4">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white ${
                    milestone.active
                      ? "bg-gradient-to-br from-[#22c55e] to-[#16a34a] border border-emerald-400/20"
                      : "bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] opacity-50"
                  }`}
                >
                  <MilestoneIcon
                    className="w-5 h-5 md:w-6 md:h-6"
                    strokeWidth={2.5}
                  />
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <h3
                    className="text-lg md:text-xl font-black tracking-tight leading-tight group-hover:text-emerald-600 transition-colors"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {milestone.name}
                  </h3>
                  <div className="flex items-start gap-2 max-w-[85%] md:max-w-[90%]">
                    <div
                      className={`mt-1 h-2.5 w-0.5 shrink-0 rounded-full ${milestone.active ? "bg-emerald-500" : "bg-[var(--border-color)]"}`}
                    />
                    <p
                      className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] leading-normal line-clamp-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {milestone.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Footer Section */}
              <div
                className="mt-auto grid grid-cols-[1fr_1px_1fr] items-center pt-3 md:pt-4 border-t -mx-4 md:-mx-6 -mb-4 md:-mb-6 rounded-b-sm"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex flex-col items-center px-2 md:px-4 pb-3 md:pb-4">
                  <span
                    className="text-[7px] md:text-[8px] font-black uppercase tracking-widest mb-1 md:mb-1.5 opacity-70"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Threshold
                  </span>
                  <div className="flex items-center gap-1 md:gap-1.5 min-h-[16px] md:min-h-[18px]">
                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500" />
                    <span
                      className="text-[10px] md:text-[11px] font-black tabular-nums tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {milestone.threshold.toLocaleString()}
                      <span className="ml-0.5 md:ml-1 text-[8px] md:text-[9px] text-emerald-600 font-bold">
                        {unit}
                      </span>
                    </span>
                  </div>
                </div>

                <div
                  className="h-5 md:h-6 w-px mb-3 md:mb-4"
                  style={{ backgroundColor: "var(--border-color)" }}
                />

                <div className="flex flex-col items-center px-2 md:px-4 pb-3 md:pb-4">
                  <span
                    className="text-[7px] md:text-[8px] font-black uppercase tracking-widest mb-1 md:mb-1.5 opacity-70"
                    style={{ color: "var(--text-muted)" }}
                  >
                    System
                  </span>
                  <div
                    className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 md:px-3 py-0.5 md:py-1 rounded-full border min-h-[16px] md:min-h-[18px] flex items-center justify-center ${
                      milestone.active
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "opacity-50"
                    }`}
                    style={{
                      borderColor: milestone.active
                        ? undefined
                        : "var(--border-color)",
                      color: milestone.active ? undefined : "var(--text-muted)",
                    }}
                  >
                    {milestone.active ? "Enabled" : "Locked"}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
};

export default MilestonesConfig;
