import { DraggablePromptComponent } from "@/components/prompt-dnd";
import {
  PromptItemEditor,
  PromptItemViewer,
} from "@/components/prompt/prompt-item";
import { PromptGroup } from "@/lib/prompt";
import { SectionPath } from "@/lib/prompt-search";
import { error } from "@/lib/toast";
import { UnifiedInputContextProvider } from "@/lib/use-editor-context";
import type { Editor } from "@/lib/use-prompt-editor";
import { useUnifiedInput } from "@/lib/use-unified-input";
import { cn } from "@/lib/utils";
import { PlusIcon, Trash } from "lucide-react";

import { PromptComponentPathProps } from "./component-props";

const promptGroupStyles = cn(
  "pl:flex pl:flex-row pl:flex-wrap pl:items-center pl:justify-start pl:gap-1 pl:rounded-lg pl:border pl:border-background/60 pl:bg-background/40 pl:p-1",
);

export function PromptGroupViewer({ group }: { group: PromptGroup }) {
  return (
    <div className={promptGroupStyles}>
      {group.items.map((item) => (
        <PromptItemViewer key={item.id} item={item} />
      ))}
    </div>
  );
}

export function PromptGroupEditor({
  group,
  editor,
  path: { parent, index },
}: {
  group: PromptGroup;
  editor: Editor;
  path: PromptComponentPathProps<SectionPath>;
}) {
  const unifiedInput = useUnifiedInput({
    group,
    parent: parent,
  });
  const path = { ...parent, groupId: group.id };
  return (
    <DraggablePromptComponent
      slotClassName={"pl:rounded-lg"}
      className={promptGroupStyles}
      data={{
        type: "prompt-group",
        id: group.id,
        parent: parent,
        index: index,
      }}
    >
      <UnifiedInputContextProvider value={unifiedInput}>
        {group.items.map((item, itemIndex) => (
          <PromptItemEditor
            key={item.id}
            item={item}
            editor={editor}
            path={{
              parent: path,
              index: itemIndex,
            }}
          />
        ))}
      </UnifiedInputContextProvider>
      <button
        onClick={() => {
          unifiedInput.createItem();
        }}
      >
        <PlusIcon className="pl:size-3" />
      </button>
      <button
        onClick={() => {
          editor
            .delete(parent, index)
            .catch((e) => error("Failed to delete group", e));
        }}
        className="pl:px-1"
      >
        <Trash className="pl:size-3" />
      </button>
    </DraggablePromptComponent>
  );
}
