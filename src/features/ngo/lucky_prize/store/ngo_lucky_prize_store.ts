"use client";

import { z } from "zod";
import {
  ngoLuckyPrizeDataSchema,
  ngoLuckyPrizePersistenceConfig,
} from "../model/ngo_lucky_prize_input_model";
import { createCompleteStore } from "../../../../core/utility";

export const ngoLuckyPrizeStore = createCompleteStore(
  ngoLuckyPrizeDataSchema,
  {
    name: "ngo_lucky_prize_storage",
    dataPath: "ngoLuckyPrizeData",
    persistenceConfig: ngoLuckyPrizePersistenceConfig,
  },
);

export const {
  model: ngoLuckyPrizeInputModel,
  formSchema: ngoLuckyPrizeFormSchema,
} = ngoLuckyPrizeStore;

export type ngoLuckyPrizeFormData = z.infer<typeof ngoLuckyPrizeFormSchema>;
