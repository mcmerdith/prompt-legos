import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { useTranslation } from "react-i18next"

import { app } from "../utils/shims"

const App = React.lazy(() => import("./sidebar-tab"))

// Create a function component with i18n for translation
function SidebarWrapper() {
  // Using useTranslation hook to initialize i18n context
  useTranslation()
  console.debug("Wrapping the sidebar")
  return <App />
}

export function registerSidebar() {
  // Register the sidebar tab using ComfyUI's extension API
  const sidebarTab = {
    id: "prompt-legos-manager",
    icon: "pi pi-code", // Using PrimeVue icon
    title: "Prompt Legos",
    tooltip: "Prompt Legos",
    type: "custom" as const,
    render: (element: HTMLElement) => {
      console.debug("Rendering Prompt Legos Manager sidebar tab")
      // Create a container for our React app
      const container = document.createElement("div")
      container.id = "prompt-legos-manager-root"
      container.style.height = "100%"
      element.appendChild(container)

      // Mount the React app to the container
      ReactDOM.createRoot(container).render(
        <React.StrictMode>
          <Suspense fallback={<div>Loading...</div>}>
            <SidebarWrapper />
          </Suspense>
        </React.StrictMode>
      )
    }
  }

  app.extensionManager.registerSidebarTab(sidebarTab)
}
