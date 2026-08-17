import {
  Package, MapPin, ClipboardList, Calendar,
  Building2, Tag, ShieldCheck, Clock, Utensils, FileText, Leaf, Circle
} from "lucide-react";
import ResuableDrawer from "../../../../global/components/reusable-components/Drawer";
import { myInventoryInputModel } from "../store/my_inventory_store";
import { setIsDrawerOpen } from "../controller/my_inventory_controller";

export const StockUpdateDrawer = () => {
  const isOpen = myInventoryInputModel.useSelector((state) => state.myInventoryState.isDrawerOpen);
  const selectedRecord = myInventoryInputModel.useSelector((state) => state.myInventoryState.selectedRecord);

  const getInventoryItemImage = (itemName: string) => {
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
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
  };

  const getRelativeDaysText = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      const expiry = new Date(dateStr);
      if (isNaN(expiry.getTime())) return "";
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expiry.setHours(0, 0, 0, 0);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return "(Expired)";
      if (diffDays === 0) return "(Today)";
      if (diffDays === 1) return "(in 1 day)";
      return `(in ${diffDays} days)`;
    } catch (e) {
      return "";
    }
  };

  const formatExpiryDate = (dateStr?: string | null) => {
    if (!dateStr) return "No Expiry";
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

  return (
    <ResuableDrawer
      isOpen={isOpen}
      onClose={() => setIsDrawerOpen(false)}
      title="Item Details"
      subtitle="View complete information about this item"
      headerVariant="green"
      headerIcon={<FileText size={20} className="text-white" />}
    >
      {selectedRecord && (
        <div className="space-y-6 p-4 sm:p-5 lg:p-6 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen">
          {/* Hero Section: Image + Title */}
          <div className="flex items-start gap-5">
            {/* Left Cover Image */}
            <div className="w-[120px] h-[120px] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm">
              <img
                src={getInventoryItemImage(selectedRecord.item_name)}
                alt={selectedRecord.item_name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Text details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1 text-start">
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-snug">
                  {selectedRecord.item_name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1.5">
                  <MapPin size={14} className="text-[#22c55e]" />
                  <span>{selectedRecord.location}</span>
                </div>
              </div>

              {/* Shield & Quantity Sub-Badges */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  {selectedRecord.condition?.toUpperCase().includes("FRESH") ? (
                    <Leaf size={12} className="text-emerald-500" />
                  ) : (
                    <ShieldCheck size={12} className="text-emerald-500" />
                  )}
                  {selectedRecord.condition?.toUpperCase()}
                </span>
                <span className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Package size={12} className="text-blue-500" />
                  {selectedRecord.quantity} {selectedRecord.unit.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Quantity Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm text-start">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                <Package size={18} className="stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black tracking-wider text-slate-400 uppercase leading-none mb-1">
                  QUANTITY
                </p>
                <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">
                  {selectedRecord.quantity}
                </p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 leading-none">
                  {selectedRecord.unit}
                </p>
              </div>
            </div>

            {/* Condition Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm text-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck size={18} className="stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black tracking-wider text-slate-400 uppercase leading-none mb-1">
                  ITEM CONDITION
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-none">
                    {selectedRecord.condition}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MORE INFORMATION Header */}
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 text-start pt-2">
            <ClipboardList size={14} className="text-emerald-700 dark:text-emerald-400 stroke-[2.5]" />
            <span>MORE INFORMATION</span>
          </div>

          {/* Details List */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            {/* Category */}
            <div className="p-4 flex items-center justify-between text-start text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Tag size={15} className="text-orange-500 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  CATEGORY
                </span>
              </div>
              <span className="text-xs font-extrabold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                <Utensils size={13} />
                {selectedRecord.category}
              </span>
            </div>

            {/* Total Quantity */}
            <div className="p-4 flex items-center justify-between text-start text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Package size={15} className="text-blue-500 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  TOTAL QUANTITY
                </span>
              </div>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                {selectedRecord.quantity} {selectedRecord.unit}
              </span>
            </div>

            {/* Item Condition */}
            <div className="p-4 flex items-center justify-between text-start text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={15} className="text-emerald-500 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  ITEM CONDITION
                </span>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                {selectedRecord.condition}
              </span>
            </div>

            {/* Expiry Date */}
            <div className="p-4 flex items-center justify-between text-start text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Calendar size={15} className="text-orange-500 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  EXPIRY DATE
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                  {formatExpiryDate(selectedRecord.expiry_date)}
                </span>
                {selectedRecord.expiry_date && (
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 leading-none mt-0.5">
                    {getRelativeDaysText(selectedRecord.expiry_date)}
                  </span>
                )}
              </div>
            </div>

            {/* Storage Location */}
            <div className="p-4 flex items-center justify-between text-start text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Building2 size={15} className="text-emerald-500 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  STORAGE LOCATION
                </span>
              </div>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                {selectedRecord.location}
              </span>
            </div>

            {/* Current Status */}
            <div className="p-4 flex items-center justify-between text-start text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Circle size={15} className="text-purple-500 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  CURRENT STATUS
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100/50 text-[10px] font-black text-emerald-600 flex items-center gap-1.5 uppercase leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {selectedRecord.status || "STORED"}
              </span>
            </div>

            {/* Added On */}
            <div className="p-4 flex items-center justify-between text-start text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Clock size={15} className="text-blue-500 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  ADDED ON
                </span>
              </div>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                {selectedRecord.added_on || "N/A"}
              </span>
            </div>

            {/* Notes */}
            <div className="p-4 flex items-start justify-between text-start text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
                <FileText size={15} className="text-slate-400 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  NOTES
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-[200px] text-right italic leading-relaxed break-words pl-4">
                {selectedRecord.notes ? `"${selectedRecord.notes}"` : "No extra parameters specified."}
              </span>
            </div>
          </div>

          {/* Close Action Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="w-full py-4 bg-[#10b981] hover:bg-[#059669] text-white rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer active:scale-95 flex items-center justify-center"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </ResuableDrawer>
  );
};
