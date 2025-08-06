import type {
  BottomPanelExtension,
  DOMWidget,
  DOMWidgetOptions
} from "@comfyorg/comfyui-frontend-types"
import type { LGraphNode } from "@comfyorg/litegraph"
import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"

import { cn } from "@/lib/utils"

function createReactApp<T extends React.ReactElement>(
  id: string,
  reactElement: T,
  className?: string,
  htmlRoot?: HTMLElement
) {
  htmlRoot ??= document.createElement("div")
  htmlRoot.className = cn("prompt-legos-react-app", className)
  htmlRoot.id = id

  const reactRoot = ReactDOM.createRoot(htmlRoot)
  reactRoot.render(
    <React.StrictMode>
      <Suspense fallback={<div>Loading...</div>}>{reactElement}</Suspense>
    </React.StrictMode>
  )

  return { htmlRoot, reactRoot }
}

export function addReactWidget<
  T extends React.ReactElement,
  V extends object | string
>(
  node: LGraphNode,
  name: string,
  reactElement: T,
  options: DOMWidgetOptions<V> = {}
): DOMWidget<HTMLElement, V> {
  const { htmlRoot } = createReactApp(name, reactElement)
  const widget = node.addDOMWidget(name, "custom", htmlRoot, options)

  return widget
}

export function createReactBottomPanelTab<T extends React.ReactElement>(
  name: string,
  id: string,
  reactElement: T
): BottomPanelExtension {
  const bottomPanelTab: BottomPanelExtension = {
    id: id,
    title: name,
    type: "custom",
    render: (rootElement) => {
      createReactApp(
        id,
        reactElement,
        "pl:flex pl:h-full pl:flex-col",
        rootElement
      )
    }
  }
  return bottomPanelTab
}
