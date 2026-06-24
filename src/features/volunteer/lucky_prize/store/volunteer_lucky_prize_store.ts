"use client";

import { z } from "zod";
import {
  volunteerLuckyPrizeDataSchema,
  volunteerLuckyPrizePersistenceConfig,
} from "../model/volunteer_lucky_prize_input_model";
import { createCompleteStore } from "../../../../core/utility";

export const volunteerLuckyPrizeStore = createCompleteStore(
  volunteerLuckyPrizeDataSchema,
  {
    name: "volunteer_lucky_prize_storage",
    dataPath: "volunteerLuckyPrizeData",
    persistenceConfig: volunteerLuckyPrizePersistenceConfig,
  },
);

export const {
  model: volunteerLuckyPrizeInputModel,
  formSchema: volunteerLuckyPrizeFormSchema,
} = volunteerLuckyPrizeStore;

export type volunteerLuckyPrizeFormData = z.infer<typeof volunteerLuckyPrizeFormSchema>;
