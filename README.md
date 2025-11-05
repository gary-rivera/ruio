<img src="https://github-production-user-asset-6210df.s3.amazonaws.com/65045826/509903879-5600d179-ddfb-45fb-99e2-5c4b5f658bad.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20251105%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251105T032027Z&X-Amz-Expires=300&X-Amz-Signature=6d8c93fbaf726c024743dbd79aa0b31f4842c9250611d457c802d8284fc9c91e&X-Amz-SignedHeaders=host" alt="ruio banner" width="100%"/>

<div align="center">
  <!-- <h1 align="center">ruio</h1> -->
   <p align="center">
    <img src="https://img.shields.io/npm/v/ruio" alt="npm version">
    <img src="https://img.shields.io/npm/dm/ruio" alt="downloads">
    <img src="https://img.shields.io/npm/l/ruio" alt="license">
  </p>
</div>

### Overview

**Instantly visualize and debug React component hierarchy with dynamic border outlines**

A developer tool to help isolate complex layout issues, understand nested structures, and refine your UI by applying dynamic styling to highlight component archtitecture.

[![ruio demo](https://github.com/user-attachments/assets/fe850828-6e5b-4310-88bb-e2e8605534f9)](https://github.com/user-attachments/assets/5f6c233a-bf19-42b1-aeda-163f6c69dc17)

- **Dynamic Border Styling**: Visualize borders on any element within your React app.
- **Element Selection Mode**: Mimics the hover effect of Chrome DevTools to highlight elements on the page.
- **Click-to-Select**: Make any element the new root with a click.
- **Toggle Logic**: Enable and disable border styling on the fly as well as memory of selected root element.
- **Reset Functionality**: Automatically clear all applied border styles.
- **Highly Configurable**: Works with different project structures and exists on top of any existing architectures.

## Quick Start

### Installation

You can install using your preferred package manager:

```bash
# npm
npm install ruio

# yarn
yarn add ruio

# bun
bun add ruio
```

### Basic Usage

Wrap your application with the `RuioContextProvider`:

```typescript
import RuioContextProvider from 'ruio'

function App() {
  return (
    <RuioContextProvider>
      {/* Your App Components Here */}
    </RuioContextProvider>
  )
}
```

## Documentation

- **[Installation Guide](docs/INSTALLATION.md)** - Setup, requirements, and troubleshooting
- **[Usage Guide](docs/USAGE.md)** - Feature walkthrough and workflows
- **[Configuration](docs/CONFIGURATION.md)** - Element exclusion, environment settings, and planned features
- **[Examples](docs/EXAMPLES.md)** - Working examples and common patterns
- **[API Reference](docs/API.md)** - PI documentation for components and hooks
- **[Changelog](docs/CHANGELOG.md)** - Version history and release notes
- **[Contributions Guide](docs/CONTRIBUTING.md)**

## Contributing

Contributions are welcome. See [Contributing Guide](docs/CONTRIBUTING.md) for details.

### License

`ruio` is licensed under the MIT License. See the [LICENSE](LICENSE/) file for more details.
