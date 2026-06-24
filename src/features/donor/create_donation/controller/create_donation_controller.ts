import type { FormEvent } from "react";
import { toast } from "sonner";
import { createDonationInputModel } from "../store/create_donation_store";
import { createDonationApi } from "../api/create_donation/create_donation_api";
import { deleteDonationApi } from "../api/delete_donation/delete_donation_api";
import { useAuthStore } from "../../../../global/store/auth-store";
import { clearDonationDraftApi } from "../api/clear_donation_draft/clear_donation_draft_api";
import { getFoodCategoriesApi } from "../api/get_food_categories/get_food_categories_api";
import { getDonationUnitsApi } from "../api/get_donation_units/get_donation_units_api";
import { getDietaryTypesApi } from "../api/get_dietary_types/get_dietary_types_api";
import { getPreparationTypesApi } from "../api/get_preparation_types/get_preparation_types_api";
import { navigate } from "../../../../core/navigation";

// Initialize controller state, fetch dynamic categories
export const onInit = async () => {
  try {
    await Promise.all([
      getFoodCategoriesApi({ key: "foodCategories" }),
      getDonationUnitsApi({ key: "donationUnits" }),
      getDietaryTypesApi({ key: "dietaryTypes" }),
      getPreparationTypesApi({ key: "preparationTypes" }),
    ]);
  } catch (error) {
    console.error("Failed to load config categories:", error);
  }
};

// Reset store state on exit
export const onDestroy = () => {
  createDonationInputModel.reset();
};

export const handleDiscard = () => {
  try {
    localStorage.removeItem("redonate_draft");
    localStorage.removeItem("redonate_id");
  } catch (err) {
    console.error("Failed to clear localStorage draft on discard:", err);
  }

  // Clear backend draft
  const user = useAuthStore.getState().user;
  const userId = user?.id;
  if (userId) {
    clearDonationDraftApi({ userId: String(userId) }).catch((err) =>
      console.error("Failed to clear draft from backend on discard:", err)
    );
  }

  navigate("/donor/donations");
};

// Handle value changes in the item form
export const handleItemValueChange = (name: string, value: any) => {
  const currentData = createDonationInputModel.useStore.getState().createDonationData;
  createDonationInputModel.update({
    currentItem: {
      ...currentData.currentItem,
      [name]: value,
    },
  });
};

// Handle logistics input changes
export const handleLogisticsChange = (name: string, value: string) => {
  const currentData = createDonationInputModel.useStore.getState().createDonationData;
  createDonationInputModel.update({
    logistics: {
      ...currentData.logistics,
      [name]: value,
    },
  });
};

// Add item to draft list
export const addItem = () => {
  const state = createDonationInputModel.useStore.getState().createDonationData;
  const { currentItem, items, editingId } = state;

  if (!currentItem.foodCategory || !currentItem.quantity) {
    toast.error("Please fill in category and quantity");
    return;
  }

  if (editingId !== null) {
    // Edit mode: replace existing item
    const updatedItems = items.map((item: any) =>
      item.id === editingId ? { ...currentItem, id: editingId } : item
    );
    createDonationInputModel.update({
      items: updatedItems,
      editingId: null,
    });
    toast.success("Changes saved successfully!");
  } else {
    // Add mode: append to items list
    createDonationInputModel.update({
      items: [...items, { ...currentItem, id: Date.now() }],
    });
    toast.success("Item added to donation list");
  }

  // Reset current item details
  createDonationInputModel.update({
    currentItem: {
      foodCategory: "",
      dietaryType: "Veg",
      preparationType: "Restaurant",
      quantity: "",
      unit: "kg",
      description: "",
      expiryDate: "",
      expiryTime: "",
      foodPhoto: null,
      otherCategory: "",
    },
  });
};

// Remove item from draft list
export const removeItem = (id: number) => {
  const state = createDonationInputModel.useStore.getState().createDonationData;
  const updatedItems = state.items.filter((item: any) => item.id !== id);
  createDonationInputModel.update({
    items: updatedItems,
  });
  if (state.editingId === id) {
    createDonationInputModel.update({ editingId: null });
  }
};

// Load item details back into the active inputs for editing
export const editItem = (item: any) => {
  const state = createDonationInputModel.useStore.getState().createDonationData;

  // Auto-save any currently active edit in progress first
  if (state.editingId !== null && state.editingId !== item.id) {
    const updatedItems = state.items.map((i: any) =>
      i.id === state.editingId ? { ...state.currentItem, id: state.editingId } : i
    );
    createDonationInputModel.update({ items: updatedItems });
    toast.success("Auto-saved changes to the previous item!");
  }

  createDonationInputModel.update({
    editingId: item.id,
    currentItem: {
      foodCategory: item.foodCategory || "",
      dietaryType: item.dietaryType || "Veg",
      preparationType: item.preparationType || "Restaurant",
      quantity: item.quantity || "",
      unit: item.unit || "kg",
      description: item.description || "",
      expiryDate: item.expiryDate || "",
      expiryTime: item.expiryTime || "",
      foodPhoto: item.foodPhoto || null,
      otherCategory: item.otherCategory || "",
    },
  });

  window.scrollTo({ top: 400, behavior: "smooth" });
  toast.info("Editing item details in the form");
};

// Upload image to Cloudinary helper
export const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "deyog3v3w";
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "hunger_free_preset";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    toast.warning(`Image upload failed for "${file.name}". Submitting donation without photo.`);
    return null;
  }
};

// Form submission handler
export const handleDonationSubmit = async (
  e: FormEvent,
  needId: string | null,
  ngoId: string | null
) => {
  e.preventDefault();

  const state = createDonationInputModel.useStore.getState().createDonationData;
  const { items, currentItem, logistics, originalDonationId } = state;
  const user = useAuthStore.getState().user;
  const userId = user?.id;

  let finalItems = [...items];

  // Auto-capture filled card details if not explicitly added
  if (finalItems.length === 0 && currentItem.foodCategory && currentItem.quantity) {
    finalItems.push({ ...currentItem, id: Date.now() });
  }

  if (finalItems.length === 0) {
    toast.error("Please add at least one food item to your donation list");
    return;
  }

  createDonationInputModel.update({ loading: true });

  try {
    // 1. Upload images in parallel
    toast.info("Uploading donation images securely to Cloudinary...");
    const uploadedUrls = await Promise.all(
      finalItems.map(async (item) => {
        if (item.foodPhoto instanceof File) {
          return await uploadImageToCloudinary(item.foodPhoto);
        }
        return null;
      })
    );

    // 2. Submit each donation to GraphQL
    for (let i = 0; i < finalItems.length; i++) {
      const item = finalItems[i];
      const imageUrl = uploadedUrls[i];

      const apiInput = {
        input: {
          foodType: item.description || "Unnamed Food Item",
          category: item.foodCategory === "other" ? (item.otherCategory || "") : item.foodCategory,
          dietaryType: item.dietaryType,
          preparationType: item.preparationType,
          quantity: `${item.quantity} ${item.unit}`,
          ngo: ngoId || null,
          donor: userId ? String(userId) : null,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          pickupAddress: logistics.pickupAddress,
          description: item.description || "Fresh food donation.",
          expiryTime: item.expiryDate && item.expiryTime ? `${item.expiryDate}T${item.expiryTime}` : null,
          image: imageUrl || (typeof item.foodPhoto === "string" ? item.foodPhoto : null),
          relatedNeed: needId || null,
        },
      };

      await createDonationApi(apiInput);
    }

    // 3. Delete original cancelled donation if redonated
    if (originalDonationId) {
      try {
        await deleteDonationApi({ id: originalDonationId });
      } catch (err) {
        console.error("Failed to delete original donation:", err);
      }
    }

    try {
      localStorage.removeItem("redonate_draft");
      localStorage.removeItem("redonate_id");
    } catch (err) {
      console.error("Failed to clear localStorage draft on submit:", err);
    }

    if (userId) {
      try {
        await clearDonationDraftApi({ userId: String(userId) });
      } catch (err) {
        console.error("Failed to clear draft from backend on submit:", err);
      }
    }

    toast.success("Donations submitted successfully!");
    navigate("/donor/donations");
  } catch (err: any) {
    console.error("Submission failed:", err);
    toast.error(`Failed to submit donation: ${err.message || "Network error"}`);
  } finally {
    createDonationInputModel.update({ loading: false });
  }
};
