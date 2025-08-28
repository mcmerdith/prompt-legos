import { DraggablePromptComponent } from "@/components/prompt-dnd";
import { VerticalSeparator } from "@/components/separator";
import { PromptItem } from "@/lib/prompt";
import { deepSearch, GroupPath } from "@/lib/prompt-search";
import { useUnifiedInputContext } from "@/lib/use-editor-context";
import type { Editor } from "@/lib/use-prompt-editor";
import { cn } from "@/lib/utils";

import { PromptComponentPathProps } from "./component-props";

const promptItemStyles = cn(
  "pl:flex pl:flex-row pl:items-center pl:gap-1 pl:rounded-md pl:border pl:border-primary/80 pl:bg-primary/60 pl:px-1 pl:text-xs",
);

export function PromptItemViewer({ item }: { item: PromptItem }) {
  return (
    <div className={promptItemStyles}>
      <p>
        {item.value.trim() === "" ? (
          <span className={"text-muted italic"}>no value</span>
        ) : (
          item.value
        )}
      </p>
      <VerticalSeparator
        className={"pl:flex-none pl:basis-0.5 pl:bg-primary/80"}
      />
      <p className={"pl:flex pl:flex-row pl:items-center pl:text-2xs"}>
        {item.weight}
      </p>
    </div>
  );
}

export function PromptItemEditor({
  item,
  editor,
  path: { parent, index },
}: {
  item: PromptItem;
  editor: Editor;
  path: PromptComponentPathProps<GroupPath>;
}) {
  const { keydownHandler, valueInputsRef, weightInputsRef, autofocusInputId } =
    useUnifiedInputContext();
  const path = {
    ...parent,
    itemId: item.id,
  };
  return (
    <DraggablePromptComponent
      data={{
        type: "prompt-item",
        id: item.id,
        parent: parent,
        index: index,
      }}
      slotClassName={"pl:rounded-md"}
      handleClassName={"pl:size-3"}
      className={promptItemStyles}
      handle
    >
      <input
        autoFocus={autofocusInputId === item.id}
        className="pl:field-sizing-content pl:px-0.5 pl:outline-offset-2 pl:selection:bg-background pl:selection:text-foreground"
        value={item.value}
        placeholder={"new value"}
        onKeyDown={(event) => keydownHandler(event, index)}
        onChange={(event) => {
          editor.rawUpdate((p) => {
            deepSearch(p, path)!.value = event.target.value;
          });
        }}
        key={item.id}
        ref={(el) => {
          valueInputsRef[item.id] = el;
        }}
      />
      <VerticalSeparator
        className={"pl:flex-none pl:basis-0.5 pl:bg-primary/80"}
      />
      <input
        className={
          "pl:slick-number-input pl:field-sizing-content pl:px-0.5 pl:text-2xs pl:outline-offset-2 pl:selection:bg-background pl:selection:text-foreground"
        }
        type={"number"}
        value={item.weight}
        tabIndex={-1}
        onKeyDown={(event) => keydownHandler(event, index, true)}
        onChange={(event) => {
          editor.rawUpdate((p) => {
            deepSearch(p, path)!.weight = parseFloat(event.target.value);
          });
        }}
        onFocus={(event) => event.currentTarget.select()}
        ref={(el) => {
          weightInputsRef[item.id] = el;
        }}
      />
    </DraggablePromptComponent>
  );
}
