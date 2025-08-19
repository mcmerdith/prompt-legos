import LegoPromptEditor from "@/components/prompt"
import { isInitializedEditor, usePromptEditor } from "@/lib/use-prompt-editor"
import { usePromptStore } from "@/stores/prompt-store"
import type { LGraphNode } from "@/utils/shims"
import { app } from "@/utils/shims"

export default function PromptWidget({ node }: { node: LGraphNode }) {
  const editor = usePromptEditor(node.id)

  if (!isInitializedEditor(editor)) return <div>Not initialized</div>

  return (
    <div className="pl:flex pl:h-full pl:flex-col">
      <main className="pl:flex-grow pl:overflow-y-scroll">
        <LegoPromptEditor editor={editor} edit={false} />
      </main>
      <footer className="pl:flex pl:flex-col pl:items-start pl:justify-center pl:gap-2 pl:pt-1">
        <button
          className="pl:w-full pl:rounded-sm pl:border-secondary/80 pl:bg-secondary/60 pl:p-1"
          onClick={() => {
            app.extensionManager.command.execute(
              "PromptLegos.PromptCreator.Open"
            )

            usePromptStore.setState({ activeNode: node.id })
          }}
        >
          Open prompt creator
        </button>
      </footer>
    </div>
  )
}
