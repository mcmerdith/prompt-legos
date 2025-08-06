import { usePromptEditor } from "@/lib/prompt"
import { cn } from "@/lib/utils"
import { usePromptCreatorStore } from "@/stores/prompt-creator-store"

import PromptComponent from "../components/prompt"

// Create a React component for the tab content
export default function PromptCreator({
  layout = "col"
}: {
  layout?: "col" | "row"
}) {
  const activeNode = usePromptCreatorStore((state) => state.activeNode)

  if (!activeNode) {
    return <div>No active node</div>
  }

  const editor = usePromptEditor(activeNode)

  const { positive, negative } = editor.prompt

  return (
    <div className="pl:flex pl:h-0 pl:w-full pl:flex-grow pl:flex-col pl:items-center pl:justify-start pl:gap-4 pl:overflow-y-scroll pl:p-4">
      <h3>
        Editing {editor.name} ({activeNode})
      </h3>
      <div
        className={cn(
          "pl:flex pl:w-full pl:gap-4",
          layout == "row"
            ? "pl:flex-row pl:items-start pl:justify-around"
            : "pl:flex-col pl:items-stretch pl:justify-start"
        )}
      >
        <PromptComponent
          className="pl:flex-auto"
          sections={positive}
          name="Positive"
          edit
        />
        <PromptComponent
          className="pl:flex-auto"
          sections={negative}
          name="Negative"
          edit
        />
      </div>
    </div>
  )
}
