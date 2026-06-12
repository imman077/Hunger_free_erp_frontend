import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Settings, Check, X } from "lucide-react";
import { useConfigStore } from "../store/config-store";
import { Spinner } from "@heroui/react";
import type { ConfigItem } from "../store/config-schemas";

type ConfigSection = {
  key:
    | "foodCategories"
    | "donationStatuses"
    | "userStatuses"
    | "ngoTypes"
    | "volunteerSkills";
  title: string;
  icon: React.ReactNode;
  hasDescription: boolean;
  hasColor: boolean;
};

const configSections: ConfigSection[] = [
  {
    key: "foodCategories",
    title: "Food Categories",
    icon: <Settings size={18} />,
    hasDescription: true,
    hasColor: false,
  },
  {
    key: "donationStatuses",
    title: "Donation Statuses",
    icon: <Settings size={18} />,
    hasDescription: false,
    hasColor: true,
  },
  {
    key: "userStatuses",
    title: "User Statuses",
    icon: <Settings size={18} />,
    hasDescription: false,
    hasColor: true,
  },
  {
    key: "ngoTypes",
    title: "NGO Types",
    icon: <Settings size={18} />,
    hasDescription: true,
    hasColor: false,
  },
  {
    key: "volunteerSkills",
    title: "Volunteer Skills",
    icon: <Settings size={18} />,
    hasDescription: true,
    hasColor: false,
  },
];

const ConfigurationPage: React.FC = () => {
  const { config, fetchConfig, isLoading, addItem, updateItem, deleteItem } =
    useConfigStore();
  const [activeSection, setActiveSection] =
    useState<keyof typeof config>("foodCategories");

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState({
    name: "",
    description: "",
    color: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    color: "slate",
  });

  const currentSection = configSections.find((s) => s.key === activeSection)!;
  const currentItems = config[activeSection] as ConfigItem[];

  const handleAdd = () => {
    if (!newItem.name.trim()) return;

    addItem(activeSection, {
      name: newItem.name,
      description: currentSection.hasDescription
        ? newItem.description
        : undefined,
      color: currentSection.hasColor ? newItem.color : undefined,
    });

    setNewItem({ name: "", description: "", color: "slate" });
    setIsAdding(false);
  };

  const handleEdit = (item: ConfigItem) => {
    setEditingId(item.id);
    setEditValue({
      name: item.name,
      description: item.description || "",
      color: item.color || "",
    });
  };

  const handleSave = (id: number) => {
    updateItem(activeSection, id, {
      name: editValue.name,
      description: editValue.description,
      color: editValue.color,
    });
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItem(activeSection, id);
    }
  };

  const colorOptions = ["emerald", "blue", "amber", "red", "slate", "purple"];

  return (
    <div className="p-4 sm:p-8 w-full mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-700 font-inter relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-50">
          <Spinner color="success" size="lg" label="Syncing Config..." />
        </div>
      )}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4">
        <div className="text-start">
          <h1
            className="text-3xl sm:text-4xl font-black tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            System Configuration
          </h1>
          <p
            className="font-semibold mt-2 text-sm sm:text-base"
            style={{ color: "var(--text-muted)" }}
          >
            Manage dropdown options and system settings in one place.
          </p>
        </div>
      </header>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div
            className="border rounded-sm p-1 lg:p-2 flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar space-x-1 lg:space-x-0 lg:space-y-1"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            {configSections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`whitespace-nowrap flex items-center gap-3 px-6 lg:px-4 py-3 rounded-sm text-left transition-all ${
                  activeSection === section.key
                    ? "bg-[#22c55e]/10 text-[#22c55e] font-bold border-b-2 lg:border-b-0 lg:border-l-4 border-[#22c55e]"
                    : "hover:bg-[var(--bg-primary)] font-medium"
                }`}
                style={{
                  color:
                    activeSection === section.key
                      ? undefined
                      : "var(--text-secondary)",
                }}
              >
                <span className="text-sm">{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-9">
          <div
            className="border rounded-sm overflow-hidden"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className="flex items-center justify-between p-3 sm:p-4 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="text-left min-w-0">
                <h2
                  className="text-base sm:text-lg font-black truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {currentSection.title}
                </h2>
                <p
                  className="text-[10px] sm:text-xs font-medium mt-0.5 truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  {currentItems.length} items configured
                </p>
              </div>
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#22c55e] text-white rounded-sm font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 shrink-0"
              >
                <Plus size={14} className="sm:w-3.5 sm:h-3.5 w-3 h-3" />
                <span>Add New</span>
              </button>
            </div>

            {isAdding && (
              <div
                className="p-4 border-b"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.05)",
                  borderColor: "rgba(34, 197, 94, 0.2)",
                }}
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="w-full sm:flex-1 px-3 py-2 border rounded-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e]"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  />
                  {currentSection.hasDescription && (
                    <input
                      type="text"
                      placeholder="Description"
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      className="w-full sm:flex-1 px-3 py-2 border rounded-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e]"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                      }}
                    />
                  )}
                  {currentSection.hasColor && (
                    <select
                      value={newItem.color}
                      onChange={(e) =>
                        setNewItem({ ...newItem, color: e.target.value })
                      }
                      className="w-full sm:w-auto px-3 py-2 border rounded-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e]"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {colorOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAdd}
                      className="flex-1 sm:flex-none p-2 bg-[#22c55e] text-white rounded-sm hover:bg-emerald-600 transition-colors flex justify-center"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="flex-1 sm:flex-none p-2 rounded-sm transition-colors flex justify-center"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div
              className="divide-y"
              style={{ borderColor: "var(--border-color)" }}
            >
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="relative flex items-center justify-start p-4 hover:bg-[var(--bg-primary)]/50 transition-colors group"
                >
                  {editingId === item.id ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                      <input
                        type="text"
                        value={editValue.name}
                        onChange={(e) =>
                          setEditValue({ ...editValue, name: e.target.value })
                        }
                        className="w-full sm:flex-1 px-3 py-2 border rounded-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e]"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                          color: "var(--text-primary)",
                        }}
                      />
                      {currentSection.hasDescription && (
                        <input
                          type="text"
                          value={editValue.description}
                          onChange={(e) =>
                            setEditValue({
                              ...editValue,
                              description: e.target.value,
                            })
                          }
                          className="w-full sm:flex-1 px-3 py-2 border rounded-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e]"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-primary)",
                          }}
                        />
                      )}
                      {currentSection.hasColor && (
                        <select
                          value={editValue.color}
                          onChange={(e) =>
                            setEditValue({
                              ...editValue,
                              color: e.target.value,
                            })
                          }
                          className="w-full sm:w-auto px-3 py-2 border rounded-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e]"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {colorOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSave(item.id)}
                          className="flex-1 sm:flex-none p-2 bg-[#22c55e] text-white rounded-sm hover:bg-emerald-600 transition-colors flex justify-center"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 sm:flex-none p-2 rounded-sm transition-colors flex justify-center"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            color: "var(--text-muted)",
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 flex-1 min-w-0 pr-16 lg:pr-0">
                        {currentSection.hasColor && item.color && (
                          <div
                            className={`w-3 h-3 rounded-full shrink-0`}
                            style={{
                              backgroundColor:
                                item.color === "emerald"
                                  ? "#10b981"
                                  : item.color === "blue"
                                    ? "#3b82f6"
                                    : item.color === "amber"
                                      ? "#f59e0b"
                                      : item.color === "red"
                                        ? "#ef4444"
                                        : item.color === "purple"
                                          ? "#a855f7"
                                          : "var(--text-muted)",
                            }}
                          />
                        )}
                        <div className="min-w-0 text-left">
                          <p
                            className="font-bold text-sm leading-tight truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {item.name}
                          </p>
                          {currentSection.hasDescription && (
                            <p
                              className="text-xs font-medium mt-0.5 truncate"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {item.description || "No description"}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="absolute right-4 flex items-center gap-1 sm:gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-sm transition-all"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Pencil
                            size={14}
                            className="hover:text-[#22c55e] transition-colors"
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-sm transition-all"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Trash2
                            size={14}
                            className="hover:text-red-500 transition-colors"
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {currentItems.length === 0 && (
                <div className="p-12 text-center">
                  <p
                    className="font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No items configured yet.
                  </p>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="mt-4 text-[#22c55e] font-bold text-sm hover:underline"
                  >
                    Add your first item
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
