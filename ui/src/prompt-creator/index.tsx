import React from "react";

import { createReactBottomPanelTab } from "@/utils/react-wrapper";
import { app } from "@/utils/shims";

const PromptCreator = React.lazy(() => import("./prompt-creator"));

const ElementId = "prompt-legos-prompt-creator" as const;

export function registerPromptCreator() {
  app.registerExtension({
    name: "PromptLegos.PromptCreator",

    // Bottom Panel Tabs API - Adds custom tabs to the bottom panel
    bottomPanelTabs: [
      createReactBottomPanelTab(
        "Prompt Creator",
        ElementId,
        <PromptCreator layout="row" />,
      ),
    ],

    commands: [
      {
        id: "PromptLegos.PromptCreator.Open",
        function() {
          const open = document.getElementById(ElementId) !== null;

          if (open) {
            // Don't reopen the tab
            return;
          }

          app.extensionManager.command.execute(
            `Workspace.ToggleBottomPanelTab.${ElementId}`,
          );
        },
      },
    ],
  });
}
