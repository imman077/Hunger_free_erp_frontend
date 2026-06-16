import { z } from "zod";
import { createCompleteStore } from "../../../../core/utility";
import {
  rewardsStateSchema,
  rewardsPersistenceConfig,
} from "../model/rewards_input_model";

export const rewardsStore = createCompleteStore(rewardsStateSchema, {
  name: "volunteer_rewards_storage",
  dataPath: "rewardsState",
  persistenceConfig: rewardsPersistenceConfig,
});

export const {
  model: rewardsInputModel,
  formSchema: rewardsFormSchema,
} = rewardsStore;

export type RewardsFormData = z.infer<typeof rewardsFormSchema>;
