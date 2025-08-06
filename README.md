# Prompt Legos

TODO: description

## Features

- **Fully Integrated**: All utilities are built directly into ComfyUI. No extra tabs.
- **Internationalization Framework**: Built-in i18n support with English and Chinese examples

## Installation

### From ComfyUI Registry (Recommended)

The easiest way to install this extension is through the ComfyUI Manager:

1. Open ComfyUI and go to the Manager
2. Search for "Prompt Legos"
3. Click Install

### Manual Installation

If you want to install directly from GitHub for development purposes:

```bash
# Go to your ComfyUI custom_nodes directory
cd ComfyUI/custom_nodes

# Clone the repository
git clone https://github.com/mcmerdith/prompt-legos

# Build the React application
cd prompt-legos/ui
npm install
npm run build

# Restart ComfyUI
```

⚠️ **Important**: When installing manually from GitHub, you **must** run `npm run build` in the `ui/` directory before the extension will work. The extension requires the compiled React code in the `dist/` folder to function properly in ComfyUI.

## Development

### Quickstart

1. Install [ComfyUI](https://docs.comfy.org/get_started).
1. Install [ComfyUI-Manager](https://github.com/ltdrdata/ComfyUI-Manager)
1. Look up this extension in ComfyUI-Manager. If you are installing manually, clone this repository under `ComfyUI/custom_nodes`.
1. Restart ComfyUI.

To install the dev dependencies and pre-commit (will run the ruff hook), do:

```bash
cd my_custom_nodepack
pip install -e .[dev]
pre-commit install
```

The `-e` flag above will result in a "live" install, in the sense that any changes you make to your node extension will automatically be picked up the next time you run ComfyUI.

### Setup Development Environment

```bash
# Go to the UI directory
cd ui

# Install dependencies
npm install

# Start development mode (watches for changes)
npm run watch
```

### TypeScript Support

This extension uses the official `@comfyorg/comfyui-frontend-types` package for type-safe interaction with ComfyUI APIs. To install it:

```bash
cd ui
npm install -D @comfyorg/comfyui-frontend-types
```

## Publishing to ComfyUI Registry

### Prerequisites

1. Set up a [Registry](https://registry.comfy.org) account
2. Create an API key at https://registry.comfy.org/nodes

### Steps to Publish

1. Install the comfy-cli tool:
   ```bash
   pip install comfy-cli
   ```

2. Verify your pyproject.toml has the correct metadata:
   ```toml
   [project]
   name = "your_extension_name"  # Use a unique name for your extension
   description = "Your extension description here."
   version = "0.1.0"  # Increment this with each update

   [tool.comfy]
   PublisherId = "your_publisher_id"  # Your Registry publisher ID
   DisplayName = "Your Extension Display Name"
   includes = ["dist/"]  # Include built React code (normally ignored by .gitignore)
   ```

3. Publish your extension:
   ```bash
   comfy-cli publish
   ```

4. When prompted, enter your API key

### Automatic Publishing with GitHub Actions

This template includes a GitHub Actions workflow that automatically publishes to the ComfyUI Registry whenever you update the version in pyproject.toml:

1. Go to your repository's Settings > Secrets and variables > Actions
2. Create a new repository secret called `REGISTRY_ACCESS_TOKEN` with your API key
3. Commit and push an update to pyproject.toml (e.g., increment the version number)
4. The GitHub Action will automatically run and publish your extension

The workflow configuration is set up in `.github/workflows/react-build.yml` and will trigger when:
- The `pyproject.toml` file is modified and pushed to the `main` branch

The workflow automatically:
1. Sets up Node.js environment
2. Installs dependencies (`npm install`)
3. Builds the React extension (`npm run build`)
4. Publishes the extension to the ComfyUI Registry

## Unit Testing

This template includes a basic setup for unit testing with Jest and React Testing Library:

```bash
# Run tests
npm test

# Run tests in watch mode during development
npm run test:watch
```

Example tests can be found in the `src/__tests__` directory. The setup includes:

- Jest for running tests
- React Testing Library for testing components
- Mock implementation of the ComfyUI window.app object

## License

MIT
