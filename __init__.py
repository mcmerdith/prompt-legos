from .src.nodes import NODE_CLASS_MAPPINGS
from .src.nodes import NODE_DISPLAY_NAME_MAPPINGS
import os
import server
from aiohttp import web
import folder_paths
import nodes

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS"]

# Define the path to our extension
workspace_path = os.path.dirname(__file__)
dist_path = os.path.join(workspace_path, "dist/prompt-legos")
dist_locales_path = os.path.join(workspace_path, "dist/locales")
project_name = os.path.basename(workspace_path)


def log(msg):
    print(f"[{project_name}] {msg}")


# dynamically load project name
try:
    # Method added in https://github.com/comfyanonymous/ComfyUI/pull/8357
    from comfy_config import config_parser

    project_config = config_parser.extract_node_configuration(
        workspace_path)
    if not project_config:
        raise Exception("Configuration not found")
    project_name = project_config.project.name
except Exception as e:
    log(
        f"Could not load project config, using default name '{project_name}': {e}")

# Print the current paths for debugging
# log(f"workspace path: {workspace_path}")
# log(f"dist path: {dist_path}")
# log(f"dist locales path: {dist_locales_path}")
# log(f"locales exist: {os.path.exists(dist_locales_path)}")

# Register the static route for serving our React app assets
if server.PromptServer.instance.app.frozen:
    log("WARN: loaded while router is frozen. If using hot-reload, this is expected.")
else:
    if os.path.exists(dist_path):

        # Add the routes for the extension
        server.PromptServer.instance.app.add_routes([
            web.static("/prompt-legos/", dist_path),
        ])

        # Register the locale files route
        if os.path.exists(dist_locales_path):
            server.PromptServer.instance.app.add_routes([
                web.static("/locales/", dist_locales_path),
            ])
            log(f"Registered locale files route at /locales/")
        else:
            log("WARNING: Locale directory not found!")

        nodes.EXTENSION_WEB_DIRS[project_name] = os.path.join(
            workspace_path, "dist")
    else:
        log("ERROR: web directory not found")
