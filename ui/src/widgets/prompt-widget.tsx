import { app } from '@/utils/shims'

import './widget.scss'

export default function PromptWidget() {
  return (
    <>
      <main className="scrollable">
        <h1>I am the widget</h1>
      </main>
      <footer>
        <button
          onClick={() => {
            app.extensionManager.command.execute(
              'Workspace.ToggleBottomPanelTab.prompt-legos-prompt-creator'
            )
          }}
        >
          Open prompt creator
        </button>
      </footer>
    </>
  )
}
