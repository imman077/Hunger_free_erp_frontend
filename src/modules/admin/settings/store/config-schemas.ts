import { z } from "zod";

export const ConfigItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const SystemConfigSchema = z.object({
  foodCategories: z.array(ConfigItemSchema),
  donationStatuses: z.array(ConfigItemSchema),
  userStatuses: z.array(ConfigItemSchema),
  ngoTypes: z.array(ConfigItemSchema),
  volunteerSkills: z.array(ConfigItemSchema),
});

export type ConfigItem = z.infer<typeof ConfigItemSchema>;
export type SystemConfig = z.infer<typeof SystemConfigSchema>;
