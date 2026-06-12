import { z } from "zod";

export const VolunteerProfileSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  memberSince: z.string(),
  verificationStatus: z.string(),
  vehicleType: z.string().optional(),
  licenseNumber: z.string().optional(),
  avatar: z.string().optional(),
});

export const VolunteerStatsSchema = z.object({
  deliveries: z.number(),
  impactPoints: z.number(),
  treesPlanted: z.number(),
  walletBalance: z.number(),
  totalEarnings: z.number(),
  thisMonthDeliveries: z.number(),
});

export const VolunteerActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  time: z.string(),
  desc: z.string(),
  type: z.enum(["delivery", "verification", "milestone", "reward"]),
});

export const VolunteerTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  location: z.string(),
  time: z.string(),
  status: z.string(),
  category: z.string(),
  bonus: z.string().optional(),
});

export const VolunteerBadgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  category: z.string(),
  isUnlocked: z.boolean(),
  description: z.string().optional(),
});

export const VolunteerPrizeSchema = z.object({
  id: z.number(),
  label: z.string(),
  icon: z.string(),
  color: z.string(),
});

export const VolunteerRewardSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.string().optional(),
  desc: z.string().optional(),
  points: z.number(),
  available: z.boolean(),
  icon: z.any().optional(),
  details: z
    .array(z.object({ group: z.string(), text: z.string() }))
    .optional(),
});

export type VolunteerProfile = z.infer<typeof VolunteerProfileSchema>;
export type VolunteerStats = z.infer<typeof VolunteerStatsSchema>;
export type VolunteerActivity = z.infer<typeof VolunteerActivitySchema>;
export type VolunteerTask = z.infer<typeof VolunteerTaskSchema>;
export type VolunteerBadge = z.infer<typeof VolunteerBadgeSchema>;
export type VolunteerPrize = z.infer<typeof VolunteerPrizeSchema>;
export type VolunteerReward = z.infer<typeof VolunteerRewardSchema>;
