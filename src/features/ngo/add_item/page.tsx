import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Package, ClipboardList, Check } from "lucide-react";
import ResuableInput from "../../../global/components/resuable-components/input";
import ResuableButton from "../../../global/components/resuable-components/button";
import ResuableDropdown from "../../../global/components/resuable-components/dropdown";
import ResuableTextarea from "../../../global/components/resuable-components/textarea";
import { ResuableDatePicker } from "../../../global/components/resuable-components/datepicker";
import { NEED_CATEGORIES, UNIT_OPTIONS } from "../../../global/constants/donation_config";
import { addItemInputModel } from "./store/add_item_store";
import {
  handleFormValueChange,
  handleSubmit,
  openSuggestModal,
  onDestroy,
} from "./controller/add_item_controller";
import { SuggestCategoryModal } from "./components/add_item_component";

const AddItem = () => {
  const navigate = useNavigate();

  const formData = addItemInputModel.useSelector((state) => state.addItemData.formData);
  const isSubmitting = addItemInputModel.useSelector((state) => state.addItemData.isSubmitting);

  const categories = NEED_CATEGORIES;
  const units = UNIT_OPTIONS;

  useEffect(() => {
    return () => {
      onDestroy();
    };
  }, []);

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
        onSubmit={(e) => handleSubmit(e, navigate)}
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
                  onChange={(val) => handleFormValueChange("name", val)}
                  required
                />

                <div className="relative">
                  <ResuableDropdown
                    label="Item Category"
                    options={categories}
                    value={formData.category}
                    onChange={(val) => handleFormValueChange("category", val)}
                  />
                  <button
                    type="button"
                    onClick={openSuggestModal}
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
                      onChange={(val) => handleFormValueChange("otherCategory", val)}
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
                    onChange={(val) => handleFormValueChange("quantity", val)}
                    required
                  />
                  <ResuableDropdown
                    label="Unit"
                    options={units}
                    value={formData.unit}
                    onChange={(val) => handleFormValueChange("unit", val)}
                  />
                </div>

                <ResuableDatePicker
                  label="Expiry Date"
                  value={formData.expiryDate}
                  onChange={(val) => handleFormValueChange("expiryDate", val)}
                />

                <ResuableInput
                  label="Storage Location"
                  placeholder="e.g. Block A, Cold Storage"
                  value={formData.location}
                  onChange={(val) => handleFormValueChange("location", val)}
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
                    placeholder="Waiting for date selection..."
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
                  onChange={(val) => handleFormValueChange("notes", val)}
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
      <SuggestCategoryModal />
    </div>
  );
};

export default AddItem;
