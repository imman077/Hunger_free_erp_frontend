import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const profileDataSchema = z.object({
  isEditing: z.boolean().default(false),
});

export const profilePersistenceConfig = {
  isEditing: false,
};

export const profileSchemas = createSchemaBundle(profileDataSchema, {
  dataPath: "profileState",
  persistenceConfig: profilePersistenceConfig,
});

export type ProfileData = z.infer<typeof profileDataSchema>;
