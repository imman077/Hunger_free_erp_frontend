import axios from "axios";
import { LoginInputSchema } from "./auth.input";
import type { LoginInput } from "./auth.input";
import { LoginResponseSchema } from "./auth.output";
import type { LoginResponse } from "./auth.output";

const GRAPHQL_ENDPOINT = "http://localhost:4000/";

export const AuthAPI = {
  /**
   * Logs in a user using the GraphQL backend
   */
  login: async (input: LoginInput): Promise<LoginResponse> => {
    // Validate input parameters using Zod
    const validatedInput = LoginInputSchema.parse(input);

    const query = `
      mutation Login($email: String!, $password: String!, $role: String!) {
        login(input: { email: $email, password: $password, role: $role }) {
          token
          user {
            id
            username
            email
            role
            phone
            donorProfile {
              businessName
            }
            ngoProfile {
              name
            }
          }
        }
      }
    `;

    const response = await axios.post(GRAPHQL_ENDPOINT, {
      query,
      variables: {
        email: validatedInput.email,
        password: validatedInput.password,
        role: validatedInput.role.toUpperCase(),
      },
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    const data = response.data.data.login;
    // Validate output payload using Zod
    return LoginResponseSchema.parse(data);
  },
};
