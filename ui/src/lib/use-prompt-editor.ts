import type { LGraphNode } from "@comfyorg/comfyui-frontend-types";
import { WritableDraft } from "immer";

import {
  LegoPrompt,
  newPromptGroup,
  newPromptItem,
  newPromptSection,
} from "@/lib/prompt";
import {
  ComponentChildFromPath,
  deepSearch,
  deepSearchPair,
  GroupPath,
  isPromptPath,
  isSectionPath,
  type ComponentParentPath,
  type ComponentPath,
} from "@/lib/prompt-search";
import { getPromptNode, insertItem, moveItem } from "@/lib/utils";
import { usePromptStore } from "@/stores/prompt-store";
import type { NodeId } from "@/utils/shims";

import { fatal, toast } from "./toast";

export type Editor = {
  editorName: string;
  node: LGraphNode;
  create: <Path extends ComponentParentPath>(
    parentPath: Path,
    index?: number,
    id?: string,
  ) => Promise<ComponentChildFromPath<Path>>;
  delete: <Path extends ComponentParentPath>(
    parentPath: Path,
    index: number,
  ) => Promise<void>;
  move: <Path extends ComponentParentPath>(
    sourceParentPath: Path,
    sourceChildIndex: number,
    targetParentPath: Path,
    targetChildIndex: number,
  ) => Promise<void>;
  rawUpdate: (update: (prompts: WritableDraft<LegoPrompt>) => void) => void;
  value: LegoPrompt | undefined;
};

export type InitializedEditor = Editor & {
  value: LegoPrompt;
};

export function isInitializedEditor(
  editor: Editor,
): editor is InitializedEditor {
  return editor.value !== undefined;
}

function isGroupPath(a: ComponentPath): a is GroupPath {
  return a.groupId !== undefined;
}

export function usePromptEditor(nodeId: NodeId): Editor | InitializedEditor {
  const store = usePromptStore((state) => state.values[nodeId]);
  const updateValue = usePromptStore((state) => state.update);

  const node = getPromptNode(nodeId);

  if (!node) {
    throw new Error("Prompt node not found", {
      cause: `Node ID ${nodeId} is not found, or is not a prompt node`,
    });
  }

  return {
    editorName: node.title,
    node: node,
    value: store,
    create(parentPath, index, id) {
      /**
       * This method is responsible for the hell of creating new components
       * deep within the 5 layers of array nesting. "unknown as any" FTW
       */
      return new Promise((resolve, reject) => {
        updateValue(node.id, (lp) => {
          if (isPromptPath(parentPath)) {
            const prompt = deepSearch(lp, parentPath);
            if (prompt) {
              resolve(
                insertItem(
                  prompt.sections,
                  newPromptSection(id),
                  index,
                ) as unknown as any,
              );
            } else {
              reject("Prompt not found");
            }
            return;
          } else if (isSectionPath(parentPath)) {
            const section = deepSearch(lp, parentPath);
            if (section) {
              resolve(
                insertItem(
                  section.groups,
                  newPromptGroup(),
                  index,
                ) as unknown as any,
              );
            } else {
              reject("Section not found");
            }
            return;
          } else if (isGroupPath(parentPath)) {
            const group = deepSearch(lp, parentPath);
            if (group) {
              resolve(
                insertItem(
                  group.items,
                  newPromptItem(),
                  index,
                ) as unknown as any,
              );
            } else {
              reject("Group not found");
            }
            return;
          } else {
            reject("Invalid path!");
            return;
          }
        });
      });
    },
    delete(parentPath, index) {
      return new Promise((resolve, reject) => {
        updateValue(node.id, (lp) => {
          if (isPromptPath(parentPath)) {
            const prompt = deepSearch(lp, parentPath);
            if (prompt) {
              prompt.sections.splice(index, 1);
              resolve();
            } else {
              reject("Prompt not found");
            }
            return;
          } else if (isSectionPath(parentPath)) {
            const section = deepSearch(lp, parentPath);
            if (section) {
              section.groups.splice(index, 1);
              resolve();
            } else {
              reject("Section not found");
            }
            return;
          } else if (isGroupPath(parentPath)) {
            const group = deepSearch(lp, parentPath);
            if (group) {
              group.items.splice(index, 1);
              resolve();
            } else {
              reject("Group not found");
            }
            return;
          } else {
            reject("Invalid path!");
            return;
          }
        });
      });
    },
    move(sourcePath, sourceIndex, targetPath, targetIndex) {
      /**
       * This method is responsible for the even worse hell of moving components
       * deep within the 5 layers of array nesting. By far the worst method
       */
      return new Promise((resolve, reject) => {
        updateValue(node.id, (lp) => {
          if (isPromptPath(sourcePath) || isPromptPath(targetPath)) {
            if (!isPromptPath(sourcePath) || !isPromptPath(targetPath))
              fatal(
                "Illegal move",
                "Item types were not equal: expected both to be single prompts",
              );
            const [source, target] = deepSearchPair(lp, sourcePath, targetPath);
            if (source && target) {
              moveItem(
                source.sections,
                sourceIndex,
                target.sections,
                targetIndex,
              );
              resolve();
            } else {
              reject("Prompt not found");
            }
            return;
          } else if (isSectionPath(sourcePath) || isSectionPath(targetPath)) {
            if (!isSectionPath(sourcePath) || !isSectionPath(targetPath))
              fatal(
                "Illegal move",
                "Item types were not equal: expected both to be sections",
              );
            const [source, target] = deepSearchPair(lp, sourcePath, targetPath);
            if (source && target) {
              moveItem(source.groups, sourceIndex, target.groups, targetIndex);
              resolve();
            } else {
              reject("Section not found");
            }
            return;
          } else if (isGroupPath(sourcePath) || isGroupPath(targetPath)) {
            if (!isGroupPath(sourcePath) || !isGroupPath(targetPath))
              fatal(
                "Illegal move",
                "Item types were not equal: expected both to be groups",
              );
            const [source, target] = deepSearchPair(lp, sourcePath, targetPath);
            if (source && target) {
              moveItem(source.items, sourceIndex, target.items, targetIndex);
              resolve();
            } else {
              reject("Group not found");
            }
            return;
          } else {
            reject("Invalid path!");
            return;
          }
        });
      });
    },
    rawUpdate(update) {
      updateValue(node.id, update);
    },
  };
}
