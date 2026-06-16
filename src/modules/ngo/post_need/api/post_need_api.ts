import client from "../../../../global/api/apollo-client";
import { CREATE_NEED } from "./needs/needs_graphql";

export const createNeedApi = async (input: any) => {
  const response = await client.mutate({
    mutation: CREATE_NEED,
    variables: { input },
  });
  return response.data;
};
