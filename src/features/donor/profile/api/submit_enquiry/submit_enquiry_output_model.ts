import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

export const EnquiryOutputDetailsSchema = z.object({
  id: z.string(),
  userId: z.string().optional().nullable(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  message: z.string(),
  role: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
});

export const submitEnquiryApiOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: EnquiryOutputDetailsSchema.optional().nullable(),
});

export const submitEnquiryOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const submitEnquiryOutputSchemas = createSchemaBundle(
  submitEnquiryApiOutputSchema,
  {
    dataPath: "submitEnquiryApiData",
    persistenceConfig: submitEnquiryOutputPersistenceConfig,
  }
);

export type SubmitEnquiryApiOutput = z.infer<typeof submitEnquiryApiOutputSchema>;
