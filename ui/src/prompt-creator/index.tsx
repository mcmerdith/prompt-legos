import React from "react"

import { createReactBottomPanelTab } from "../utils/react-wrapper"
import { app } from "../utils/shims"

const PromptCreator = React.lazy(() => import("./prompt-creator"))

export function registerPromptCreator() {
  app.registerExtension({
    name: "PromptLegos.PromptCreator",

    // Bottom Panel Tabs API - Adds custom tabs to the bottom panel
    bottomPanelTabs: [
      createReactBottomPanelTab(
        "Prompt Creator",
        "prompt-legos-prompt-creator",
        <PromptCreator />
      )
    ]
  })
}
