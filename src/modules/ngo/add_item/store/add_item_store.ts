import { z } from "zod";
import { createCompleteStore } from "../../../../core/utility";
import {
  addItemDataSchema,
  addItemPersistenceConfig,
} from "../model/add_item_input_model";

export const addItemStore = createCompleteStore(addItemDataSchema, {
  name: "ngo_add_item_storage",
  dataPath: "addItemData",
  persistenceConfig: addItemPersistenceConfig,
});

export const {
  model: addItemInputModel,
  formSchema: addItemFormSchema,
} = addItemStore;

export type AddItemFormData = z.infer<typeof addItemFormSchema>;
