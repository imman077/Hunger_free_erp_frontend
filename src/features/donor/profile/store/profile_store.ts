import { z } from "zod";
import { createCompleteStore } from "../../../../core/utility";
import {
  profileFormStateSchema,
  profilePersistenceConfig,
} from "../model/profile_input_model";

export const profileStore = createCompleteStore(profileFormStateSchema, {
  name: "profile_form_storage",
  dataPath: "profileFormState",
  persistenceConfig: profilePersistenceConfig,
});

export const {
  model: profileInputModel,
  formSchema: profileFormSchema,
} = profileStore;

export type ProfileFormData = z.infer<typeof profileFormSchema>;
