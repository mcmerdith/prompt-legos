import React from "react"

import { type Prompt, defaultPrompt } from "@/lib/prompt"
import { usePromptCreatorStore } from "@/stores/prompt-creator-store"

import { addReactWidget } from "../utils/react-wrapper"
import { app } from "../utils/shims"

// Lazy load the App component for better performance
const PromptWidget = React.lazy(() => import("./prompt-widget"))

export function registerWidgets() {
  app.registerExtension({
    name: "PromptLegos.PromptWidget",

    setup() {
      const originalOnNodeRemoved = app.graph.onNodeRemoved
      app.graph.onNodeRemoved = (node) => {
        originalOnNodeRemoved?.apply(app.graph, [node])
        if (node.comfyClass === "PromptLegosPrompt") {
          console.debug("Removing prompt editor for node", node.id)
          usePromptCreatorStore.setState((state) => {
            const newEditors = { ...state.editors }
            delete newEditors[node.id]

            return {
              editors: newEditors
            }
          })
        }
      }
    },

    getCustomWidgets() {
      return {
        LEGO_PROMPT: (node, inputName) => {
          const widget = addReactWidget(
            node,
            inputName,
            <PromptWidget node={node} />,
            {
              getValue(): Prompt {
                return defaultPrompt()
              },
              setValue(_value: Prompt) {
                // todo
              },
              getMinHeight() {
                return 200
              }
            }
          )

          return {
            widget: widget,
            minHeight: widget.options.getMinHeight?.()
          }
        }
      }
    }
  })
}
