import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Heart, CheckCircle } from "lucide-react";
import ResuableButton from "../../../global/components/resuable-components/button";
import { toast } from "sonner";

import { useDonorStore } from "../store/donor-store";
import { createDonationInputModel } from "./store/create_donation_store";
import {
  onInit,
  onDestroy,
  handleDonationSubmit,
} from "./controller/create_donation_controller";
import {
  DonationFields,
  LogisticsFields,
} from "./components/create_donation_component";

export default function CreateDonationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const needId = searchParams.get("need_id");
  const ngoId = searchParams.get("ngo_id");

  const { redonatePayload, setRedonatePayload } = useDonorStore();

  const loading = createDonationInputModel.useSelector(
    (state) => state.createDonationData.loading
  );

  // Initialize page and handle redonate payloads
  useEffect(() => {
    onInit();

    if (redonatePayload) {
      const data = redonatePayload;

      // Extract details into form inputs
      const originalDonationId = data.id ? String(data.id) : null;

      let qty = "";
      let unt = "kg";
      if (data.quantity) {
        const parts = String(data.quantity).split(" ");
        qty = parts[0] || "";
        unt = parts.length > 1 ? parts.slice(1).join(" ") : "kg";
      }

      createDonationInputModel.update({
        originalDonationId,
        items: [
          {
            id: Date.now(),
            foodCategory: data.category || "",
            dietaryType: data.dietaryType || "Veg",
            preparationType: data.preparationType || "Restaurant",
            quantity: qty,
            unit: unt,
            description: data.foodType || data.description || "",
            expiryDate: data.expiryTime ? data.expiryTime.split("T")[0] : "",
            expiryTime:
              data.expiryTime && data.expiryTime.includes("T")
                ? data.expiryTime.split("T")[1]
                : "",
            foodPhoto: null,
            otherCategory: "",
          },
        ],
        logistics: {
          pickupAddress: data.pickupAddress || "",
          contactPhone: "",
        },
      });

      setRedonatePayload(null);
      toast.info("Donation details imported for review");
    }

    return () => {
      onDestroy();
    };
  }, [redonatePayload, setRedonatePayload]);

  return (
    <div
      className="p-3 sm:p-4 lg:p-5 pb-10 w-full mx-auto min-h-screen"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Header Bar */}
      <div className="max-w-5xl mx-auto mb-8 sm:mb-12 px-1 sm:px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <button
            onClick={() => navigate("/donor/donations")}
            className="flex items-center gap-2 transition-colors group w-fit"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] pt-0.5">
              Back
            </span>
          </button>
          <div className="hidden sm:block h-10 w-px bg-[var(--border-color)] opacity-60" />
          <div className="min-w-0">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              Create Donation
            </h1>
          </div>
        </div>
      </div>

      {needId && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-md border border-green-500/20 bg-green-500/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
            <Heart size={20} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-tight text-green-600">
              Responding to NGO Need
            </h3>
            <p className="text-[10px] font-medium text-green-700/80 uppercase tracking-widest mt-0.5">
              Your donation will be directly prioritized for this organization's
              request.
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => handleDonationSubmit(e, needId, ngoId)}
        className="max-w-4xl mx-auto space-y-6 pb-24"
      >
        <DonationFields />
        <LogisticsFields />

        {/* Action Bar */}
        <div
          className="fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t p-6 z-[200] shadow-[0_-10px_40px_rgba(0,0,0,0.08)]"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="max-w-5xl mx-auto flex flex-col-reverse sm:flex-row items-center justify-end gap-4 sm:gap-6">
            <ResuableButton
              variant="ghost"
              onClick={() => navigate("/donor/donations")}
              className="w-full sm:w-auto font-black text-[11px] uppercase tracking-[0.2em] hover:text-red-500 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              Discard Entry
            </ResuableButton>
            <ResuableButton
              type="submit"
              variant="dark"
              disabled={loading}
              className="w-full sm:min-w-[240px] h-[52px] !bg-[#16a34a] hover:!bg-[#15803d] !rounded-md shadow-lg shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              startContent={
                loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <CheckCircle size={20} />
                )
              }
            >
              <span className="text-[11px] font-black uppercase tracking-widest">
                {loading ? "Submitting..." : "Confirm Donation"}
              </span>
            </ResuableButton>
          </div>
        </div>
      </form>
    </div>
  );
}
