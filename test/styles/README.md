# CSS Regression Tests

## Purpose

These tests capture the current UI state to detect any unintended visual changes during CSS refactoring.

## Test Files

1. **css-regression.test.tsx** - Captures computed CSS styles for key components
2. **html-structure.test.tsx** - Captures rendered HTML structure and className attributes

## Usage

### Before CSS Refactoring

Baseline snapshots have been created. Commit these to your repo:

```bash
git add test/styles/__snapshots__/
git commit -m "test: add CSS regression test baselines"
```

### During/After CSS Refactoring

Run the tests to detect changes:

```bash
npm run test:ci -- test/styles/
```

#### If tests fail:

1. **Review the diff** - Vitest will show what changed
2. **Verify changes are intentional** - Check if the changes match your refactoring goals
3. **Update snapshots if correct**:
   ```bash
   npm run test -- test/styles/ -u
   ```

## What These Tests Catch

- Changes to DOM structure
- Changes to CSS class names
- Changes to computed CSS properties
- Accidentally removed elements
- Changes to component rendering logic

## Limitations

- CSS modules don't fully render in jsdom, so some computed styles may be empty
- Tests focus on structural integrity and class names rather than pixel-perfect rendering
- For visual regression testing, consider tools like Percy or Chromatic
