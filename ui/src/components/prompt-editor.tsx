import React from "react";

import { DndPromptContext } from "@/components/prompt-dnd";
import {
  SinglePromptEditor,
  SinglePromptViewer,
} from "@/components/prompt/single-prompt";
import type { LegoPrompt } from "@/lib/prompt";
import { warn } from "@/lib/toast";
import type { InitializedEditor } from "@/lib/use-prompt-editor";
import { cn } from "@/lib/utils";

function Wrapper({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "pl:flex pl:w-full pl:flex-col pl:items-stretch pl:justify-start pl:gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function LegoPromptViewer({
  prompt,
  className,
}: {
  prompt: LegoPrompt;
  className?: string;
}) {
  return (
    <Wrapper className={className}>
      {prompt.prompts.map((prompt) => (
        <SinglePromptViewer singlePrompt={prompt} key={prompt.id} />
      ))}
    </Wrapper>
  );
}

export default function LegoPromptEditor({
  editor,
  className,
}: {
  editor: InitializedEditor;
  className?: string;
}) {
  return (
    <DndPromptContext editor={editor}>
      <Wrapper className={className}>
        <button
          onClick={() => {
            editor.rawUpdate((state) => {
              state.prompts = [];
            });
            try {
              void editor.node.recreate?.();
            } catch (e) {
              warn(
                "Your ComfyUI version doesn't support automatic recreation!",
                "Use 'Fix node (recreate)'",
              );
            }
          }}
        >
          Reset Prompt
        </button>
        {editor.value.prompts.map((prompt) => (
          <SinglePromptEditor
            editor={editor}
            singlePrompt={prompt}
            key={prompt.id}
          />
        ))}
      </Wrapper>
    </DndPromptContext>
  );
}

// editor.value?.prompts.map((prompt) => (
//   <SinglePromptEditor
//     editor={editor}
//     singlePrompt={prompt}
//     key={prompt.id}
//   />
// ))
