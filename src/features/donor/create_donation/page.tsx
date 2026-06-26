import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Heart, CheckCircle } from "lucide-react";
import ResuableButton from "../../../global/components/reusable-components/Button";
import { toast } from "sonner";
import PageHeader from "../../../global/components/reusable-components/PageHeader";

import { useDonorStore } from "../store/donor-store";
import { useAuthStore } from "../../../global/store/auth-store";
import { getDonationDraftApi } from "./api/get_donation_draft/get_donation_draft_api";
import { createDonationInputModel } from "./store/create_donation_store";
import {
  onInit,
  onDestroy,
  handleDonationSubmit,
  handleDiscard,
} from "./controller/create_donation_controller";
import {
  DonationFields,
  LogisticsFields,
} from "./components/create_donation_component";
import { getDonationByIdApi } from "./api/get_donation_by_id/get_donation_by_id_api";

export default function CreateDonationPage() {
  const [searchParams] = useSearchParams();
  const needId = searchParams.get("need_id");
  const ngoId = searchParams.get("ngo_id");

  const { redonatePayload, setRedonatePayload } = useDonorStore();
  const [isPrefillLoading, setIsPrefillLoading] = useState(false);

  const loading = createDonationInputModel.useSelector(
    (state) => state.createDonationData.loading
  );

  const prefillForm = (data: any) => {
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
          foodPhoto: data.image || null,
          otherCategory: "",
        },
      ],
      logistics: {
        pickupAddress: data.pickupAddress || "",
        contactPhone: "",
      },
    });
  };

  // Initialize page and handle redonate payloads
  useEffect(() => {
    onInit();

    const redonateIdParam = searchParams.get("redonate_id");

    const loadPrefillData = async () => {
      if (redonatePayload) {
        try {
          localStorage.setItem("redonate_draft", JSON.stringify(redonatePayload));
          localStorage.setItem("redonate_id", String(redonatePayload.id));
        } catch (err) {
          console.error("Failed to save draft to localStorage:", err);
        }
        prefillForm(redonatePayload);
        setRedonatePayload(null);
        toast.info("Donation details imported for review");
      } else if (redonateIdParam) {
        const cachedDraftStr = localStorage.getItem("redonate_draft");
        const cachedId = localStorage.getItem("redonate_id");

        if (cachedDraftStr && cachedId === redonateIdParam) {
          try {
            const cachedDraft = JSON.parse(cachedDraftStr);
            prefillForm(cachedDraft);
            toast.info("Donation details restored from draft");
          } catch (err) {
            console.error("Failed to parse cached draft:", err);
          }
        } else {
          setIsPrefillLoading(true);
          try {
            const response = await getDonationByIdApi({ id: redonateIdParam });
            const fetchedDonation = response?.data?.donationById;
            if (fetchedDonation) {
              prefillForm(fetchedDonation);
              localStorage.setItem("redonate_draft", JSON.stringify(fetchedDonation));
              localStorage.setItem("redonate_id", redonateIdParam);
              toast.info("Donation details fetched from server");
            } else {
              toast.error("Could not find the cancelled donation details.");
            }
          } catch (err) {
            console.error("Failed to fetch donation by ID:", err);
            toast.error("Failed to load donation details from server.");
          } finally {
            setIsPrefillLoading(false);
          }
        }
      } else {
        // Fetch active draft from backend API if local storage is empty
        const user = useAuthStore.getState().user;
        const userId = user?.id;
        if (userId) {
          setIsPrefillLoading(true);
          try {
            const response = await getDonationDraftApi({ userId: String(userId) });
            const backendDraft = response?.data?.donationDraft;
            if (backendDraft) {
              prefillForm(backendDraft);
              localStorage.setItem("redonate_draft", JSON.stringify(backendDraft));
              localStorage.setItem("redonate_id", backendDraft.id || "draft");
              toast.info("Active draft restored from server");
            }
          } catch (err) {
            console.error("Failed to fetch active draft from server:", err);
          } finally {
            setIsPrefillLoading(false);
          }
        }
      }
    };

    loadPrefillData();

    return () => {
      onDestroy();
    };
  }, [redonatePayload, setRedonatePayload, searchParams]);

  return (
    <div
      className="p-3 sm:p-4 lg:p-5 pb-10 w-full mx-auto min-h-screen"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Header Bar */}
      <div className="max-w-4xl mx-auto mb-8 sm:mb-12 px-1 sm:px-0">
        <PageHeader
          title="Create Donation"
          subtitle="Contribute food items and schedule a pickup"
        />
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

      {isPrefillLoading ? (
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-32 gap-6 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-sm">
          <div className="animate-spin h-10 w-10 border-4 border-[var(--border-color)] border-t-[#16a34a] rounded-full" />
          <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--text-secondary)" }}>
            Restoring donation details...
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => handleDonationSubmit(e, needId, ngoId)}
          className="max-w-4xl mx-auto space-y-6 pb-24"
        >
          <DonationFields />
          <LogisticsFields />

          {/* Action Bar */}
          <div
            className="p-6 border rounded-3xl shadow-sm flex flex-col-reverse sm:flex-row items-center justify-end gap-4 sm:gap-6 bg-[var(--bg-primary)] border-[var(--border-color)]"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <ResuableButton
              variant="ghost"
              onClick={handleDiscard}
              className="w-full sm:w-auto font-black text-[11px] uppercase tracking-[0.2em] hover:text-red-500 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              Discard Entry
            </ResuableButton>
            <ResuableButton
              type="submit"
              variant="dark"
              disabled={loading}
              className="w-full sm:min-w-[240px] h-[52px] !bg-[#16a34a] hover:!bg-[#15803d] !rounded-2xl shadow-lg shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </form>
      )}
    </div>
  );
}
