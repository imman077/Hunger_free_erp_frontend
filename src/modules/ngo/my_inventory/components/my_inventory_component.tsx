
import { Package, MapPin, ClipboardList, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import ResuableDrawer from "../../../../global/components/resuable-components/drawer";
import ResuableInput from "../../../../global/components/resuable-components/input";
import ResuableDropdown from "../../../../global/components/resuable-components/dropdown";
import ResuableButton from "../../../../global/components/resuable-components/button";
import { myInventoryInputModel } from "../store/my_inventory_store";
import {
  setIsDrawerOpen,
  setIsEditing,
  setEditFormDataValue,
  handleUpdateStock,
} from "../controller/my_inventory_controller";

export const StockUpdateDrawer = () => {
  const isOpen = myInventoryInputModel.useSelector((state) => state.myInventoryState.isDrawerOpen);
  const isUpdating = myInventoryInputModel.useSelector((state) => state.myInventoryState.isUpdating);
  const isEditing = myInventoryInputModel.useSelector((state) => state.myInventoryState.isEditing);
  const selectedRecord = myInventoryInputModel.useSelector((state) => state.myInventoryState.selectedRecord);
  const editFormData = myInventoryInputModel.useSelector((state) => state.myInventoryState.editFormData);

  return (
    <ResuableDrawer
      isOpen={isOpen}
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
                  onChange={(val) => setEditFormDataValue("quantity", val)}
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
                  onChange={(val) => setEditFormDataValue("status", val)}
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
  );
};
