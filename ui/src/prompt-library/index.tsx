import React from "react";

import { createReactSidebarTab } from "@/utils/react-wrapper";

import { app } from "../utils/shims";

const PromptLibrary = React.lazy(() => import("./prompt-library"));

const ElementId = "prompt-legos-prompt-library" as const;

export function registerPromptLibrary() {
  app.extensionManager.registerSidebarTab(
    createReactSidebarTab(
      ElementId,
      "Library",
      <PromptLibrary />,
      "PromptLegos Templates",
      "pi pi-book",
    ),
  );

  app.registerExtension({
    name: "PromptLegos.PromptLibrary",

    commands: [
      {
        id: "PromptLegos.PromptLibrary.Toggle",
        function() {
          app.extensionManager.command.execute(
            `Workspace.ToggleSidebarTab.${ElementId}`,
          );
        },
      },
      {
        id: "PromptLegos.PromptLibrary.Open",
        function() {
          const open = document.getElementById(ElementId) !== null;

          if (open) {
            // Don't reopen the tab
            return;
          }

          app.extensionManager.command.execute(
            "PromptLegos.PromptLibrary.Toggle",
          );
        },
      },
    ],
  });
}
