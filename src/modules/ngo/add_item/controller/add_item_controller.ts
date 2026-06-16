import { toast } from "sonner";
import { addItemInputModel } from "../store/add_item_store";
import { addItemApi } from "../api/add_item_api";

export const handleFormValueChange = (name: string, value: any) => {
  const currentData = addItemInputModel.useStore.getState().addItemData;
  const updatedForm = {
    ...currentData.formData,
    [name]: value,
  };

  // Auto-calculate condition on expiry date change
  if (name === "expiryDate" && value) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(value);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let autoCondition = "Excellent";
    if (diffDays <= 7) {
      autoCondition = "Critical";
    } else if (diffDays <= 30) {
      autoCondition = "Good";
    }
    updatedForm.condition = autoCondition;
  }

  addItemInputModel.update({
    formData: updatedForm,
  });
};

export const handleSuggestValueChange = (name: "suggestionCategoryName" | "suggestionReason", value: string) => {
  addItemInputModel.update({
    [name]: value,
  });
};

export const openSuggestModal = () => {
  addItemInputModel.update({
    isSuggestModalOpen: true,
  });
};

export const closeSuggestModal = () => {
  addItemInputModel.update({
    isSuggestModalOpen: false,
    suggestionCategoryName: "",
    suggestionReason: "",
    isSuccess: false,
  });
};

export const handleSuggestSubmit = () => {
  const state = addItemInputModel.useStore.getState().addItemData;
  if (!state.suggestionCategoryName) return;

  addItemInputModel.update({ isSubmitting: true });

  setTimeout(() => {
    addItemInputModel.update({
      isSubmitting: false,
      isSuccess: true,
    });
    setTimeout(() => {
      closeSuggestModal();
    }, 2500);
  }, 1500);
};

export const handleSubmit = async (e: React.FormEvent, navigate: (path: string) => void) => {
  e.preventDefault();
  const state = addItemInputModel.useStore.getState().addItemData;
  const { formData } = state;

  addItemInputModel.update({ isSubmitting: true });

  try {
    const submitData = {
      item_name: formData.name,
      category: formData.category === "other" ? formData.otherCategory : formData.category,
      quantity: parseFloat(formData.quantity) || 0,
      unit: formData.unit,
      expiry_date: formData.expiryDate || null,
      location: formData.location,
      condition: formData.condition,
      notes: formData.notes,
    };

    await addItemApi(submitData);

    addItemInputModel.update({ isSubmitting: false });
    toast.success("Item Added", {
      description: `${formData.name} added to inventory.`,
    });
    onDestroy();
    navigate("/ngo/inventory");
  } catch (error) {
    console.error("Error adding inventory item:", error);
    addItemInputModel.update({ isSubmitting: false });
    toast.error("Failed to add item", {
      description: "An error occurred while saving to the database.",
    });
  }
};

export const onDestroy = () => {
  addItemInputModel.reset();
};
