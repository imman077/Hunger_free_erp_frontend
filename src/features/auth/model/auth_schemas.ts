import { z } from "zod";

// Input Schema
export const LoginInputSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.string(),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

// Output User Schema
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

// Output Response Schema
export const LoginResponseSchema = z.object({
  token: z.string(),
  user: LoginUserSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;
