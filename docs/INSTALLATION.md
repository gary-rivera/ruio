# Installation

## Package Managers

You can install ruio using your preferred package manager:

### npm

```bash
npm install ruio
```

### Yarn

```bash
yarn add ruio
```

### Bun

```bash
bun add ruio
```

### pnpm

```bash
pnpm add ruio
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

## Next Steps

Once installed, head over to the [Usage Guide](USAGE.md) to get started with ruio.
