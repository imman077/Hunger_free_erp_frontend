import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Heart, CheckCircle, Trash2 } from "lucide-react";
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
  formatIndianPhoneNumber,
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

  const getSessionUserPhone = (): string => {
    const user: any = useAuthStore.getState().user;
    if (user?.profile?.phone) return user.profile.phone;
    if (user?.phone) return user.phone;
    if (user?.ngo_profile?.contact_number) return user.ngo_profile.contact_number;

    try {
      const keys = ["user", "user_data", "profile", "auth", "session_user", "donor", "user_phone"];
      for (const k of keys) {
        const item = sessionStorage.getItem(k) || localStorage.getItem(k);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (parsed.phone) return parsed.phone;
            if (parsed.profile?.phone) return parsed.profile.phone;
            if (parsed.contact_number) return parsed.contact_number;
            if (parsed.contactPhone) return parsed.contactPhone;
          } catch {
            if (/^\+?\d[\d\s-]{8,}$/.test(item)) return item;
          }
        }
      }

      const authStoreRaw = sessionStorage.getItem("auth-storage") || localStorage.getItem("auth-storage");
      if (authStoreRaw) {
        const parsed = JSON.parse(authStoreRaw);
        const u = parsed?.state?.user;
        if (u?.profile?.phone) return u.profile.phone;
        if (u?.phone) return u.phone;
      }
    } catch (e) {
      console.error("Error reading session storage for phone:", e);
    }
    return "";
  };

  const getSessionUserAddress = (): string => {
    const user: any = useAuthStore.getState().user;
    if (user?.profile?.address) return user.profile.address;
    if (user?.address) return user.address;

    try {
      const keys = ["user", "user_data", "profile", "auth", "session_user", "donor", "user_address"];
      for (const k of keys) {
        const item = sessionStorage.getItem(k) || localStorage.getItem(k);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (parsed.address) return parsed.address;
            if (parsed.profile?.address) return parsed.profile.address;
            if (parsed.pickupAddress) return parsed.pickupAddress;
          } catch {
            if (item.length > 5 && !item.startsWith("{")) return item;
          }
        }
      }

      const authStoreRaw = sessionStorage.getItem("auth-storage") || localStorage.getItem("auth-storage");
      if (authStoreRaw) {
        const parsed = JSON.parse(authStoreRaw);
        const u = parsed?.state?.user;
        if (u?.profile?.address) return u.profile.address;
        if (u?.address) return u.address;
      }
    } catch (e) {
      console.error("Error reading session storage for address:", e);
    }
    return "";
  };

  const prefillForm = (data: any) => {
    if (!data) return;

    const originalDonationId = data.id ? String(data.id) : null;

    let qty = "";
    let unt = "kg";
    if (data.quantity) {
      const parts = String(data.quantity).trim().split(" ");
      qty = parts[0] || "";
      unt = parts.length > 1 ? parts.slice(1).join(" ") : "kg";
    }

    // Process expiry date and time
    let expDate = data.expiryDate || "";
    let expTime = "";

    if (data.expiryTime) {
      const str = String(data.expiryTime).trim();
      if (str.includes("T")) {
        const parts = str.split("T");
        if (!expDate) expDate = parts[0];
        expTime = parts[1] ? parts[1].substring(0, 5) : "";
      } else if (str.includes("-") && str.length >= 10) {
        const parts = str.split(" ");
        if (!expDate) expDate = parts[0];
        if (parts[1]) expTime = parts[1].substring(0, 5);
      } else {
        expTime = str.substring(0, 5);
      }
    }

    // Default to today's date if empty or past date (for redonating old donations)
    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
    if (!expDate || expDate < todayStr) {
      expDate = todayStr;
    }
    if (!expTime) {
      expTime = "18:00";
    }

    // Resolve contact phone and pickup address from donation data or session/auth storage
    const phoneRaw =
      data.contactPhone ||
      data.pickupPhone ||
      data.phone ||
      data.donorPhone ||
      getSessionUserPhone() ||
      "";
    const contactPhone = formatIndianPhoneNumber(phoneRaw);

    const pickupAddress =
      data.pickupAddress ||
      getSessionUserAddress() ||
      "";

    const itemObj = {
      id: Date.now(),
      foodCategory: data.category || data.foodCategory || "",
      dietaryType: data.dietaryType || "Veg",
      preparationType: data.preparationType || data.preparation || "Restaurant",
      quantity: qty,
      unit: unt,
      description: data.foodType || data.description || "",
      expiryDate: expDate,
      expiryTime: expTime,
      foodPhoto: data.image || data.foodPhoto || null,
      otherCategory: data.otherCategory || "",
    };

    createDonationInputModel.update({
      originalDonationId,
      items: [itemObj],
      currentItem: itemObj,
      logistics: {
        pickupAddress: pickupAddress,
        contactPhone: contactPhone,
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
      className="w-full mx-auto min-h-screen relative"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <form
        id="create-donation-form"
        onSubmit={(e) => handleDonationSubmit(e, needId, ngoId)}
        className="w-full"
      >
        {/* Sticky Header Bar */}
        <div
          className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-4 mb-0 backdrop-blur-md shadow-sm transition-all border-b"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <PageHeader
            title="Create Donation"
            subtitle="Contribute food items and schedule a pickup"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleDiscard}
                className="h-[46px] px-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2.5 shadow-sm"
              >
                <Trash2 size={18} className="text-slate-500 dark:text-slate-400" />
                <span>Discard</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="h-[46px] px-7 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2.5 shadow-md shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <CheckCircle size={18} />
                )}
                <span>{loading ? "Submitting..." : "Confirm Donation"}</span>
              </button>
            </div>
          </PageHeader>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {needId && (
            <div className="w-full p-4 rounded-md border border-green-500/20 bg-green-500/5 flex items-center gap-4">
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
            <div className="w-full flex flex-col items-center justify-center py-32 gap-6 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-sm">
              <div className="animate-spin h-10 w-10 border-4 border-[var(--border-color)] border-t-[#16a34a] rounded-full" />
              <p
                className="text-[11px] font-black uppercase tracking-[0.2em]"
                style={{ color: "var(--text-secondary)" }}
              >
                Restoring donation details...
              </p>
            </div>
          ) : (
            <>
              <DonationFields />
              <LogisticsFields />
            </>
          )}
        </div>
      </form>
    </div>
  );
}
