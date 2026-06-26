import { profileInputModel } from "../store/profile_store";
import { useAuthStore } from "../../../../global/store/auth-store";
import { getProfileApi } from "../api/get_profile/get_profile_api";
import { getProfileApiOutputModel } from "../api/get_profile/get_profile_store";
import { submitEnquiryApi } from "../api/submit_enquiry/submit_enquiry_api";
import { toast } from "sonner";

export const onInit = async () => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    // Fetch profile (which includes documents now) in a single GraphQL query
    await getProfileApi({ userId: String(userId) });
  } catch (err) {
    console.error("Profile load failed:", err);
  }
};

export const onDestroy = () => {
  profileInputModel.reset();
};

export const toggleField = (field: string) => {
  const state = profileInputModel.useStore.getState().profileFormState;
  const prev = state.selectedFields;
  const isSelecting = !prev.includes(field);

  let nextFields = [...prev];
  const nextFieldValues = { ...(state.fieldValues || {}) };

  if (isSelecting) {
    nextFields.push(field);
    nextFieldValues[field] = "";
  } else {
    nextFields = prev.filter((f: string) => f !== field);
    delete nextFieldValues[field];
  }

  profileInputModel.update({
    selectedFields: nextFields,
    fieldValues: nextFieldValues,
  });
};

export const handleSubmit = async () => {
  try {
    const profileData = getProfileApiOutputModel.useStore.getState().getProfileApiData?.data;
    const formState = profileInputModel.useStore.getState().profileFormState;
    
    let messageParts: string[] = [];
    if (formState.selectedFields && formState.selectedFields.length > 0) {
      messageParts.push("Requested Updates:");
      formState.selectedFields.forEach((field: string) => {
        const val = (formState.fieldValues && formState.fieldValues[field]) || "";
        messageParts.push(`- ${field.toUpperCase()}: ${val}`);
      });
    }
    if (formState.generalNotes) {
      if (messageParts.length > 0) messageParts.push("");
      messageParts.push("Additional Notes:");
      messageParts.push(formState.generalNotes);
    }
    const compiledMessage = messageParts.join("\n");

    const inputPayload = {
      userId: profileData?.id || null,
      name: profileData?.username || "Star Hotel",
      email: profileData?.email || "info@starhotel.com",
      phone: profileData?.phone || null,
      subject: `Profile Update - ${formState.requestCategory?.toUpperCase() || 'General'}`,
      message: compiledMessage,
      role: "DONOR",
    };

    const res = await submitEnquiryApi(inputPayload);

    if (res?.data?.id) {
      profileInputModel.update({
        requestId: res.data.id,
        isSubmitted: true,
        requestMessage: compiledMessage,
      });
      toast.success("Verification request submitted successfully!");
    }
  } catch (err) {
    console.error("Failed to submit enquiry:", err);
    toast.error("Failed to submit update request. Please try again.");
  }
};

export const resetSupportHub = () => {
  profileInputModel.update({
    isSubmitted: false,
    requestCategory: null,
    selectedFields: [],
    requestId: "",
    requestMessage: "",
    fieldValues: {},
    generalNotes: "",
  });
};

export const switchCategory = (id: string | null) => {
  profileInputModel.update({
    requestCategory: id,
    selectedFields: [],
    requestMessage: "",
    fieldValues: {},
    generalNotes: "",
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
  const profileData = getProfileApiOutputModel.useStore.getState().getProfileApiData?.data;
  const documents = profileData?.donorProfile?.documents || [];
  
  const bankAccounts = (profileData?.paymentMethods?.bankAccounts || []).map((b: any, index: number) => ({
    id: b.id || `bank-${index}`,
    bankName: b.bankName || '',
    accountHolder: b.accountHolder || '',
    accountNumber: b.accountNumber || '',
    ifscCode: b.ifscCode || '',
    isPrimary: b.isPrimary ?? false,
    isVerified: b.isVerified ?? false,
  }));

  const upiIds = (profileData?.paymentMethods?.upiIds || []).map((u: any, index: number) => ({
    id: u.id || `upi-${index}`,
    vpa: u.vpa || '',
    label: u.label || '',
    isPrimary: u.isPrimary ?? false,
    isVerified: u.isVerified ?? false,
  }));

  const primaryBank = bankAccounts.find((b: any) => b.isPrimary) || bankAccounts[0];
  const primaryUpi = upiIds.find((u: any) => u.isPrimary) || upiIds[0];

  return {
    profile: {
      businessName: profileData?.donorProfile?.businessName || '',
      businessType: profileData?.donorProfile?.businessType || '',
      registrationId: profileData?.donorProfile?.registrationId || '',
      taxId: profileData?.donorProfile?.taxId || '',
      name: profileData?.username || '',
      email: profileData?.email || '',
      phone: profileData?.phone || '',
      location: profileData?.donorProfile?.address ? `${profileData.donorProfile.address.city || ''}, ${profileData.donorProfile.address.state || ''}` : '',
      verificationLevel: profileData?.donorProfile?.verificationLevel || 'Level I',
      completion: profileData?.donorProfile?.profileCompleteness || 0,
      bankName: primaryBank?.bankName || '',
      accountNumber: primaryBank?.accountNumber || '',
      upiId: primaryUpi?.vpa || '',
      branch: primaryBank?.ifscCode || ''
    },
    documents,
    bankAccounts,
    upiIds,
    currentPoints: profileData?.gamification?.points || 0,
  };
};
