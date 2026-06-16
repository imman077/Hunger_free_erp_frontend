import { z } from "zod";

/**
 * Common schema elements
 */
const BaseEntitySchema = z.object({
  id: z.number(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
});

/**
 * Donor Schemas
 */
export const DonationHistorySchema = z.object({
  event: z.string(),
  date: z.string(),
  amount: z.number(),
});

export const DonorSchema = BaseEntitySchema.extend({
  businessName: z.string(),
  type: z.string(),
  totalDonations: z.number(),
  points: z.number(),
  status: z.string(),
  contactPerson: z.string(),
  donationHistory: z.array(DonationHistorySchema),
});

/**
 * NGO Schemas
 */
export const NgoStatusSchema = z.enum(["Active", "Pending", "Deactivated"]);

export const NgoSchema = BaseEntitySchema.extend({
  name: z.string(),
  registrationNo: z.string(),
  serviceAreas: z.array(z.string()),
  beneficiaries: z.string(),
  status: NgoStatusSchema,
  volunteers: z.array(z.string()),
});

/**
 * Volunteer Schemas
 */
export const VolunteerStatusSchema = z.enum(["available", "on-leave", "busy"]);
export const VerificationStatusSchema = z.enum([
  "Verified",
  "Pending",
  "Rejected",
]);

export const VolunteerSchema = BaseEntitySchema.extend({
  name: z.string(),
  zone: z.string(),
  volunteerAreas: z.array(z.string()),
  tasksCompleted: z.number(),
  totalTasks: z.number(),
  missedTasks: z.number(),
  rating: z.string(),
  status: VolunteerStatusSchema,
  onLeave: z.boolean(),
  emergencyPhone: z.string(),
  vehicle: z.string(),
  license: z.string(),
  createdDate: z.string(),
  verificationStatus: VerificationStatusSchema,
  lastActive: z.string(),
  lastAssignment: z.string(),
  allowedTaskTypes: z.array(z.string()),
  fuelEligibility: z.boolean(),
  isSuspended: z.boolean(),
  suspensionValue: z.number().optional(),
  suspensionUnit: z.string().optional(),
  suspensionEndTime: z.number().optional(),
});

/**
 * General User Item Schema (for UsersPage overview)
 */
export const RecentActivitySchema = z.object({
  action: z.string(),
  time: z.string(),
  icon: z.string(),
});

export const miniTimelineSchema = z.object({
  event: z.string(),
  date: z.string(),
});

export const UserItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  status: z.string(),
  date: z.string(),
  userId: z.string(),
  joinedDate: z.string(),
  lastLogin: z.string(),
  lastLoginTime: z.string(),
  totalPoints: z.number(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  organization: z.string(),
  location: z.string(),
  badges: z.array(z.string()),
  donationsMade: z.number(),
  itemsDonated: z.number(),
  avgRating: z.number(),
  recentActivity: z.array(RecentActivitySchema),
  miniTimeline: z.array(miniTimelineSchema),
  avatar: z.string().optional(),
});

/**
 * Collective Store Schema
 */
export const UserDataSchema = z.object({
  donors: z.array(DonorSchema),
  ngos: z.array(NgoSchema),
  volunteers: z.array(VolunteerSchema),
  users: z.array(UserItemSchema),
});

export type DonationHistory = z.infer<typeof DonationHistorySchema>;
export type Donor = z.infer<typeof DonorSchema>;
export type NgoStatus = z.infer<typeof NgoStatusSchema>;
export type Ngo = z.infer<typeof NgoSchema>;
export type VolunteerStatus = z.infer<typeof VolunteerStatusSchema>;
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;
export type Volunteer = z.infer<typeof VolunteerSchema>;
export type UserItem = z.infer<typeof UserItemSchema>;
export type UserData = z.infer<typeof UserDataSchema>;
