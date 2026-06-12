import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Eye,
  Loader2,
  Plus,
  Package,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@heroui/react";
import { toast } from "sonner";
import { ImpactCards } from "../../../../global/components/resuable-components/ImpactCards";
import ReusableTable, {
  TableChip,
} from "../../../../global/components/resuable-components/table";
import ResuableDrawer from "../../../../global/components/resuable-components/drawer";
import ResuableInput from "../../../../global/components/resuable-components/input";
import ResuableButton from "../../../../global/components/resuable-components/button";
import ResuableDropdown from "../../../../global/components/resuable-components/dropdown";
import { ngoInventoryService } from "../api/inventory/inventory.api";

interface InventoryItem {
  id: number;
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  expiry_date: string;
  condition: string;
  notes: string;
  status?: string;
  urgency?: string;
}

const NGOInventory = () => {
  const navigate = useNavigate();
  const inventoryStats = [
    {
      label: "Grains & Rice",
      val: "420kg",
      trend: "Good Stock",
      color: "bg-[#22c55e]",
    },
    {
      label: "Hygiene Kits",
      val: "150 units",
      trend: "Low Stock",
      color: "bg-blue-500",
    },
    {
      label: "Fresh Food",
      val: "85kg",
      trend: "Expires Soon",
      color: "bg-orange-500",
    },
    {
      label: "Medical Gear",
      val: "940 units",
      trend: "Well stocked",
      color: "bg-purple-500",
    },
  ];

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] =
    useState<InventoryItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editFormData, setEditFormData] = useState({
    quantity: "",
    status: "" as any,
  });

  const fetchedRef = React.useRef(false);

  const fetchInventory = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ngoInventoryService.getInventory();
      // Ensure specific fields exist or set defaults
      const mapped = (Array.isArray(data) ? data : []).map((item: any) => ({
        ...item,
        status: item.status || "Stored",
        urgency: item.urgency || "Normal"
      }));
      setItems(mapped);
    } catch (error) {
      toast.error("Failed to load inventory");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!fetchedRef.current) {
      fetchInventory();
      fetchedRef.current = true;
    }
  }, [fetchInventory]);

  const handleViewDetails = (record: InventoryItem) => {
    setSelectedRecord(record);
    setEditFormData({
      quantity: String(record.quantity),
      status: record.status || "Stored",
    });
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  const handleUpdateStock = async () => {
    if (!selectedRecord) return;
    setIsUpdating(true);
    try {
      await ngoInventoryService.updateItem(selectedRecord.id, {
        quantity: parseFloat(editFormData.quantity) || 0,
        status: editFormData.status
      });
      toast.success("Stock Updated", {
        description: `${selectedRecord.item_name} levels have been updated.`,
      });
      setIsDrawerOpen(false);
      fetchInventory();
    } catch (error) {
      toast.error("Failed to update stock");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredData = items;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
        <div className="w-12 h-12 border-4 border-hf-green border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-hf-green">
          Fetching Inventory...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 max-w-[1600px] mx-auto bg-transparent">
      {/* User Friendly Header */}
      <div className="p-3 sm:p-4 lg:p-5">
        <div className="relative">
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 p-4">
            <div className="text-start space-y-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-hf-green/10 text-hf-green text-[10px] font-black uppercase tracking-[0.3em] px-2.5 py-1 rounded-sm border border-hf-green/20">
                  Inventory Items
                </span>
              </div>
              <h1
                className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                Inventory <span className="text-hf-green">Hub</span>
              </h1>
            </div>
            <ResuableButton
              variant="primary"
              className="flex items-center gap-2.5 px-6 py-3 bg-hf-green hover:bg-hf-green/90 text-white rounded-sm transition-all active:scale-95"
              onClick={() => navigate("/ngo/inventory/add")}
            >
              <Plus size={16} className="text-white" />
              <span className="text-[11px] font-black uppercase tracking-[0.15em] pt-0.5">
                Add Item
              </span>
            </ResuableButton>
          </div>
        </div>
      </div>

      {/* Analytics Hub */}
      <div className="p-3 sm:p-4 lg:p-5">
        <ImpactCards data={inventoryStats} className="gap-3 md:gap-4" />
      </div>

      {/* Main Records (Standard Layout) */}
      <div className="p-3 sm:p-4 lg:p-5">
        <ReusableTable
          data={filteredData}
          enableSearch={true}
          enableFilters={false}
          columns={[
            {
              name: "Item Details",
              uid: "item_name",
              sortable: true,
              align: "start",
            },
            { name: "Category", uid: "category", sortable: true },
            { name: "Quantity", uid: "quantity", sortable: false },
            { name: "Condition", uid: "condition", sortable: true },
            { name: "Expiry", uid: "expiry_date", sortable: true },
            { name: "Status", uid: "status", sortable: true },
            { name: "Urgency", uid: "urgency", sortable: true },
            { name: "Actions", uid: "actions", sortable: false },
          ]}
          renderCell={(record: any, columnKey: React.Key) => {
            switch (columnKey) {
              case "item_name":
                return (
                  <div className="py-2 text-left">
                    <TableChip
                      text={record.item_name}
                      initials={record.item_name.substring(0, 1)}
                      iconClassName="bg-hf-green text-white border-hf-green/40 border transition-colors duration-300"
                    />
                  </div>
                );
              case "category":
                return (
                  <span
                    className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                      color: "var(--color-emerald)",
                    }}
                  >
                    {record.category}
                  </span>
                );
              case "quantity":
                return (
                  <div className="space-y-1">
                    <span
                      className="font-black text-[13px] tracking-tight tabular-nums"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {record.quantity}
                    </span>
                    <span
                      className="text-[9px] font-black uppercase block tracking-widest pl-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {record.unit}
                    </span>
                  </div>
                );
              case "condition":
                return (
                  <div className="flex items-center gap-2 py-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${record.condition === "Excellent" ? "bg-emerald-500" : record.condition === "Good" ? "bg-blue-500" : "bg-red-500"}`}
                    />
                    <span
                      className="text-[11px] font-black uppercase tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {record.condition}
                    </span>
                  </div>
                );
              case "expiry_date":
                return (
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] font-bold font-mono uppercase"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {record.expiry_date || "N/A"}
                    </span>
                  </div>
                );
              case "status":
                return (
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-sm border flex items-center gap-1.5 w-fit"
                    style={{
                      backgroundColor:
                        record.status === "Delivered"
                          ? "rgba(16, 185, 129, 0.15)"
                          : record.status === "In Transit"
                            ? "rgba(59, 130, 246, 0.15)"
                            : "rgba(148, 163, 184, 0.15)",
                      borderColor:
                        record.status === "Delivered"
                          ? "rgba(16, 185, 129, 0.3)"
                          : record.status === "In Transit"
                            ? "rgba(59, 130, 246, 0.3)"
                            : "rgba(148, 163, 184, 0.3)",
                      color:
                        record.status === "Delivered"
                          ? "#4ade80"
                          : record.status === "In Transit"
                            ? "#60a5fa"
                            : "var(--text-muted)",
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          record.status === "Delivered"
                            ? "#4ade80"
                            : record.status === "In Transit"
                              ? "#60a5fa"
                              : "var(--text-muted)",
                      }}
                    />
                    {record.status}
                  </span>
                );
              case "urgency":
                return (
                  <span
                    className="text-[9px] font-black uppercase px-2.5 py-1 rounded-sm border tracking-wider"
                    style={{
                      backgroundColor:
                        record.urgency === "High"
                          ? "rgba(239, 68, 68, 0.15)"
                          : "rgba(148, 163, 184, 0.15)",
                      borderColor:
                        record.urgency === "High"
                          ? "rgba(239, 68, 68, 0.3)"
                          : "rgba(148, 163, 184, 0.3)",
                      color:
                        record.urgency === "High"
                          ? "#f87171"
                          : "var(--text-secondary)",
                    }}
                  >
                    {record.urgency}
                  </span>
                );
              case "actions":
                return (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        handleViewDetails(record);
                      }}
                      className="!bg-transparent transition-all min-w-0 h-8 w-8"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Eye size={14} />
                    </Button>
                  </div>
                );

              default:
                return (
                  <span
                    className="text-xs font-medium whitespace-nowrap px-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {String(record[columnKey as keyof InventoryItem])}
                  </span>
                );
            }
          }}
        />
      </div>

      {/* Stock Update Drawer */}
      <ResuableDrawer
        isOpen={isDrawerOpen}
        onClose={() => !isUpdating && setIsDrawerOpen(false)}
        title="Item Details"
      >
        {selectedRecord && (
          <div className="space-y-8 p-3 sm:p-4 lg:p-5">
            {/* Branded Item Hero */}
            <div
              className="p-5 rounded-sm flex items-center gap-5 relative overflow-hidden border"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="absolute -top-6 -right-6 p-4 opacity-[0.03]">
                <Package size={120} className="text-hf-green" />
              </div>
              <div className="w-14 h-14 bg-hf-green rounded-sm border border-hf-green/40 flex items-center justify-center text-2xl font-black text-white relative z-10 uppercase shrink-0">
                {selectedRecord.item_name.substring(0, 1)}
              </div>
              <div className="flex-1 min-w-0 space-y-2 relative z-10">
                <h4
                  className="text-[17px] font-black uppercase tracking-tight leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  {selectedRecord.item_name}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="flex items-center gap-1.5 px-2 py-1 rounded-sm border"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <MapPin size={10} className="text-hf-green" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                      {selectedRecord.location}
                    </span>
                  </div>
                  <div
                    className="px-2 py-1 rounded-sm border"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#22c55e]">
                      {selectedRecord.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {!isEditing ? (
              /* Detail View: Information Rich Summary */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="p-4 rounded-sm space-y-1.5 border"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <span
                      className="text-[8px] font-black uppercase tracking-[0.2em] block"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Quantity
                    </span>
                    <p
                      className="text-xl font-black tracking-tighter"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedRecord.quantity}{" "}
                      <span className="text-[10px] font-black uppercase opacity-40 ml-1">
                        {selectedRecord.unit}
                      </span>
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-sm space-y-1.5 border"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <span
                      className="text-[8px] font-black uppercase tracking-[0.2em] block"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Item Condition
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedRecord.condition === "Excellent"
                            ? "bg-emerald-500"
                            : selectedRecord.condition === "Good"
                              ? "bg-blue-500"
                              : "bg-red-500"
                        }`}
                      />
                      <p
                        className="text-[14px] font-black uppercase tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {selectedRecord.condition}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] px-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <ClipboardList size={12} className="text-hf-green" />
                    More Information
                  </div>
                  <div
                    className="border rounded-sm divide-y overflow-hidden"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div
                      className="p-4 flex items-center justify-between"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Expiry Date
                      </span>
                      <span
                        className="text-[12px] font-black flex items-center gap-2 tabular-nums"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <Calendar size={14} className="text-[#22c55e]" />
                        {selectedRecord.expiry_date || "N/A"}
                      </span>
                    </div>
                    <div
                      className="p-4 flex items-center justify-between border-t"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Current Status
                      </span>
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-sm border"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            selectedRecord.status === "Delivered"
                              ? "bg-emerald-500"
                              : selectedRecord.status === "In Transit"
                                ? "bg-blue-500"
                                : "bg-slate-400"
                          }`}
                        />
                        <span
                          className="text-[11px] font-black uppercase tracking-tight"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {selectedRecord.status}
                        </span>
                      </div>
                    </div>
                    <div
                      className="p-4 space-y-2 border-t"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Notes
                      </span>
                      <div
                        className="p-3 rounded-sm border border-dashed min-h-[60px] flex items-center"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <p
                          className="text-[12px] font-medium italic leading-relaxed"
                          style={{
                            color: selectedRecord.notes
                              ? "var(--text-primary)"
                              : "var(--text-muted)",
                          }}
                        >
                          {selectedRecord.notes
                            ? `"${selectedRecord.notes}"`
                            : "No extra parameters specified."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <ResuableButton
                    variant="primary"
                    className="w-full py-4 rounded-sm bg-hf-green hover:bg-hf-green/90"
                    onClick={() => setIsEditing(true)}
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      Edit Item Details
                    </span>
                  </ResuableButton>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full py-3 text-[11px] font-black uppercase tracking-widest transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Edit View: Adjustment Controls */
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-1">
                  <h5
                    className="text-[10px] font-black uppercase tracking-[0.3em]"
                    style={{ color: "var(--color-emerald)" }}
                  >
                    Edit Details
                  </h5>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border bg-hf-green/5 border-hf-green/20 text-hf-green hover:bg-hf-green/10 transition-all active:scale-95 shrink-0"
                  >
                    <ArrowLeft size={10} strokeWidth={4} />
                    <span className="text-[9px] font-black uppercase tracking-widest pt-0.5">
                      Back
                    </span>
                  </button>
                </div>

                <div
                  className="grid grid-cols-1 gap-6 p-6 rounded-sm border"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <ResuableInput
                    label="Adjust Quantity"
                    value={editFormData.quantity}
                    onChange={(val) =>
                      setEditFormData({ ...editFormData, quantity: val })
                    }
                    placeholder={`e.g. ${selectedRecord.quantity}`}
                    required
                    endContent={
                      <span
                        className="text-[10px] font-black uppercase tracking-widest pr-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {selectedRecord.unit}
                      </span>
                    }
                  />

                  <ResuableDropdown
                    label="Update Status"
                    options={[
                      { value: "Dispatched", label: "Dispatched" },
                      { value: "In Transit", label: "In Transit" },
                      { value: "Delivered", label: "Delivered" },
                    ]}
                    value={editFormData.status}
                    onChange={(val) =>
                      setEditFormData({ ...editFormData, status: val as any })
                    }
                  />

                  <div
                    className="p-4 rounded-2xl border flex items-start gap-4"
                    style={{
                      backgroundColor: "rgba(59, 130, 246, 0.12)",
                      borderColor: "rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    <p
                      className="text-[11px] font-bold leading-relaxed"
                      style={{ color: "#60a5fa" }}
                    >
                      Saving these changes will update the inventory records and
                      notify the distribution center.
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <ResuableButton
                    variant="primary"
                    className="w-full py-4 rounded-sm bg-hf-green hover:bg-hf-green/90"
                    disabled={isUpdating}
                    onClick={handleUpdateStock}
                  >
                    {isUpdating ? (
                      <div className="flex items-center gap-3">
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </ResuableButton>
                  <ResuableButton
                    variant="ghost"
                    className="w-full py-4 rounded-sm"
                    disabled={isUpdating}
                    onClick={() => setIsEditing(false)}
                  >
                    Discard Changes
                  </ResuableButton>
                </div>
              </div>
            )}
          </div>
        )}
      </ResuableDrawer>
    </div>
  );
};

export default NGOInventory;
