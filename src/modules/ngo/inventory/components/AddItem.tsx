import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Package,
  ClipboardList,
  Check,
  Loader2,
} from "lucide-react";
import ResuableInput from "../../../../global/components/resuable-components/input";
import ResuableButton from "../../../../global/components/resuable-components/button";
import ResuableDropdown from "../../../../global/components/resuable-components/dropdown";
import ResuableModal from "../../../../global/components/resuable-components/modal";
import ResuableTextarea from "../../../../global/components/resuable-components/textarea";
import { ResuableDatePicker } from "../../../../global/components/resuable-components/datepicker";
import { toast } from "sonner";
import { NEED_CATEGORIES, UNIT_OPTIONS } from "../../../../global/constants/donation_config";
import { ngoInventoryService } from "../api/inventory/inventory.api";

const AddItem = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Perishable",
    quantity: "",
    unit: "kg",
    expiryDate: "",
    location: "",
    condition: "Excellent",
    notes: "",
    otherCategory: "",
  });

  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestionCategoryName, setSuggestionCategoryName] = useState("");
  const [suggestionReason, setSuggestionReason] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = NEED_CATEGORIES;
  const units = UNIT_OPTIONS;

  useEffect(() => {
    if (formData.expiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiry = new Date(formData.expiryDate);
      expiry.setHours(0, 0, 0, 0);

      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let autoCondition = "Excellent";
      if (diffDays <= 7) {
        autoCondition = "Critical";
      } else if (diffDays <= 30) {
        autoCondition = "Good";
      }

      setFormData((prev) => ({ ...prev, condition: autoCondition }));
    }
  }, [formData.expiryDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        item_name: formData.name,
        category: formData.category === "other" ? formData.otherCategory : formData.category,
        quantity: parseFloat(formData.quantity) || 0,
        unit: formData.unit,
        expiry_date: formData.expiryDate || null,
        location: formData.location,
        condition: formData.condition,
        notes: formData.notes
      };

      await ngoInventoryService.addItem(submitData);
      
      setIsSubmitting(false);
      toast.success("Item Added", {
        description: `${formData.name} added to inventory.`,
      });
      navigate("/ngo/inventory");
    } catch (error) {
      console.error("Error adding inventory item:", error);
      setIsSubmitting(false);
      toast.error("Failed to add item", {
        description: "An error occurred while saving to the database."
      });
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 max-w-[1000px] mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tactical Header */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 sm:pb-8"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="space-y-1">
          <button
            onClick={() => navigate("/ngo/inventory")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border bg-hf-green/5 border-hf-green/20 text-hf-green hover:bg-hf-green/10 transition-all active:scale-95 mb-4 w-fit"
          >
            <ChevronLeft size={10} strokeWidth={4} />
            <span className="text-[9px] font-black uppercase tracking-widest pt-0.5">
              Inventory
            </span>
          </button>
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm flex items-center justify-center border shrink-0"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <Package size={20} className="text-hf-green sm:hidden" />
              <Package size={24} className="text-hf-green hidden sm:block" />
            </div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              Add New <span className="text-hf-green">Item</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Main Intelligent Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Column: Essential Data */}
        <div className="lg:col-span-12 space-y-4 sm:space-y-6">
          <div
            className="p-4 sm:p-6 md:p-8 rounded-sm border relative overflow-hidden group"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-hf-green opacity-[0.02] blur-3xl rounded-full transition-opacity" />

            <div className="relative space-y-6 sm:space-y-8">
              <div
                className="flex items-center gap-3 border-b pb-4 sm:pb-6"
                style={{ borderColor: "var(--border-color)" }}
              >
                <ClipboardList size={18} className="text-hf-green" />
                <h2
                  className="text-[11px] font-black uppercase tracking-[0.2em]"
                  style={{ color: "var(--text-primary)" }}
                >
                  Item Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-8 sm:gap-y-10">
                <ResuableInput
                  label="Item Name"
                  placeholder="e.g. Organic Brown Rice"
                  value={formData.name}
                  onChange={(val) => setFormData({ ...formData, name: val })}
                  required
                />

                <div className="relative">
                  <ResuableDropdown
                    label="Item Category"
                    options={categories}
                    value={formData.category}
                    onChange={(val) =>
                      setFormData({ ...formData, category: val })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setIsSuggestModalOpen(true)}
                    className="flex items-center gap-1.5 text-[8px] font-black text-hf-green hover:underline underline-offset-4 decoration-2 uppercase tracking-[0.2em] px-1 mt-1.5 transition-colors"
                  >
                    Request new category
                  </button>
                </div>

                {formData.category === "other" && (
                  <div className="md:col-span-1">
                    <ResuableInput
                      label="Specify Classification"
                      placeholder="Enter custom classification"
                      value={formData.otherCategory}
                      onChange={(val) =>
                        setFormData({ ...formData, otherCategory: val })
                      }
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ResuableInput
                    label="Quantity"
                    placeholder="0.00"
                    type="number"
                    value={formData.quantity}
                    onChange={(val) =>
                      setFormData({ ...formData, quantity: val })
                    }
                    required
                  />
                  <ResuableDropdown
                    label="Unit"
                    options={units}
                    value={formData.unit}
                    onChange={(val) => setFormData({ ...formData, unit: val })}
                  />
                </div>

                <ResuableDatePicker
                  label="Expiry Date"
                  value={formData.expiryDate}
                  onChange={(val) =>
                    setFormData({ ...formData, expiryDate: val })
                  }
                />

                <ResuableInput
                  label="Storage Location"
                  placeholder="e.g. Block A, Cold Storage"
                  value={formData.location}
                  onChange={(val) =>
                    setFormData({ ...formData, location: val })
                  }
                />

                <div className="relative">
                  <ResuableInput
                    label="Item Condition"
                    value={
                      formData.condition === "Excellent"
                        ? "Excellent"
                        : formData.condition === "Good"
                          ? "Good"
                          : "Critical"
                    }
                    onChange={() => {}}
                    disabled
                    placeholder="Wating for date selection..."
                    className="opacity-75 cursor-not-allowed"
                    endContent={
                      formData.expiryDate && (
                        <span
                          className="text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-full border mr-2"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-color)",
                            color: "var(--color-emerald)",
                          }}
                        >
                          Auto Calculated
                        </span>
                      )
                    }
                  />
                </div>
              </div>

              <div
                className="pt-6 border-t"
                style={{ borderColor: "var(--border-color)" }}
              >
                <ResuableTextarea
                  label="Additional Notes"
                  placeholder="Add any extra details or instructions here..."
                  value={formData.notes}
                  onChange={(val) => setFormData({ ...formData, notes: val })}
                  rows={4}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/ngo/inventory")}
                  className="w-full sm:w-auto px-8 py-3.5 text-[11px] font-black uppercase tracking-widest transition-colors hover:text-hf-green"
                  style={{ color: "var(--text-muted)" }}
                >
                  Discard
                </button>
                <ResuableButton
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-10 py-4 bg-hf-green text-white rounded-sm hover:bg-hf-green/90 transition-all active:scale-95 ${
                    isSubmitting ? "opacity-70" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-sm animate-spin" />
                  ) : (
                    <Check size={16} className="text-white" />
                  )}
                  <span className="text-[11px] font-black uppercase tracking-[0.15em] pt-0.5">
                    {isSubmitting ? "Saving..." : "Add Item"}
                  </span>
                </ResuableButton>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Suggest Category Modal */}
      <ResuableModal
        isOpen={isSuggestModalOpen}
        onOpenChange={setIsSuggestModalOpen}
        title="Category Suggestion"
        footer={
          !isSuccess && (
            <div className="flex items-center justify-end gap-3">
              <ResuableButton
                variant="ghost"
                size="sm"
                disabled={isSubmitting}
                onClick={() => {
                  setIsSuggestModalOpen(false);
                  setSuggestionReason("");
                  setSuggestionCategoryName("");
                }}
              >
                Cancel
              </ResuableButton>
              <ResuableButton
                variant="primary"
                size="sm"
                disabled={isSubmitting || !suggestionCategoryName}
                onClick={() => {
                  setIsSubmitting(true);
                  // Simulate system transmission
                  setTimeout(() => {
                    setIsSubmitting(false);
                    setIsSuccess(true);
                    // Automatic reset and close
                    setTimeout(() => {
                      setIsSuccess(false);
                      setIsSuggestModalOpen(false);
                      setSuggestionReason("");
                      setSuggestionCategoryName("");
                    }, 2500);
                  }, 1500);
                }}
              >
                {isSubmitting ? (
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
          {isSuccess ? (
            <div className="relative flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in duration-500 overflow-hidden">
              <div className="relative mb-8">
                {/* Outer decorative ring */}
                <div className="absolute inset-0 rounded-full bg-hf-green animate-ping opacity-10 scale-150" />
                <div className="w-16 h-16 bg-hf-green rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-hf-green/20">
                  <Check className="text-white" size={32} strokeWidth={3} />
                </div>
              </div>

              <div className="text-center space-y-3 z-10 px-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-hf-green leading-none mb-1">
                  Sent
                </h3>
                <h2
                  className="text-2xl font-black tracking-tight leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  Request Sent!
                </h2>
                <p
                  className="text-[13px] font-medium max-w-[320px] leading-relaxed mx-auto"
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

              {/* Automatic dismissal indicator */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <div className="h-full bg-hf-green animate-[progress-shrink_2.5s_linear_forwards]" />
              </div>

              <p
                className="absolute bottom-4 text-[9px] font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Closing automatically...
              </p>

              <style>{`
                @keyframes progress-shrink {
                  from { width: 100%; }
                  to { width: 0%; }
                }
              `}</style>
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
                * Our administrators will review this request and update the
                global list if approved.
              </p>
            </>
          )}
        </div>
      </ResuableModal>
    </div>
  );
};

export default AddItem;
