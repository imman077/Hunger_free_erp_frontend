import {
  Heart,
  Package,
  Trophy,
  Zap,
  Target,
  Award,
  Shield,
  Crown,
  Star,
  Flame,
  Globe,
  ZapOff,
  Users,
  ShieldCheck,
  Gem,
} from "lucide-react";

export const INITIAL_TIERS = [
  {
    name: "Beginner",
    range: "0 - 500",
    bonus: "0%",
    pointsRequired: 0,
    perks: "Welcome Pack, Forum Access, Standard Support",
    color: "#64748b",
  },
  {
    name: "Bronze",
    range: "501 - 1,500",
    bonus: "5%",
    pointsRequired: 501,
    perks: "Verified Badge, 5% Multiplier, Raffle Entry",
    color: "#92400e",
  },
  {
    name: "Silver",
    range: "1,501 - 3,500",
    bonus: "10%",
    pointsRequired: 1501,
    perks: "Silver Badge, Priority Pickup, Impact Reports",
    color: "#475569",
  },
  {
    name: "Gold",
    range: "3,501 - 7,500",
    bonus: "15%",
    pointsRequired: 3501,
    perks: "Gold Badge, VIP Event Invites, Direct Support",
    color: "#b45309",
  },
  {
    name: "Platinum",
    range: "7,501 - 15,000",
    bonus: "20%",
    pointsRequired: 7501,
    perks: "Platinum Badge, Exclusive Gear, Impact Manager",
    color: "#4338ca",
  },
  {
    name: "Diamond",
    range: "15,001 - 30,000",
    bonus: "25%",
    pointsRequired: 15001,
    perks: "Diamond Badge, Featured Profile, Milestone Gifts",
    color: "#0891b2",
  },
  {
    name: "Legend",
    range: "30,001+",
    bonus: "40%",
    pointsRequired: 30001,
    perks: "Legend Badge, 10 Trees/mo, Global All-Access",
    color: "#059669",
  },
];

export const INITIAL_MILESTONES = [
  // --- DONOR ACHIEVEMENTS (Donations) ---
  {
    id: 7,
    name: "First Spark",
    desc: "Make your very first donation",
    requirementType: "donations",
    threshold: 1,
    icon: "Flame",
    active: true,
    category: "donors",
  },
  {
    id: 13,
    name: "Helping Hand",
    desc: "Completed 10 total donations",
    requirementType: "donations",
    threshold: 10,
    icon: "Users",
    active: true,
    category: "donors",
  },
  {
    id: 1,
    name: "Kind Soul",
    desc: "Completed 50 total donations",
    requirementType: "donations",
    threshold: 50,
    icon: "Heart",
    active: true,
    category: "donors",
  },
  {
    id: 14,
    name: "Generous Heart",
    desc: "Completed 100 total donations",
    requirementType: "donations",
    threshold: 100,
    icon: "Target",
    active: true,
    category: "donors",
  },
  {
    id: 6,
    name: "Community Pillar",
    desc: "Donate 1,000 times to the ecosystem",
    requirementType: "donations",
    threshold: 1000,
    icon: "Award",
    active: true,
    category: "donors",
  },

  // --- DONOR ACHIEVEMENTS (Points) ---
  {
    id: 15,
    name: "Impact Starter",
    desc: "Earn 1,000 impact points",
    requirementType: "points",
    threshold: 1000,
    icon: "Zap",
    active: true,
    category: "donors",
  },
  {
    id: 3,
    name: "Point Master",
    desc: "Earn 10,000 impact points",
    requirementType: "points",
    threshold: 10000,
    icon: "Trophy",
    active: true,
    category: "donors",
  },
  {
    id: 9,
    name: "Global Impact",
    desc: "Reach 50,000 total impact points",
    requirementType: "points",
    threshold: 50000,
    icon: "Globe",
    active: true,
    category: "donors",
  },
  {
    id: 11,
    name: "Elite Patron",
    desc: "Rank in the top tier of donors",
    requirementType: "points",
    threshold: 100000,
    icon: "Crown",
    active: true,
    category: "donors",
  },

  // --- DONOR ACHIEVEMENTS (Streaks) ---
  {
    id: 25,
    name: "Consistency King",
    desc: "7-day consistent donation streak",
    requirementType: "streaks",
    threshold: 7,
    icon: "Flame",
    active: true,
    category: "donors",
  },
  {
    id: 5,
    name: "Streak Sensation",
    desc: "30-day consistent donation streak",
    requirementType: "streaks",
    threshold: 30,
    icon: "Target",
    active: true,
    category: "donors",
  },
  {
    id: 26,
    name: "Unstoppable",
    desc: "100-day consistent donation streak",
    requirementType: "streaks",
    threshold: 100,
    icon: "Zap",
    active: true,
    category: "donors",
  },

  // --- DONOR ACHIEVEMENTS (Community & Others) ---
  {
    id: 8,
    name: "Local Guardian",
    desc: "Support 5 different local NGOs",
    requirementType: "donations",
    threshold: 5,
    icon: "Shield",
    active: true,
    category: "donors",
  },
  {
    id: 12,
    name: "Community Glue",
    desc: "Refer 10 new donors",
    requirementType: "donations",
    threshold: 10,
    icon: "Users",
    active: true,
    category: "donors",
  },

  // --- NGO ACHIEVEMENTS (Rescue Operations) ---
  {
    id: 16,
    name: "Rescue Rookie",
    desc: "Save 100kg of food from wastage",
    requirementType: "deliveries",
    threshold: 100,
    icon: "Package",
    active: true,
    category: "ngos",
  },
  {
    id: 4,
    name: "Zero Waste Pro",
    desc: "Save 500kg of food from wastage",
    requirementType: "deliveries",
    threshold: 500,
    icon: "Shield",
    active: true,
    category: "ngos",
  },
  {
    id: 17,
    name: "Impact Engine",
    desc: "Save 1,000kg of food from wastage",
    requirementType: "deliveries",
    threshold: 1000,
    icon: "Zap",
    active: true,
    category: "ngos",
  },
  {
    id: 18,
    name: "Sustainability Star",
    desc: "Save 5,000kg of food from wastage",
    requirementType: "deliveries",
    threshold: 5000,
    icon: "Globe",
    active: true,
    category: "ngos",
  },
  {
    id: 19,
    name: "Hunger Warrior",
    desc: "Save 10,000kg of food from wastage",
    requirementType: "deliveries",
    threshold: 10000,
    icon: "Trophy",
    active: true,
    category: "ngos",
  },
  {
    id: 27,
    name: "Ecosystem Giant",
    desc: "Save 50,000kg of food from wastage",
    requirementType: "deliveries",
    threshold: 50000,
    icon: "Crown",
    active: true,
    category: "ngos",
  },

  // --- NGO ACHIEVEMENTS (Impact Points) ---
  {
    id: 28,
    name: "Credit Starter",
    desc: "Earn 5,000 impact points",
    requirementType: "points",
    threshold: 5000,
    icon: "Star",
    active: true,
    category: "ngos",
  },
  {
    id: 29,
    name: "Resource Master",
    desc: "Earn 25,000 impact points",
    requirementType: "points",
    threshold: 25000,
    icon: "Target",
    active: true,
    category: "ngos",
  },
  {
    id: 30,
    name: "NGO Elite",
    desc: "Earn 100,000 impact points",
    requirementType: "points",
    threshold: 100000,
    icon: "Gem",
    active: true,
    category: "ngos",
  },

  // --- NGO ACHIEVEMENTS (Streaks) ---
  {
    id: 35,
    name: "Rescue Streak",
    desc: "Maintain a 7-day food rescue streak",
    requirementType: "streaks",
    threshold: 7,
    icon: "Flame",
    active: true,
    category: "ngos",
  },
  {
    id: 36,
    name: "Reliability Master",
    desc: "Maintain a 30-day food rescue streak",
    requirementType: "streaks",
    threshold: 30,
    icon: "Target",
    active: true,
    category: "ngos",
  },
  {
    id: 37,
    name: "Operational Excellence",
    desc: "Maintain a 100-day food rescue streak",
    requirementType: "streaks",
    threshold: 100,
    icon: "Zap",
    active: true,
    category: "ngos",
  },

  // --- VOLUNTEER ACHIEVEMENTS (Service Milestones) ---
  {
    id: 20,
    name: "Swift Start",
    desc: "Complete 10 successful deliveries",
    requirementType: "deliveries",
    threshold: 10,
    icon: "Flame",
    active: true,
    category: "volunteers",
  },
  {
    id: 21,
    name: "Path Finder",
    desc: "Complete 50 successful deliveries",
    requirementType: "deliveries",
    threshold: 50,
    icon: "Target",
    active: true,
    category: "volunteers",
  },
  {
    id: 2,
    name: "Food Hero",
    desc: "Achieve 100 successful deliveries",
    requirementType: "deliveries",
    threshold: 100,
    icon: "Shield",
    active: true,
    category: "volunteers",
  },
  {
    id: 22,
    name: "Street Legend",
    desc: "Complete 250 successful deliveries",
    requirementType: "deliveries",
    threshold: 250,
    icon: "Zap",
    active: true,
    category: "volunteers",
  },
  {
    id: 23,
    name: "Community Savior",
    desc: "Complete 500 successful deliveries",
    requirementType: "deliveries",
    threshold: 500,
    icon: "Trophy",
    active: true,
    category: "volunteers",
  },
  {
    id: 24,
    name: "Guardian Angel",
    desc: "Complete 1,000 successful deliveries",
    requirementType: "deliveries",
    threshold: 1000,
    icon: "Heart",
    active: true,
    category: "volunteers",
  },
  {
    id: 31,
    name: "Hunger Destroyer",
    desc: "Complete 5,000 successful deliveries",
    requirementType: "deliveries",
    threshold: 5000,
    icon: "Crown",
    active: true,
    category: "volunteers",
  },

  // --- VOLUNTEER ACHIEVEMENTS (Points & Streaks) ---
  {
    id: 32,
    name: "Service Spark",
    desc: "Earn 2,000 impact points",
    requirementType: "points",
    threshold: 2000,
    icon: "Star",
    active: true,
    category: "volunteers",
  },
  {
    id: 33,
    name: "Elite Guardian",
    desc: "Earn 10,000 impact points",
    requirementType: "points",
    threshold: 10000,
    icon: "ShieldCheck",
    active: true,
    category: "volunteers",
  },
  {
    id: 34,
    name: "Reliable Heart",
    desc: "Maintain a 14-day delivery streak",
    requirementType: "streaks",
    threshold: 14,
    icon: "Heart",
    active: true,
    category: "volunteers",
  },
  {
    id: 38,
    name: "Commitment Pillar",
    desc: "Maintain a 30-day delivery streak",
    requirementType: "streaks",
    threshold: 30,
    icon: "Shield",
    active: true,
    category: "volunteers",
  },
  {
    id: 39,
    name: "The Unstoppable Hero",
    desc: "Maintain a 100-day delivery streak",
    requirementType: "streaks",
    threshold: 100,
    icon: "Zap",
    active: true,
    category: "volunteers",
  },
];

export const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Heart":
      return Heart;
    case "Package":
      return Package;
    case "Trophy":
      return Trophy;
    case "Zap":
      return Zap;
    case "Target":
      return Target;
    case "Award":
      return Award;
    case "Shield":
      return Shield;
    case "Crown":
      return Crown;
    case "Star":
      return Star;
    case "Flame":
      return Flame;
    case "Globe":
      return Globe;
    case "ZapOff":
      return ZapOff;
    case "Users":
      return Users;
    case "ShieldCheck":
      return ShieldCheck;
    case "Gem":
      return Gem;
    default:
      return Award;
  }
};
