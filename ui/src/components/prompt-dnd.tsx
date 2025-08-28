import { Draggable } from "@dnd-kit/dom";
import {
  DragDropProvider,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/react";
import { GripVerticalIcon } from "lucide-react";
import React, { ComponentPropsWithoutRef } from "react";
import z from "zod/v4";

import { PromptGroupViewer } from "@/components/prompt/prompt-group";
import { PromptItemViewer } from "@/components/prompt/prompt-item";
import { PromptSectionViewer } from "@/components/prompt/prompt-section";
import { VerticalSeparator } from "@/components/separator";
import {
  deepSearch,
  GroupPath,
  PromptPath,
  SectionPath,
  type ComponentParentPath,
} from "@/lib/prompt-search";
import { toast } from "@/lib/toast";
import { InitializedEditor } from "@/lib/use-prompt-editor";
import { cn } from "@/lib/utils";
import { usePromptStore } from "@/stores/prompt-store";

const DragDropData = z.union([
  z.object({
    type: z.literal("prompt-section"),
    id: z.string(),
    parent: PromptPath,
    index: z.number(),
  }),
  z.object({
    type: z.literal("prompt-group"),
    id: z.string(),
    parent: SectionPath,
    index: z.number(),
  }),
  z.object({
    type: z.literal("prompt-item"),
    id: z.string(),
    parent: GroupPath,
    index: z.number(),
  }),
]);
type DragDropData = z.infer<typeof DragDropData>;

function idString(parent: ComponentParentPath, self?: string) {
  return [
    parent.promptId,
    parent.sectionId,
    parent.groupId,
    parent.itemId,
    self,
  ]
    .filter((c) => !!c)
    .join("/");
}

export function DraggablePromptComponent({
  data,
  handle,
  slotClassName,
  handleClassName,
  className,
  children,
  ...props
}: {
  data: DragDropData;
  handle?: boolean;
  slotClassName?: string;
  handleClassName?: string;
} & ComponentPropsWithoutRef<"div">) {
  const { ref, handleRef, isDragging } = useDraggable({
    id: idString(data.parent, data.id),
    type: data.type,
    data: data,
  });

  return (
    <DroppablePromptSlot className={slotClassName} data={data}>
      <div
        className={cn(className, isDragging ? "opacity-50" : undefined)}
        ref={ref}
        {...props}
      >
        {children}
        {handle && (
          <GripVerticalIcon ref={handleRef} className={handleClassName} />
        )}
      </div>
    </DroppablePromptSlot>
  );
}

export function DroppablePromptSlot({
  data,
  className,
  children,
  ...props
}: {
  data: DragDropData;
} & ComponentPropsWithoutRef<"div">) {
  const { ref, isDropTarget, droppable } = useDroppable({
    id: idString(data.parent, data.id),
    type: `${data.type}-slot`,
    accept: [data.type, `${data.type}-template`],
    data: data,
  });

  const dragOperation = droppable.manager?.dragOperation;
  const selfDrop = dragOperation?.target?.id === dragOperation?.source?.id;

  return (
    <div className={cn("pl:flex pl:flex-row pl:gap-1")}>
      {!selfDrop && isDropTarget && (
        <VerticalSeparator className={"pl:bg-foreground"} />
      )}
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </div>
  );
}

export function DndPromptContext({
  editor,
  children,
}: {
  editor: InitializedEditor;
  children?: React.ReactNode;
}) {
  return (
    <DragDropProvider
      sensors={[PointerSensor, KeyboardSensor]}
      onDragEnd={({ operation, canceled }) => {
        if (canceled) return;
        const { source, target } = operation;
        if (source === null || target === null) return;
        const sourceData = DragDropData.parse(source.data);
        const targetData = DragDropData.parse(target.data);

        if (!editor.value) return;
        if (sourceData.type !== targetData.type) {
          console.warn("cannot drag", sourceData.type, "into", targetData.type);
          return;
        }
        editor
          .move(
            sourceData.parent,
            sourceData.index,
            targetData.parent,
            targetData.index,
          )
          .catch((e) => toast.error("Failed to move component", e));
      }}
    >
      {children}
      <DragOverlay>
        {(source) => <PromptComponentPreview element={source} />}
      </DragOverlay>
    </DragDropProvider>
  );
}

function PromptComponentPreview({ element }: { element: Draggable }) {
  const { activeNode, values } = usePromptStore();

  if (!activeNode) return null;

  const { type, id, parent } = DragDropData.parse(element.data);
  const lp = values[activeNode];

  if (!lp) return null;

  if (type === "prompt-section") {
    const section = deepSearch(lp, {
      ...parent,
      sectionId: id,
    });
    if (!section) return null;
    return <PromptSectionViewer section={section} />;
  } else if (type === "prompt-group") {
    const group = deepSearch(lp, {
      ...parent,
      groupId: id,
    });
    if (!group) return null;
    return <PromptGroupViewer group={group} />;
  } else if (type === "prompt-item") {
    const item = deepSearch(lp, {
      ...parent,
      itemId: id,
    });
    if (!item) return null;
    return <PromptItemViewer item={item} />;
  } else {
    return <p>Non-previewable</p>;
  }
}
