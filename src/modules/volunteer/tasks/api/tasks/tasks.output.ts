import { z } from "zod";

export const VolunteerTaskSchema = z
  .object({
    id: z.number(),
    food_category: z.string().optional().nullable(),
    quantity: z.union([z.string(), z.number()]).optional().nullable(),
    unit: z.string().optional().nullable(),
    status: z.string(),
    created_at: z.string().optional().nullable(),
    pickup_address: z.string().optional().nullable(),
    delivery_address: z.string().optional().nullable(),
  })
  .passthrough();

export type VolunteerTask = z.infer<typeof VolunteerTaskSchema>;

export const GetNearbyPickupsResponseSchema = z.array(VolunteerTaskSchema);
export const AcceptPickupResponseSchema = VolunteerTaskSchema;
export const GetMyTasksResponseSchema = z.array(VolunteerTaskSchema);
export const MarkAsPickedUpResponseSchema = z.any();
export const MarkAsDeliveredResponseSchema = z.any();

export type GetNearbyPickupsResponse = z.infer<typeof GetNearbyPickupsResponseSchema>;
export type AcceptPickupResponse = z.infer<typeof AcceptPickupResponseSchema>;
export type GetMyTasksResponse = z.infer<typeof GetMyTasksResponseSchema>;
