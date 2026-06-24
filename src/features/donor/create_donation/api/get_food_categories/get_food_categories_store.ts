import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  getFoodCategoriesOutputSchema,
  getFoodCategoriesOutputPersistenceConfig,
} from "./get_food_categories_output_model";

export const getFoodCategoriesApiStore = createCompleteStore(
  getFoodCategoriesOutputSchema,
  {
    name: "get_food_categories_api_storage",
    dataPath: "getFoodCategoriesApiData",
    persistenceConfig: getFoodCategoriesOutputPersistenceConfig,
  }
);

export const {
  model: getFoodCategoriesApiOutputModel,
  formSchema: getFoodCategoriesApiFormSchema,
} = getFoodCategoriesApiStore;

export type GetFoodCategoriesApiFormData = z.infer<typeof getFoodCategoriesApiFormSchema>;
