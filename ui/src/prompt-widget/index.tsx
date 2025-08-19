import { createSinglePrompt, LegoPrompt } from "@/lib/prompt"
import { usePromptStore } from "@/stores/prompt-store"
import { addReactWidget } from "@/utils/react-wrapper"
import { app } from "@/utils/shims"
import { InputSpec } from "@comfyorg/comfyui-frontend-types"
import React from "react"
import { z } from "zod/v4"

// Lazy load the App component for better performance
const PromptWidget = React.lazy(() => import("./prompt-widget"))

const LEGO_PROMPT_INPUT_SPEC = z.tuple(
  [
    z.literal("LEGO_PROMPT"),
    z.object({
      segments: z.string().array()
    })
  ],
  {
    error: "Invalid InputSpec"
  }
)

export function registerPromptWidget() {
  app.registerExtension({
    name: "PromptLegos.PromptWidget",

    setup() {
      const originalOnNodeRemoved = app.graph.onNodeRemoved
      app.graph.onNodeRemoved = (node) => {
        originalOnNodeRemoved?.apply(app.graph, [node])
        if (node.comfyClass === "PromptLegosPrompt") {
          console.debug("Removing prompt editor for node", node.id)
          setTimeout(() => usePromptStore.getState().delete(node.id), 1000)
        }
      }
    },

    getCustomWidgets() {
      return {
        LEGO_PROMPT: (node, inputName, inputSpec: InputSpec) => {
          const [_, { segments }] = LEGO_PROMPT_INPUT_SPEC.parse(inputSpec)

          const state = usePromptStore.getState()

          const originalOnAdded = node.onAdded
          node.onAdded = function (graph) {
            originalOnAdded?.apply(node, [graph])
            console.log(node.id, state.values)
            if (!state.values[node.id])
              state.create(node.id, {
                id: "PROMPT",
                prompts: segments.map((segment) => createSinglePrompt(segment))
              })
          }

          const widget = addReactWidget(
            node,
            inputName,
            <PromptWidget node={node} />,
            {
              getValue(): LegoPrompt {
                return state.values[node.id] ?? { prompts: {} }
              },
              setValue(_value: LegoPrompt) {
                // todo
                console.log("setValue called", _value)
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
