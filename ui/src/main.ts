import { registerPromptCreator } from "./prompt-creator";
import { registerPromptLibrary } from "./prompt-library";
import { registerPromptWidget } from "./prompt-widget";

import "./utils/i18n";

import { app } from "./utils/shims";

void import("./index.css");

registerPromptLibrary();
registerPromptWidget();
registerPromptCreator();

try {
  // Register extension with about page badges
  app.registerExtension({
    name: "PromptLegos",

    // About Panel Badges API - Adds custom badges to the ComfyUI about page
    aboutPageBadges: [
      {
        label: "GitHub",
        url: "https://github.com/mcmerdith/prompt_legos",
        icon: "pi pi-github",
      },
    ],

    // Associate keybindings with the commands
    keybindings: [
      {
        combo: {
          key: "p",
          ctrl: true,
        },
        commandId: "Workspace.ToggleBottomPanelTab.prompt-legos-prompt-creator",
      },
    ],
  });

  // Initialize the extension once everything is ready
} catch (error) {
  console.error("Failed to initialize Prompt Legos:", error);
}
