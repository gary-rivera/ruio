# Configuration

## Element Exclusion

You can exclude specific elements and their descendants from ruio's border visualization by applying the `ruio-exclude` class.

### Basic Usage

```html
<div className="ruio-exclude">
  {/* This content and all descendants will be excluded from ruio */}
</div>
```

### How It Works

- **Inclusive Exclusion**: When you add `ruio-exclude` to an element, both that element AND all its descendants are excluded
- **Automatic**: The ruio UI controls automatically have this class applied
- **No Configuration Needed**: Just add the class name - ruio handles the rest

### Common Use Cases

#### Excluding Modals

```typescript
function Modal({ children }) {
  return (
    <div className="ruio-exclude modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>
  )
}
```

#### Excluding Navigation

```typescript
function Navigation() {
  return (
    <nav className="ruio-exclude">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  )
}
```

#### Excluding Third-Party Widgets

```typescript
function ThirdPartyWidget() {
  return (
    <div className="ruio-exclude">
      <script src="https://widget.example.com/embed.js"></script>
      <div id="widget-container"></div>
    </div>
  )
}
```

#### Excluding Fixed Overlays

```typescript
function Toast({ message }) {
  return (
    <div className="ruio-exclude toast-container">
      <p>{message}</p>
    </div>
  )
}
```

### Multiple Classes

You can combine `ruio-exclude` with your existing classes:

```typescript
<div className="my-component my-styles ruio-exclude">
  {/* Content */}
</div>
```

Or use it with CSS modules:

```typescript
import styles from './Component.module.css'

<div className={`${styles.container} ruio-exclude`}>
  {/* Content */}
</div>
```

## Environment Configuration

### Development vs Production

ruio automatically detects the environment using `process.env.NODE_ENV`:

```typescript
// Development mode (NODE_ENV !== 'production')
// - Toggle button visible
// - All features enabled
// - Settings accessible

// Production mode (NODE_ENV === 'production')
// - No UI controls rendered
// - Minimal overhead
// - Safe to include in production builds
```

### Enabling in Production (Demo Apps)

For production demo apps or staging environments, you can override the default behavior:

```typescript
import RuioContextProvider from 'ruio'

function App() {
  return (
    <RuioContextProvider showInProduction={true}>
      {/* Your App Components */}
    </RuioContextProvider>
  )
}
```

**Use Cases:**
- Demo applications where you want to showcase ruio
- Staging environments for debugging
- Production apps where you need to visualize component hierarchy

**Note:** Only use `showInProduction` when you intentionally want ruio visible to end users.

### Custom Environment Detection

If you need custom environment detection, you can conditionally render the provider:

```typescript
const isDevelopment = process.env.NODE_ENV === 'development'
const isStaging = process.env.REACT_APP_ENV === 'staging'

function App() {
  return (
    <>
      {(isDevelopment || isStaging) && (
        <RuioContextProvider>
          <YourApp />
        </RuioContextProvider>
      )}
      {!isDevelopment && !isStaging && <YourApp />}
    </>
  )
}
```

Or use the `showInProduction` prop for simpler cases:

```typescript
function App() {
  const isStaging = process.env.REACT_APP_ENV === 'staging'

  return (
    <RuioContextProvider showInProduction={isStaging}>
      <YourApp />
    </RuioContextProvider>
  )
}
```

## Root Element Configuration

### Auto-Detection

ruio automatically detects your application's root element. It tries the following selectors in order:

1. User's saved selection (from localStorage)
2. Custom `defaultRootSelector` prop (if provided)
3. `#root` (most common)
4. `#app` (alternative common pattern)
5. `[data-reactroot]` (older React versions)
6. `body > div:first-child` (universal fallback)

### Custom Root Selector

For non-standard app structures, pass the `defaultRootSelector` prop:

```typescript
import RuioContextProvider from 'ruio'

function App() {
  return (
    <RuioContextProvider defaultRootSelector=".app-container">
      <div className="app-container">
        {/* Your App Components */}
      </div>
    </RuioContextProvider>
  )
}
```

**Common Use Cases:**

```typescript
// Custom ID
<RuioContextProvider defaultRootSelector="#my-app">
  <div id="my-app">{/* ... */}</div>
</RuioContextProvider>

// Class selector
<RuioContextProvider defaultRootSelector=".main-content">
  <div className="main-content">{/* ... */}</div>
</RuioContextProvider>

// Data attribute
<RuioContextProvider defaultRootSelector="[data-app-root]">
  <div data-app-root>{/* ... */}</div>
</RuioContextProvider>

// Complex selector
<RuioContextProvider defaultRootSelector="main.app-wrapper > div">
  <main className="app-wrapper">
    <div>{/* ... */}</div>
  </main>
</RuioContextProvider>
```

### Manual Selection

You can also manually select a root element at runtime:

1. Enable ruio
2. Click the crosshair icon (element selection mode)
3. Click any element to make it the new root
4. The selection persists across page refreshes

## LocalStorage Settings

ruio automatically persists settings to `localStorage`. You can manually inspect or modify these:

### Storage Keys

| Key | Value Type | Description |
|-----|------------|-------------|
| `ruio_enabled` | `boolean` | Whether ruio is enabled |
| `ruio_root_selector` | `string` | CSS selector for the root element |

### Inspecting Storage

```javascript
// Check if ruio is enabled
localStorage.getItem('ruio_enabled')

// Check current root selector
localStorage.getItem('ruio_root_selector')
```

### Clearing Settings

```javascript
// Clear all ruio settings
localStorage.removeItem('ruio_enabled')
localStorage.removeItem('ruio_root_selector')

// Or clear all localStorage (use with caution!)
localStorage.clear()
```

## Planned Configuration Features

The following features are planned for future releases:

### UI Depth Selection

Control how deep ruio crawls the DOM tree:

```typescript
// Coming soon!
<RuioContextProvider depth={5}>
  <App />
</RuioContextProvider>
```

Options will include:
- Crawl deeper down the DOM tree
- Option to crawl up the DOM tree
- Simultaneously crawl the DOM upwards and downwards

### Color Theming

Customize the color palette used for border visualization:

```typescript
// Coming soon!
<RuioContextProvider theme="ocean">
  <App />
</RuioContextProvider>

// Or custom colors
<RuioContextProvider
  colors={['#ff0000', '#00ff00', '#0000ff']}
>
  <App />
</RuioContextProvider>
```

### Keyboard Shortcuts

Keyboard macros for quick access:

```typescript
// Coming soon!
<RuioContextProvider
  shortcuts={{
    toggle: 'Ctrl+Shift+R',
    select: 'Ctrl+Shift+S',
    reset: 'Ctrl+Shift+X'
  }}
>
  <App />
</RuioContextProvider>
```

### Custom Positioning

Control where the ruio UI appears:

```typescript
// Coming soon!
<RuioContextProvider position="top-right">
  <App />
</RuioContextProvider>
```

## TypeScript Configuration

ruio includes full TypeScript support out of the box. No additional configuration needed!

### Type Definitions

All types are automatically available when you import from ruio:

```typescript
import RuioContextProvider, { useRuioContext } from 'ruio'

// Types are inferred automatically
const context = useRuioContext()
```

### Custom Types

If you're building custom controls, you can import the context type:

```typescript
import type { RuioContextProps } from 'ruio'

const customHandler = (context: RuioContextProps) => {
  // Your logic here
}
```

## Best Practices

1. **Always exclude overlays**: Modal overlays, tooltips, and fixed elements should use `ruio-exclude`
2. **Keep it in development only**: Let ruio's automatic environment detection handle production
3. **Don't over-exclude**: Only exclude elements that interfere with visualization
4. **Use semantic class names**: Combine `ruio-exclude` with descriptive class names for clarity

## Need More Configuration?

If you need configuration options not listed here, please:

1. Check the [GitHub issues](https://github.com/gary-rivera/ruio/issues) to see if it's been requested
2. Open a new issue describing your use case
3. Contribute! See the [Contributing Guide](CONTRIBUTING.md)
