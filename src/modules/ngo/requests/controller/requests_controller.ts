import { toast } from "sonner";
import { requestsInputModel } from "../store/requests_store";
import { ngoDonationsService } from "../api/donations/donations_api";
import { ngoNeedsService } from "../../post_need/api/needs/needs_api";
import type { DonationRequest } from "../model/requests_model";

let timerId: any = null;
let startTime = 0;

export const fetchDonations = async (user: any) => {
  const state = requestsInputModel.useStore.getState().requestsState;
  const { activeTab } = state;

  try {
    let rawDonations: any[] = [];
    let rawNeeds: any[] = [];

    if (activeTab === "marketplace") {
      const response = await ngoDonationsService.getMarketplaceDonations();
      rawDonations = Array.isArray(response) ? response : [];
    } else if (activeTab === "community-requests") {
      const results = await Promise.allSettled([
        ngoDonationsService.getMarketplaceDonations(),
        ngoNeedsService.getAllNeeds(),
      ]);
      const donationsRes = results[0].status === "fulfilled" ? results[0].value : [];
      const needsRes = results[1].status === "fulfilled" ? results[1].value : [];
      rawDonations = Array.isArray(donationsRes) ? donationsRes : [];
      rawNeeds = Array.isArray(needsRes) ? needsRes : [];
    } else if (activeTab === "my-requests") {
      const results = await Promise.allSettled([
        ngoDonationsService.getMyRequests(),
        ngoDonationsService.getAllDonations(),
        ngoNeedsService.getAllNeeds(),
      ]);
      const d1 = results[0].status === "fulfilled" ? results[0].value : [];
      const d2 = results[1].status === "fulfilled" ? results[1].value : [];
      const needsRes = results[2].status === "fulfilled" ? results[2].value : [];

      const res1 = Array.isArray(d1) ? d1 : [];
      const res2 = Array.isArray(d2) ? d2 : [];
      const allDonations = [...res1, ...res2];

      const seenIds = new Set();
      rawDonations = allDonations.filter((d) => {
        if (seenIds.has(d.id)) return false;
        seenIds.add(d.id);
        return true;
      });

      rawNeeds = Array.isArray(needsRes) ? needsRes : [];
    }

    const mappedDonations: DonationRequest[] = rawDonations.map((d: any) => {
      const userId = String(user?.id);
      const ngoProfileId = String((user?.ngo_profile as any)?.id || "");

      const matchesNGO = (val: any) => {
        const s = String(val);
        return s === userId || !!(ngoProfileId && s === ngoProfileId);
      };

      const isSupported =
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
        !!d.accepted_ngo ||
        !!d.accepted_ngo_id ||
        !!d.accepted_by ||
        !!d.accepted_by_id;

      return {
        id: d.id,
        title: d.title || d.food_items || d.food_category,
        source: d.donor_name || d.donor?.name || "Private Donor",
        sourceType: d.donor_role || "DONOR",
        isMine: isMine,
        isSupported: isSupported,
        isOwn: isMine || isSupported,
        isClaimed: isClaimed,
        distance: "Nearby",
        icon:
          d.food_category === "Cooked Food" || d.food_items?.toLowerCase().includes("rice")
            ? "🥗"
            : "🥖",
        time: d.created_at
          ? new Date(d.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "Recently",
        urgency: d.status === "PENDING" || d.urgency === "High" ? "High" : "Normal",
        rawStatus: d.status,
        status: d.status === "PENDING" && !isClaimed ? "Available" : isSupported ? d.status : "Claimed",
        progress: isClaimed ? 60 : d.status === "PENDING" ? 25 : 75,
        description: d.description || d.food_items,
        quantity: d.quantity || "N/A",
        expiryTime: d.expiry_time ? new Date(d.expiry_time).toLocaleDateString() : "No Expiry",
        pickupAddress: d.pickup_address,
        origin: "DONATION" as const,
        volunteer: d.accepted_volunteer_detail
          ? {
              name: d.accepted_volunteer_detail.name,
              phone: d.accepted_volunteer_detail.phone,
              rating: "4.8",
            }
          : undefined,
      };
    });

    const mappedNeeds: DonationRequest[] = rawNeeds.map((n: any) => {
      const userId = String(user?.id);
      const ngoProfileId = String((user?.ngo_profile as any)?.id || "");

      const matchesNGO = (val: any) => {
        const s = String(val);
        return s === userId || !!(ngoProfileId && s === ngoProfileId);
      };

      const isSupported =
        (Array.isArray(n.supporter_ids) &&
          n.supporter_ids
            .map(String)
            .some((id: string) => id === userId || id === ngoProfileId)) ||
        matchesNGO(n.accepted_by) ||
        matchesNGO(n.accepted_by_id) ||
        matchesNGO(n.accepted_ngo_id) ||
        (n.accepted_by && matchesNGO(n.accepted_by.id));

      const isMine = Boolean(n.is_mine) || matchesNGO(n.ngo_id) || matchesNGO(n.ngo);

      return {
        id: n.id,
        title: n.item_name || n.title,
        source: n.ngo_name || n.ngo?.name || "Partner NGO",
        sourceType: "NGO" as const,
        isMine: isMine,
        isSupported: isSupported,
        isOwn: isMine || isSupported,
        distance: "Community",
        icon: "📋",
        time: n.created_at
          ? new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "Recently",
        urgency: n.urgency || "Normal",
        status: n.status || (isSupported ? "Fulfilling" : "Open"),
        progress: isSupported ? 40 : 10,
        description: n.description,
        quantity: n.quantity ? `${n.quantity} ${n.unit || ""}` : "N/A",
        origin: "NEED" as const,
      };
    });

    requestsInputModel.update({
      donations: [...mappedDonations, ...mappedNeeds],
    });
  } catch (error) {
    toast.error("Failed to load requests");
  }
};

export const handleViewTracking = (donation: DonationRequest) => {
  const state = requestsInputModel.useStore.getState().requestsState;
  if (state.activeTab === "my-requests" || donation.status !== "Available") {
    requestsInputModel.update({
      selectedRequest: donation,
      isDrawerOpen: true,
      otpValue: "",
      otpError: "",
    });
  }
};

export const handleAcceptClick = (donation: DonationRequest, user: any) => {
  const phone = user?.ngo_profile?.contact_number || user?.profile?.phone || "";
  const initialQty = donation.quantity?.split(" ")[0] || "";

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
