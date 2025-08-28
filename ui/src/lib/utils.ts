import type { LGraphNode } from "@comfyorg/comfyui-frontend-types";
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { z } from "zod/v4";

import type { NodeId } from "@/utils/shims";
import { app } from "@/utils/shims";

export { v4 as uuid } from "uuid";

const twMerge = extendTailwindMerge({
  prefix: "pl",
}); // TODO: add the rest of the tailwind config to twMerge

export const MapById = <T extends z.ZodType>(type: T) =>
  z.map(z.uuidv4().or(z.string()), type);
export type MapById<T> = Map<string, T>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getPromptNode(nodeId: NodeId) {
  const node = app.graph.getNodeById(nodeId) as LGraphNode | null; // no idea why this needs to be cast

  if (!node) {
    return null;
  }

  if (node.comfyClass !== "PromptLegosPrompt") {
    console.error("Node is not a PromptLegosPrompt node", node);
    app.extensionManager.toast.add({
      severity: "warn",
      detail: "Invalid node type!",
      life: 5000,
    });
    return null;
  }

  return node;
}

/**
 * Insert an item into an array
 * @param array The array to insert into
 * @param item The item to insert
 * @param index The index to insert at.
 * If not provided the item will be inserted at the end
 * @returns The inserted item for convenience
 */
export function insertItem<T>(array: T[], item: T, index?: number) {
  array.splice(index ?? array.length, 0, item);
  return item;
}

/**
 * Move an element from one array to another
 *
 * Mutates both arrays in place
 * @param source The source array
 * @param sourceIndex The index of the item to move
 * @param target The target array
 * @param targetIndex The index to emplace the moved item
 * @returns If the move was successful
 */
export function moveItem<T>(
  source: T[] | undefined,
  sourceIndex: number,
  target: T[] | undefined,
  targetIndex: number,
) {
  if (!source || !target) return false;
  const element = source.at(sourceIndex);
  if (!element) return false;
  if (source === target) {
    // we may need to alter the target position due to removing the element
    if (sourceIndex === targetIndex) return true;
    source.splice(sourceIndex, 1);
    // we removed an element from the target array
    if (sourceIndex < targetIndex) {
      // if the removed element was before the target, decrease the index by 1
      target.splice(targetIndex - 1, 0, element);
    } else {
      // if the removed element was after the target, do not decrease the index
      target.splice(targetIndex, 0, element);
    }
  } else {
    // separate arrays so proceed without alterations
    source.splice(sourceIndex, 1);
    target.splice(targetIndex, 0, element);
  }
  return true;
}
