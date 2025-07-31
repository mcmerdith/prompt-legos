import './index.css'
import { registerPromptCreator } from './prompt-creator'
import { registerSidebar } from './sidebar-tab'
import './utils/i18n'
import { app } from './utils/shims'
import { registerWidgets } from './widgets'

registerSidebar()
registerWidgets()
registerPromptCreator()

try {
  // Register extension with about page badges
  app.registerExtension({
    name: 'PromptLegos',

    // About Panel Badges API - Adds custom badges to the ComfyUI about page
    aboutPageBadges: [
      {
        label: 'Documentation',
        url: 'https://docs.comfy.org/custom-nodes/js/javascript_overview',
        icon: 'pi pi-file'
      },
      {
        label: 'GitHub',
        url: 'https://github.com/Comfy-Org/ComfyUI-React-Extension-Template',
        icon: 'pi pi-github'
      },
      {
        label: 'Support',
        url: 'https://discord.gg/comfy-org',
        icon: 'pi pi-discord'
      }
    ],

    // Commands and Keybindings API - Register custom commands with keyboard shortcuts
    // commands: [
    //   {
    //     id: 'reactExample.clearWorkflow',
    //     label: 'Clear Workflow from React Example',
    //     function: () => {

    //     }
    //   }
    // ],

    // Associate keybindings with the commands
    keybindings: [
      {
        combo: { key: 'i', ctrl: true, alt: true },
        commandId: 'reactExample.showInfo'
      },

      {
        combo: {
          key: 'p',
          ctrl: true
        },
        commandId: 'Workspace.ToggleBottomPanelTab.prompt-legos-prompt-creator'
      }
    ]

    // Topbar Menu API - Add commands to the top menu bar
    // menuCommands: [
    //   {
    //     // Add commands to the Extensions menu
    //     path: ['Extensions', 'React Example'],
    //     commands: [
    //       'reactExample.showInfo',
    //       'reactExample.runWorkflow',
    //       'reactExample.clearWorkflow'
    //     ]
    //   },
    //   {
    //     // Create a submenu under Extensions > React Example
    //     path: ['Extensions', 'React Example', 'Advanced'],
    //     commands: ['reactExample.showInfo']
    //   }
    // ]
  })

  // Initialize the extension once everything is ready
} catch (error) {
  console.error('Failed to initialize React Example Extension:', error)
}
