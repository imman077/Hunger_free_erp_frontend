import { z } from "zod";
import { createCompleteStore } from "../../../../core/utility";
import {
  tasksStateSchema,
  tasksPersistenceConfig,
} from "../model/tasks_input_model";

export const tasksStore = createCompleteStore(tasksStateSchema, {
  name: "volunteer_tasks_storage",
  dataPath: "tasksState",
  persistenceConfig: tasksPersistenceConfig,
});

export const {
  model: tasksInputModel,
  formSchema: tasksFormSchema,
} = tasksStore;

export type TasksFormData = z.infer<typeof tasksFormSchema>;
