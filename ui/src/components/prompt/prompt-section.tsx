import { Plus, Trash } from "lucide-react";

import { Button } from "@/components/button";
import {
  DraggablePromptComponent,
  DroppablePromptSlot,
} from "@/components/prompt-dnd";
import {
  PromptGroupEditor,
  PromptGroupViewer,
} from "@/components/prompt/prompt-group";
import { getLabel, PromptSection } from "@/lib/prompt";
import { PromptPath } from "@/lib/prompt-search";
import { toast } from "@/lib/toast";
import type { Editor } from "@/lib/use-prompt-editor";
import { cn } from "@/lib/utils";

import { PromptComponentPathProps } from "./component-props";

const promptSectionStyles = cn(
  "pl:flex pl:min-h-12 pl:flex-row pl:flex-wrap pl:items-center pl:justify-start pl:gap-1 pl:rounded-sm pl:border pl:border-secondary/80 pl:bg-secondary/60 pl:p-1 pl:text-secondary-foreground",
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
    <DraggablePromptComponent
      data={{
        type: "prompt-section",
        id: section.id,
        parent: parent,
        index: index,
      }}
      slotClassName={"pl:rounded-sm"}
      handleClassName={"pl:size-3"}
      className={promptSectionStyles}
      handle
    >
      <p className="pl:basis-full pl:text-xs pl:text-muted-foreground">
        {getLabel(section.id)}
      </p>
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
      <DroppablePromptSlot
        data={{
          type: "prompt-group",
          id: "new-group",
          parent: path,
          index: section.groups.length,
        }}
      >
        <Button
          variant={"transparent"}
          iconStart={<Plus className="pl:size-4" />}
          onClick={() => {
            editor
              .create(path)
              .catch((e) => toast.error("Failed to create group", e));
          }}
        />
      </DroppablePromptSlot>
      <Button
        variant={"transparent"}
        iconStart={<Trash className="pl:size-4" />}
        onClick={() => {
          editor
            .delete(parent, index)
            .catch((e) => toast.error("Failed to delete group", e));
        }}
      />
    </DraggablePromptComponent>
  );
}
