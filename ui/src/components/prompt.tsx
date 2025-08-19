import { VerticalSeparator } from "@/components/separator"
import {
  getLabel,
  newPromptGroup,
  newPromptSection,
  PromptGroup,
  type PromptItem,
  PromptSection,
  SinglePrompt
} from "@/lib/prompt"
import { deepSearch } from "@/lib/prompt-search"
import { warn } from "@/lib/toast"
import {
  EditorContextProvider,
  GroupIdContextProvider,
  PromptIdContextProvider,
  SectionIdContextProvider,
  UnifiedInputContextProvider,
  useEditorContext,
  useGroupIdContext,
  usePromptIdContext,
  useSectionIdContext,
  useUnifiedInputContext
} from "@/lib/use-editor-context"
import { InitializedEditor } from "@/lib/use-prompt-editor"
import { useUnifiedInput } from "@/lib/use-unified-input"
import { cn } from "@/lib/utils"
import { Plus, Trash } from "lucide-react"
import React from "react"

const LegoPromptEditor = React.forwardRef<
  HTMLDivElement,
  {
    editor: InitializedEditor
    edit?: boolean
  } & React.HTMLAttributes<HTMLDivElement>
>(({ editor, edit = false, className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "pl:flex pl:w-full pl:flex-col pl:items-stretch pl:justify-start pl:gap-4",
        className
      )}
      ref={ref}
      {...props}
    >
      <button
        onClick={() => {
          editor.update((state) => {
            state.prompts = []
          })
          try {
            editor.node.recreate()
          } catch (e) {
            warn(
              "Your ComfyUI version doesn't support automatic recreation!",
              "Use 'Fix node (recreate)'"
            )
          }
        }}
      >
        Reset Prompt
      </button>
      <EditorContextProvider
        value={{
          editor: editor,
          edit: edit
        }}
      >
        {/* Single Prompts */}
        {editor.value.prompts.map((prompt) => (
          <SinglePromptEditor prompt={prompt} key={prompt.id} />
        ))}
      </EditorContextProvider>
    </div>
  )
})
export default LegoPromptEditor

function SinglePromptEditor({
  prompt: { id, sections }
}: {
  prompt: SinglePrompt
}) {
  const { editor, edit } = useEditorContext()
  return (
    <div className="pl:flex pl:flex-col pl:items-start pl:justify-start pl:gap-1">
      <PromptIdContextProvider value={id}>
        <h3>{getLabel(id)}</h3>
        <div className="pl:flex pl:flex-row pl:flex-wrap pl:items-stretch pl:justify-start pl:gap-2 pl:pl-1">
          {sections.map((section, sectionIndex) => (
            <PromptSectionEditor
              key={section.id}
              section={section}
              index={sectionIndex}
            />
          ))}
        </div>
        {edit && (
          <button
            onClick={() => {
              const name = prompt("New section name")
              editor.update((prompts) => {
                deepSearch(prompts, {
                  promptId: id
                }).sections.push(
                  newPromptSection(name?.replace(/\s/g, "-")?.toLowerCase())
                )
              })
            }}
            className="pl:flex pl:flex-row pl:items-center pl:justify-start pl:gap-1"
          >
            <Plus className="pl:size-6" />
            <span className="pl:text-sm">Add Section</span>
          </button>
        )}
      </PromptIdContextProvider>
    </div>
  )
}

function PromptSectionEditor({
  section: { id, groups },
  index
}: {
  section: PromptSection
  index: number
}) {
  const { editor, edit } = useEditorContext()
  const promptId = usePromptIdContext()

  return (
    <SectionIdContextProvider value={id}>
      <div className="pl:flex pl:flex-col pl:items-start pl:justify-start pl:gap-1">
        <p className="pl:text-xs pl:text-muted-foreground">{getLabel(id)}</p>
        <div className="pl:flex pl:flex-row pl:flex-wrap pl:items-center pl:justify-start pl:gap-1 pl:rounded-sm pl:border pl:border-secondary/80 pl:bg-secondary/60 pl:p-2 pl:text-secondary-foreground">
          {groups.map((group, groupIndex) => (
            <PromptGroupEditor
              key={group.id}
              group={group}
              index={groupIndex}
            />
          ))}
          {edit && (
            <button
              onClick={() => {
                editor.update((prompts) => {
                  deepSearch(prompts, {
                    promptId,
                    sectionId: id
                  }).groups.push(newPromptGroup())
                })
              }}
            >
              <Plus className="pl:size-4" />
            </button>
          )}
          {edit && (
            <button
              onClick={() => {
                editor.update((prompts) => {
                  deepSearch(prompts, {
                    promptId
                  }).sections.splice(index, 1)
                })
              }}
            >
              <Trash className="pl:size-4" />
            </button>
          )}
        </div>
      </div>
    </SectionIdContextProvider>
  )
}

function PromptGroupEditor({
  group,
  index
}: {
  group: PromptGroup
  index: number
}) {
  const { editor, edit } = useEditorContext()
  const promptId = usePromptIdContext()
  const sectionId = useSectionIdContext()
  const { id, items } = group

  const unifiedInput = useUnifiedInput({
    group
  })

  return (
    <GroupIdContextProvider value={id}>
      <UnifiedInputContextProvider value={unifiedInput}>
        <div className="pl:flex pl:flex-row pl:flex-wrap pl:items-center pl:justify-start pl:gap-1 pl:rounded-lg pl:border pl:border-background/60 pl:bg-background/40 pl:p-1">
          {/* Prompt Items */}
          {items.map((item, itemIndex) => (
            <PromptItemEditor key={item.id} item={item} index={itemIndex} />
          ))}
          {edit && (
            <button
              onClick={() => {
                editor.update((prompt) => {
                  deepSearch(prompt, {
                    promptId,
                    sectionId
                  }).groups.splice(index, 1)
                })
              }}
              className="pl:px-1"
            >
              <Trash className="pl:size-3" />
            </button>
          )}
        </div>
      </UnifiedInputContextProvider>
    </GroupIdContextProvider>
  )
}

function PromptItemEditor({
  item,
  index
}: {
  item: PromptItem
  index: number
}) {
  const { editor, edit } = useEditorContext()
  const promptId = usePromptIdContext()
  const sectionId = useSectionIdContext()
  const groupId = useGroupIdContext()

  const { keydownHandler, inputsRef, autofocusInputId } =
    useUnifiedInputContext()

  return (
    <div
      className={
        "pl:flex pl:flex-row pl:gap-1 pl:rounded-md pl:border pl:border-primary/80 pl:bg-primary/60 pl:px-1 pl:text-xs"
      }
    >
      {edit ? (
        <input
          autoFocus={autofocusInputId === item.id}
          className="pl:field-sizing-content"
          value={item.value}
          placeholder={"new value"}
          onKeyDown={(e) => keydownHandler(e, index)}
          onChange={(event) => {
            editor.update((p) => {
              deepSearch(p, {
                promptId,
                sectionId,
                groupId: groupId,
                itemId: item.id
              }).value = event.target.value
            })
          }}
          key={item.id}
          ref={(el) => (inputsRef[item.id] = el)}
        />
      ) : (
        <p>
          {item.value.trim() === "" ? (
            <span className={"text-muted italic"}>no value</span>
          ) : (
            item.value
          )}
        </p>
      )}
      <VerticalSeparator
        className={"pl:flex-none pl:basis-0.5 pl:bg-primary/80"}
      />
      <p className={"pl:flex pl:flex-row pl:items-center pl:text-2xs"}>
        {item.weight}
      </p>
    </div>
  )
}
