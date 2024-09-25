> ⚠️ **Disclaimer**: Ruio is currently in an unstable state and is still under active development. Features, UI, and behaviors may change frequently. Use it with caution (for now :D).

# ruio (or React UI Outliner )

**ruio** is a developer tool designed for React applications that allows you to dynamically apply real-time border styles to elements at the click of a button. Inspired by the Google Chrome Inspect Tool, Ruio provides instant visual feedback to help developers identify layout issues and optimize the structure of their applications. The tool is optimized for performance and scalability, offering a seamless integration experience in any React project.

![npm](https://img.shields.io/npm/v/ruio) ![license](https://img.shields.io/npm/l/ruio)

## Features

- **Dynamic Border Styling**: Visualize borders on any element within your React app.
- **Element Selection Mode**: Mimics the hover effect of Chrome DevTools to highlight elements on the page.
- **Click-to-Select**: Make any element the new root with a click.
- **Toggle Logic**: Enable and disable border styling on the fly.
- **Reset Functionality**: Quickly clear all applied border styles.
- **Highly Configurable**: Works with different project structures and styles, supporting CSS Modules out-of-the-box.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Development](#development)
- [License](#license)
- [Contributing](#contributing)

## Installation

You can install Ruio via npm:

```bash
npm install ruio
```

## Usage

To get started with Ruio, wrap your application in the RuioContextProvider:

```javascript
// App.tsx
import { RuioContextProvider } from 'ruio';

function App() {
	return (
		<RuioContextProvider>{/* Your App Components Here */}</RuioContextProvider>
	);
}

export default App;
```

Next, add the Ruio toggle button to your UI. This button allows you to enable or disable the border visualization mode.

Now, once the toggle button is clicked, you’ll be able to hover over elements in your app and see real-time borders being applied.

## Configuration

Ruio is slated for configurative UI soon! Check back for options such as:

- Outline UI depth selection.
  - Crawl deeper down the DOM tree
  - Option to crawl up the DOM tree
  - Both upwards and downwards crawling
- Color theming
- Keyboard macros for interactions (+ customization)

### Element Exclusion

Apply a special `ruio-exclude` class to elements that you don't want to be considered for ruio's UI styling (inclusive). Any descendant of a component with the `ruio-exclude` class will also not be considered for ruio styling.

```html
<div className="ruio-exclude">
	{/* Content that shouldn't be affected by Ruio */}
</div>
```

## Development

To start developing Ruio locally:

1. Clone the repository:

```bash
git clone https://github.com/gary-rivera/ruio.git
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. You can also run tests to ensure everything is working correctly:

```bash
npm run test
```

Running in Your Project
You can test ruio with the example React project:

react-redux-realworld-example-app [repo](https://github.com/gothinkster/react-redux-realworld-example-app)

## License

`ruio` is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
