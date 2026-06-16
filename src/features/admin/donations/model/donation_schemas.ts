import { z } from "zod";

export const DonationSchema = z.object({
  id: z.string(),
  donor: z.string(),
  foodType: z.string(),
  quantity: z.string(),
  pickupTime: z.string(),
  status: z.string(),
  assignedVolunteer: z.string().nullable(),
});

export const VolunteerSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.string(),
  vehicle: z.string(),
  distance: z.string(),
  tasks: z.number(),
});

export const DonationStatsSchema = z.object({
  label: z.string(),
  val: z.string(),
  trend: z.string(),
  color: z.string(),
});

export type Donation = z.infer<typeof DonationSchema>;
export type Volunteer = z.infer<typeof VolunteerSchema>;
export type DonationStats = z.infer<typeof DonationStatsSchema>;
