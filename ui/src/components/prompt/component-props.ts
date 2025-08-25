import { ItemPath } from "@/lib/prompt-search"

export type PromptComponentPathProps<ParentPath extends Partial<ItemPath>> = {
  parent: ParentPath
  index: number
}
