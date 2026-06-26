// This file is kept for type compatibility only.
// All real data is loaded from backend APIs via donor-store.ts refreshDashboard / refreshDocuments etc.
import type { DonorData } from "./donor-schemas";

export const initialData: DonorData = {
  currentPoints: 0,
  stats: [],
  recentActivities: [],
  donationHistory: [],
  profile: {
    businessName: '',
    businessType: '',
    registrationId: '',
    taxId: '',
    name: '',
    email: '',
    phone: '',
    location: '',
    memberSince: '',
    verificationLevel: '',
    completion: 0,
    bankName: null,
    accountNumber: null,
    upiId: null,
    branch: null,
    legalName: '',
    website: '',
    entityType: '',
    alternateContact: '',
    address: { line1: '', city: '', state: '', postalCode: '', country: '' }
  },
  documents: [],
  prizes: [],
  rewards: [],
  bankAccounts: [],
  upiIds: []
};


