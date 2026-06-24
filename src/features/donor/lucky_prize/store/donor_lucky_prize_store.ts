"use client";

import { z } from "zod";
import {
  donorLuckyPrizeDataSchema,
  donorLuckyPrizePersistenceConfig,
} from "../model/donor_lucky_prize_input_model";
import { createCompleteStore } from "../../../../core/utility";

export const donorLuckyPrizeStore = createCompleteStore(
  donorLuckyPrizeDataSchema,
  {
    name: "donor_lucky_prize_storage",
    dataPath: "donorLuckyPrizeData",
    persistenceConfig: donorLuckyPrizePersistenceConfig,
  },
);

export const {
  model: donorLuckyPrizeInputModel,
  formSchema: donorLuckyPrizeFormSchema,
} = donorLuckyPrizeStore;

export type donorLuckyPrizeFormData = z.infer<typeof donorLuckyPrizeFormSchema>;
