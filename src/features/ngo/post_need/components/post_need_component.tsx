
import { Loader2, Check } from "lucide-react";
import ResuableInput from "../../../../global/components/reusable-components/Input";
import ResuableTextarea from "../../../../global/components/reusable-components/Textarea";
import ResuableButton from "../../../../global/components/reusable-components/Button";
import ResuableModal from "../../../../global/components/reusable-components/Modal";
import { postNeedInputModel } from "../store/post_need_store";
import {
  closeSuggestModal,
  handleSuggestValueChange,
  handleSuggestSubmit,
} from "../controller/post_need_controller";

export const SuggestCategoryModal = () => {
  const isOpen = postNeedInputModel.useSelector((state) => state.postNeedData.isSuggestModalOpen);
  const isSubmitting = postNeedInputModel.useSelector((state) => state.postNeedData.isSubmitting);
  const isSuccess = postNeedInputModel.useSelector((state) => state.postNeedData.isSuccess);
  const suggestionCategoryName = postNeedInputModel.useSelector((state) => state.postNeedData.suggestionCategoryName);
  const suggestionReason = postNeedInputModel.useSelector((state) => state.postNeedData.suggestionReason);

  return (
    <ResuableModal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) closeSuggestModal();
      }}
      title="Category Suggestion"
      footer={
        !isSuccess && (
          <div className="flex items-center justify-end gap-3">
            <ResuableButton
              variant="ghost"
              size="sm"
              disabled={isSubmitting}
              onClick={closeSuggestModal}
            >
              Cancel
            </ResuableButton>
            <ResuableButton
              variant="primary"
              size="sm"
              disabled={isSubmitting || !suggestionCategoryName}
              onClick={handleSuggestSubmit}
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
              <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-20 scale-150" />
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-green-500/20">
                <Check className="text-white" size={32} strokeWidth={3} />
              </div>
            </div>

            <div className="text-center space-y-3 z-10">
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

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
              <div className="h-full bg-green-500 animate-[progress-shrink_2.5s_linear_forwards]" />
            </div>

            <p className="absolute bottom-4 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
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
                onChange={(val) => handleSuggestValueChange("suggestionCategoryName", val)}
                required
              />
            </div>

            <div className="space-y-2">
              <ResuableTextarea
                value={suggestionReason}
                onChange={(val) => handleSuggestValueChange("suggestionReason", val)}
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
  );
};
