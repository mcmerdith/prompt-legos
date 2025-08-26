import { Plus, Trash } from "lucide-react";

import { DraggablePromptComponent } from "@/components/prompt-dnd";
import {
  PromptGroupEditor,
  PromptGroupViewer,
} from "@/components/prompt/prompt-group";
import { getLabel, PromptSection } from "@/lib/prompt";
import { PromptPath } from "@/lib/prompt-search";
import { error } from "@/lib/toast";
import type { Editor } from "@/lib/use-prompt-editor";
import { cn } from "@/lib/utils";

import { PromptComponentPathProps } from "./component-props";

const promptSectionStyles = cn(
  "pl:flex pl:min-h-14 pl:flex-row pl:flex-wrap pl:items-center pl:justify-start pl:gap-1 pl:rounded-sm pl:border pl:border-secondary/80 pl:bg-secondary/60 pl:p-2 pl:text-secondary-foreground",
);

export function PromptSectionViewer({ section }: { section: PromptSection }) {
  return (
    <div className={promptSectionStyles}>
      {section.groups.map((group) => (
        <PromptGroupViewer key={group.id} group={group} />
      ))}
    </div>
  );
}

export function PromptSectionEditor({
  section,
  editor,
  path: { parent, index },
}: {
  section: PromptSection;
  editor: Editor;
  path: PromptComponentPathProps<PromptPath>;
}) {
  const path = { ...parent, sectionId: section.id };
  return (
    <div className="pl:flex pl:flex-col pl:items-start pl:justify-start pl:gap-1">
      <p className="pl:text-xs pl:text-muted-foreground">
        {getLabel(section.id)}
      </p>
      <DraggablePromptComponent
        slotClassName={"pl:rounded-sm"}
        className={promptSectionStyles}
        data={{
          type: "prompt-section",
          id: section.id,
          parent: parent,
          index: index,
        }}
      >
        {section.groups.map((group, groupIndex) => (
          <PromptGroupEditor
            key={group.id}
            group={group}
            editor={editor}
            path={{
              parent: path,
              index: groupIndex,
            }}
          />
        ))}
        <button
          onClick={() => {
            editor
              .create(path)
              .catch((e) => error("Failed to create group", e));
          }}
        >
          <Plus className="pl:size-4" />
        </button>
        <button
          onClick={() => {
            editor
              .delete(parent, index)
              .catch((e) => error("Failed to delete group", e));
          }}
        >
          <Trash className="pl:size-4" />
        </button>
      </DraggablePromptComponent>
    </div>
  );
}
