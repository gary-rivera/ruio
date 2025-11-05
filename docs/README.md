---
coverY: 0
layout:
  width: default
  cover:
    visible: true
    size: hero
  title:
    visible: false
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
  metadata:
    visible: true
---

<div align="center">
  <h1>ruio</h1>
  <img src="https://img.shields.io/npm/v/ruio" alt="npm version">
  <img src="https://img.shields.io/npm/dm/ruio" alt="downloads">
  <img src="https://img.shields.io/npm/l/ruio" alt="license">
</div>

### Overview

**Instantly visualize and debug React component hierarchy with dynamic border outlines**

A developer tool to help isolate complex layout issues, better understand nested components, and refine your UI by applying dynamic styling to highlight component architecture.

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

That's it! In development mode, you'll see the ruio toggle button. Click it to visualize your component hierarchy.

## Documentation

📚 **Comprehensive guides:**

- **[Installation Guide](INSTALLATION.md)** - Detailed setup, requirements, and troubleshooting
- **[Usage Guide](USAGE.md)** - Complete feature walkthrough and workflows
- **[Configuration](CONFIGURATION.md)** - Element exclusion, environment settings, and planned features
- **[Examples](EXAMPLES.md)** - Working examples and common patterns
- **[API Reference](API.md)** - Complete API documentation for components and hooks
- **[Contributing Guide](CONTRIBUTING.md)** - Guidelines for contributing to the project
- **[Changelog](CHANGELOG.md)** - Version history and release notes

## Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

### License

`ruio` is licensed under the MIT License. See the [LICENSE](../LICENSE/) file for more details.
