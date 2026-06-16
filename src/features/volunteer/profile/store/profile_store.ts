import { z } from "zod";
import { createCompleteStore } from "../../../../core/utility";
import {
  profileDataSchema,
  profilePersistenceConfig,
} from "../model/profile_input_model";

export const profileStore = createCompleteStore(profileDataSchema, {
  name: "volunteer_profile_storage",
  dataPath: "profileState",
  persistenceConfig: profilePersistenceConfig,
});

export const {
  model: profileInputModel,
  formSchema: profileFormSchema,
} = profileStore;

export type ProfileFormData = z.infer<typeof profileFormSchema>;
