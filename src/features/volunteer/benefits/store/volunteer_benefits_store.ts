"use client";

import { z } from "zod";
import {
  volunteerBenefitsDataSchema,
  volunteerBenefitsPersistenceConfig,
} from "../model/volunteer_benefits_input_model";
import { createCompleteStore } from "@/core/utility";

export const volunteerBenefitsStore = createCompleteStore(
  volunteerBenefitsDataSchema,
  {
    name: "volunteer_benefits_storage",
    dataPath: "volunteerBenefitsData",
    persistenceConfig: volunteerBenefitsPersistenceConfig,
  },
);

export const {
  model: volunteerBenefitsInputModel,
  formSchema: volunteerBenefitsFormSchema,
} = volunteerBenefitsStore;

export type volunteerBenefitsFormData = z.infer<typeof volunteerBenefitsFormSchema>;
