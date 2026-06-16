import { z } from "zod";

export const GetNeedByIdInputSchema = z.union([z.string(), z.number()]);
export type GetNeedByIdInput = z.infer<typeof GetNeedByIdInputSchema>;
