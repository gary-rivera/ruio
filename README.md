<div align="center">
  <a href="https://www.npmjs.com/package/ruio">
    <img src="./docs/ruio-banner.png" alt="ruio banner" />
  </a>
</div>

<div align="center">
  <!-- <h1 align="center">ruio</h1> -->
   <p align="center">
    <img src="https://img.shields.io/npm/v/ruio" alt="npm version">
    <img src="https://img.shields.io/npm/dm/ruio" alt="downloads">
    <img src="https://img.shields.io/npm/l/ruio" alt="license">
  </p>
</div>

## Overview
<div align="left"> 
  <p>
    <strong>Instantly visualize and debug React component hierarchy with dynamic border outlines</strong>
  </p>
  <p>
    A developer tool to help isolate complex layout issues, understand nested structures, and refine your UI by applying dynamic styling to highlight component archtitecture.
  </p>
</div>

  <a href="https://github.com/user-attachments/assets/5f6c233a-bf19-42b1-aeda-163f6c69dc17">
    <img src="https://github.com/user-attachments/assets/fe850828-6e5b-4310-88bb-e2e8605534f9" width="75%" alt="ruio demo">
  </a>

- **Dynamic Border Styling**: Visualize borders on any element within your React app.
- **Element Selection Mode**: Mimics the hover effect of Chrome DevTools to highlight elements on the page.
- **Click-to-Select**: Make any element the new root with a click.
- **Toggle Logic**: Enable and disable border styling on the fly as well as memory of selected root element.
- **Reset Functionality**: Automatically clear all applied border styles.
- **Highly Configurable**: Works with different project structures and exists on top of any existing architectures.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Development](#development)
- [License](#license)
- [Contributing](#contributing)

## Installation

You can install Ruio using your preferred package manager:

```bash
# npm
npm install ruio

# yarn
yarn add ruio

# bun
bun add ruio
```

## Usage

To get started with Ruio, wrap your application in the RuioContextProvider:

```javascript
// App.tsx
import RuioContextProvider from 'ruio'

function App() {
  return <RuioContextProvider>{/* Your App Components Here */}</RuioContextProvider>
}

export default App
```

As long as youre in a development environment the `ruio` toggle icon will render. This button allows you to enable or disable the border visualization mode.

Now, once the toggle button is clicked, you’ll be able to hover over elements in your app's DOM tree and see real-time UI insights being applied.

## Configuration

Ruio is slated for a configurative UI soon! Check back for new customized options such as:

- Outline UI depth selection.
  - Crawl deeper down the DOM tree
  - Option to crawl up the DOM tree
  - Simultaneously crawl the DOM upwards and downwards
- Color theming
- Keyboard macros for accessibility (+ key binding)

### Element Exclusion

Applying `ruio-exclude` class to elements that you don't want to be considered for ruio's UI styling (inclusive). Any descendant of a component with the `ruio-exclude` class will also be excluded from ruio styling.

```html
<div className="ruio-exclude">{/* Content that shouldn't be affected by Ruio */}</div>
```

## Examples

Check out the [`/examples`](./examples) directory for working examples:

- **vite/** - Minimal starter showing basic setup
- **blog/** - Realistic blog layout with nested components

Run `npm run dev` to see the examples locally.

## Documentation

For detailed information and guides, check out the following documentation:

- **[API Reference](./docs/API.md)** - Complete API documentation for components and hooks
- **[Contributing Guide](./docs/CONTRIBUTING.md)** - Guidelines for contributing to the project
- **[Changelog](./docs/CHANGELOG.md)** - Version history and release notes

## Local Development

1. Clone the repository:

```bash
git clone https://github.com/gary-rivera/ruio.git
```

2. Install dependencies using your preferred package manager:

```bash
# npm
npm install

# yarn
yarn install

# bun
bun install
```

3. Start the development server:

```bash
# npm
npm run dev

# yarn
yarn dev

# bun
bun run dev
```

4. To run tests:

```bash
# npm
npm run test

# yarn
yarn test

# bun
bun test
```

### Trying it out

To see `ruio` in action in a [real world example](https://gary-rivera.github.io/calculator/). 

## Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details on how to get started.

## License

`ruio` is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
