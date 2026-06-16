import { useState } from "react";
import {
  Package,
  MapPin,
  Loader2,
  Check,
  Plus,
  Trash2,
  Utensils,
  Clock as ClockIcon,
  Tag,
  Edit,
} from "lucide-react";
import ResuableInput from "../../../../global/components/resuable-components/input";
import ResuableButton from "../../../../global/components/resuable-components/button";
import ResuableDropdown from "../../../../global/components/resuable-components/dropdown";
import ResuableDatePicker from "../../../../global/components/resuable-components/datepicker";
import ResuableTimePicker from "../../../../global/components/resuable-components/TimePicker";
import FileUploadSlot from "../../../../global/components/resuable-components/FileUploadSlot";
import ResuableModal from "../../../../global/components/resuable-components/modal";
import ResuableTextarea from "../../../../global/components/resuable-components/textarea";

import { createDonationInputModel } from "../store/create_donation_store";
import { getConfigItemsApiOutputModel } from "../api/get_config_items/get_config_items_store";
import {
  handleItemValueChange,
  addItem,
  removeItem,
  editItem,
  handleLogisticsChange,
} from "../controller/create_donation_controller";

import {
  FOOD_CATEGORIES,
  UNIT_OPTIONS,
  DIETARY_TYPES,
  PREPARATION_TYPES,
} from "../../../../global/constants/donation_config";

export const DonationFields = () => {
  const currentItem = createDonationInputModel.useSelector(
    (state) => state.createDonationData.currentItem
  );
  const items = createDonationInputModel.useSelector(
    (state) => state.createDonationData.items
  );
  const editingId = createDonationInputModel.useSelector(
    (state) => state.createDonationData.editingId
  );

  const configData = getConfigItemsApiOutputModel.useSelector(
    (state) => state.getConfigItemsApiData?.configItems || []
  );

  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestionCategoryName, setSuggestionCategoryName] = useState("");
  const [suggestionReason, setSuggestionReason] = useState("");
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);
  const [isSuggestionSuccess, setIsSuggestionSuccess] = useState(false);

  // Map config items to drop-down options, fallback to static defaults
  const foodCategories =
    configData
      ?.filter((c: any) => c.key === "foodCategories")
      ?.map((c: any) => ({ value: c.name, label: c.name })) || FOOD_CATEGORIES;

  const unitOptions =
    configData
      ?.filter((c: any) => c.key === "donationUnits")
      ?.map((c: any) => ({ value: c.name, label: c.description || c.name })) ||
    UNIT_OPTIONS;

  const dietaryTypes =
    configData
      ?.filter((c: any) => c.key === "dietaryTypes")
      ?.map((c: any) => ({ value: c.name, label: c.description || c.name })) ||
    DIETARY_TYPES;

  const preparationTypes =
    configData
      ?.filter((c: any) => c.key === "preparationTypes")
      ?.map((c: any) => ({ value: c.name, label: c.description || c.name })) ||
    PREPARATION_TYPES;

  return (
    <>
      {/* Food Details Card */}
      <div
        className="border rounded-md shadow-sm"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-primary)",
        }}
      >
        <div
          className="border-b p-5 sm:p-7 flex items-center gap-4"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div
            className="w-12 h-12 border rounded-xl flex items-center justify-center shadow-sm shrink-0"
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.08)",
              borderColor: "rgba(34, 197, 94, 0.15)",
              color: "#22c55e",
            }}
          >
            <Package size={24} />
          </div>
          <div>
            <h2
              className="text-xs sm:text-sm font-black uppercase tracking-tight leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              01. Food Details
            </h2>
            <p
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-1.5 opacity-40"
              style={{ color: "var(--text-secondary)" }}
            >
              Tell us what you are donating today
            </p>
          </div>
        </div>

        {/* Added Items List & Preview */}
        {(items.length > 0 ||
          (editingId === null &&
            (currentItem.foodCategory ||
              currentItem.description ||
              currentItem.quantity))) && (
          <div
            className="p-5 sm:p-8 space-y-4 bg-emerald-50/10 border-b"
            style={{ borderColor: "var(--border-color)" }}
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4 flex items-center gap-2">
              <Utensils size={14} /> Added Items (
              {items.length +
                (editingId === null &&
                (currentItem.foodCategory ||
                  currentItem.description ||
                  currentItem.quantity)
                  ? 1
                  : 0)}
              )
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item: any) => {
                const isEditingThisItem = item.id === editingId;
                const displayItem = isEditingThisItem
                  ? { ...currentItem, id: item.id }
                  : item;

                return (
                  <div
                    key={item.id}
                    className={`bg-white border rounded-2xl p-5 flex flex-col gap-4 shadow-sm group hover:shadow-md transition-all relative overflow-hidden ${
                      isEditingThisItem
                        ? "border-dashed border-blue-400 bg-blue-50/10 animate-pulse"
                        : "border-emerald-100"
                    }`}
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${
                        isEditingThisItem
                          ? "bg-blue-500 animate-pulse"
                          : "bg-emerald-500 opacity-20"
                      }`}
                    />

                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4
                          className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                            isEditingThisItem
                              ? "text-blue-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {displayItem.foodCategory || "SELECT CATEGORY"}
                        </h4>
                        <p
                          className={`text-sm font-black leading-tight ${
                            isEditingThisItem
                              ? "text-slate-800 italic opacity-85"
                              : "text-slate-900"
                          }`}
                        >
                          {displayItem.description || "Enter Food Name..."}
                        </p>
                      </div>

                      {isEditingThisItem ? (
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200/50 px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0">
                          <Loader2
                            size={10}
                            className="animate-spin text-blue-500 shrink-0"
                          />
                          Editing
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => editItem(item)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Edit Item"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Remove Item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <Tag size={12} className="opacity-50" />{" "}
                        {displayItem.quantity || "0"} {displayItem.unit}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        {displayItem.dietaryType}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                            Expires On
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                            <ClockIcon size={12} className="text-blue-500" />
                            {displayItem.expiryDate || "Not set"} @{" "}
                            {displayItem.expiryTime || "Not set"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-[9px] font-black uppercase tracking-tighter ${
                          isEditingThisItem ? "text-blue-400" : "text-slate-300"
                        }`}
                      >
                        {displayItem.preparationType}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Draft/In-progress Item */}
              {editingId === null &&
                (currentItem.foodCategory ||
                  currentItem.description ||
                  currentItem.quantity) && (
                  <div className="border border-dashed border-blue-300 bg-blue-50/10 rounded-2xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden animate-pulse">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-40 animate-pulse" />

                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                          {currentItem.foodCategory || "SELECT CATEGORY"}
                        </h4>
                        <p className="text-sm font-black text-slate-800 leading-tight italic opacity-70">
                          {currentItem.description || "Enter Food Name..."}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200/50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        <Loader2
                          size={10}
                          className="animate-spin text-blue-500 shrink-0"
                        />
                        In Progress
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <Tag size={12} className="opacity-50" />{" "}
                        {currentItem.quantity || "0"} {currentItem.unit}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        {currentItem.dietaryType}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                            Expires On
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                            <ClockIcon size={12} className="text-blue-500" />
                            {currentItem.expiryDate || "Not set"} @{" "}
                            {currentItem.expiryTime || "Not set"}
                          </div>
                        </div>
                      </div>
                      <div className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                        {currentItem.preparationType}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Inputs Section */}
        <div className="p-5 sm:p-8 space-y-8">
          <FileUploadSlot
            label="Food Item Photo"
            value={currentItem.foodPhoto}
            onChange={(file: File | null) =>
              handleItemValueChange("foodPhoto", file)
            }
            subtitle="High-quality image for better verification"
            icon="camera"
            mandatory
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-1.5">
              <ResuableDropdown
                label="Food Category"
                value={currentItem.foodCategory}
                onChange={(val) => handleItemValueChange("foodCategory", val)}
                options={foodCategories}
                placeholder="Select Type"
                required={items.length === 0}
                align="left"
              />
              <button
                type="button"
                onClick={() => setIsSuggestModalOpen(true)}
                className="self-start flex items-center gap-1.5 text-[9px] font-black text-[#22c55e] hover:text-[#16a34a] transition-colors uppercase tracking-[0.2em] px-1 hover:underline underline-offset-4 decoration-2"
              >
                Request new category
              </button>
            </div>

            <ResuableInput
              label="Food Name"
              placeholder="e.g. Veg Biryani, Pooris & Sabji"
              value={currentItem.description}
              onChange={(val) => handleItemValueChange("description", val)}
              required={items.length === 0}
              align="left"
            />
            <ResuableInput
              label="Quantity"
              type="number"
              value={currentItem.quantity}
              onChange={(val) => handleItemValueChange("quantity", val)}
              required={items.length === 0}
              placeholder="0"
              align="left"
            />
            <ResuableDropdown
              label="Unit"
              value={currentItem.unit}
              onChange={(val) => handleItemValueChange("unit", val)}
              options={unitOptions}
              placeholder="Unit"
              required={items.length === 0}
              align="left"
            />
            <ResuableDropdown
              label="Dietary Type"
              value={currentItem.dietaryType}
              onChange={(val) => handleItemValueChange("dietaryType", val)}
              options={dietaryTypes}
              placeholder="Select Type"
              required={items.length === 0}
              align="left"
            />
            <ResuableDropdown
              label="Preparation"
              value={currentItem.preparationType}
              onChange={(val) => handleItemValueChange("preparationType", val)}
              options={preparationTypes}
              placeholder="Select Prep"
              required={items.length === 0}
              align="left"
            />
          </div>
        </div>

        {/* Expiry Details */}
        <div
          className="p-5 sm:p-8 space-y-8 bg-[var(--bg-secondary)]/30 border-t"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResuableDatePicker
              label="Expiry Date"
              value={currentItem.expiryDate}
              required={items.length === 0}
              onChange={(val) => handleItemValueChange("expiryDate", val)}
              align="left"
            />
            <ResuableTimePicker
              label="Expiry Time"
              value={currentItem.expiryTime}
              onChange={(val) => handleItemValueChange("expiryTime", val)}
              required={items.length === 0}
              align="left"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div
          className="p-5 sm:p-8 border-t flex justify-center gap-4"
          style={{ borderColor: "var(--border-color)" }}
        >
          {editingId !== null && (
            <button
              type="button"
              onClick={() => {
                createDonationInputModel.update({
                  editingId: null,
                  currentItem: {
                    foodCategory: "",
                    dietaryType: "Veg",
                    preparationType: "Restaurant",
                    quantity: "",
                    unit: "kg",
                    description: "",
                    expiryDate: "",
                    expiryTime: "",
                    foodPhoto: null,
                    otherCategory: "",
                  },
                });
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 shadow-sm"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-3 px-8 py-3.5 bg-emerald-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
          >
            {editingId !== null ? (
              <>
                <Check size={18} strokeWidth={3} /> Save Changes
              </>
            ) : (
              <>
                <Plus size={18} strokeWidth={3} /> Add Item to Donation List
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggest Category Modal */}
      <ResuableModal
        isOpen={isSuggestModalOpen}
        onOpenChange={setIsSuggestModalOpen}
        title="Category Suggestion"
        footer={
          !isSuggestionSuccess && (
            <div className="flex items-center justify-end gap-3">
              <ResuableButton
                variant="ghost"
                size="sm"
                disabled={isSubmittingSuggestion}
                onClick={() => {
                  setIsSuggestModalOpen(false);
                  setSuggestionReason("");
                  setSuggestionCategoryName("");
                }}
              >
                Cancel
              </ResuableButton>
              <ResuableButton
                variant="dark"
                size="sm"
                className="!bg-[#16a34a] hover:!bg-[#15803d]"
                disabled={isSubmittingSuggestion || !suggestionCategoryName}
                onClick={() => {
                  setIsSubmittingSuggestion(true);
                  setTimeout(() => {
                    setIsSubmittingSuggestion(false);
                    setIsSuggestionSuccess(true);
                    setTimeout(() => {
                      setIsSuggestionSuccess(false);
                      setIsSuggestModalOpen(false);
                      setSuggestionReason("");
                      setSuggestionCategoryName("");
                    }, 2500);
                  }, 1500);
                }}
              >
                {isSubmittingSuggestion ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  "Submit Request"
                )}
              </ResuableButton>
            </div>
          )
        }
      >
        <div className="space-y-6 py-4">
          {isSuggestionSuccess ? (
            <div className="relative flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in duration-500 overflow-hidden text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-20 scale-150" />
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-green-500/20">
                  <Check className="text-white" size={32} strokeWidth={3} />
                </div>
              </div>
              <div className="space-y-3 z-10 px-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-green-600 leading-none mb-1">
                  Sent
                </h3>
                <h2
                  className="text-2xl font-black tracking-tight leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  Request Sent!
                </h2>
                <p
                  className="text-[13px] font-medium max-w-[320px] leading-relaxed mx-auto text-left"
                  style={{ color: "var(--text-muted)" }}
                >
                  We've received your suggestion for{" "}
                  <span
                    className="font-bold px-1.5 py-0.5 rounded-sm"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {suggestionCategoryName}
                  </span>{" "}
                  and our team will review it soon.
                </p>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <div className="h-full bg-green-500 animate-[progress-shrink_2.5s_linear_forwards]" />
              </div>
              <p
                className="absolute bottom-4 text-[9px] font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Closing automatically...
              </p>
              <style>{`@keyframes progress-shrink { from { width: 100%; } to { width: 0%; } }`}</style>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <ResuableInput
                  label="Category name"
                  placeholder="e.g., Organic Fertilizers"
                  value={suggestionCategoryName}
                  onChange={setSuggestionCategoryName}
                  required
                />
              </div>
              <div className="space-y-2">
                <ResuableTextarea
                  value={suggestionReason}
                  onChange={setSuggestionReason}
                  label="Why should we add this?"
                  placeholder="Briefly describe the importance of this category..."
                  rows={3}
                />
              </div>
              <p
                className="text-[10px] font-medium italic"
                style={{ color: "var(--text-muted)" }}
              >
                * Our administrators will review this request and update the global list if approved.
              </p>
            </>
          )}
        </div>
      </ResuableModal>
    </>
  );
};

export const LogisticsFields = () => {
  const logistics = createDonationInputModel.useSelector(
    (state) => state.createDonationData.logistics
  );

  return (
    <div
      className="border rounded-md shadow-sm"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <div
        className="border-b p-5 sm:p-7 flex items-center gap-4"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div
          className="w-12 h-12 border rounded-xl flex items-center justify-center shadow-sm shrink-0"
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.08)",
            borderColor: "rgba(34, 197, 94, 0.15)",
            color: "#22c55e",
          }}
        >
          <MapPin size={24} />
        </div>
        <div>
          <h2
            className="text-xs sm:text-sm font-black uppercase tracking-tight leading-none"
            style={{ color: "var(--text-primary)" }}
          >
            02. Pickup Information
          </h2>
          <p
            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-1.5 opacity-40"
            style={{ color: "var(--text-secondary)" }}
          >
            Where and how to collect the food
          </p>
        </div>
      </div>
      <div className="p-5 sm:p-8 space-y-8">
        <ResuableInput
          label="Full Pickup Address"
          value={logistics.pickupAddress}
          onChange={(val) => handleLogisticsChange("pickupAddress", val)}
          required
          placeholder="e.g. Block A, Community Hub, Zip 12345"
          align="left"
        />
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          <ResuableInput
            label="Contact Phone"
            type="tel"
            value={logistics.contactPhone}
            onChange={(val) => handleLogisticsChange("contactPhone", val)}
            required
            placeholder="+1 (000) 000-0000"
            align="left"
          />
        </div>
      </div>
    </div>
  );
};
