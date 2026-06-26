import { z } from "zod";

const AddressSchema = z.object({
  line1: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
}).optional().nullable();

const DonorProfileSchema = z.object({
  businessName: z.string().optional().nullable(),
  businessType: z.string().optional().nullable(),
  subCategory: z.string().optional().nullable(),
  verificationLevel: z.string().optional().nullable(),
  registrationId: z.string().optional().nullable(),
  profileCompleteness: z.number().optional().nullable(),
  taxId: z.string().optional().nullable(),
  address: AddressSchema,
  documents: z.array(
    z.object({
      name: z.string().optional().nullable(),
      status: z.string().optional().nullable(),
      date: z.string().optional().nullable(),
      url: z.string().optional().nullable(),
    })
  ).optional().nullable(),
}).optional().nullable();

const NGOStatsSchema = z.object({
  totalDonations: z.number().optional().nullable(),
  beneficiariesHelped: z.number().optional().nullable(),
  activeNeeds: z.number().optional().nullable(),
}).optional().nullable();

const NgoProfileSchema = z.object({
  name: z.string().optional().nullable(),
  registrationId: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  managingDirector: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
  currentTier: z.string().optional().nullable(),
  stats: NGOStatsSchema,
}).optional().nullable();

const VolunteerProfileSchema = z.object({
  zone: z.string().optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
  rating: z.number().optional().nullable(),
  tasksCompleted: z.number().optional().nullable(),
  vehicleType: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
}).optional().nullable();

const BadgeSchema = z.object({
  name: z.string(),
  earnedAt: z.string().optional().nullable(),
});

const PointsHistoryEntrySchema = z.object({
  points: z.number(),
  reason: z.string(),
  createdAt: z.string().optional().nullable(),
});

const GamificationSchema = z.object({
  points: z.number(),
  lifetimePoints: z.number(),
  badges: z.array(BadgeSchema).optional().nullable(),
  pointsHistory: z.array(PointsHistoryEntrySchema).optional().nullable(),
}).optional().nullable();

const BankAccountResponseSchema = z.object({
  id: z.string().optional().nullable(),
  bankName: z.string().optional().nullable(),
  accountHolder: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  ifscCode: z.string().optional().nullable(),
  isPrimary: z.boolean().optional().nullable(),
  isVerified: z.boolean().optional().nullable(),
}).optional().nullable();

const UPIIdResponseSchema = z.object({
  id: z.string().optional().nullable(),
  vpa: z.string().optional().nullable(),
  label: z.string().optional().nullable(),
  isPrimary: z.boolean().optional().nullable(),
  isVerified: z.boolean().optional().nullable(),
}).optional().nullable();

const PaymentMethodsResponseSchema = z.object({
  bankAccounts: z.array(BankAccountResponseSchema).optional().nullable(),
  upiIds: z.array(UPIIdResponseSchema).optional().nullable(),
}).optional().nullable();

export const ProfileDetailSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.string(),
  avatar: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  isVerified: z.boolean().optional().nullable(),
  donorProfile: DonorProfileSchema,
  ngoProfile: NgoProfileSchema,
  volunteerProfile: VolunteerProfileSchema,
  paymentMethods: PaymentMethodsResponseSchema,
  gamification: GamificationSchema,
  createdAt: z.string().optional().nullable(),
});

export type ProfileDetail = z.infer<typeof ProfileDetailSchema>;
