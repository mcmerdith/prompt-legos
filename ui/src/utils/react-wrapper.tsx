import {
  type BottomPanelExtension,
  DOMWidget,
  DOMWidgetOptions
} from '@comfyorg/comfyui-frontend-types'
import { LGraphNode } from '@comfyorg/litegraph'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'

function createReactApp<T extends React.ReactElement>(
  name: string,
  element: T
) {
  const root = document.createElement('div')
  root.className = `prompt-lego-widget-root`
  root.id = `${name}-root`

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
    </React.StrictMode>
  )

  return root
}

export function addReactWidget<
  T extends React.ReactElement,
  V extends object | string
>(
  node: LGraphNode,
  name: string,
  element: T,
  options: DOMWidgetOptions<V> = {}
): DOMWidget<HTMLElement, V> {
  const widget = node.addDOMWidget(
    name,
    'custom',
    createReactApp(name, element),
    options
  )

  return widget
}

export function createReactBottomPanelTab<T extends React.ReactElement>(
  name: string,
  id: string,
  element: T
): BottomPanelExtension {
  const bottomPanelTab: BottomPanelExtension = {
    id: id,
    title: name,
    type: 'custom',
    render: (el) => {
      const bottomPanelApp = createReactApp(name, element)
      el.appendChild(bottomPanelApp)
    }
  }
  return bottomPanelTab
}
