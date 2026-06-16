import { z } from "zod";
import { createCompleteStore } from "../../../../core/utility";
import {
  myInventoryStateSchema,
  myInventoryPersistenceConfig,
} from "../model/my_inventory_model";

export const myInventoryStore = createCompleteStore(myInventoryStateSchema, {
  name: "ngo_my_inventory_storage",
  dataPath: "myInventoryState",
  persistenceConfig: myInventoryPersistenceConfig,
});

export const {
  model: myInventoryInputModel,
  formSchema: myInventoryFormSchema,
} = myInventoryStore;

export type MyInventoryFormData = z.infer<typeof myInventoryFormSchema>;
