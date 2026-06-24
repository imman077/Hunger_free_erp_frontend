"use client";

import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const donorLuckyPrizeDataSchema = z.object({
  loading: z.boolean().optional(),
});

export const donorLuckyPrizePersistenceConfig = {
  loading: false,
};

export const donorLuckyPrizeSchemas = createSchemaBundle(
  donorLuckyPrizeDataSchema,
  {
    dataPath: "donorLuckyPrizeData",
    persistenceConfig: donorLuckyPrizePersistenceConfig,
  },
);

export type donorLuckyPrizeData = z.infer<typeof donorLuckyPrizeDataSchema>;
