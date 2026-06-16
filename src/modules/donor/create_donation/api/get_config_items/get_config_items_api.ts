import { gql } from "@apollo/client";
import client from "../../../../../global/api/apollo-client";
import {
  getConfigItemsInputSchema,
} from "./get_config_items_input_model";
import type {
  GetConfigItemsInput,
} from "./get_config_items_input_model";
import { getConfigItemsOutputSchema } from "./get_config_items_output_model";
import { getConfigItemsApiOutputModel } from "./get_config_items_store";

const GET_CONFIG_ITEMS_QUERY = gql`
  query GetConfigItems($key: String) {
    configItems(key: $key) {
      id
      key
      name
      description
    }
  }
`;

export async function getConfigItemsApi(
  input: GetConfigItemsInput
): Promise<any> {
  try {
    const validatedInput = getConfigItemsInputSchema.parse(input);
    getConfigItemsApiOutputModel.update({ loading: true });

    const response = await client.query({
      query: GET_CONFIG_ITEMS_QUERY,
      variables: { key: validatedInput.key },
      fetchPolicy: "network-only",
    });

    const validatedOutput = getConfigItemsOutputSchema.parse(response);
    getConfigItemsApiOutputModel.update({
      loading: false,
      data: validatedOutput.data,
    });
    return validatedOutput;
  } catch (err) {
    getConfigItemsApiOutputModel.update({ loading: false });
    throw err;
  }
}
