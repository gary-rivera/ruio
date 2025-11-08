# Ruio Examples

Example applications demonstrating how to use ruio with different frameworks and patterns.

## Available Examples

### Vite Simple (`./vite-simple`)

**Default example** - The quickest way to get started with ruio.

A minimal Vite + React setup showing basic ruio integration. Perfect for understanding the fundamentals.

**To run:**

```bash
npm run dev
# or explicitly:
npm run dev:vite-simple
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
npm run dev:blog
```

---

## Creating Your Own Example

1. Create a new directory: `examples/your-example-name/`
2. Add your components and App.tsx
3. Add a main.tsx entry point (React 18+ root setup)
4. Create an `index.html` file in your example directory:
   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>ruio - Your Example Name</title>
     </head>
     <body>
       <div id="root"></div>
       <script type="module" src="/examples/your-example-name/main.tsx"></script>
     </body>
   </html>
   ```
5. Add an npm script to `package.json`:
   ```json
   "dev:your-example-name": "EXAMPLE=your-example-name vite"
   ```
6. Document your example here in this README

## Structure

Each example follows this structure:

```
examples/
  └── your-example/
      ├── components/          # Example-specific components
      ├── App.tsx             # Main app component
      ├── main.tsx            # Entry point
      ├── index.html          # HTML entry point
      └── README.md           # Example-specific documentation (optional)
```

## How It Works

The project uses Vite's flexible configuration to support multiple examples:

- Each example has its own `index.html` in its directory
- The `vite.config.ts` reads the `EXAMPLE` environment variable to set the root directory
- npm scripts (e.g., `npm run dev:blog`) set the `EXAMPLE` variable for each example
- The default `npm run dev` runs the `vite-simple` example

This keeps the project root clean while allowing unlimited examples to be added easily.
