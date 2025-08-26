import { LegoPromptViewer } from "@/components/prompt-editor";
import { usePromptStore } from "@/stores/prompt-store";
import { app } from "@/utils/shims";
import type { LGraphNode } from "@comfyorg/comfyui-frontend-types";

export default function PromptWidget({ node }: { node: LGraphNode }) {
  const setActiveEditor = usePromptStore((state) => state.setActiveEditor);
  const value = usePromptStore((state) => state.values[node.id]);

  if (!value) return <div>Not initialized</div>;

  return (
    <div className="pl:flex pl:h-full pl:flex-col">
      <main className="pl:flex-grow pl:overflow-y-scroll">
        <LegoPromptViewer prompt={value} />
      </main>
      <footer className="pl:flex pl:flex-col pl:items-start pl:justify-center pl:gap-2 pl:pt-1">
        <button
          className="pl:w-full pl:rounded-sm pl:border-secondary/80 pl:bg-secondary/60 pl:p-1"
          onClick={() => {
            setActiveEditor(node.id);
            app.extensionManager.command.execute(
              "PromptLegos.PromptCreator.Open",
            );
          }}
        >
          Open prompt creator
        </button>
      </footer>
    </div>
  );
}
