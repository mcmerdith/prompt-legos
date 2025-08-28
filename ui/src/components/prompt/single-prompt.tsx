import { Plus } from "lucide-react";
import React from "react";

import { Button } from "@/components/button";
import {
  PromptSectionEditor,
  PromptSectionViewer,
} from "@/components/prompt/prompt-section";
import { getLabel, SinglePrompt } from "@/lib/prompt";
import { toast } from "@/lib/toast";
import type { Editor } from "@/lib/use-prompt-editor";
import { app } from "@/utils/shims";

import { DroppablePromptSlot } from "../prompt-dnd";

function Wrapper({ id, children }: { id: string; children?: React.ReactNode }) {
  return (
    <div className="pl:flex pl:flex-col pl:items-start pl:justify-start pl:gap-1">
      <h3>{getLabel(id)}</h3>
      <div className="pl:flex pl:flex-row pl:flex-wrap pl:items-stretch pl:justify-start pl:gap-1 pl:pl-1">
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
      <DroppablePromptSlot
        data={{
          type: "prompt-section",
          id: "new-section",
          parent: path,
          index: singlePrompt.sections.length,
        }}
      >
        <Button
          variant={"transparent"}
          className="pl:flex pl:flex-row pl:items-center pl:justify-start pl:gap-1 pl:text-sm"
          iconStart={<Plus className="pl:size-4" />}
          onClick={() => {
            app.extensionManager.dialog
              .prompt({
                title: "New section",
                message: "Enter section name",
              })
              .then((name) => {
                if (!name) return;
                editor
                  .create(path, undefined, name?.replace(/\s/g, "-"))
                  .catch((e) => toast.error("Failed to create section", e));
              })
              .catch((e) => {
                toast.error("Failed to create section", e);
              });
          }}
        >
          Add Section
        </Button>
      </DroppablePromptSlot>
    </Wrapper>
  );
}
