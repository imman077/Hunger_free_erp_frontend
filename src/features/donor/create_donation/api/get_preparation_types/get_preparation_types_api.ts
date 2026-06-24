import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import {
  getPreparationTypesInputSchema,
} from "./get_preparation_types_input_model";
import type {
  GetPreparationTypesInput,
} from "./get_preparation_types_input_model";
import { getPreparationTypesOutputSchema } from "./get_preparation_types_output_model";
import { getPreparationTypesApiOutputModel } from "./get_preparation_types_store";

export const GET_PREPARATION_TYPES_QUERY = gql`
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

export async function getPreparationTypesApi(
  input: GetPreparationTypesInput
): Promise<any> {
  try {
    const validatedInput = getPreparationTypesInputSchema.parse(input);
    getPreparationTypesApiOutputModel.update({ loading: true });

    const response = await client.query({
      query: GET_PREPARATION_TYPES_QUERY,
      variables: { key: validatedInput.key },
      fetchPolicy: "network-only",
    });

    const validatedOutput = getPreparationTypesOutputSchema.parse(response);
    getPreparationTypesApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });
    return validatedOutput;
  } catch (err) {
    getPreparationTypesApiOutputModel.update({ loading: false });
    throw err;
  }
}
