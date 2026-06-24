"use client";

import { z } from "zod";
import {
  ngoBenefitsDataSchema,
  ngoBenefitsPersistenceConfig,
} from "../model/ngo_benefits_input_model";
import { createCompleteStore } from "@/core/utility";

export const ngoBenefitsStore = createCompleteStore(
  ngoBenefitsDataSchema,
  {
    name: "ngo_benefits_storage",
    dataPath: "ngoBenefitsData",
    persistenceConfig: ngoBenefitsPersistenceConfig,
  },
);

export const {
  model: ngoBenefitsInputModel,
  formSchema: ngoBenefitsFormSchema,
} = ngoBenefitsStore;

export type ngoBenefitsFormData = z.infer<typeof ngoBenefitsFormSchema>;
