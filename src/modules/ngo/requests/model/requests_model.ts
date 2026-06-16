import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const volunteerDetailSchema = z.object({
  name: z.string(),
  phone: z.string(),
  rating: z.string(),
});

export const donationRequestSchema = z.object({
  id: z.number(),
  title: z.string(),
  source: z.string(),
  sourceType: z.enum(["DONOR", "NGO"]),
  isOwn: z.boolean(),
  distance: z.string(),
  icon: z.string(),
  time: z.string(),
  urgency: z.enum(["High", "Normal"]),
  status: z.string(),
  rawStatus: z.string().optional(),
  progress: z.number(),
  description: z.string().optional(),
  quantity: z.string().optional(),
  resourceType: z.string().optional(),
  quality: z.string().optional(),
  pickupAddress: z.string().optional(),
  deliveryAddress: z.string().optional(),
  expiryTime: z.string().optional(),
  origin: z.enum(["DONATION", "NEED"]),
  isMine: z.boolean().optional(),
  isSupported: z.boolean().optional(),
  isClaimed: z.boolean().optional(),
  volunteer: volunteerDetailSchema.optional(),
});

export const requestsStateSchema = z.object({
  viewMode: z.enum(["table", "card"]).default("card"),
  activeTab: z.enum(["marketplace", "my-requests", "community-requests"]).default("marketplace"),
  donations: z.array(donationRequestSchema).default([]),
  selectedRequest: donationRequestSchema.nullable().default(null),
  isDrawerOpen: z.boolean().default(false),
  isAcceptModalOpen: z.boolean().default(false),
  acceptingDonation: donationRequestSchema.nullable().default(null),
  isAccepting: z.boolean().default(false),
  isAcceptSuccess: z.boolean().default(false),
  searchQuery: z.string().default(""),
  roleFilter: z.enum(["ALL", "DONOR", "NGO"]).default("ALL"),
  supportQty: z.string().default(""),
  supportPhone: z.string().default(""),
  otpValue: z.string().default(""),
  isVerifying: z.boolean().default(false),
  otpError: z.string().default(""),
  isTimerPaused: z.boolean().default(false),
  remainingTime: z.number().default(2500),
});

export const requestsPersistenceConfig = {
  viewMode: false,
  activeTab: false,
  donations: false,
  selectedRequest: false,
  isDrawerOpen: false,
  isAcceptModalOpen: false,
  acceptingDonation: false,
  isAccepting: false,
  isAcceptSuccess: false,
  searchQuery: false,
  roleFilter: false,
  supportQty: false,
  supportPhone: false,
  otpValue: false,
  isVerifying: false,
  otpError: false,
  isTimerPaused: false,
  remainingTime: false,
};

export const requestsSchemas = createSchemaBundle(requestsStateSchema, {
  dataPath: "requestsState",
  persistenceConfig: requestsPersistenceConfig,
});

export type RequestsState = z.infer<typeof requestsStateSchema>;
export type DonationRequest = z.infer<typeof donationRequestSchema>;
