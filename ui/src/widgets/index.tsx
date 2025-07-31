import React from 'react'

import { addReactWidget } from '../utils/react-wrapper'
import { app } from '../utils/shims'

// Lazy load the App component for better performance
const PromptWidget = React.lazy(() => import('./prompt-widget'))

export function registerWidgets() {
  app.registerExtension({
    name: 'PromptLegos.PromptWidget',

    nodeCreated(node) {
      console.debug('Node created', node.title, node.type, node)
      if (node.title === 'Bruh Node') {
        addReactWidget(node, 'lego-brick-widget', <PromptWidget />, {
          getValue(): string {
            return 'temp'
          },
          setValue(_value: string) {
            // todo
          },
          getMinHeight() {
            return 200
          }
        })
      }
    }
  })
}
