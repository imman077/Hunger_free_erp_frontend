import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { z } from "zod";

/**
 * Creates a schema bundle.
 */
export function createSchemaBundle<S extends z.ZodTypeAny>(
  schema: S,
  options: { dataPath: string; persistenceConfig: Record<string, boolean> }
) {
  return {
    model: schema,
    persistence: options.persistenceConfig,
    dataPath: options.dataPath,
  };
}

/**
 * Creates a complete Zustand store wrapped with utility selectors and lifecycle actions.
 */
export function createCompleteStore<S extends z.ZodTypeAny>(
  schema: S,
  options: {
    name: string;
    dataPath: string;
    persistenceConfig?: Record<string, boolean>;
  }
) {
  const { name, dataPath, persistenceConfig } = options;

  // Generate initial state from Zod schema defaults or fallback values
  const getInitialValue = (schemaType: z.ZodTypeAny): any => {
    if (schemaType instanceof z.ZodDefault) {
      return (schemaType._def as any).defaultValue();
    }
    if (schemaType instanceof z.ZodObject) {
      const shape = schemaType.shape;
      const obj: any = {};
      for (const key in shape) {
        obj[key] = getInitialValue(shape[key]);
      }
      return obj;
    }
    if (schemaType instanceof z.ZodArray) {
      return [];
    }
    if (schemaType instanceof z.ZodString) {
      return "";
    }
    if (schemaType instanceof z.ZodBoolean) {
      return false;
    }
    if (schemaType instanceof z.ZodNumber) {
      return 0;
    }
    if (schemaType instanceof z.ZodOptional || schemaType instanceof z.ZodNullable) {
      return null;
    }
    return undefined;
  };

  const initialData = getInitialValue(schema);

  const initialStoreState = {
    [dataPath]: initialData,
  };

  // Create the underlying Zustand store
  const store = create<any>()(
    persist(
      (set) => ({
        ...initialStoreState,
        _update: (updateFnOrState: any) => {
          set((state: any) => {
            const nextState =
              typeof updateFnOrState === "function"
                ? updateFnOrState(state)
                : updateFnOrState;

            // Merge update into state
            if (nextState[dataPath]) {
              return {
                [dataPath]: {
                  ...state[dataPath],
                  ...nextState[dataPath],
                },
              };
            }
            return nextState;
          });
        },
        _reset: () => {
          set({
            [dataPath]: initialData,
          });
        },
      }),
      {
        name: name,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state: any) => {
          if (!persistenceConfig) return state;
          const data = state[dataPath];
          if (!data) return state;
          
          const persistedData: any = {};
          for (const key in data) {
            if (persistenceConfig[key] !== false) {
              persistedData[key] = data[key];
            }
          }
          return {
            [dataPath]: persistedData,
          };
        },
      }
    )
  );

  const model = {
    useStore: store,
    useSelector: (selector: (state: any) => any) => {
      return store(selector);
    },
    update: (newData: any) => {
      if (newData[dataPath]) {
        store.getState()._update(newData);
      } else {
        store.getState()._update({
          [dataPath]: newData,
        });
      }
    },
    reset: () => {
      store.getState()._reset();
    },
  };

  return {
    model,
    formSchema: schema,
  };
}
