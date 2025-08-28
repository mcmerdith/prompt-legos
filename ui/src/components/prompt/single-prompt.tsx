import { Plus } from "lucide-react";
import React from "react";

import {
  PromptSectionEditor,
  PromptSectionViewer,
} from "@/components/prompt/prompt-section";
import { getLabel, SinglePrompt } from "@/lib/prompt";
import { toast } from "@/lib/toast";
import type { Editor } from "@/lib/use-prompt-editor";

function Wrapper({ id, children }: { id: string; children?: React.ReactNode }) {
  return (
    <div className="pl:flex pl:flex-col pl:items-start pl:justify-start pl:gap-1">
      <h3>{getLabel(id)}</h3>
      <div className="pl:flex pl:flex-row pl:flex-wrap pl:items-stretch pl:justify-start pl:gap-2 pl:pl-1">
        {children}
      </div>
    </div>
  );
}

export function SinglePromptViewer({
  singlePrompt,
}: {
  singlePrompt: SinglePrompt;
}) {
  return (
    <Wrapper id={singlePrompt.id}>
      {singlePrompt.sections.map((section) => (
        <PromptSectionViewer key={section.id} section={section} />
      ))}
    </Wrapper>
  );
}

export function SinglePromptEditor({
  singlePrompt,
  editor,
}: {
  singlePrompt: SinglePrompt;
  editor: Editor;
}) {
  const path = { promptId: singlePrompt.id };
  return (
    <Wrapper id={singlePrompt.id}>
      {singlePrompt.sections.map((section, sectionIndex) => (
        <PromptSectionEditor
          key={section.id}
          section={section}
          editor={editor}
          path={{
            parent: path,
            index: sectionIndex,
          }}
        />
      ))}
      <button
        onClick={() => {
          const name = prompt("New section name");
          editor
            .create(path, undefined, name?.replace(/\s/g, "-"))
            .catch((e) => toast.error("Failed to create section", e));
        }}
        className="pl:flex pl:flex-row pl:items-center pl:justify-start pl:gap-1"
      >
        <Plus className="pl:size-6" />
        <span className="pl:text-sm">Add Section</span>
      </button>
    </Wrapper>
  );
}
