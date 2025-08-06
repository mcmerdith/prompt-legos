import type { LGraphNode } from "@comfyorg/litegraph/dist/LGraphNode"

import PromptComponent from "@/components/prompt"
import { usePromptEditor } from "@/lib/prompt"
import { usePromptCreatorStore } from "@/stores/prompt-creator-store"
import { app } from "@/utils/shims"

export default function PromptWidget({ node }: { node: LGraphNode }) {
  const editor = usePromptEditor(node.id)

  const { positive, negative } = editor.prompt

  return (
    <div className="pl:flex pl:h-full pl:flex-col">
      <main className="pl:flex-grow pl:overflow-y-scroll">
        <div className="pl:flex pl:w-full pl:flex-col pl:items-stretch pl:justify-start pl:gap-4">
          <PromptComponent
            className="pl:flex-auto"
            sections={positive}
            name="Positive"
          />
          <PromptComponent
            className="pl:flex-auto"
            sections={negative}
            name="Negative"
          />
        </div>
      </main>
      <footer className="pl:flex pl:flex-col pl:items-start pl:justify-center pl:gap-2 pl:pt-1">
        <button
          className="pl:w-full pl:rounded-sm pl:border-secondary/80 pl:bg-secondary/60 pl:p-1"
          onClick={() => {
            app.extensionManager.command.execute(
              "PromptLegos.PromptCreator.Open"
            )

            usePromptCreatorStore.setState({ activeNode: node.id })
          }}
        >
          Open prompt creator
        </button>
      </footer>
    </div>
  )
}
