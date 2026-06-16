import { toast } from "sonner";
import { postNeedInputModel } from "../store/post_need_store";
import { createNeedApi } from "../api/post_need_api";

export const handleFormValueChange = (name: string, value: any) => {
  const currentData = postNeedInputModel.useStore.getState().postNeedData;
  postNeedInputModel.update({
    formData: {
      ...currentData.formData,
      [name]: value,
    },
  });
};

export const handleSuggestValueChange = (name: "suggestionCategoryName" | "suggestionReason", value: string) => {
  postNeedInputModel.update({
    [name]: value,
  });
};

export const openSuggestModal = () => {
  postNeedInputModel.update({
    isSuggestModalOpen: true,
  });
};

export const closeSuggestModal = () => {
  postNeedInputModel.update({
    isSuggestModalOpen: false,
    suggestionCategoryName: "",
    suggestionReason: "",
    isSuccess: false,
  });
};

export const handleSuggestSubmit = () => {
  const state = postNeedInputModel.useStore.getState().postNeedData;
  if (!state.suggestionCategoryName) return;

  postNeedInputModel.update({ isSubmitting: true });

  setTimeout(() => {
    postNeedInputModel.update({
      isSubmitting: false,
      isSuccess: true,
    });
    setTimeout(() => {
      closeSuggestModal();
    }, 2500);
  }, 1500);
};

export const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "deyog3v3w";
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "hunger_free_preset";

  const formDataToUpload = new FormData();
  formDataToUpload.append("file", file);
  formDataToUpload.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formDataToUpload,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    toast.warning(`Image upload failed for "${file.name}". Submitting need without photo.`);
    return null;
  }
};

export const handleSubmit = async (
  e: React.FormEvent,
  user: any,
  navigate: (path: string) => void
) => {
  e.preventDefault();
  const state = postNeedInputModel.useStore.getState().postNeedData;
  const { formData } = state;

  postNeedInputModel.update({ isSubmitting: true });

  try {
    let imageUrl = null;
    if (formData.itemImage) {
      toast.info("Uploading image to Cloudinary...");
      imageUrl = await uploadImageToCloudinary(formData.itemImage);
    }

    let urgencyVal = "Medium Priority";
    if (formData.urgency === "low") urgencyVal = "Low Priority";
    else if (formData.urgency === "medium") urgencyVal = "Medium Priority";
    else if (formData.urgency === "high") urgencyVal = "High Priority";
    else if (formData.urgency === "urgent") urgencyVal = "Urgent";

    const input = {
      ngo: String(user?.id),
      itemName: formData.itemName,
      category: formData.category === "other" ? formData.otherCategory : formData.category,
      quantity: parseInt(formData.quantity) || 0,
      unit: formData.unit,
      urgency: urgencyVal,
      requiredBy: formData.requiredBy || null,
      image: imageUrl,
      distributionAddress: formData.location,
      description: formData.description || `Delivery at ${formData.location}`,
    };

    await createNeedApi(input);

    toast.success("Need posted successfully!");
    postNeedInputModel.update({ isSuccess: true });
    setTimeout(() => {
      onDestroy();
      navigate("/ngo/dashboard");
    }, 2000);
  } catch (error: any) {
    console.error("Submission failed:", error);
    toast.error(error.message || "Failed to post need. Please try again.");
  } finally {
    postNeedInputModel.update({ isSubmitting: false });
  }
};

export const onDestroy = () => {
  postNeedInputModel.reset();
};
