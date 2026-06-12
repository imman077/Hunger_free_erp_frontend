import { z } from "zod";

export const LoginUserSchema = z.object({
  id: z.union([z.string(), z.number()]),
  username: z.string(),
  email: z.string().email(),
  role: z.string(),
  phone: z.string().nullable().optional(),
  donorProfile: z
    .object({
      businessName: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  ngoProfile: z
    .object({
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: LoginUserSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;
