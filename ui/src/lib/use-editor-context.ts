import { createContext, useContext } from "react";

import { InitializedEditor } from "./use-prompt-editor";
import { useUnifiedInput } from "./use-unified-input";

function create<T>(typeName: string = "", defaultValue?: T) {
  const Context = createContext<T>(defaultValue as unknown as T);
  return {
    Context,
    Provider: Context.Provider,
    useContext: () => {
      const context = useContext(Context);
      if (context === undefined) {
        throw new Error(
          `use${typeName}Context must be used within an initialized ${typeName}ContextProvider`,
        );
      }
      return context;
    },
  };
}

export const { Provider: EditorContextProvider, useContext: useEditorContext } =
  create<InitializedEditor | null>("Editor", null);

export const {
  Provider: UnifiedInputContextProvider,
  useContext: useUnifiedInputContext,
} = create<ReturnType<typeof useUnifiedInput>>("UnifiedInput");
