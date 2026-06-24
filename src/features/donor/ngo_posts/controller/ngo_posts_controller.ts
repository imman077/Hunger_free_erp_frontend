import React from "react";
import { toast } from "sonner";
import { ngoPostsInputModel } from "../store/ngo_posts_store";
import { getNeedsApi } from "../api/get_needs/get_needs_api";
import { createDonationApi } from "../api/create_donation/create_donation_api";
import { getCategoryImage } from "../../../../global/constants/donation_config";
import { useAuthStore } from "../../../../global/store/auth-store";

export const fetchNeeds = async () => {
  try {
    await getNeedsApi({ status: "Open" });
  } catch (err) {
    console.error("Failed to load requests:", err);
    toast.error("Failed to load requests");
  }
};

export const onInit = () => {
  console.log("NGOPosts page initialized");
  fetchNeeds();
};

export const onDestroy = () => {
  console.log("NGOPosts page destroyed");
};

export const handleApplyToHelp = (need: any, user: any) => {
  if (
    user &&
    user.profile.role === "NGO" &&
    (need.ngo === user.id || need.ngo === String(user.id) || need.is_mine)
  ) {
    ngoPostsInputModel.update({
      selectedNeed: need,
      isDrawerOpen: true,
    });
    return;
  }

  ngoPostsInputModel.update({
    fulfillForm: {
      foodCategory: need.category || "Dry Ration",
      quantity: "1",
      expiryDate: "",
      expiryTime: "",
      pickupAddress: "",
      contactPhone: user?.profile?.phone ?? "",
    },
    selectedNeed: need,
    isFulfillModalOpen: true,
  });
};

export const handleFulfillSubmit = async (e: React.FormEvent, user: any) => {
  e.preventDefault();
  const state = ngoPostsInputModel.useStore.getState().ngoPostsData;
  const selectedNeed = state.selectedNeed;
  const fulfillForm = state.fulfillForm;
  if (!selectedNeed) return;

  const val = parseInt(fulfillForm.quantity) || 0;
  const remaining = selectedNeed.quantity - (selectedNeed.fulfilled_quantity || 0);

  if (val <= 0) {
    toast.error("Please enter a valid quantity to donate.");
    return;
  }

  if (val > remaining) {
    toast.error(
      `You cannot donate more than the remaining need (${remaining} ${selectedNeed.unit}).`
    );
    return;
  }

  ngoPostsInputModel.update({ isFulfilling: true });
  try {
    const defaultExpiry = new Date();
    defaultExpiry.setHours(defaultExpiry.getHours() + 48);

    const input = {
      foodType: selectedNeed.item_name,
      category: fulfillForm.foodCategory,
      dietaryType: "Veg",
      preparationType: "Restaurant",
      quantity: `${fulfillForm.quantity} ${selectedNeed.unit}`,
      ngo: selectedNeed.ngo.toString(),
      donor: user?.id || null,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      pickupAddress:
        fulfillForm.pickupAddress ||
        "Pickup location to be shared via contact. Phone: " +
          fulfillForm.contactPhone,
      description: `Fulfillment support for need: ${selectedNeed.item_name}. Contact: ${fulfillForm.contactPhone}`,
      expiryTime: defaultExpiry.toISOString(),
      image: getCategoryImage(fulfillForm.foodCategory),
      relatedNeed: selectedNeed.id.toString(),
    };

    await createDonationApi({ input });

    // Save phone number to auth store (persists to localStorage)
    if (fulfillForm.contactPhone && user && !user.profile?.phone) {
      useAuthStore.setState((authState: any) => {
        if (authState.user) {
          return {
            user: {
              ...authState.user,
              profile: {
                ...authState.user.profile,
                phone: fulfillForm.contactPhone,
              },
            },
          };
        }
        return {};
      });
    }

    toast.success(
      "Support successfully pledged through GraphQL! The NGO will be notified."
    );
    ngoPostsInputModel.update({ isFulfillModalOpen: false });
    fetchNeeds();
  } catch (error: any) {
    console.error("GraphQL submit error:", error);
    toast.error(
      `Failed to submit support: ${
        error.message || "Please check your network and data."
      }`
    );
  } finally {
    ngoPostsInputModel.update({ isFulfilling: false });
  }
};

export const handleValueChange = (name: string, value: string) => {
  const state = ngoPostsInputModel.useStore.getState().ngoPostsData;
  const selectedNeed = state.selectedNeed;
  const fulfillForm = { ...state.fulfillForm };
  let newValue = value;

  if (name === "quantity" && selectedNeed) {
    const remaining = selectedNeed.quantity - (selectedNeed.fulfilled_quantity || 0);
    const numValue = parseInt(value);
    if (numValue > remaining) {
      newValue = remaining.toString();
    }
  }

  if (name === "contactPhone") {
    const digitsOnly = value.replace(/\D/g, "");
    newValue = digitsOnly.slice(0, 10);
  }

  fulfillForm[name as keyof typeof fulfillForm] = newValue;
  ngoPostsInputModel.update({ fulfillForm });
};
