import { useEffect, useState } from "react";
import { getProfileApiOutputModel } from "../api/get_profile/get_profile_store";
import { tiersService } from "../../dashboard/api/tiers/tiers_api";
import type { GamificationTier } from "../../dashboard/api/tiers/tiers_output_model";
import { mapBankAccounts, mapUpiIds } from "../../store/map-payment-methods";

export const useDonorProfile = (options?: { skipTiers?: boolean }) => {
  const skipTiers = options?.skipTiers ?? false;
  const profileData = getProfileApiOutputModel.useSelector((s) => s.getProfileApiData?.data);
  const isLoadingProfile = getProfileApiOutputModel.useSelector((s) => s.getProfileApiData?.loading);
  
  const documents = profileData?.donorProfile?.documents || [];

  const [tiers, setTiers] = useState<GamificationTier[]>([]);
  const [isLoadingTiers, setIsLoadingTiers] = useState(!skipTiers);

  useEffect(() => {
    if (skipTiers) return;
    let active = true;
    tiersService.getGamificationTiers()
      .then((res) => {
        if (active) {
          setTiers(res);
          setIsLoadingTiers(false);
        }
      })
      .catch((err) => {
        console.error("Error loading tiers:", err);
        if (active) {
          setIsLoadingTiers(false);
        }
      });
    return () => {
      active = false;
    };
  }, [skipTiers]);

  const parseMemberSince = (createdAt: any) => {
    if (!createdAt) return 'N/A';
    if (/^\d+$/.test(createdAt)) {
      return new Date(Number(createdAt)).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const bankAccounts = mapBankAccounts(profileData?.paymentMethods?.bankAccounts);
  const upiIds = mapUpiIds(profileData?.paymentMethods?.upiIds);

  const primaryBank = bankAccounts.find((b: any) => b.isPrimary) || bankAccounts[0];
  const primaryUpi = upiIds.find((u: any) => u.isPrimary) || upiIds[0];

  const profile = {
    businessName: profileData?.donorProfile?.businessName || '',
    businessType: profileData?.donorProfile?.businessType || '',
    registrationId: profileData?.donorProfile?.registrationId || '',
    taxId: profileData?.donorProfile?.taxId || '',
    legalName: profileData?.donorProfile?.legalName || profileData?.donorProfile?.businessName || profileData?.username || '',
    website: profileData?.donorProfile?.website || '',
    entityType: profileData?.donorProfile?.entityType || profileData?.donorProfile?.businessType || '',
    name: profileData?.username || '',
    email: profileData?.email || '',
    phone: profileData?.phone || '',
    alternateContact: profileData?.donorProfile?.alternateContact || '',
    address: {
      line1: profileData?.donorProfile?.address?.line1 || '',
      city: profileData?.donorProfile?.address?.city || '',
      state: profileData?.donorProfile?.address?.state || '',
      postalCode: profileData?.donorProfile?.address?.postalCode || '',
      country: '',
    },
    location: profileData?.donorProfile?.address ? `${profileData.donorProfile.address.city || ''}, ${profileData.donorProfile.address.state || ''}` : '',
    memberSince: parseMemberSince(profileData?.createdAt),
    verificationLevel: profileData?.donorProfile?.verificationLevel || 'Level I',
    completion: profileData?.donorProfile?.profileCompleteness || 0,
    bankName: primaryBank?.bankName || '',
    accountNumber: primaryBank?.accountNumber || '',
    upiId: primaryUpi?.vpa || '',
    branch: primaryBank?.ifscCode || ''
  };

  return {
    profile,
    documents,
    bankAccounts,
    upiIds,
    currentPoints: profileData?.gamification?.points || 0,
    tiers,
    isLoading: isLoadingProfile || isLoadingTiers,
    error: null,
  };
};
