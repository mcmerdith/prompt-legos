import { InputSpec } from "@comfyorg/comfyui-frontend-types";
import React from "react";
import { z } from "zod/v4";

import { LegoPrompt } from "@/lib/prompt";
import { usePromptStore } from "@/stores/prompt-store";
import { addReactWidget } from "@/utils/react-wrapper";
import { app } from "@/utils/shims";

// Lazy load the App component for better performance
const PromptWidget = React.lazy(() => import("./prompt-widget"));

const LEGO_PROMPT_INPUT_SPEC = z.tuple(
  [
    z.literal("LEGO_PROMPT"),
    z.object({
      segments: z.string().array(),
    }),
  ],
  {
    error: "Invalid InputSpec",
  },
);

export function registerPromptWidget() {
  app.registerExtension({
    name: "PromptLegos.PromptWidget",

    setup() {
      const originalOnNodeRemoved = app.graph.onNodeRemoved;
      app.graph.onNodeRemoved = (node) => {
        originalOnNodeRemoved?.apply(app.graph, [node]);
        if (node.comfyClass === "PromptLegosPrompt") {
          console.debug("Removing prompt editor for node", node.id);
          usePromptStore.getState().delete(node.id);
        }
      };
    },

    getCustomWidgets() {
      return {
        LEGO_PROMPT: (node, inputName, inputSpec: InputSpec) => {
          const [_, { segments }] = LEGO_PROMPT_INPUT_SPEC.parse(inputSpec);

          let internalNodeState: LegoPrompt | undefined = undefined;

          const originalOnAdded = node.onAdded;
          node.onAdded = function (graph) {
            originalOnAdded?.apply(node, [graph]);
            usePromptStore.getState().create(node.id, segments);
          };

          const widget = addReactWidget(
            node,
            inputName,
            <PromptWidget node={node} />,
            {
              getValue(): LegoPrompt {
                if (node.id === -1) {
                  // node not yet created, all we have is the internal state
                  return internalNodeState ?? { prompts: [] };
                } else {
                  const state = usePromptStore.getState();
                  if (internalNodeState) {
                    // we need to push the internal state to the store
                    state.update(node.id, (current) => {
                      current.prompts = internalNodeState!.prompts;
                    });
                    // get rid of it so we don't infinitely update
                    internalNodeState = undefined;
                  }
                  return (
                    state.values[node.id] ?? {
                      prompts: [],
                    }
                  );
                }
              },
              setValue(_value: LegoPrompt) {
                // todo
                internalNodeState = LegoPrompt.parse(_value);
                console.debug(node.id, "setValue called", _value);
              },
              getMinHeight() {
                return 200;
              },
            },
          );

          return {
            widget: widget,
            minHeight: widget.options.getMinHeight?.(),
          };
        },
      };
    },
  });
}
