"use client";

import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const volunteerLuckyPrizeDataSchema = z.object({
  loading: z.boolean().optional(),
});

export const volunteerLuckyPrizePersistenceConfig = {
  loading: false,
};

export const volunteerLuckyPrizeSchemas = createSchemaBundle(
  volunteerLuckyPrizeDataSchema,
  {
    dataPath: "volunteerLuckyPrizeData",
    persistenceConfig: volunteerLuckyPrizePersistenceConfig,
  },
);

export type volunteerLuckyPrizeData = z.infer<typeof volunteerLuckyPrizeDataSchema>;
