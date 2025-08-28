import { z } from "zod/v4";

import { uuid } from "./utils";

export const WithId = z.object({
  id: z
    .uuid()
    .or(z.string())
    .default(() => uuid()),
});

export const PromptItem = WithId.extend({
  value: z.string(),
  weight: z.number(),
});
export type PromptItem = z.infer<typeof PromptItem>;

export const PromptGroup = WithId.extend({
  items: PromptItem.array(),
  weight: z.number(),
});
export type PromptGroup = z.infer<typeof PromptGroup>;

export const PromptSection = WithId.extend({
  groups: PromptGroup.array(),
  weight: z.number(),
});
export type PromptSection = z.infer<typeof PromptSection>;

export const SinglePrompt = WithId.extend({
  sections: PromptSection.array(),
});
export type SinglePrompt = z.infer<typeof SinglePrompt>;

export const LegoPrompt = z.object({
  prompts: SinglePrompt.array(),
});
export type LegoPrompt = z.infer<typeof LegoPrompt>;

export type PromptComponent =
  | SinglePrompt
  | PromptSection
  | PromptGroup
  | PromptItem;

export function getLabel(id: string) {
  return id
    .replace(/-/g, " ")
    .replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
    );
}

export function newPromptItem(value?: string, weight?: number): PromptItem {
  return {
    id: uuid(),
    value: value ?? "",
    weight: weight ?? 1,
  };
}

export function newPromptGroup(
  items?: PromptItem[],
  weight?: number,
): PromptGroup {
  return {
    id: uuid(),
    items: items ?? [newPromptItem()],
    weight: weight ?? 1,
  };
}

export function newPromptSection(
  id?: string,
  groups?: PromptGroup[],
  weight?: number,
): PromptSection {
  return {
    id: id ?? uuid(),
    groups: groups ?? [newPromptGroup()],
    weight: weight ?? 1,
  };
}

export function createSinglePrompt(id?: string): SinglePrompt {
  return {
    id: id ?? uuid(),
    sections: [newPromptSection("preamble")],
  };
}
