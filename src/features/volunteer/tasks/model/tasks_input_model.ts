import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const tasksStateSchema = z.object({
  searchQuery: z.string().default(""),
});

export const tasksPersistenceConfig = {
  searchQuery: false,
};

export const tasksSchemas = createSchemaBundle(tasksStateSchema, {
  dataPath: "tasksState",
  persistenceConfig: tasksPersistenceConfig,
});

export type TasksState = z.infer<typeof tasksStateSchema>;
