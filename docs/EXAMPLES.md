# Examples

This guide walks you through the example projects included in the ruio repository.

## Available Examples

The [`/examples`](../examples/) directory contains working demonstrations of ruio:

- **vite-simple/** - Minimal starter showing basic setup
- **blog/** - Realistic blog layout with nested components

## Running the Examples

### Prerequisites

1. Clone the ruio repository:

   ```bash
   git clone https://github.com/gary-rivera/ruio.git
   cd ruio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Starting an Example

Run the development server:

```bash
npm run dev
```

This will start Vite's dev server and you can explore the examples in your browser.

## Example 1: vite-simple

**Location**: `examples/vite-simple/`

### What It Demonstrates

This minimal example shows:

- Basic ruio setup with `RuioContextProvider`
- Simple component hierarchy
- How ruio visualizes nested components

### Code Structure

```typescript
// examples/vite-simple/App.tsx
import RuioContextProvider from 'ruio'
import SimpleComponent from './components/SimpleComponent'

function App() {
  return (
    <RuioContextProvider>
      <div className="app">
        <header>
          <h1>Ruio Simple Example</h1>
        </header>
        <main>
          <SimpleComponent />
        </main>
      </div>
    </RuioContextProvider>
  )
}
```

### Try It Out

1. Open the example in your browser
2. Click the ruio toggle button
3. Hover over different elements
4. Click the crosshair icon to enter selection mode
5. Click any element to make it the root

## Example 2: blog

**Location**: `examples/blog/`

### What It Demonstrates

This realistic example shows:

- Complex, nested component structure
- Real-world layout patterns (header, sidebar, content, footer)
- Multiple levels of component nesting
- Using `ruio-exclude` for UI elements

### Code Structure

```typescript
// examples/blog/App.tsx
import RuioContextProvider from 'ruio'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import BlogPost from './components/BlogPost'
import Footer from './components/Footer'

function App() {
  return (
    <RuioContextProvider>
      <div className="blog-layout">
        <Header />
        <div className="content-wrapper">
          <Sidebar />
          <main>
            <BlogPost />
            <BlogPost />
          </main>
        </div>
        <Footer />
      </div>
    </RuioContextProvider>
  )
}
```

### Component Hierarchy

```
App
├── Header
│   ├── Logo
│   └── Navigation
├── ContentWrapper
│   ├── Sidebar
│   │   ├── Categories
│   │   └── RecentPosts
│   └── Main
│       ├── BlogPost
│       │   ├── Title
│       │   ├── Meta
│       │   └── Content
│       └── BlogPost
│           ├── Title
│           ├── Meta
│           └── Content
└── Footer
    ├── SocialLinks
    └── Copyright
```

### Try It Out

1. Enable ruio with the toggle
2. Notice how different nesting levels have different colors
3. Use element selection mode to focus on:
   - Just the Header
   - A single BlogPost
   - The Sidebar
4. Observe how complex layouts become easier to understand

## Real-World Example

For a production example of ruio in action, check out this [calculator app](https://gary-rivera.github.io/calculator/).

### What It Shows

- ruio integrated into a real application
- How ruio helps debug calculator layout
- Complex button grid visualization
- State management with visual feedback

## Creating Your Own Example

Want to test ruio in your own project? Here's a quick template:

```typescript
// your-app/App.tsx
import RuioContextProvider from 'ruio'
import YourComponents from './components'

function App() {
  return (
    <RuioContextProvider>
      <YourComponents />
    </RuioContextProvider>
  )
}

export default App
```

## Common Patterns

### Pattern 1: Modal with Exclusion

```typescript
function App() {
  return (
    <RuioContextProvider>
      <YourApp />
      {/* Exclude modal from visualization */}
      <Modal className="ruio-exclude">
        <ModalContent />
      </Modal>
    </RuioContextProvider>
  )
}
```

### Pattern 2: Conditional Rendering

```typescript
function App() {
  const [showComponent, setShowComponent] = useState(false)

  return (
    <RuioContextProvider>
      <button onClick={() => setShowComponent(!showComponent)}>
        Toggle
      </button>
      {/* Watch borders appear/disappear */}
      {showComponent && <DynamicComponent />}
    </RuioContextProvider>
  )
}
```

### Pattern 3: List Rendering

```typescript
function App() {
  const items = ['Item 1', 'Item 2', 'Item 3']

  return (
    <RuioContextProvider>
      <ul>
        {/* Visualize each list item's hierarchy */}
        {items.map(item => (
          <li key={item}>
            <Card title={item} />
          </li>
        ))}
      </ul>
    </RuioContextProvider>
  )
}
```

## Tips for Examples

1. **Start Simple**: Begin with the `vite-simple` example to understand basics
2. **Graduate to Complex**: Move to the `blog` example for real-world patterns
3. **Experiment**: Modify the examples to test different scenarios
4. **Use Selection Mode**: Practice using element selection to focus on specific components
5. **Exclude Strategically**: Try adding `ruio-exclude` to different elements to see the effect

## Troubleshooting Examples

### Example Won't Start

```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Ruio Not Appearing

- Check that `NODE_ENV` is not set to `'production'`
- Verify `RuioContextProvider` is wrapping your components
- Check browser console for errors

### Borders Not Showing

- Make sure ruio is enabled (click the toggle)
- Check that elements don't have `ruio-exclude` class
- Verify your components are descendants of `RuioContextProvider`

## Next Steps

- Read the [Usage Guide](USAGE.md) for detailed feature explanations
- Check the [API Reference](API.md) for technical documentation
- Review [Configuration](CONFIGURATION.md) for customization options
