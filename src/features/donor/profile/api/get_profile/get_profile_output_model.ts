import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

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
  legalName: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  entityType: z.string().optional().nullable(),
  alternateContact: z.string().optional().nullable(),
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

const GamificationSchema = z.object({
  points: z.number(),
  lifetimePoints: z.number().optional().nullable(),
}).optional().nullable();

export const getProfileApiOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    role: z.string(),
    avatar: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    isVerified: z.boolean().optional().nullable(),
    donorProfile: DonorProfileSchema,
    paymentMethods: PaymentMethodsResponseSchema,
    gamification: GamificationSchema,
    createdAt: z.string().optional().nullable(),
  }).optional().nullable(),
});

export const getProfileOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getProfileOutputSchemas = createSchemaBundle(
  getProfileApiOutputSchema,
  {
    dataPath: "getProfileApiData",
    persistenceConfig: getProfileOutputPersistenceConfig,
  }
);

export type GetProfileApiOutput = z.infer<typeof getProfileApiOutputSchema>;
