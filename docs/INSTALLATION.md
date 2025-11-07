# Installation

## Package Managers

You can install ruio using your preferred package manager:

```bash
# npm
npm install ruio

# yarn
yarn add ruio

# bun
bun add ruio
```

## Requirements

- **React**: 16.8+ (hooks support required)
- **Node.js**: 14+ recommended
- **TypeScript**: 4.0+ (optional, but types are included)

## TypeScript Setup

ruio is written in TypeScript and includes type definitions out of the box. No additional `@types` package is needed.

```typescript
// Types are automatically available
import RuioContextProvider from 'ruio'
import { useRuioContext } from 'ruio'
```

## Verification

After installation, verify the package is installed correctly:

```bash
# Check installed version
npm list ruio

# Or check package.json
cat package.json | grep ruio
```

## Root Element Detection

ruio automatically detects your application's root element using common patterns. It tries to find elements in this order:

1. User's saved selection (from previous session via localStorage)
2. Custom `defaultRootSelector` prop (if provided)
3. `#root` (most common in React apps)
4. `#app` (alternative common pattern)
5. `[data-reactroot]` (older React versions)
6. `body > div:first-child` (universal fallback)

### Standard Setup

Most React apps work out of the box with no configuration:

```html
<!-- index.html -->
<div id="root"></div>
```

### Custom Setup

For non-standard app structures, pass the `defaultRootSelector` prop:

```typescript
import RuioContextProvider from 'ruio'

function App() {
  return (
    <RuioContextProvider defaultRootSelector=".main-app">
      <div className="main-app">
        {/* Your components */}
      </div>
    </RuioContextProvider>
  )
}
```

## Troubleshooting

### Peer Dependency Warnings

If you see peer dependency warnings, ensure you have React installed:

```bash
npm install react react-dom
```

### Version Conflicts

If you encounter version conflicts with React:

1. Check your React version: `npm list react`
2. Ensure React is 16.8 or higher
3. Update React if needed: `npm install react@latest react-dom@latest`

### Module Not Found

If you get "Module not found" errors:

1. Clear your package manager cache:

   ```bash
   npm cache clean --force
   # or
   yarn cache clean
   ```

2. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Root Element Not Found

If you see a console warning about not finding a root element:

1. **Check your HTML**: Ensure you have a root element with `id="root"` or `id="app"`
2. **Use custom selector**: Pass the `defaultRootSelector` prop with your actual root element's selector
3. **Use element selection mode**: Click the crosshair icon in the ruio UI to manually select a root element

```typescript
// Example with custom selector
<RuioContextProvider defaultRootSelector="#my-app">
  <div id="my-app">
    {/* Your app */}
  </div>
</RuioContextProvider>
```

## Next Steps

Once installed, head over to the [Usage Guide](USAGE.md) to get started with ruio.
