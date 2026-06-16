import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const rewardsStateSchema = z.object({
  isSpinning: z.boolean().default(false),
  rotation: z.number().default(0),
  wonPrize: z.any().nullable().default(null),
});

export const rewardsPersistenceConfig = {
  isSpinning: false,
  rotation: true,
  wonPrize: false,
};

export const rewardsSchemas = createSchemaBundle(rewardsStateSchema, {
  dataPath: "rewardsState",
  persistenceConfig: rewardsPersistenceConfig,
});

export type RewardsState = z.infer<typeof rewardsStateSchema>;
