import { z } from "zod";
import { createSchemaBundle } from "../../../../../core/utility";

export const luckyPrizeSchema = z.object({
  id: z.string(),
  role: z.string(),
  label: z.string(),
  prizeType: z.string().optional().nullable(),
  value: z.number().optional().nullable(),
  icon: z.string().optional().nullable(),
  probability: z.number().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export const getPrizesOutputSchema = z.object({
  loading: z.boolean().default(false),
  data: z.object({
    prizes: z.array(luckyPrizeSchema).optional().nullable(),
  }).optional().nullable(),
});

export const getPrizesOutputPersistenceConfig = {
  loading: false,
  data: true,
};

export const getPrizesOutputSchemas = createSchemaBundle(
  getPrizesOutputSchema,
  {
    dataPath: "getPrizesApiData",
    persistenceConfig: getPrizesOutputPersistenceConfig,
  }
);

export type GetPrizesOutput = z.infer<typeof getPrizesOutputSchema>;
export type LuckyPrize = z.infer<typeof luckyPrizeSchema>;
