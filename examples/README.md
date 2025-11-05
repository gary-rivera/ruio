# Ruio Examples

Example applications demonstrating how to use ruio with different frameworks and patterns.

## Available Examples

### Vite Minimal (`./vite`)

**Default example** - The quickest way to get started with ruio.

A minimal Vite + React setup showing basic ruio integration. Perfect for understanding the fundamentals.

**What you'll learn:**
- How to wrap your app with `RuioWrapper`
- Using the ruio toggle button
- Element selection and depth control
- Basic component visualization

**To run:**
```bash
npm run dev
```

Opens http://localhost:5173 with the minimal example.

---

### Blog Layout (`./blog`)

A realistic blog post page demonstrating ruio's capabilities in a complex, real-world UI.

**Features demonstrated:**
- Complete blog page (header, content, sidebar, comments, footer)
- Deep nesting (comments with nested replies)
- Recursive components
- Multiple layout strategies (grid, flexbox, horizontal, vertical)
- Element exclusion using `ruio-exclude` class
- Component depth visualization

**To run:**
```bash
# Edit index.html line 10 to point to /examples/blog/main.tsx
npm run dev
```

**What you'll see:**
- Professional blog layout with realistic styling
- Nested comment threads (3+ levels deep)
- Various component patterns and layouts
- Newsletter signup excluded from ruio styling

---

## Coming Soon

### Next.js Example (`./nextjs`)

Integration example for Next.js applications (planned).

## Creating Your Own Example

1. Create a new directory: `examples/your-example-name/`
2. Add your components and App.tsx
3. Add a main.tsx entry point
4. Update `index.html` or vite config to point to your example
5. Document your example here

## Structure

Each example should follow this structure:

```
examples/
  └── your-example/
      ├── components/          # Example-specific components
      ├── App.tsx             # Main app component
      ├── main.tsx            # Entry point
      └── README.md           # Example-specific documentation (optional)
```
