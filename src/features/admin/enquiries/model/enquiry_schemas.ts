import { z } from "zod";

export const EnquirySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  status: z.string(),
  time: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  email: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  appliedDate: z.string().optional(),
  regNo: z.string().optional(),
  link: z.string().optional(),
});

export const RewardEnquirySchema = z.object({
  id: z.string(),
  name: z.string(),
  user: z.string(),
  userType: z.string(),
  points: z.string(),
  status: z.string(),
  time: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  appliedDate: z.string().optional(),
  category: z.string().optional(),
  userPointsBalance: z.string().optional(),
});

export const EnquiryStateSchema = z.object({
  registrations: z.array(EnquirySchema),
  claims: z.array(EnquirySchema),
  payments: z.array(EnquirySchema),
  updates: z.array(EnquirySchema),
  rewards: z.array(RewardEnquirySchema),
});

export type Enquiry = z.infer<typeof EnquirySchema>;
export type RewardEnquiry = z.infer<typeof RewardEnquirySchema>;
export type EnquiryState = z.infer<typeof EnquiryStateSchema>;
