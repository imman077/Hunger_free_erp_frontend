import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import {
  getFoodCategoriesInputSchema,
} from "./get_food_categories_input_model";
import type {
  GetFoodCategoriesInput,
} from "./get_food_categories_input_model";
import { getFoodCategoriesOutputSchema } from "./get_food_categories_output_model";
import { getFoodCategoriesApiOutputModel } from "./get_food_categories_store";

export const GET_FOOD_CATEGORIES_QUERY = gql`
  query ConfigItems($key: String) {
    configItems(key: $key) {
      id
      key
      name
      description
      color
      isActive
      sortOrder
    }
  }
`;

export async function getFoodCategoriesApi(
  input: GetFoodCategoriesInput
): Promise<any> {
  try {
    const validatedInput = getFoodCategoriesInputSchema.parse(input);
    getFoodCategoriesApiOutputModel.update({ loading: true });

    const response = await client.query({
      query: GET_FOOD_CATEGORIES_QUERY,
      variables: { key: validatedInput.key },
      fetchPolicy: "network-only",
    });

    const validatedOutput = getFoodCategoriesOutputSchema.parse(response);
    getFoodCategoriesApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });
    return validatedOutput;
  } catch (err) {
    getFoodCategoriesApiOutputModel.update({ loading: false });
    throw err;
  }
}
