import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Users,
  AlertCircle,
} from "lucide-react";
import ResuableInput from "../../../global/components/resuable-components/input";
import ResuableButton from "../../../global/components/resuable-components/button";
import ResuableDropdown from "../../../global/components/resuable-components/dropdown";
import ResuableDatePicker from "../../../global/components/resuable-components/datepicker";
import ResuableTextarea from "../../../global/components/resuable-components/textarea";
import FileUploadSlot from "../../../global/components/resuable-components/FileUploadSlot";
import { useAuthStore } from "../../../global/contexts/auth-store";
import { NEED_CATEGORIES, UNIT_OPTIONS, URGENCY_OPTIONS } from "../../../global/constants/donation_config";

import { postNeedInputModel } from "./store/post_need_store";
import {
  handleFormValueChange,
  handleSubmit,
  openSuggestModal,
  onDestroy,
} from "./controller/post_need_controller";
import { SuggestCategoryModal } from "./components/post_need_component";

const PostNewNeed = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const formData = postNeedInputModel.useSelector((state) => state.postNeedData.formData);

  const categoryOptions = NEED_CATEGORIES;
  const unitOptions = UNIT_OPTIONS;
  const urgencyOptions = URGENCY_OPTIONS;

  useEffect(() => {
    return () => {
      onDestroy();
    };
  }, []);

  return (
    <div
      className="p-8 w-full mx-auto h-fit"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Header Bar */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/ngo/dashboard")}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors group"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-sm font-bold uppercase tracking-widest pt-0.5">
                Back
              </span>
            </button>
            <div className="h-10 w-px bg-gray-200 hidden sm:block" />
            <div>
              <h1
                className="text-4xl font-black tracking-tighter leading-none mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Post New Need
              </h1>
            </div>
          </div>
          <div
            className="px-4 py-2 rounded-sm flex items-center gap-3 shadow-sm border"
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.08)",
              borderColor: "rgba(34, 197, 94, 0.2)",
            }}
          >
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[10px] font-black text-[#22c55e] uppercase tracking-widest">
              Form Active
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => handleSubmit(e, user, navigate)}
        className="max-w-5xl mx-auto space-y-10"
      >
        {/* Card 01: Item Info */}
        <div
          className="border rounded-sm shadow-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div
            className="border-b p-8 flex items-center gap-5"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div
              className="w-14 h-14 rounded-sm flex items-center justify-center border"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.08)",
                borderColor: "rgba(34, 197, 94, 0.2)",
                color: "#22c55e",
              }}
            >
              <Package size={28} />
            </div>
            <div>
              <h2
                className="text-2xl text-left font-black tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Item Details
              </h2>
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Specify what you need and how much
              </p>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <ResuableInput
              label="Item Name"
              placeholder="e.g., Baby Food & Formula"
              value={formData.itemName}
              onChange={(value) => handleFormValueChange("itemName", value)}
              required
            />

            <div className="flex flex-col gap-1.5">
              <ResuableDropdown
                label="Category"
                options={categoryOptions}
                value={formData.category}
                onChange={(value) => handleFormValueChange("category", value)}
                placeholder="Select category"
              />
              <button
                type="button"
                onClick={openSuggestModal}
                className="self-start flex items-center gap-1.5 text-[9px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-[0.2em] px-1 hover:underline underline-offset-4 decoration-2"
              >
                Request Admin to add new category
              </button>
            </div>

            {formData.category === "other" && (
              <div className="md:col-span-1">
                <ResuableInput
                  label="Specify Category"
                  placeholder="Enter custom category"
                  value={formData.otherCategory}
                  onChange={(value) =>
                    handleFormValueChange("otherCategory", value)
                  }
                  required
                />
              </div>
            )}

            <ResuableInput
              label="Quantity"
              placeholder="e.g., 50"
              type="number"
              value={formData.quantity}
              onChange={(value) => handleFormValueChange("quantity", value)}
              required
            />

            <ResuableDropdown
              label="Unit"
              options={unitOptions}
              value={formData.unit}
              onChange={(value) => handleFormValueChange("unit", value)}
            />

            <ResuableDropdown
              label="Urgency Level"
              options={urgencyOptions}
              value={formData.urgency}
              onChange={(value) => handleFormValueChange("urgency", value)}
            />

            <ResuableDatePicker
              label="Required By"
              value={formData.requiredBy}
              onChange={(value) => handleFormValueChange("requiredBy", value)}
            />

            <div className="md:col-span-2">
              <FileUploadSlot
                label="Item Image"
                subtitle="Upload a sample photo of the item"
                value={formData.itemImage}
                onChange={(file) => handleFormValueChange("itemImage", file)}
                mandatory
                icon="camera"
                accept="image/*"
              />
            </div>
          </div>
        </div>

        {/* Card 02: Distribution Info */}
        <div
          className="border rounded-sm shadow-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div
            className="border-b p-8 flex items-center gap-5"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div
              className="w-14 h-14 rounded-sm flex items-center justify-center border"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
                color: "var(--text-muted)",
              }}
            >
              <Users size={28} />
            </div>
            <div>
              <h2
                className="text-2xl font-black tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Delivery Information
              </h2>
              <p
                className="text-xs text-left font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Where the items should be delivered or distributed
              </p>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 gap-8">
            <ResuableInput
              label="Distribution Address"
              placeholder="e.g., Community Center A, Shelter B"
              value={formData.location}
              onChange={(value) => handleFormValueChange("location", value)}
              required
            />

            <ResuableTextarea
              label="Description"
              rows={5}
              placeholder="Provide any additional details about this need..."
              value={formData.description}
              onChange={(value) => handleFormValueChange("description", value)}
            />
          </div>
        </div>

        {/* System Intelligence Banner - Simplified */}
        <div
          className="relative overflow-hidden border p-0 rounded-none shadow-sm flex items-stretch"
          style={{
            backgroundColor: "rgba(59, 130, 246, 0.03)",
            borderColor: "rgba(59, 130, 246, 0.2)",
          }}
        >
          <div className="flex-1 p-6 flex flex-col sm:flex-row items-start gap-6">
            <div
              className="w-12 h-12 rounded-none flex items-center justify-center border shrink-0"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "rgba(59, 130, 246, 0.2)",
                color: "#3b82f6",
              }}
            >
              <AlertCircle size={24} />
            </div>
            <div className="text-left">
              <div className="flex flex-col gap-1 mb-2">
                <h3 className="text-lg font-black text-blue-700 tracking-tight leading-tight">
                  Important Information
                </h3>
              </div>
              <p
                className="text-[13px] font-medium leading-relaxed max-w-2xl"
                style={{ color: "rgba(59, 130, 246, 0.9)" }}
              >
                Donors will see your request immediately after you post it. We
                will send you notifications when someone shows interest. Please
                make sure all details are correct.
              </p>
            </div>
          </div>
          {/* Subtle background element */}
          <div className="absolute -right-8 -bottom-8 opacity-[0.03] pointer-events-none">
            <AlertCircle size={160} />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <ResuableButton variant="primary" size="lg" type="submit">
            Post Need
          </ResuableButton>
        </div>
      </form>

      {/* Suggest Category Modal */}
      <SuggestCategoryModal />
    </div>
  );
};

export default PostNewNeed;
