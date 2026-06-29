import { create } from "zustand";
import type {
  VolunteerProfile,
  VolunteerStats,
  VolunteerActivity,
  VolunteerTask,
  VolunteerBadge,
  VolunteerPrize,
  VolunteerReward,
} from "./volunteer_schemas";

interface VolunteerState {
  profile: VolunteerProfile;
  stats: VolunteerStats;
  activities: VolunteerActivity[];
  tasks: VolunteerTask[];
  badges: VolunteerBadge[];
  prizes: VolunteerPrize[];
  rewards: {
    grants: VolunteerReward[];
    mega: VolunteerReward[];
    social: VolunteerReward[];
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setProfile: (profile: VolunteerProfile) => void;
  setStats: (stats: VolunteerStats) => void;
  setActivities: (activities: VolunteerActivity[]) => void;
  setTasks: (tasks: VolunteerTask[]) => void;
  setBadges: (badges: VolunteerBadge[]) => void;
  setRewardsData: (rewards: any) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVolunteerStore = create<VolunteerState>((set) => ({
  profile: {
    fullName: "Rahul S.",
    email: "rahul@humanitarian.org",
    phone: "+91 98765 43210",
    location: "Puducherry, India",
    memberSince: "December 2024",
    verificationStatus: "Verified Volunteer",
    vehicleType: "Two Wheeler",
    licenseNumber: "PY-01-2024-0001234",
    bankName: "State Bank of India",
    accountNumber: "**** 1234",
    upiId: "rahul@okaxis",
  },
  stats: {
    deliveries: 842,
    impactPoints: 24500,
    treesPlanted: 45,
    walletBalance: 2500,
    totalEarnings: 8500,
    thisMonthDeliveries: 850,
  },
  activities: [
    {
      id: "1",
      title: "Meal Delivered",
      time: "2h ago",
      desc: "15kg food bundle dropped at Sector 4 Center.",
      type: "delivery",
    },
    {
      id: "2",
      title: "ID Verified",
      time: "Yesterday",
      desc: "Your vehicle documents are now approved.",
      type: "verification",
    },
    {
      id: "3",
      title: "New Badge",
      time: "3 days ago",
      desc: "Earned 'Master Courier' for 100 successful trips.",
      type: "milestone",
    },
  ],
  tasks: [
    {
      id: "1",
      title: "White Town Route",
      location: "5 stops",
      time: "Hot",
      status: "3X Bonus",
      category: "Delivery",
    },
    {
      id: "2",
      title: "Express Trip",
      location: "Mission St",
      time: "2h ago",
      status: "Done",
      category: "Meals",
    },
  ],
  badges: [
    {
      id: "1",
      name: "Master Courier",
      icon: "Package",
      category: "volunteers",
      isUnlocked: true,
      description: "100 successful deliveries",
    },
    {
      id: "2",
      name: "Early Bird",
      icon: "Clock",
      category: "volunteers",
      isUnlocked: true,
      description: "Delivered 10 meals before 8 AM",
    },
    {
      id: "3",
      name: "Green Hero",
      icon: "Zap",
      category: "volunteers",
      isUnlocked: true,
      description: "Planted 50 trees",
    },
    {
      id: "4",
      name: "Community Pillar",
      icon: "Users",
      category: "volunteers",
      isUnlocked: false,
      description: "Participated in 5 community drives",
    },
  ],
  prizes: [
    { id: 1, label: "₹500", icon: "💰", color: "var(--bg-secondary)" },
    { id: 2, label: "₹1,000", icon: "⚡", color: "var(--bg-tertiary)" },
    { id: 3, label: "₹2,500", icon: "💎", color: "var(--bg-primary)" },
    { id: 4, label: "MEGA BONUS", icon: "🏆", color: "#22c55e" },
    { id: 5, label: "₹250", icon: "🎁", color: "var(--bg-secondary)" },
    { id: 6, label: "₹5,000", icon: "🔥", color: "var(--bg-tertiary)" },
    { id: 7, label: "₹750", icon: "✨", color: "var(--bg-primary)" },
    { id: 8, label: "₹10,000", icon: "🌟", color: "var(--bg-tertiary)" },
  ],
  rewards: {
    grants: [
      {
        id: 1,
        name: "Fuel Voucher",
        amount: "₹500",
        points: 1000,
        available: true,
      },
      {
        id: 2,
        name: "Maintenance Fund",
        amount: "₹1,500",
        points: 2500,
        available: true,
      },
      {
        id: 3,
        name: "Gear Upgrade",
        amount: "₹3,000",
        points: 5000,
        available: true,
      },
      {
        id: 4,
        name: "Premium Insurance",
        amount: "₹7,500",
        points: 10000,
        available: true,
      },
    ],
    mega: [
      {
        id: 5,
        name: "Monthly Bonus",
        amount: "₹5,000",
        points: 15000,
        available: true,
      },
      {
        id: 6,
        name: "Yearly Reward",
        amount: "₹25,000",
        points: 50000,
        available: true,
      },
    ],
    social: [
      {
        id: 7,
        name: "Direct Relief Fund",
        desc: "Essential aid for 50 lives",
        points: 5000,
        available: true,
        details: [
          { group: "Youth", text: "School kits & hygiene packs" },
          { group: "Communities", text: "Groceries & basic clothing" },
        ],
      },
    ],
  },
  isLoading: false,
  error: null,

  setProfile: (profile) => set({ profile }),
  setStats: (stats) => set({ stats }),
  setActivities: (activities) => set({ activities }),
  setTasks: (tasks) => set({ tasks }),
  setBadges: (badges) => set({ badges }),
  setRewardsData: (rewards) => set({ rewards }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
