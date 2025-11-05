# Blog Layout Example

A realistic blog post layout demonstrating ruio's component visualization capabilities in a complex UI.

## What This Example Shows

This example creates a complete blog post page with:

### Component Structure

```
App
├── Header
│   └── Navigation (list of nav items)
├── Main Layout
│   ├── BlogPost
│   │   ├── Article Header (title, metadata)
│   │   ├── Content Sections
│   │   │   └── Tip Callout
│   │   └── Tags Footer
│   └── Sidebar
│       ├── Author Card
│       ├── Related Posts List
│       └── Newsletter Signup (ruio-exclude)
├── CommentsSection
│   └── Comments (with nested replies)
└── Footer
    └── Footer Links Grid
```

## Key Features Demonstrated

1. **Horizontal Layouts**: Navigation bar with multiple items
2. **Deep Nesting**: Comments with replies (recursive components)
3. **Repeated Components**: Navigation items, related posts, comments
4. **Grid Layouts**: Two-column main layout, footer grid
5. **Element Exclusion**: Newsletter signup uses `ruio-exclude` class
6. **Common UI**: Blog layout developers will recognize

## How to Use

1. Run the dev server:

   ```bash
   npm run dev
   ```

2. Open http://localhost:5173

3. Toggle ruio to see the component structure:
   - Click the ruio toggle button
   - Hover over different sections to highlight them
   - Click to select a new root element
   - Adjust depth to traverse deeper into nested components

## Component Files

- `Header.tsx` - Top navigation
- `BlogPost.tsx` - Main article content
- `Sidebar.tsx` - Author card, related posts, newsletter
- `Comment.tsx` - Reusable comment component (recursive)
- `CommentsSection.tsx` - Comments container
- `Footer.tsx` - Site footer with links
