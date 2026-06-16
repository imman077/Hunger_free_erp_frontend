import { create } from "zustand";
import { NgoDataSchema } from "./ngo_schemas";
import type { NgoData } from "./ngo_schemas";
import { ngoDonationsService } from "../requests/api/donations/donations_api";

interface NgoState {
  data: NgoData;
  isLoading: boolean;
  error: string | null;

  // Actions
  setNgoData: (data: NgoData) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  refreshData: () => Promise<void>;
}

const initialData: NgoData = {
  currentPoints: 45000,
  profile: {
    ngoName: "Green Harvest NGO",
    ngoType: "Social Welfare / Food Security",
    registrationId: "NGO-8823-XYZ-2025",
    taxId: "80G-EXEMPT-9920",
    managerName: "Sarah Micheals",
    email: "contact@greenharvest.org",
    phone: "+1 555 123 4567",
    location: "New York, NY",
    memberSince: "January 2025",
    verificationLevel: "Verified Partner",
    bankName: "HDFC Bank",
    accountNumber: "**** 8824",
    upiId: "charity@okaxis",
  },
  stats: [
    {
      label: "Impact Points",
      val: "45,000",
      trend: "Legend Tier",
      color: "bg-hf-green",
    },
    {
      label: "Direct Impact",
      val: "12,500",
      trend: "People Fed",
      color: "bg-hf-green",
    },
    {
      label: "Success Rate",
      val: "94.2%",
      trend: "High Score",
      color: "bg-hf-green",
    },
    {
      label: "Grant Status",
      val: "₹3.0L",
      trend: "Unlocked",
      color: "bg-orange-600",
    },
  ],
  notifications: [
    {
      title: "New Food Available",
      desc: "Fresh bread from Local Bakery (10kg)",
      time: "10 mins ago",
      type: "donation",
      status: "action_needed",
    },
    {
      title: "Driver Assigned",
      desc: "Michael is on the way for pickup #2234",
      time: "45 mins ago",
      type: "logistics",
      status: "in_transit",
    },
    {
      title: "Impact Verified",
      desc: "Report confirmed for Project Alpha",
      time: "2 hours ago",
      type: "impact",
      status: "completed",
    },
  ],
  documents: [
    {
      name: "Tax Exempt Certificate (80G)",
      status: "Verified",
      date: "Jan 15, 2025",
      url: "/HungerFree Doc.pdf",
    },
    {
      name: "Operating License",
      status: "Verified",
      date: "Jan 10, 2025",
      url: "/HungerFree Doc.pdf",
    },
    {
      name: "Impact Audit Report 2024",
      status: "In Review",
      date: "Pending",
      url: "/HungerFree Doc.pdf",
    },
  ],
  activeNeeds: [
    {
      title: "Fresh Bakery Food",
      desc: "Baker Street \u2022 2km away",
      type: "Immediate",
    },
    {
      title: "Cooked Meals (20kg)",
      desc: "Promenade Hotel \u2022 5km away",
      type: "Priority",
    },
    {
      title: "Dairy Products",
      desc: "Auroville Dairy \u2022 12km away",
      type: "Standard",
    },
  ],
  prizes: [
    { id: 1, label: "₹10,000", icon: "💰", color: "var(--bg-secondary)" },
    { id: 2, label: "₹50,000", icon: "⚡", color: "var(--bg-tertiary)" },
    { id: 3, label: "₹25,000", icon: "💎", color: "var(--bg-primary)" },
    { id: 4, label: "GRAND GRANT", icon: "🏆", color: "#22c55e" },
    { id: 5, label: "₹5,000", icon: "🎁", color: "var(--bg-secondary)" },
    { id: 6, label: "₹1,00,000", icon: "🔥", color: "var(--bg-tertiary)" },
    { id: 7, label: "₹15,000", icon: "✨", color: "var(--bg-primary)" },
    { id: 8, label: "₹2,50,000", icon: "🌟", color: "var(--bg-tertiary)" },
  ],
  rewards: {
    grants: [
      {
        id: 1,
        name: "Operations Fund",
        amount: "₹5,000",
        points: 1000,
        available: true,
      },
      {
        id: 2,
        name: "Growth Fund",
        amount: "₹15,000",
        points: 2500,
        available: true,
      },
      {
        id: 3,
        name: "Impact Fund",
        amount: "₹30,000",
        points: 5000,
        available: true,
      },
      {
        id: 4,
        name: "Expansion Fund",
        amount: "₹75,000",
        points: 10000,
        available: true,
      },
    ],
    mega: [
      {
        id: 5,
        name: "Mega Grant",
        amount: "₹1,50,000",
        points: 20000,
        available: true,
      },
      {
        id: 6,
        name: "Super Grant",
        amount: "₹3,00,000",
        points: 35000,
        available: true,
      },
      {
        id: 7,
        name: "National NGO Award",
        points: 50000,
        available: false,
      },
    ],
    social: [
      {
        id: 8,
        name: "Direct Relief Grant",
        desc: "Essential aid for 100+ lives",
        points: 5000,
        available: true,
        details: [
          { group: "Youth", text: "School kits & nutrition packs" },
          { group: "Animals", text: "Pet food & rescue equipment" },
          { group: "Communities", text: "Groceries & basic clothing" },
        ],
      },
      {
        id: 9,
        name: "Field Operation Fund",
        desc: "Specialized medical/rescue camp",
        points: 15000,
        available: true,
        details: [
          { group: "Youth", text: "Vaccinations & vitamin distribution" },
          { group: "Animals", text: "Sterilization & mobile clinic" },
          { group: "Communities", text: "Sugar, BP & health screenings" },
        ],
      },
      {
        id: 10,
        name: "Logistics Grant",
        desc: "Electronic Van for Mission Mobility",
        points: 25000,
        available: false,
        details: [
          { group: "Youth", text: "Transporting kids to events" },
          { group: "Animals", text: "Rescue Ambulance service" },
          { group: "Communities", text: "Mobile Food Bank delivery" },
        ],
      },
    ],
  },
  tiers: [
    { name: "Beginner", points: "0-1,000", color: "text-gray-400" },
    { name: "Partner", points: "1,001-5,000", color: "text-[#22c55e]" },
    { name: "Elite", points: "5,001-15,000", color: "text-blue-600" },
    { name: "Master", points: "15,001-35,000", color: "text-purple-600" },
    { name: "Legend", points: "35,001-75,000", color: "text-amber-600" },
    { name: "Titan", points: "75,001+", color: "text-red-600" },
  ],
};

export const useNgoStore = create<NgoState>((set) => ({
  data: initialData,
  isLoading: false,
  error: null,

  setNgoData: (newData) => {
    const result = NgoDataSchema.safeParse(newData);
    if (result.success) {
      set({ data: result.data as NgoData });
    } else {
      console.error("NGO store validation failed:", result.error);
      set({ error: "Invalid data format received" });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  refreshData: async () => {
    set({ isLoading: true });
    try {
      const response = await ngoDonationsService.getMyRequests();
      set((state) => ({
        data: {
          ...state.data,
          myRequests: response.map((d: any) => ({
            id: d.id,
            foodType: d.food_category,
            quantity: `${d.quantity} ${d.unit}`,
            donor: d.donor_name || d.donor_hotel || "Private Donor",
            donorPhone: d.contact_phone,
            status: d.status,
            date: new Date(d.created_at).toLocaleDateString(),
            pickupAddress: d.pickup_address,
            volunteer: d.accepted_volunteer_detail ? {
                name: d.accepted_volunteer_detail.name,
                phone: d.accepted_volunteer_detail.phone,
                rating: "4.8"
            } : undefined,
            trackingHistory: d.tracking_history || []
          }))
        },
        isLoading: false
      }));
    } catch (err) {
      set({ error: "Failed to sync NGO data", isLoading: false });
    }
  }
}));
