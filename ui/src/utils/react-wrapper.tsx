import type {
  BottomPanelExtension,
  DOMWidget,
  DOMWidgetOptions,
  LGraphNode,
} from "@comfyorg/comfyui-frontend-types";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import { cn } from "@/lib/utils";

function createReactApp<T extends React.ReactElement>(
  id: string,
  reactElement: T,
  className?: string,
  htmlRoot?: HTMLElement,
) {
  htmlRoot ??= document.createElement("div");
  htmlRoot.className = cn("prompt-legos-react-app", className);
  htmlRoot.id = id;

  const reactRoot = ReactDOM.createRoot(htmlRoot);
  reactRoot.render(
    <React.StrictMode>
      <Suspense fallback={<div>Loading...</div>}>{reactElement}</Suspense>
    </React.StrictMode>,
  );

  return { htmlRoot, reactRoot };
}

export function addReactWidget<
  T extends React.ReactElement,
  V extends object | string,
>(
  node: LGraphNode,
  name: string,
  reactElement: T,
  options: DOMWidgetOptions<V> = {},
): DOMWidget<HTMLElement, V> {
  const { htmlRoot, reactRoot } = createReactApp(name, reactElement);

  // add the created widget
  const widget = node.addDOMWidget(name, "custom", htmlRoot, options);

  // make sure we cleanup when we're done
  const originalOnRemoved = node.onRemoved;
  node.onRemoved = () => {
    originalOnRemoved?.apply(node);
    reactRoot.unmount();
  };

  return widget;
}

export function createReactBottomPanelTab<T extends React.ReactElement>(
  name: string,
  id: string,
  reactElement: T,
): BottomPanelExtension {
  let app: ReactDOM.Root | undefined;

  return {
    id: id,
    title: name,
    type: "custom",
    render(rootElement) {
      // hack for ComfyUI_frontend#4372
      // destroy isn't always called so at least make sure we clean up the old
      // panel before creating a new one
      app?.unmount();

      // mount app and store reference to the react root
      const { reactRoot } = createReactApp(
        id,
        reactElement,
        "pl:flex pl:h-full pl:flex-col",
        rootElement,
      );
      app = reactRoot;
    },
    destroy() {
      // clean up the app
      app?.unmount();
      app = undefined;
    },
  };
}
