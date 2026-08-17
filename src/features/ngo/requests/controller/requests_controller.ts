import { toast } from "sonner";
import { requestsInputModel } from "../store/requests_store";
import { ngoDonationsService } from "../api/donations/donations_api";
import { ngoNeedsService } from "../../post_need/api/needs/needs_api";
import { useAuthStore } from "../../../../global/store/auth-store";
import type { DonationRequest } from "../model/requests_model";

let timerId: any = null;
let startTime = 0;
let activeFetchPromise: Promise<void> | null = null;
let currentFetchingTab = "";

export const fetchDonations = async (userParam?: any, overrideTab?: string) => {
  const state = requestsInputModel.useStore.getState().requestsState;
  const activeTab = overrideTab || state.activeTab;
  const user = userParam || useAuthStore.getState().user;

  if (activeFetchPromise && currentFetchingTab === activeTab) {
    return activeFetchPromise;
  }

  currentFetchingTab = activeTab;
  activeFetchPromise = (async () => {
    try {
      let rawDonations: any[] = [];
      let rawNeeds: any[] = [];

      if (activeTab === "marketplace") {
        const results = await Promise.allSettled([
          ngoDonationsService.getMarketplaceDonations(),
          ngoDonationsService.getMyRequests()
        ]);
        const dAll = results[0].status === "fulfilled" ? results[0].value : [];
        const dMine = results[1].status === "fulfilled" ? results[1].value : [];

        const allDonations = (Array.isArray(dAll) ? dAll : []).map((d: any) => ({ ...d, _source: "marketplace" }));
        const mineDonations = (Array.isArray(dMine) ? dMine : []).map((d: any) => ({ ...d, _source: "mine" }));

        // Combine them avoiding duplicates
        const seen = new Set();
        rawDonations = [];
        for (const item of [...allDonations, ...mineDonations]) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            rawDonations.push(item);
          }
        }
      } else if (activeTab === "community-requests") {
        // Fetch all needs so that lists and tab counts are prefilled correctly
        const response = await ngoNeedsService.getAllNeeds(false);
        rawNeeds = Array.isArray(response) ? response : [];
      } else if (activeTab === "my-requests") {
        const results = await Promise.allSettled([
          ngoDonationsService.getMyRequests(),
          ngoNeedsService.getAllNeeds(false),
        ]);
        const d1 = results[0].status === "fulfilled" ? results[0].value : [];
        const needsRes = results[1].status === "fulfilled" ? results[1].value : [];

        rawDonations = (Array.isArray(d1) ? d1 : []).map((d: any) => ({ ...d, _source: "mine" }));
        rawNeeds = Array.isArray(needsRes) ? needsRes : [];
      }

    const mappedDonations: DonationRequest[] = rawDonations.map((d: any) => {
      const userId = String(user?.id);
      const ngoProfileId = String((user?.ngo_profile as any)?.id || "");

      const matchesNGO = (val: any) => {
        if (!val || val === "undefined" || val === "null" || !user?.id) return false;
        const s = String(val);
        return s === userId || !!(ngoProfileId && s === ngoProfileId);
      };

      const ngoName = user?.ngo_profile?.name || "";
      const ngoUsername = user?.username || "";

      // Items tagged _source=mine came from getMyRequests — they are always accepted by this NGO
      const isAcceptedByMe = d._source === "mine";

      const isSupported =
        isAcceptedByMe ||
        d.ngo === ngoName ||
        d.ngo === ngoUsername ||
        matchesNGO(d.ngo) ||
        matchesNGO(d.accepted_ngo) ||
        matchesNGO(d.accepted_ngo_id) ||
        matchesNGO(d.accepted_by_id) ||
        matchesNGO(d.accepted_by) ||
        (d.accepted_ngo && matchesNGO(d.accepted_ngo.id));

      const isMine =
        matchesNGO(d.donor_id) ||
        matchesNGO(d.donor) ||
        (d.donor && matchesNGO(d.donor.id));

      const isClaimed =
        !!d.ngo ||
        !!d.accepted_ngo ||
        !!d.accepted_ngo_id ||
        !!d.accepted_by ||
        !!d.accepted_by_id;

      return {
        id: d.id,
        title: d.foodType || d.title || d.food_items || d.food_category,
        source: d.donor_name || d.donor_hotel || d.donor?.name || d.donor || "Private Donor",
        sourceType: d.donor_role || "DONOR",
        isMine: isMine,
        isSupported: isSupported,
        isOwn: isMine || isSupported,
        isClaimed: isClaimed,
        distance: "Nearby",
        icon:
          (d.category || d.food_category) === "Cooked Food" || (d.foodType || d.title || d.food_items || "")?.toLowerCase().includes("rice")
            ? "🥗"
            : "🥖",
        time: d.createdAt || d.created_at
          ? new Date(d.createdAt || d.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "Recently",
        urgency: d.status === "PENDING" || d.urgency === "High" ? "High" : "Normal",
        rawStatus: d.status,
        status: d.status === "PENDING" && !isClaimed ? "Available" : isSupported ? d.status : "Claimed",
        progress: isClaimed ? 60 : d.status === "PENDING" ? 25 : 75,
        description: d.description || d.foodType || d.food_items,
        quantity: d.quantity || "N/A",
        category: d.category || d.food_category,
        expiryTime: d.expiryTime || d.expiry_time || "No Expiry",
        pickupAddress: d.pickupAddress || d.pickup_address,
        origin: "DONATION" as const,
        volunteer: d.accepted_volunteer_detail
          ? {
              name: d.accepted_volunteer_detail.name,
              phone: d.accepted_volunteer_detail.phone,
              rating: "4.8",
            }
          : undefined,
        pickupOtp: d.pickup_otp || d.pickupOtp,
        deliveryOtp: d.delivery_otp || d.deliveryOtp,
      };
    });

    const mappedNeeds: DonationRequest[] = rawNeeds.map((n: any) => {
      const userId = String(user?.id);
      const ngoProfileId = String((user?.ngo_profile as any)?.id || "");

      const matchesNGO = (val: any) => {
        if (!val || val === "undefined" || val === "null" || !user?.id) return false;
        const s = String(val);
        return s === userId || !!(ngoProfileId && s === ngoProfileId);
      };

      const rawSupporterIds = Array.isArray(n.supporterIds) ? n.supporterIds : (Array.isArray(n.supporter_ids) ? n.supporter_ids : []);
      const isSupported =
        rawSupporterIds
          .map(String)
          .some((id: string) => id === userId || id === ngoProfileId) ||
        matchesNGO(n.accepted_by) ||
        matchesNGO(n.accepted_by_id) ||
        matchesNGO(n.accepted_ngo_id) ||
        (n.accepted_by && matchesNGO(n.accepted_by.id));

      const isMine = Boolean(n.is_mine) || matchesNGO(n.ngo_id) || matchesNGO(n.ngo) || matchesNGO(n.user_id);

      return {
        id: n.id,
        title: n.title || n.itemName || n.item_name || n.food_category || n.category || "Community Need",
        source: n.ngo_name || n.ngo?.name || n.ngo || "Partner NGO",
        sourceType: "NGO" as const,
        isMine: isMine,
        isSupported: isSupported,
        isOwn: isMine || isSupported,
        distance: "Community",
        icon: "📋",
        time: n.createdAt || n.created_at
          ? new Date(n.createdAt || n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "Recently",
        urgency: n.urgency || "Normal",
        rawStatus: n.status,
        status: n.status || (isSupported ? "Fulfilling" : "Open"),
        progress: isSupported ? 40 : 10,
        description: n.description || n.title,
        quantity: n.quantity_required || (n.quantity ? `${n.quantity} ${n.unit || ""}` : "N/A"),
        category: n.category || "General",
        pickupAddress: n.distributionAddress || n.distribution_address || n.address || "Community Center",
        origin: "NEED" as const,
        supporters: n.supporters || [],
        supporters_details: n.supportersDetails || n.supporters_details || [],
        supporter_ids: rawSupporterIds,
        fulfilled_quantity: typeof n.fulfilledQuantity === "number" ? n.fulfilledQuantity : (typeof n.fulfilled_quantity === "number" ? n.fulfilled_quantity : 0),
        quantity_num: typeof n.quantity === "number" ? n.quantity : (parseInt(n.quantity) || 0),
        unit: n.unit || "",
      };
    });

    requestsInputModel.update({
      donations: [...mappedDonations, ...mappedNeeds],
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    toast.error("Failed to load requests");
  } finally {
    activeFetchPromise = null;
    currentFetchingTab = "";
  }
  })();

  return activeFetchPromise;
};

export const handleViewTracking = (donation: DonationRequest) => {
  requestsInputModel.update({
    selectedRequest: donation,
    isDrawerOpen: true,
    otpValue: "",
    otpError: "",
  });
};

export const handleAcceptClick = (donation: DonationRequest, user: any) => {
  const phone = user?.ngo_profile?.contact_number || user?.profile?.phone || "";
  const initialQty = donation.origin === "NEED"
    ? Math.max(0, (donation.quantity_num || 0) - (donation.fulfilled_quantity || 0)).toString()
    : (donation.quantity?.split(" ")[0] || "");

  requestsInputModel.update({
    acceptingDonation: donation,
    isAcceptModalOpen: true,
    supportQty: initialQty,
    supportPhone: phone,
    isAcceptSuccess: false,
  });
};

export const startCloseTimer = (duration: number) => {
  startTime = Date.now();
  requestsInputModel.update({
    remainingTime: duration,
    isTimerPaused: false,
  });

  if (timerId) clearTimeout(timerId);
  timerId = setTimeout(() => {
    requestsInputModel.update({
      isAcceptSuccess: false,
      isAcceptModalOpen: false,
      acceptingDonation: null,
      remainingTime: 2500,
    });
  }, duration);
};

export const clearCloseTimer = () => {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
    const elapsed = Date.now() - startTime;
    const currentRemaining = requestsInputModel.useStore.getState().requestsState.remainingTime;
    requestsInputModel.update({
      remainingTime: Math.max(0, currentRemaining - elapsed),
    });
  }
};

export const handleMouseEnterSuccess = () => {
  requestsInputModel.update({ isTimerPaused: true });
  clearCloseTimer();
};

export const handleMouseLeaveSuccess = () => {
  requestsInputModel.update({ isTimerPaused: false });
  const remaining = requestsInputModel.useStore.getState().requestsState.remainingTime;
  if (remaining > 0) {
    startCloseTimer(remaining);
  }
};

export const handleConfirmAccept = async (user: any) => {
  const state = requestsInputModel.useStore.getState().requestsState;
  const { acceptingDonation, supportQty, supportPhone } = state;
  if (!acceptingDonation) return;

  requestsInputModel.update({ isAccepting: true });
  try {
    if (acceptingDonation.origin === "NEED") {
      await ngoDonationsService.supportNeed(acceptingDonation.id, {
        quantity: parseFloat(supportQty) || 0,
        phone: supportPhone,
      });
    } else {
      await ngoDonationsService.acceptDonation(acceptingDonation.id);
    }

    requestsInputModel.update({
      isAccepting: false,
      isAcceptSuccess: true,
    });
    startCloseTimer(2500);
    await fetchDonations(user);
  } catch (error) {
    requestsInputModel.update({ isAccepting: false });
    toast.error(
      acceptingDonation.origin === "NEED"
        ? "Failed to support need. It might already be closed."
        : "Failed to accept donation. It might already be claimed."
    );
    requestsInputModel.update({ isAcceptModalOpen: false });
  }
};

export const handleVerifyOTP = async (user: any) => {
  const state = requestsInputModel.useStore.getState().requestsState;
  const { selectedRequest, otpValue } = state;
  if (!selectedRequest) return;

  requestsInputModel.update({ isVerifying: true, otpError: "" });
  try {
    await ngoDonationsService.verifyDelivery(selectedRequest.id, otpValue);
    toast.success("Food delivery confirmed securely!");
    requestsInputModel.update({ isDrawerOpen: false });
    await fetchDonations(user);
  } catch (err: any) {
    const errMsg = err.response?.data?.error || "Invalid delivery verification code.";
    requestsInputModel.update({ otpError: errMsg });
    toast.error(errMsg);
  } finally {
    requestsInputModel.update({ isVerifying: false });
  }
};

export const setRequestsStateValue = (name: string, value: any) => {
  requestsInputModel.update({
    [name]: value,
  });
};

export const closeDrawer = () => {
  requestsInputModel.update({ isDrawerOpen: false });
};

export const onDestroy = () => {
  if (timerId) clearTimeout(timerId);
  requestsInputModel.reset();
};
