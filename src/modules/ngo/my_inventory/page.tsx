import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import { Button } from "@heroui/react";
import { ImpactCards } from "../../../global/components/resuable-components/ImpactCards";
import ReusableTable, {
  TableChip,
} from "../../../global/components/resuable-components/table";
import ResuableButton from "../../../global/components/resuable-components/button";

import { myInventoryInputModel } from "./store/my_inventory_store";
import {
  fetchInventory,
  handleViewDetails,
  onDestroy,
} from "./controller/my_inventory_controller";
import { StockUpdateDrawer } from "./components/my_inventory_component";

const NGOInventory = () => {
  const navigate = useNavigate();

  const items = myInventoryInputModel.useSelector((state) => state.myInventoryState.items);
  const isLoading = myInventoryInputModel.useSelector((state) => state.myInventoryState.isLoading);

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

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchInventory();
      fetchedRef.current = true;
    }
    return () => {
      onDestroy();
    };
  }, []);

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
                    {String(record[columnKey as keyof typeof record])}
                  </span>
                );
            }
          }}
        />
      </div>

      {/* Stock Update Drawer */}
      <StockUpdateDrawer />
    </div>
  );
};

export default NGOInventory;
