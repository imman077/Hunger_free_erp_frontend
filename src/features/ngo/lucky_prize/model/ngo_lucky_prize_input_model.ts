"use client";

import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const ngoLuckyPrizeDataSchema = z.object({
  loading: z.boolean().optional(),
});

export const ngoLuckyPrizePersistenceConfig = {
  loading: false,
};

export const ngoLuckyPrizeSchemas = createSchemaBundle(
  ngoLuckyPrizeDataSchema,
  {
    dataPath: "ngoLuckyPrizeData",
    persistenceConfig: ngoLuckyPrizePersistenceConfig,
  },
);

export type ngoLuckyPrizeData = z.infer<typeof ngoLuckyPrizeDataSchema>;
