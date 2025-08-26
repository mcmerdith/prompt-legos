import z from "zod/v4";

import {
  LegoPrompt,
  PromptGroup,
  PromptItem,
  SinglePrompt,
  type PromptSection,
} from "@/lib/prompt";

export const PromptPath = z.object({
  promptId: z.string(),
  sectionId: z.undefined().optional(),
  groupId: z.undefined().optional(),
  itemId: z.undefined().optional(),
});
export type PromptPath = z.infer<typeof PromptPath>;

export const SectionPath = PromptPath.extend({
  sectionId: z.string(),
  groupId: z.undefined().optional(),
  itemId: z.undefined().optional(),
});
export type SectionPath = z.infer<typeof SectionPath>;

export const GroupPath = SectionPath.extend({
  groupId: z.string(),
  itemId: z.undefined().optional(),
});
export type GroupPath = z.infer<typeof GroupPath>;

export const ItemPath = GroupPath.extend({
  itemId: z.string(),
});
export type ItemPath = z.infer<typeof ItemPath>;

export type ComponentPath = PromptPath | SectionPath | GroupPath | ItemPath;
export type ComponentParentPath = PromptPath | SectionPath | GroupPath;

export function isPromptPath(path: ComponentPath): path is PromptPath {
  return (
    path.promptId !== undefined &&
    path.groupId === undefined &&
    path.sectionId === undefined &&
    path.itemId === undefined
  );
}
export function isSectionPath(path: ComponentPath): path is SectionPath {
  return (
    path.promptId !== undefined &&
    path.sectionId !== undefined &&
    path.groupId === undefined &&
    path.itemId === undefined
  );
}
export function isGroupPath(path: ComponentPath): path is GroupPath {
  return (
    path.promptId !== undefined &&
    path.sectionId !== undefined &&
    path.groupId !== undefined &&
    path.itemId === undefined
  );
}
export function isItemPath(path: ComponentPath): path is ItemPath {
  return (
    path.promptId !== undefined &&
    path.sectionId !== undefined &&
    path.groupId !== undefined &&
    path.itemId !== undefined
  );
}
export function isPathTypeEqual(
  path: ComponentPath,
  other: ComponentPath,
): other is typeof path {
  return (
    typeof path.promptId === typeof other.promptId &&
    typeof path.sectionId === typeof other.sectionId &&
    typeof path.groupId === typeof other.groupId &&
    typeof path.itemId === typeof other.itemId
  );
}
export function isPathEqual(path1: ComponentPath, path2: ComponentPath) {
  return (
    path1.promptId === path2.promptId &&
    path1.sectionId === path2.sectionId &&
    path1.groupId === path2.groupId &&
    path1.itemId === path2.itemId
  );
}

/**
 * An absolutely diabolical type definition to
 * map paths to the component they represent
 */
export type ComponentFromPath<T extends ComponentPath> = T extends ItemPath
  ? PromptItem
  : T extends GroupPath
    ? PromptGroup
    : T extends SectionPath
      ? PromptSection
      : T extends PromptPath
        ? SinglePrompt
        : never;

/**
 * An absolutely diabolical type definition to
 * map paths to the child component they contain
 */
export type ComponentChildFromPath<T extends ComponentParentPath> =
  T extends GroupPath
    ? PromptItem
    : T extends SectionPath
      ? PromptGroup
      : T extends PromptPath
        ? PromptSection
        : never;

/**
 * Find the component at a path within a prompt
 */
export function deepSearch<
  Path extends ComponentPath,
  Result extends ComponentFromPath<Path> = ComponentFromPath<Path>,
>(legoPrompt: LegoPrompt, path: Path): Result | undefined {
  const { promptId, sectionId, groupId, itemId } = path;

  const prompt = legoPrompt.prompts.find((p) => p.id === promptId);
  if (!prompt) return undefined;
  if (!sectionId) return prompt as Result;

  const section = prompt.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  if (!groupId) return section as Result;

  const group = section.groups.find((g) => g.id === groupId);
  if (!group) return undefined;
  if (!itemId) return group as Result;

  const item = group.items.find((i) => i.id === itemId);
  if (!item) return undefined;
  return item as Result;
}

/**
 * Find 2 similar components by their path. They must be of the same component type
 * @param lp The LegoPrompt object
 * @param sourcePath The path of the first component
 * @param targetPath The path of the second component
 * @returns A tuple of the 2 parents.
 * If the path is equal they are a reference to the same element.
 * Will return undefined if either component is not found
 * @deprecated Is this even necessary?
 */
export function deepSearchPair<
  Path extends ComponentPath,
  Component extends ComponentFromPath<Path> = ComponentFromPath<Path>,
>(
  lp: LegoPrompt,
  sourcePath: Path,
  targetPath: Path,
): [Component, Component] | [undefined, undefined] {
  const source = deepSearch<Path>(lp, sourcePath);
  if (!source) return [undefined, undefined];
  if (isPathEqual(sourcePath, targetPath))
    return [source as Component, source as Component];
  const target = deepSearch<Path>(lp, targetPath);
  if (!target) return [undefined, undefined];
  return [source as Component, target as Component];
}
