import { z } from "zod";

const DeleteSampleScreenInputDataSchema = z.object({
  sampleScreenCode: z.string().optional(),
});

export const deleteSampleScreenInputDataSchema = DeleteSampleScreenInputDataSchema;
export type DeleteSampleScreenInputData = z.infer<
  typeof deleteSampleScreenInputDataSchema
>;
