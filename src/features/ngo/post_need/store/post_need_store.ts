import { z } from "zod";
import { createCompleteStore } from "../../../../core/utility";
import {
  postNeedDataSchema,
  postNeedPersistenceConfig,
} from "../model/post_need_model";

export const postNeedStore = createCompleteStore(postNeedDataSchema, {
  name: "ngo_post_need_storage",
  dataPath: "postNeedData",
  persistenceConfig: postNeedPersistenceConfig,
});

export const {
  model: postNeedInputModel,
  formSchema: postNeedFormSchema,
} = postNeedStore;

export type PostNeedFormData = z.infer<typeof postNeedFormSchema>;
