import {
  PromptGroupEditor,
  PromptGroupViewer,
} from "@/components/prompt/prompt-group";
import { getLabel, PromptSection } from "@/lib/prompt";
import { PromptPath } from "@/lib/prompt-search";
import { error } from "@/lib/toast";
import type { Editor } from "@/lib/use-prompt-editor";
import { Plus, Trash } from "lucide-react";
import React from "react";

import { PromptComponentPathProps } from "./component-props";

function Wrapper({ id, children }: { id: string; children?: React.ReactNode }) {
  return (
    <div className="pl:flex pl:flex-col pl:items-start pl:justify-start pl:gap-1">
      <p className="pl:text-xs pl:text-muted-foreground">{getLabel(id)}</p>
      <div className="pl:flex pl:flex-row pl:flex-wrap pl:items-center pl:justify-start pl:gap-1 pl:rounded-sm pl:border pl:border-secondary/80 pl:bg-secondary/60 pl:p-2 pl:text-secondary-foreground">
        {children}
      </div>
    </div>
  );
}

export function PromptSectionViewer({ section }: { section: PromptSection }) {
  return (
    <Wrapper id={section.id}>
      {section.groups.map((group) => (
        <PromptGroupViewer key={group.id} group={group} />
      ))}
    </Wrapper>
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
    <Wrapper id={section.id}>
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
          editor.create(path).catch((e) => error("Failed to create group", e));
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
    </Wrapper>
  );
}
