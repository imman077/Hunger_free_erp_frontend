import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Eye, Search, Table, LayoutGrid, MapPin, ShieldCheck,
  Package, Utensils, Clock, X, Edit3, Trash2,
  Droplet, Leaf, AlertTriangle
} from "lucide-react";
import { Button } from "@heroui/react";
import { ImpactCards } from "../../../global/components/reusable-components/ImpactCards";
import ReusableTable, {
  TableChip,
} from "../../../global/components/reusable-components/Table";
import ResuableButton from "../../../global/components/reusable-components/Button";
import Tabs from "../../../global/components/reusable-components/Tabs";
import { getCategoryImage } from "../../../global/constants/donation_config";
import { Loader } from "../../../global/components/reusable-components/Loader";
import ResuableModal from "../../../global/components/reusable-components/Modal";

import { myInventoryInputModel } from "./store/my_inventory_store";
import {
  fetchInventory,
  handleViewDetails,
  handleDeleteItem,
  confirmDelete,
  onDestroy,
} from "./controller/my_inventory_controller";
import { StockUpdateDrawer } from "./components/my_inventory_component";
import type { InventoryItem } from "./model/my_inventory_model";

const NGOInventory = () => {
  const navigate = useNavigate();

  const items = myInventoryInputModel.useSelector((state) => state.myInventoryState.items);
  const isLoading = myInventoryInputModel.useSelector((state) => state.myInventoryState.isLoading);
  const isDeleteModalOpen = myInventoryInputModel.useSelector((state) => state.myInventoryState.isDeleteModalOpen);
  const deleteItemName = myInventoryInputModel.useSelector((state) => state.myInventoryState.deleteItemName);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

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

  // Filter inventory items based on search query
  const filteredData = items.filter((item: InventoryItem) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.item_name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.status?.toLowerCase().includes(q)
    );
  });

  const getInventoryItemImage = (itemName: string, category: string) => {
    const t = (itemName || "").toLowerCase();
    
    if (t.includes("bread")) {
      return "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80";
    }
    if (t.includes("water") || t.includes("mineral")) {
      return "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80";
    }
    if (t.includes("bean") || t.includes("canned")) {
      return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80";
    }
    if (t.includes("milk") || t.includes("powder") || t.includes("tin")) {
      return "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80";
    }
    if (t.includes("flour") || t.includes("wheat")) {
      return "https://images.unsplash.com/photo-1574325131876-a79999999999?auto=format&fit=crop&w=600&q=80";
    }
    if (t.includes("rice")) {
      return "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80";
    }
    if (t.includes("oil")) {
      return "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80";
    }
    return getCategoryImage(category);
  };



  const formatExpiryDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const renderCard = (record: InventoryItem) => {
    const isWater = record.category?.toLowerCase().includes("water") || record.category?.toLowerCase().includes("beverage");
    const isCooked = record.category?.toLowerCase().includes("cooked");

    // Dynamic Category Details
    let catLabel = (record.category || "General").toUpperCase();
    let CatIcon = Package;
    let catClass = "bg-emerald-50 text-emerald-600 border-emerald-100/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30";

    if (isCooked) {
      catLabel = "COOKED FOOD";
      CatIcon = Utensils;
      catClass = "bg-orange-50 text-orange-600 border-orange-100/50 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30";
    } else if (isWater) {
      catLabel = "WATER";
      CatIcon = Droplet;
      catClass = "bg-blue-50 text-blue-600 border-blue-100/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30";
    }

    // Dynamic Condition Details
    const conditionUpper = (record.condition || "Excellent").toUpperCase();
    const ConditionIcon = conditionUpper.includes("FRESH") ? Leaf : ShieldCheck;

    // Dynamic Status tag styling
    const statusUpper = (record.status || "Stored").toUpperCase();
    let statusClass = "bg-emerald-50 text-emerald-600 border-emerald-100/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30";
    let statusDotColor = "bg-emerald-500";

    if (statusUpper === "RESERVED") {
      statusClass = "bg-blue-50 text-blue-600 border-blue-100/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30";
      statusDotColor = "bg-blue-500";
    } else if (statusUpper === "LOW STOCK") {
      statusClass = "bg-orange-50 text-orange-600 border-orange-100/50 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30";
      statusDotColor = "bg-orange-500";
    } else if (statusUpper === "OUT OF STOCK") {
      statusClass = "bg-red-50 text-red-600 border-red-100/50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30";
      statusDotColor = "bg-red-500";
    }

    return (
      <div
        key={record.id}
        onClick={() => handleViewDetails(record)}
        className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group/card relative overflow-hidden text-start cursor-pointer"
      >
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-4 w-full">
          {/* Category Tag */}
          <span className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${catClass}`}>
            <CatIcon size={13} />
            {catLabel}
          </span>

          {/* Status Tag */}
          <span className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider font-extrabold ${statusClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor}`} />
            {statusUpper}
          </span>
        </div>

        {/* Hero Section: Image + Title */}
        <div className="flex items-stretch gap-4 mb-2">
          {/* Left Cover Image */}
          <div className="w-[120px] h-[120px] rounded-[20px] overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm">
            <img
              src={getInventoryItemImage(record.item_name, record.category)}
              alt={record.item_name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Text details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-1 text-start">
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-snug line-clamp-2 group-hover/card:text-emerald-600 transition-colors">
                {record.item_name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1.5">
                <MapPin size={14} className="text-[#22c55e]" />
                <span>{record.location}</span>
              </div>
            </div>

            {/* Shield & Quantity Sub-Badges */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <ConditionIcon size={13} className="text-emerald-500" />
                {conditionUpper}
              </span>
              <span className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Package size={13} className="text-blue-500" />
                {record.quantity} {record.unit.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(record);
            }}
            className="w-full py-3 px-4 bg-[#f4fbf7] hover:bg-emerald-50 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20 rounded-xl text-xs font-black uppercase tracking-[0.1em] flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer active:scale-95 shadow-sm"
          >
            <Eye size={14} className="text-emerald-500 stroke-[2.5]" />
            <span>VIEW DETAILS</span>
          </button>
        </div>

        {/* Footer Row */}
        <div className="flex items-center justify-between border-t border-slate-100/80 dark:border-slate-800/80 pt-4 mt-5">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <Clock size={14} className="shrink-0" />
            <span className="text-[10px] font-bold tracking-wider">
              Added on <span className="text-slate-500 dark:text-slate-400 font-extrabold">{record.added_on || "N/A"}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/ngo/inventory/edit/${record.id}`);
              }}
              className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50/40 hover:bg-blue-100/60 dark:bg-blue-950/10 dark:hover:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 transition-all rounded-xl shadow-sm cursor-pointer active:scale-95 flex items-center justify-center"
              title="Edit Item"
            >
              <Edit3 size={14} className="stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteItem(record.id, record.item_name);
              }}
              className="p-2 text-red-600 dark:text-red-400 bg-red-50/40 hover:bg-red-100/60 dark:bg-red-950/10 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/50 transition-all rounded-xl shadow-sm cursor-pointer active:scale-95 flex items-center justify-center"
              title="Delete Item"
            >
              <Trash2 size={14} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center w-full border border-dashed rounded-[1.75rem]" style={{ borderColor: "var(--border-color)" }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-slate-50 dark:bg-slate-800 border" style={{ borderColor: "var(--border-color)" }}>
        <Search size={24} className="text-[var(--text-muted)]" />
      </div>
      <h3 className="text-lg font-black uppercase tracking-tight mb-1.5" style={{ color: "var(--text-primary)" }}>No Items Found</h3>
      <p className="text-xs font-semibold max-w-xs" style={{ color: "var(--text-muted)" }}>
        {searchQuery ? "Try checking spelling or reset filters to view all entries." : "Your inventory is currently empty."}
      </p>
    </div>
  );

  if (isLoading) {
    return <Loader text="Fetching Inventory..." minHeight="400px" />;
  }

  return (
    <div className="w-full space-y-4 max-w-[1600px] mx-auto bg-transparent pb-10">
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
              className="flex items-center gap-2.5 px-6 py-3 bg-hf-green hover:bg-hf-green/90 text-white rounded-sm transition-all active:scale-95 shadow-lg shadow-green-600/20"
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

      {/* Control Actions Row (Search & Switcher) */}
      <div className="px-3 sm:p-4 lg:p-5">
        <div 
          className="p-4 rounded-[1.5rem] border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items, categories, status..."
              className="w-full pl-11 pr-10 py-2.5 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 transition-all shadow-sm border"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-950/30"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* View switcher */}
          <Tabs
            tabs={[
              { id: "card", icon: LayoutGrid, label: "Cards" },
              { id: "table", icon: Table, label: "Table" },
            ]}
            activeTab={viewMode}
            onTabChange={(view) => setViewMode(view as "card" | "table")}
            layoutId="ngoInventoryViewMode"
          />
        </div>
      </div>

      {/* Main Records (Standard Layout) */}
      <div className="px-3 sm:p-4 lg:p-5">
        {viewMode === "card" ? (
          filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item: InventoryItem) => renderCard(item))}
            </div>
          ) : (
            renderEmptyState()
          )
        ) : (
          <div
            className="border rounded-md shadow-sm p-2 overflow-hidden"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <ReusableTable
              data={filteredData}
              enableSearch={false}
              enableFilters={false}
              topContent={null}
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
                          className="text-[11px] font-extrabold uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {formatExpiryDate(record.expiry_date)}
                        </span>
                      </div>
                    );
                  case "status":
                    return (
                      <span
                        className="text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-sm border flex items-center gap-1.5 w-fit"
                        style={{
                          backgroundColor:
                            record.status === "Stored"
                              ? "rgba(16, 185, 129, 0.15)"
                              : record.status === "Reserved"
                                ? "rgba(59, 130, 246, 0.15)"
                                : record.status === "Low Stock"
                                  ? "rgba(249, 115, 22, 0.15)"
                                  : "rgba(239, 68, 68, 0.15)",
                          borderColor:
                            record.status === "Stored"
                              ? "rgba(16, 185, 129, 0.3)"
                              : record.status === "Reserved"
                                ? "rgba(59, 130, 246, 0.3)"
                                : record.status === "Low Stock"
                                  ? "rgba(249, 115, 22, 0.3)"
                                  : "rgba(239, 68, 68, 0.3)",
                          color:
                            record.status === "Stored"
                              ? "#4ade80"
                              : record.status === "Reserved"
                                ? "#60a5fa"
                                : record.status === "Low Stock"
                                  ? "#fb923c"
                                  : "#f87171",
                        }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              record.status === "Stored"
                                ? "#4ade80"
                                : record.status === "Reserved"
                                  ? "#60a5fa"
                                  : record.status === "Low Stock"
                                    ? "#fb923c"
                                    : "#f87171",
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
                          className="!bg-transparent transition-all min-w-0 h-8 w-8 text-slate-400 hover:text-slate-600"
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onClick={(e: any) => {
                            e.stopPropagation();
                            navigate(`/ngo/inventory/edit/${record.id}`);
                          }}
                          className="!bg-transparent transition-all min-w-0 h-8 w-8 text-blue-500 hover:text-blue-700"
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onClick={(e: any) => {
                            e.stopPropagation();
                            handleDeleteItem(record.id, record.item_name);
                          }}
                          className="!bg-transparent transition-all min-w-0 h-8 w-8 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
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
        )}
      </div>

      {/* Stock Update Drawer */}
      <StockUpdateDrawer />

      {/* Delete Confirmation Modal */}
      <ResuableModal
        isOpen={isDeleteModalOpen}
        onOpenChange={(open) =>
          myInventoryInputModel.update({ isDeleteModalOpen: open })
        }
        title="Delete Inventory Item"
        subtitle="This action will permanently remove the item from storage."
        icon={<Trash2 size={18} className="text-red-500" />}
        iconWrapperClassName="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-500"
        size="md"
        classNames={{
          body: "bg-white dark:bg-slate-900"
        }}
      >
        <div className="p-5.5 space-y-5 text-start">
          {/* Warning Banner */}
          <div className="p-4 rounded-2xl border border-red-100 dark:border-red-950/30 bg-red-50/20 dark:bg-red-950/10 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/30">
              <AlertTriangle size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">CRITICAL ACTION REQUIRED</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                Deleting this inventory item will also remove all associated tracking history. You cannot retrieve this data later.
              </p>
            </div>
          </div>

          {/* Item Details Preview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center shrink-0">
              <Package size={18} className="text-emerald-500" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">ITEM SELECTED</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">{deleteItemName}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              onClick={() => myInventoryInputModel.update({ isDeleteModalOpen: false })}
              className="px-6 py-2.5 text-sm font-medium bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="px-5 py-2.5 text-sm font-medium bg-red-650 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Trash2 size={16} />
              Confirm Delete
            </Button>
          </div>
        </div>
      </ResuableModal>
    </div>
  );
};

export default NGOInventory;
