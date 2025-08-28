import { BookDashedIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/button";
import LegoPromptEditor from "@/components/prompt-editor";
import { EditorContextProvider } from "@/lib/use-editor-context";
import { isInitializedEditor, usePromptEditor } from "@/lib/use-prompt-editor";
import { cn } from "@/lib/utils";
import { usePromptStore } from "@/stores/prompt-store";
import { app } from "@/utils/shims";

// Create a React component for the tab content
export default function PromptCreator({
  layout = "col",
}: {
  layout?: "col" | "row";
}) {
  const activeNode = usePromptStore((state) => state.activeNode);
  const recreate = usePromptStore((state) => state.recreate);
  const editor = usePromptEditor(activeNode ?? "undefined");

  if (!isInitializedEditor(editor)) {
    return <div>No active editor</div>;
  }

  return (
    <div className="pl:flex pl:h-0 pl:w-full pl:flex-grow pl:flex-col pl:items-center pl:justify-start pl:gap-4 pl:overflow-y-scroll pl:p-4">
      <div
        className={
          "pl:relative pl:flex pl:w-full pl:flex-row pl:items-center pl:justify-center"
        }
      >
        <div className={"pl:absolute pl:left-0 pl:flex pl:flex-row pl:gap-2"}>
          <Button
            iconStart={<BookDashedIcon />}
            title={"Open Template Library"}
            onClick={() => {
              app.extensionManager.command.execute(
                "PromptLegos.PromptLibrary.Toggle",
              );
            }}
          />
          <Button
            iconStart={<RotateCcwIcon />}
            title={"Reset Prompt"}
            onClick={() => {
              app.extensionManager.dialog
                .confirm({
                  title: "Are you sure?",
                  message: "Resetting cannot be undone",
                })
                .then(() => {
                  recreate(editor.node.id);
                });
            }}
          />
        </div>
        <h3>
          Editing {editor.editorName} ({activeNode})
        </h3>
      </div>
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
