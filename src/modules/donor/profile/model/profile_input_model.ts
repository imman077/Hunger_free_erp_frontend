import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const profileFormStateSchema = z.object({
  activeTab: z.string().default("identity"),
  isRequestDrawerOpen: z.boolean().default(false),
  requestCategory: z.string().nullable().default(null),
  selectedFields: z.array(z.string()).default([]),
  isSubmitted: z.boolean().default(false),
  requestId: z.string().default(""),
  requestMessage: z.string().default(""),
  isPreviewOpen: z.boolean().default(false),
  selectedFile: z.object({
    url: z.string(),
    name: z.string(),
  }).nullable().default(null),
});

export const profilePersistenceConfig = {
  activeTab: true,
  isRequestDrawerOpen: false,
  requestCategory: false,
  selectedFields: false,
  isSubmitted: false,
  requestId: false,
  requestMessage: false,
  isPreviewOpen: false,
  selectedFile: false,
};

export const profileSchemas = createSchemaBundle(profileFormStateSchema, {
  dataPath: "profileFormState",
  persistenceConfig: profilePersistenceConfig,
});

export type ProfileFormState = z.infer<typeof profileFormStateSchema>;
