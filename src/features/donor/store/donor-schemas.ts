import { z } from "zod";

export const DonorStatSchema = z.object({
  title: z.string(),
  value: z.string(),
  change: z.string(),
  iconName: z.string().optional(),
  color: z.string(),
});

export const RecentActivitySchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  ngo: z.string(),
  time: z.string(),
  status: z.string(),
  category: z.string(),
});

export const DonationDetailSchema = z.object({
  id: z.union([z.number(), z.string()]),
  foodType: z.string(),
  category: z.string(),
  dietaryType: z.string(),
  preparationType: z.string(),
  quantity: z.string(),
  ngo: z.string().optional().nullable(),
  date: z.string(),
  status: z.string(),
  pickupAddress: z.string(),
  deliveryAddress: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  volunteer: z
    .object({
      name: z.string(),
      phone: z.string(),
      rating: z.string(),
    })
    .optional()
    .nullable(),
  pickupCoords: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional()
    .nullable(),
  deliveryCoords: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional()
    .nullable(),
  volunteerLocation: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional()
    .nullable(),
  image: z.string().optional().nullable(),
  timeline: z.array(
    z.object({
      status: z.string(),
      date: z.string(),
      time: z.string(),
      completed: z.boolean(),
      description: z.string().optional().nullable(),
    }),
  ),
  isNgoNeed: z.boolean().optional().nullable(),
  relatedNeed: z.string().optional().nullable(),
  donor: z.string().optional().nullable(),
  expiryTime: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
});

export const BankAccountSchema = z.object({
  id: z.string(),
  bankName: z.string(),
  accountHolder: z.string(),
  accountNumber: z.string(),
  ifscCode: z.string(),
  isPrimary: z.boolean(),
  isVerified: z.boolean(),
});

export const UpiIdSchema = z.object({
  id: z.string(),
  vpa: z.string(),
  label: z.string(),
  isPrimary: z.boolean(),
  isVerified: z.boolean(),
});

export const ProfileDetailsSchema = z.object({
  businessName: z.string(),
  businessType: z.string(),
  registrationId: z.string(),
  taxId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  memberSince: z.string(),
  verificationLevel: z.string(),
  completion: z.number(),
  bankName: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  upiId: z.string().optional().nullable(),
  branch: z.string().optional().nullable(),
  legalName: z.string().optional().default(''),
  website: z.string().optional().default(''),
  entityType: z.string().optional().default(''),
  alternateContact: z.string().optional().default(''),
  address: z.object({
    line1: z.string().optional().default(''),
    city: z.string().optional().default(''),
    state: z.string().optional().default(''),
    postalCode: z.string().optional().default(''),
    country: z.string().optional().default(''),
  }).optional().default({ line1: '', city: '', state: '', postalCode: '', country: '' }),
});

export const DocumentSchema = z.object({
  name: z.string(),
  status: z.enum(["Verified", "In Review", "Rejected", "Pending"]),
  date: z.string(),
  url: z.string().optional(),
});

export const PrizeSchema = z.object({
  id: z.union([z.number(), z.string()]),
  label: z.string(),
  icon: z.string(),
  color: z.string(),
});

export const RewardItemSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  amount: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  points: z.number(),
  available: z.boolean(),
  category: z.enum(["cash", "tours", "youth"]),
});

export const DonorDataSchema = z.object({
  currentPoints: z.number(),
  stats: z.array(DonorStatSchema),
  recentActivities: z.array(RecentActivitySchema),
  donationHistory: z.array(DonationDetailSchema),
  profile: ProfileDetailsSchema,
  documents: z.array(DocumentSchema),
  prizes: z.array(PrizeSchema),
  rewards: z.array(RewardItemSchema),
  bankAccounts: z.array(BankAccountSchema),
  upiIds: z.array(UpiIdSchema),
});

export type DonorStat = z.infer<typeof DonorStatSchema>;
export type RecentActivity = z.infer<typeof RecentActivitySchema>;
export type DonationDetail = z.infer<typeof DonationDetailSchema>;
export type ProfileDetails = z.infer<typeof ProfileDetailsSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type Prize = z.infer<typeof PrizeSchema>;
export type RewardItem = z.infer<typeof RewardItemSchema>;
export type DonorData = z.infer<typeof DonorDataSchema>;
export type BankAccount = z.infer<typeof BankAccountSchema>;
export type UpiId = z.infer<typeof UpiIdSchema>;
