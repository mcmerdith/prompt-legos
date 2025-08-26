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

export const {
  Context: EditorContext,
  Provider: EditorContextProvider,
  useContext: useEditorContext,
} = create<InitializedEditor | null>("Editor", null);

export const {
  Context: UnifiedInputContxt,
  Provider: UnifiedInputContextProvider,
  useContext: useUnifiedInputContext,
} = create<ReturnType<typeof useUnifiedInput>>("UnifiedInputContextProvider");

export const {
  Context: PromptIdContext,
  Provider: PromptIdContextProvider,
  useContext: usePromptIdContext,
} = create<string>("PromptId");

export const {
  Context: SectionIdContext,
  Provider: SectionIdContextProvider,
  useContext: useSectionIdContext,
} = create<string>("SectionId");

export const {
  Context: GroupIdContext,
  Provider: GroupIdContextProvider,
  useContext: useGroupIdContext,
} = create<string>("GroupId");

export const {
  Context: ItemIdContext,
  Provider: ItemIdContextProvider,
  useContext: useItemIdContext,
} = create<string>("ItemId");
