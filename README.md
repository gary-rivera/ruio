<div align="center">
  <a href="https://www.npmjs.com/package/ruio">
    <img src="./docs/ruio-banner.png" alt="ruio banner" />
  </a>
</div>

<div align="center">
  <h1>ruio</h1>
  <img src="https://img.shields.io/npm/v/ruio" alt="npm version">
  <img src="https://img.shields.io/npm/dm/ruio" alt="downloads">
 <img src="https://img.shields.io/npm/l/ruio" alt="license">
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

```bash
npm install ruio
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
