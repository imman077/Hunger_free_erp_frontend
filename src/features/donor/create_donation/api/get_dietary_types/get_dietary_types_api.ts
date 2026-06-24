import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import {
  getDietaryTypesInputSchema,
} from "./get_dietary_types_input_model";
import type {
  GetDietaryTypesInput,
} from "./get_dietary_types_input_model";
import { getDietaryTypesOutputSchema } from "./get_dietary_types_output_model";
import { getDietaryTypesApiOutputModel } from "./get_dietary_types_store";

export const GET_DIETARY_TYPES_QUERY = gql`
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

export async function getDietaryTypesApi(
  input: GetDietaryTypesInput
): Promise<any> {
  try {
    const validatedInput = getDietaryTypesInputSchema.parse(input);
    getDietaryTypesApiOutputModel.update({ loading: true });

    const response = await client.query({
      query: GET_DIETARY_TYPES_QUERY,
      variables: { key: validatedInput.key },
      fetchPolicy: "network-only",
    });

    const validatedOutput = getDietaryTypesOutputSchema.parse(response);
    getDietaryTypesApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });
    return validatedOutput;
  } catch (err) {
    getDietaryTypesApiOutputModel.update({ loading: false });
    throw err;
  }
}
