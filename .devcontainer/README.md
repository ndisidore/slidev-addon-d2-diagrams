# Dev Container Setup

This directory contains the configuration for a development container that provides a consistent development environment for the Slidev D2 Diagrams Addon project.

## What's Included

- **Node.js 20.x (LTS)** - Required for the project (>=18.0.0)
- **D2 CLI** - For rendering D2 diagrams
- **Slidev CLI** - For development and building
- **TypeScript** - For type checking and development
- **ESLint & Prettier** - For code quality and formatting
- **Vue.js tooling** - Volar extension and TypeScript support

## Getting Started

1. **Prerequisites**:
   - Install Docker Desktop or Docker Engine
   - Install VS Code with the Dev Containers extension

2. **Open in Dev Container**:
   - Open the project in VS Code
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Select "Dev Containers: Reopen in Container"
   - Wait for the container to build and start

3. **First Run**:
   - The container will automatically run `npm install` on first startup
   - All dependencies will be installed in the container

## Available Commands

Once inside the container, you can run:

```bash
# Development
npm run dev          # Start Slidev development server
npm run build        # Build the addon
npm run test         # Run tests with Vitest
npm run lint         # Run linting and type checking
npm run format:fix   # Fix formatting issues
```

## VS Code Extensions

The following extensions are automatically installed in the container:

- **Vue Language Features (Volar)** - Vue.js support
- **TypeScript Vue Plugin** - TypeScript support for Vue
- **Tailwind CSS IntelliSense** - CSS framework support
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **D2** - D2 diagram language support

## Container Features

- **Node.js 20.x** - Latest LTS version
- **Git support** - For version control
- **Build tools** - For compiling native dependencies
- **Optimized workspace** - Fast file access and caching

## Troubleshooting

If you encounter issues:

1. **Rebuild the container**:
   - Command Palette → "Dev Containers: Rebuild Container"

2. **Check Docker logs**:
   - Ensure Docker is running and has sufficient resources

3. **Clear container cache**:
   - Command Palette → "Dev Containers: Rebuild Container" (with "Clean" option)

## Customization

You can modify the container by editing:

- `Dockerfile` - Add system packages or tools
- `devcontainer.json` - Change VS Code settings or extensions
- `.dockerignore` - Optimize build context
