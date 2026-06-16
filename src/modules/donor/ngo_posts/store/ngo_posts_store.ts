import { z } from "zod";
import { createCompleteStore } from "../../../../core/utility";
import {
  ngoPostsDataSchema,
  ngoPostsPersistenceConfig,
} from "../model/ngo_posts_model";

export const ngoPostsStore = createCompleteStore(ngoPostsDataSchema, {
  name: "ngo_posts_storage",
  dataPath: "ngoPostsData",
  persistenceConfig: ngoPostsPersistenceConfig,
});

export const {
  model: ngoPostsInputModel,
  formSchema: ngoPostsFormSchema,
} = ngoPostsStore;

export type NgoPostsFormData = z.infer<typeof ngoPostsFormSchema>;
