# Usage Guide

## Quick Start

To get started with ruio, wrap your application in the `RuioContextProvider`:

```typescript
// App.tsx
import RuioContextProvider from 'ruio'

function App() {
  return (
    <RuioContextProvider>
      {/* Your App Components Here */}
    </RuioContextProvider>
  )
}

export default App
```

That's it! ruio will automatically detect your development environment and render the toggle button.

## How It Works

### Development Environment Detection

ruio only displays its UI controls in development mode. It checks `process.env.NODE_ENV` and will:

- **Development**: Show the ruio toggle button and all features
- **Production**: Hide all UI controls (safe to include in production builds)

### The Toggle Button

Once your app is running in development mode, you'll see the ruio toggle button in the corner of your screen.

**Click the toggle button to:**
- Enable/disable border visualization
- Access element selection mode
- View the settings panel

### Visualizing Components

When ruio is enabled:

1. **Automatic Border Styling**: All React elements in your component tree will receive colored borders based on their depth
2. **Depth-Based Colors**: Different nesting levels get different colors, making it easy to see component hierarchy
3. **Real-Time Updates**: Borders update as you interact with your app

### Element Selection Mode

Click the crosshair icon to enter **Element Selection Mode**:

1. **Hover to Highlight**: Move your mouse over elements to see them highlighted (similar to Chrome DevTools)
2. **Click to Select Root**: Click any element to make it the new root
3. **Focused Visualization**: Only the selected element and its descendants will show borders

This is useful for:
- Focusing on specific parts of your UI
- Debugging deeply nested components
- Isolating layout issues in complex component trees

### Persisted State

ruio automatically saves your settings to `localStorage`:

- **Enabled State**: Whether ruio is on or off
- **Selected Root**: Which element is currently selected as root

These settings persist across page refreshes, so you don't have to reconfigure ruio every time.

## Advanced Usage

### Using the Context Hook

For advanced customization, you can access ruio's internal state using the `useRuioContext` hook:

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

  // Custom logic using ruio state
  return (
    <div>
      <button onClick={() => setRuioEnabled(!ruioEnabled)}>
        Toggle Ruio
      </button>
    </div>
  )
}
```

**Available Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `ruioEnabled` | `boolean` | Whether ruio is currently enabled |
| `setRuioEnabled` | `function` | Toggle ruio on/off |
| `depth` | `number` | Current visualization depth |
| `setDepth` | `function` | Set visualization depth |
| `rootElement` | `HTMLElement \| null` | Currently selected root element |
| `isElementSelectionModeActive` | `boolean` | Whether selection mode is active |
| `toggleElementSelectionMode` | `function` | Toggle selection mode |
| `currentColorPalette` | `string` | Current color palette key |
| `setCurrentColorPalette` | `function` | Change color palette |

### Building Custom Controls

You can build your own ruio controls using the context hook:

```typescript
import { useRuioContext } from 'ruio'

function MyCustomControls() {
  const { ruioEnabled, setRuioEnabled, depth, setDepth } = useRuioContext()

  return (
    <div className="custom-ruio-controls">
      <button onClick={() => setRuioEnabled(!ruioEnabled)}>
        {ruioEnabled ? 'Disable' : 'Enable'} Ruio
      </button>

      <label>
        Depth: {depth}
        <input
          type="range"
          min="1"
          max="10"
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
        />
      </label>
    </div>
  )
}
```

## Common Workflows

### Debugging Layout Issues

1. Enable ruio with the toggle button
2. Use element selection mode to focus on the problematic component
3. Observe the border colors to understand nesting levels
4. Identify unexpected wrapper elements or layout issues

### Understanding Component Hierarchy

1. Enable ruio
2. Navigate through your app
3. Watch how borders update as components mount/unmount
4. Use different colors to quickly identify depth levels

### Refactoring Components

1. Enable ruio before refactoring
2. Make your changes
3. Verify the visual hierarchy matches your expectations
4. Use element selection to test specific component trees

## Tips and Best Practices

- **Exclude UI Elements**: Use `ruio-exclude` on modals, tooltips, and navigation to keep the visualization focused (see [Configuration](CONFIGURATION.md))
- **Reset Root**: Click the home icon to reset the root element back to the document
- **Keyboard Navigation**: Keep the toggle accessible for quick enable/disable (keyboard shortcuts coming soon!)
- **Color Patterns**: Learn the color sequence to quickly identify depth levels

## Next Steps

- Learn about [Configuration options](CONFIGURATION.md)
- Explore the [Examples](EXAMPLES.md)
- Read the [API Reference](API.md) for detailed technical documentation
