import { z } from "zod";

const GetSampleScreenInputDataSchema = z.object({
  pageNo: z.number().int().optional(),
  pageSize: z.number().int().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});

export const getSampleScreenInputDataSchema = GetSampleScreenInputDataSchema;
export type GetSampleScreenInputData = z.infer<typeof getSampleScreenInputDataSchema>;
