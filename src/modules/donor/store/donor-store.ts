import { create } from "zustand";
import { DonorDataSchema } from "./donor-schemas";
import type { DonorData } from "./donor-schemas";
import client from "../../../global/api/apollo-client";
import { GET_MY_DONATIONS } from "../donations/api/donations/donations.graphql";

interface DonorState {
  data: DonorData;
  donationStats: {
    totalDonations: number;
    pendingCount: number;
    completedCount: number;
    inProgressCount: number;
  };
  isLoading: boolean;
  error: string | null;
  redonatePayload: any | null;

  // Actions
  setDonorData: (data: DonorData) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  refreshData: (status?: string, sortOrder?: string) => Promise<void>;
  setRedonatePayload: (payload: any | null) => void;
}

const initialData: DonorData = {
  currentPoints: 24500,
  profile: {
    businessName: "Grand Regal Hotel",
    businessType: "Hospitality / 5-Star Hotel",
    registrationId: "REG-99203348",
    taxId: "GST-IN-122930",
    name: "Johnathan Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    location: "Chennai, TN",
    memberSince: "January 2025",
    verificationLevel: "Verified Level III",
    completion: 85,
    bankName: "HDFC Bank",
    accountNumber: "**** 8890",
    upiId: "grandregal@okaxis",
    branch: "Anna Nagar, Chennai",
  },
  stats: [
    {
      title: "Total Donations",
      value: "342",
      change: "+12 this week",
      color: "#22c55e",
    },
    {
      title: "Impact Points",
      value: "24,500",
      change: "Gold Tier",
      color: "#22c55e",
    },
  ],
  recentActivities: [
    {
      id: 1,
      title: "Fresh Vegetables & Fruits",
      ngo: "Green Harvest NGO",
      time: "2 hours ago",
      status: "Collected",
      category: "Cooked Food",
    },
    {
      id: 2,
      title: "Cooked Meals (10 portions)",
      ngo: "Hope Shelter",
      time: "Yesterday",
      status: "In Transit",
      category: "Meals",
    },
  ],
  donationHistory: [
    {
      id: 1,
      foodType: "Fresh Vegetables & Fruits",
      category: "Fruits & Vegetables",
      dietaryType: "Veg",
      preparationType: "Homemade",
      quantity: "15 kg",
      ngo: "Green Harvest NGO",
      date: "Dec 27, 2024",
      status: "Collected",
      pickupAddress: "123, Anna Salai, Heritage Town, Puducherry 605001",
      deliveryAddress: "Hope Shelter Main Hall, Mission Street, Pondy 605001",
      description:
        "Organic seasonal vegetables including carrots, spinach, and apples. Freshly packed from the morning harvest.",
      volunteer: {
        name: "Suresh Kumar",
        phone: "+91 98765 43210",
        rating: "4.8",
      },
      timeline: [
        {
          status: "Donation Created",
          date: "Dec 27, 2024",
          time: "09:00 AM",
          completed: true,
        },
        {
          status: "Volunteer Assigned",
          date: "Dec 27, 2024",
          time: "10:30 AM",
          completed: true,
        },
        {
          status: "Pickup Completed",
          date: "Dec 27, 2024",
          time: "11:45 AM",
          completed: true,
        },
        {
          status: "In Transit",
          date: "Dec 27, 2024",
          time: "12:00 PM",
          completed: false,
        },
        {
          status: "Delivered",
          date: "Dec 27, 2024",
          time: "--:--",
          completed: false,
        },
      ],
    },
  ],
  documents: [
    {
      name: "Business License",
      status: "Verified",
      date: "Jan 12, 2025",
      url: "/HungerFree Doc.pdf",
    },
    {
      name: "Tax Registration",
      status: "Verified",
      date: "Jan 12, 2025",
      url: "/HungerFree Doc.pdf",
    },
    {
      name: "Food Safety Cert",
      status: "In Review",
      date: "Pending",
      url: "/HungerFree Doc.pdf",
    },
  ],
  prizes: [
    { id: 1, label: "₹1,000", icon: "💰", color: "var(--bg-secondary)" },
    { id: 2, label: "₹500", icon: "💎", color: "var(--bg-tertiary)" },
    { id: 3, label: "₹5,000", icon: "🏆", color: "var(--bg-primary)" },
    { id: 4, label: "₹2,500", icon: "🎁", color: "var(--bg-secondary)" },
    { id: 5, label: "₹1,000", icon: "💰", color: "var(--bg-tertiary)" },
    { id: 6, label: "GRAND JACKPOT", icon: "✨", color: "#22c55e" },
    { id: 7, label: "₹500", icon: "💎", color: "var(--bg-secondary)" },
    { id: 8, label: "₹2,000", icon: "🎁", color: "var(--bg-tertiary)" },
  ],
  rewards: [
    {
      id: 1,
      category: "cash",
      name: "Quick Cash",
      amount: "₹1,000",
      points: 600,
      available: true,
    },
    {
      id: 2,
      category: "cash",
      name: "Cash Bonus",
      amount: "₹2,500",
      points: 1200,
      available: true,
    },
    {
      id: 3,
      category: "cash",
      name: "Big Win",
      amount: "₹5,000",
      points: 2500,
      available: true,
    },
    {
      id: 4,
      category: "cash",
      name: "Mega Prize",
      amount: "₹10,000",
      points: 5000,
      available: true,
    },
    {
      id: 5,
      category: "tours",
      name: "Goa Beach Trip",
      desc: "3D/2N, Flights + Hotel",
      points: 8000,
      available: true,
    },
    {
      id: 6,
      category: "tours",
      name: "Rajasthan Heritage",
      desc: "4D/3N Luxury Stay",
      points: 18000,
      available: true,
    },
    {
      id: 7,
      category: "youth",
      name: "Gaming Console",
      desc: "PS5 or Xbox Series X",
      points: 18000,
      available: true,
    },
  ],
  bankAccounts: [
    {
      id: "1",
      bankName: "HDFC BANK",
      accountHolder: "JOHN DOE",
      accountNumber: "**** **** 4590",
      ifscCode: "HDFC0001234",
      isPrimary: true,
      isVerified: true,
    },
    {
      id: "2",
      bankName: "ICICI BANK",
      accountHolder: "JOHN DOE",
      accountNumber: "**** **** 8821",
      ifscCode: "ICIC0005566",
      isPrimary: false,
      isVerified: false,
    },
  ],
  upiIds: [
    {
      id: "1",
      vpa: "johndoe@okaxis",
      label: "PRIMARY UPI",
      isPrimary: true,
      isVerified: true,
    },
    {
      id: "2",
      vpa: "johndoe.hdfc@okicici",
      label: "SECONDARY UPI",
      isPrimary: false,
      isVerified: true,
    },
  ],
};

export const useDonorStore = create<DonorState>((set) => ({
  data: initialData,
  donationStats: {
    totalDonations: 0,
    pendingCount: 0,
    completedCount: 0,
    inProgressCount: 0,
  },
  isLoading: false,
  error: null,
  redonatePayload: null,

  setDonorData: (newData) => {
    const result = DonorDataSchema.safeParse(newData);
    if (result.success) {
      set({ data: result.data });
    } else {
      console.error("Donor store validation failed:", result.error);
      set({ error: "Invalid data format received" });
    }
  },

  setRedonatePayload: (payload) => set({ redonatePayload: payload }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  refreshData: async (status?: string, sortOrder?: string) => {
    set({ isLoading: true });
    try {
      const { data } = await client.query<{ donations: any[], donationStats: any }>({
        query: GET_MY_DONATIONS,
        variables: {
          ...(status ? { status: status === 'Active' ? 'PENDING' : status.toUpperCase() } : {}),
          ...(sortOrder ? { sortOrder: sortOrder === 'Newest First' ? 'NEWEST_FIRST' : 'OLDEST_FIRST' } : {})
        },
        fetchPolicy: 'network-only' // Ensure we get fresh data
      });
      
      set((state) => ({
        data: {
          ...state.data,
          donationHistory: data.donations.map((d: any) => ({
            ...d,
            // Map MongoDB _id or id to number if needed by schema
            id: isNaN(Number(d.id)) ? d.id : Number(d.id)
          }))
        },
        donationStats: data.donationStats || state.donationStats,
        isLoading: false
      }));
    } catch (err) {
      console.error("GraphQL Error:", err);
      set({ error: "Failed to sync with server", isLoading: false });
    }
  }
}));
