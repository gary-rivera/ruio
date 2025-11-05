# API Reference

This document provides detailed information about the **ruio** API, including components, hooks, and configuration options.

## Table of Contents

- [RuioContextProvider (RuioWrapper)](#ruiocontextprovider-ruiowrapper)
- [useRuioContext Hook](#useruiocontext-hook)
- [Element Exclusion](#element-exclusion)
- [Environment Detection](#environment-detection)

---

## RuioContextProvider (RuioWrapper)

The main component that wraps your React application and provides ruio functionality.

### Import

```typescript
import RuioContextProvider from 'ruio'
```

**Alias:** Also exported as `RuioWrapper` (same component, different name).

### Usage

```typescript
import RuioContextProvider from 'ruio'

function App() {
  return (
    <RuioContextProvider>
      {/* Your application components */}
    </RuioContextProvider>
  )
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Your application components |

### Behavior

- Automatically detects development vs. production environment
- Only renders the ruio UI toggle in development mode (`process.env.NODE_ENV !== 'production'`)
- Creates a portal for the ruio UI controls to avoid CSS conflicts
- Persists settings (enabled state, root element) in `localStorage`

---

## useRuioContext Hook

A React hook that provides access to ruio's internal state and controls. This is primarily for advanced use cases.

### Import

```typescript
import { useRuioContext } from 'ruio'
```

### Usage

```typescript
import { useRuioContext } from 'ruio'

function CustomComponent() {
  const {
    ruioEnabled,
    setRuioEnabled,
    depth,
    setDepth,
    rootElement,
    isElementSelectionModeActive,
    toggleElementSelectionMode,
    currentColorPalette,
    setCurrentColorPalette,
  } = useRuioContext()

  // Use ruio state and controls
}
```

### Returns

The hook returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `ruioEnabled` | `boolean` | Whether ruio visualization is currently enabled |
| `setRuioEnabled` | `React.Dispatch<boolean>` | Toggle ruio on/off |
| `depth` | `number` | Current UI depth for border visualization |
| `setDepth` | `React.Dispatch<number>` | Set the visualization depth |
| `rootElement` | `HTMLElement \| null` | Currently selected root element |
| `isElementSelectionModeActive` | `boolean` | Whether element selection mode is active |
| `setIsElementSelectionModeActive` | `React.Dispatch<boolean>` | Control element selection mode |
| `toggleElementSelectionMode` | `() => void` | Toggle element selection mode |
| `currentColorPalette` | `string` | Current color palette/theme key |
| `setCurrentColorPalette` | `React.Dispatch<string>` | Change the color palette |

### Important Notes

- This hook must be used within a component that is a child of `RuioContextProvider`
- Throws an error if used outside of the provider context
- Most users won't need this hook; it's primarily for advanced customization

---

## Element Exclusion

You can exclude specific elements and their descendants from ruio's border visualization.

### Usage

Add the `ruio-exclude` class to any element you want to exclude:

```html
<div className="ruio-exclude">
  {/* This content and all its descendants will be excluded from ruio */}
</div>
```

### Behavior

- Elements with `ruio-exclude` class are completely ignored by ruio
- All descendant elements are also excluded (inclusive exclusion)
- The ruio UI controls automatically have this class applied
- Useful for:
  - Modal overlays
  - Fixed navigation bars
  - Third-party widgets
  - Any elements that shouldn't be visualized

---

## Environment Detection

ruio automatically detects the environment and adjusts its behavior:

### Development Mode

- Toggle button is visible
- Full ruio functionality enabled
- Settings modal accessible
- Element selection mode available

### Production Mode

- Toggle button is hidden
- Minimal overhead
- No UI controls rendered
- Safe to include in production builds

### How It Works

ruio checks `process.env.NODE_ENV` and only renders UI controls when the value is not `'production'`.

---

## LocalStorage Persistence

ruio automatically persists certain settings in `localStorage`:

| Key | Value Type | Description |
|-----|------------|-------------|
| `ruio_enabled` | `boolean` | Whether ruio is enabled |
| `ruio_root_selector` | `string` | CSS selector for the root element |

These values are automatically restored on page refresh, providing a seamless developer experience.

---

## TypeScript Support

ruio is written in TypeScript and includes full type definitions. No additional `@types` package is required.

### Type Definitions

```typescript
interface RuioContextProps {
  ruioEnabled: boolean
  setRuioEnabled: React.Dispatch<React.SetStateAction<boolean>>
  depth: number
  setDepth: React.Dispatch<React.SetStateAction<number>>
  rootElement: HTMLElement | null
  isElementSelectionModeActive: boolean
  setIsElementSelectionModeActive: React.Dispatch<React.SetStateAction<boolean>>
  toggleElementSelectionMode: () => void
  currentColorPalette: string
  setCurrentColorPalette: React.Dispatch<React.SetStateAction<string>>
}
```

---

## Examples

### Basic Setup

```typescript
// App.tsx
import RuioContextProvider from 'ruio'

function App() {
  return (
    <RuioContextProvider>
      <YourApp />
    </RuioContextProvider>
  )
}
```

### Excluding Elements

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

### Advanced: Custom Controls

```typescript
import { useRuioContext } from 'ruio'

function CustomRuioControls() {
  const { ruioEnabled, setRuioEnabled, depth, setDepth } = useRuioContext()

  return (
    <div className="custom-controls">
      <button onClick={() => setRuioEnabled(!ruioEnabled)}>
        {ruioEnabled ? 'Disable' : 'Enable'} Ruio
      </button>
      <input
        type="range"
        min="1"
        max="10"
        value={depth}
        onChange={(e) => setDepth(Number(e.target.value))}
      />
    </div>
  )
}
```

---

## Questions or Issues?

If you have questions about the API or encounter issues, please:

1. Check the [README](../README.md) for general usage information
2. Review the [examples](../README.md#usage) in the documentation
3. Open an issue on [GitHub](https://github.com/gary-rivera/ruio/issues)
