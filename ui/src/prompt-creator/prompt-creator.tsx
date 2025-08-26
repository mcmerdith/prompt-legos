import LegoPromptEditor from "@/components/prompt-editor";
import { EditorContextProvider } from "@/lib/use-editor-context";
import { isInitializedEditor, usePromptEditor } from "@/lib/use-prompt-editor";
import { cn } from "@/lib/utils";
import { usePromptStore } from "@/stores/prompt-store";

// Create a React component for the tab content
export default function PromptCreator({
  layout = "col",
}: {
  layout?: "col" | "row";
}) {
  const activeNode = usePromptStore((state) => state.activeNode);
  const editor = usePromptEditor(activeNode ?? "undefined");

  if (!isInitializedEditor(editor)) {
    return <div>No active editor</div>;
  }

  return (
    <div className="pl:flex pl:h-0 pl:w-full pl:flex-grow pl:flex-col pl:items-center pl:justify-start pl:gap-4 pl:overflow-y-scroll pl:p-4">
      <h3>
        Editing {editor.editorName} ({activeNode})
      </h3>
      <div
        className={cn(
          "pl:flex pl:w-full pl:gap-4",
          layout == "row"
            ? "pl:flex-row pl:items-start pl:justify-around"
            : "pl:flex-col pl:items-stretch pl:justify-start",
        )}
      >
        <EditorContextProvider value={editor}>
          <LegoPromptEditor editor={editor} />
        </EditorContextProvider>
      </div>
    </div>
  );
}
