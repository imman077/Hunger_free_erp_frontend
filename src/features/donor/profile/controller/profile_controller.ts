import { profileInputModel } from "../store/profile_store";
import { useDonorStore } from "../../store/donor-store";
import { donorProfileService } from "../api/profile/profile_api";
import { paymentMethodsService } from "../api/profile/payment_methods_api";

export const onInit = async () => {
  try {
    const store = useDonorStore.getState();

    // Fetch profile + payment methods + all other dashboard data in parallel
    const [profile, payments] = await Promise.all([
      donorProfileService.getProfile(),
      paymentMethodsService.getPaymentMethods()
    ]);

    store.setDonorData({
      ...store.data,
      profile: {
        businessName: profile.businessName,
        businessType: profile.businessType,
        registrationId: profile.registrationId,
        taxId: profile.taxId,
        legalName: profile.legalName || '',
        website: profile.website || '',
        entityType: profile.entityType || '',
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        alternateContact: profile.alternateContact || '',
        address: {
          line1: profile.address?.line1 || '',
          city: profile.address?.city || '',
          state: profile.address?.state || '',
          postalCode: profile.address?.postalCode || '',
          country: profile.address?.country || '',
        },
        location: profile.location,
        memberSince: profile.memberSince,
        verificationLevel: profile.verificationLevel,
        completion: profile.completion,
        bankName: profile.bankName || '',
        accountNumber: profile.accountNumber || '',
        upiId: profile.upiId || '',
        branch: profile.branch || ''
      },
      bankAccounts: payments.bankAccounts || [],
      upiIds: payments.upiIds || []
    });

    // Fetch remaining data sections in parallel (non-blocking)
    await Promise.all([
      store.refreshDashboard(),
      store.refreshDocuments(),
      store.refreshPrizes(),
      store.refreshRewards()
    ]);
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
