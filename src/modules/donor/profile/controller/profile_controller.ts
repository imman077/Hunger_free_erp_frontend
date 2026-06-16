import { profileInputModel } from "../store/profile_store";
import { useDonorStore } from "../../store/donor-store";

export const onInit = () => {
  console.log("Profile controller initialized");
};

export const onDestroy = () => {
  profileInputModel.reset();
};

export const toggleField = (field: string) => {
  const state = profileInputModel.useStore.getState().profileFormState;
  const prev = state.selectedFields;
  const isSelecting = !prev.includes(field);
  const entry = `${field.toUpperCase()}: `;

  let nextFields = [...prev];
  let nextMessage = state.requestMessage;

  if (isSelecting) {
    nextFields.push(field);
    if (!nextMessage.includes(`${field.toUpperCase()}:`)) {
      nextMessage = nextMessage ? `${nextMessage}\n${entry}` : entry;
    }
  } else {
    nextFields = prev.filter((f: string) => f !== field);
    nextMessage = nextMessage
      .split("\n")
      .filter((line: string) => !line.includes(`${field.toUpperCase()}:`))
      .join("\n")
      .trim();
  }

  profileInputModel.update({
    selectedFields: nextFields,
    requestMessage: nextMessage,
  });
};

export const handleSubmit = () => {
  const newId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
  profileInputModel.update({
    requestId: newId,
    isSubmitted: true,
  });
};

export const resetSupportHub = () => {
  profileInputModel.update({
    isSubmitted: false,
    requestCategory: null,
    selectedFields: [],
    requestId: "",
    requestMessage: "",
  });
};

export const switchCategory = (id: string | null) => {
  profileInputModel.update({
    requestCategory: id,
    selectedFields: [],
    requestMessage: "",
  });
};

export const handleViewDocument = (doc: any) => {
  profileInputModel.update({
    selectedFile: {
      url: doc.url || "/HungerFree Doc.pdf",
      name: doc.name,
    },
    isPreviewOpen: true,
  });
};
export const getProfileData = () => {
  const data = useDonorStore.getState().data;
  return {
    profile: data.profile,
    documents: data.documents,
    bankAccounts: data.bankAccounts,
    upiIds: data.upiIds,
    currentPoints: data.currentPoints,
  };
};
