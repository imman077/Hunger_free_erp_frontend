import { z } from "zod";

export const NgoProfileSchema = z.object({
  ngoName: z.string(),
  ngoType: z.string(),
  registrationId: z.string(),
  taxId: z.string(),
  managerName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  memberSince: z.string(),
  verificationLevel: z.string(),
  bankName: z.string(),
  accountNumber: z.string(),
  upiId: z.string(),
  beneficiariesServed: z.number().optional(),
  donationsAccepted: z.number().optional(),
});

export const NgoStatSchema = z.object({
  label: z.string(),
  val: z.string(),
  trend: z.string(),
  color: z.string(),
});

export const NgoNotificationSchema = z.object({
  title: z.string(),
  desc: z.string(),
  time: z.string(),
  type: z.enum(["donation", "logistics", "impact"]),
  status: z.enum(["action_needed", "in_transit", "completed"]),
});

export const NgoDocumentSchema = z.object({
  name: z.string(),
  status: z.string(),
  date: z.string(),
  url: z.string().optional(),
});

export const PrizeSchema = z.object({
  id: z.number(),
  label: z.string(),
  icon: z.any(),
  color: z.string(),
});

export const RewardSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.string().optional(),
  points: z.number(),
  available: z.boolean(),
  desc: z.string().optional(),
  icon: z.any().optional(),
  details: z
    .array(
      z.object({
        group: z.string(),
        text: z.string(),
      }),
    )
    .optional(),
});

export const NgoDataSchema = z.object({
  currentPoints: z.number(),
  profile: NgoProfileSchema,
  stats: z.array(NgoStatSchema),
  notifications: z.array(NgoNotificationSchema),
  documents: z.array(NgoDocumentSchema),
  activeNeeds: z.array(
    z.object({
      title: z.string(),
      desc: z.string(),
      type: z.string(),
    }),
  ),
  prizes: z.array(PrizeSchema),
  rewards: z.object({
    grants: z.array(RewardSchema),
    mega: z.array(RewardSchema),
    social: z.array(RewardSchema),
  }),
  tiers: z.array(
    z.object({
      name: z.string(),
      points: z.string(),
      color: z.string(),
    })
  ).optional(),
  myRequests: z.array(z.object({
    id: z.number(),
    foodType: z.string(),
    quantity: z.string(),
    donor: z.string(),
    donorPhone: z.string().optional(),
    status: z.string(),
    date: z.string(),
    pickupAddress: z.string(),
    volunteer: z.object({
        name: z.string(),
        phone: z.string(),
        rating: z.string()
    }).optional(),
    trackingHistory: z.array(z.any()).optional()
  })).optional()
});

export type NgoProfile = z.infer<typeof NgoProfileSchema>;
export type NgoStat = z.infer<typeof NgoStatSchema>;
export type NgoNotification = z.infer<typeof NgoNotificationSchema>;
export type NgoDocument = z.infer<typeof NgoDocumentSchema>;
export type Prize = z.infer<typeof PrizeSchema>;
export type Reward = z.infer<typeof RewardSchema>;
export type NgoData = z.infer<typeof NgoDataSchema>;
