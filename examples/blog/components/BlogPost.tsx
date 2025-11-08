import React from 'react'

const BlogPost: React.FC = () => {
  return (
    <article
      id="main-article"
      className="blog-post card"
      style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <header className="post-header" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #e5e7eb' }}>
        <h1 className="post-title" style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#1f2937' }}>
          Understanding React Component Hierarchy
        </h1>
        <div className="post-meta metadata" style={{ display: 'flex', gap: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
          <span className="author">By Jane Developer</span>
          <span className="separator">•</span>
          <span className="date">Nov 4, 2025</span>
          <span className="separator">•</span>
          <span className="read-time">5 min read</span>
        </div>
      </header>

      <section className="intro-section content-section" style={{ marginBottom: '1.5rem' }}>
        <p className="paragraph" style={{ lineHeight: '1.8', color: '#374151', marginBottom: '1rem' }}>
          When building React applications, understanding how components nest and communicate is
          crucial for maintainability and debugging. This article explores visualization techniques
          that can help you grasp your app's structure.
        </p>
        <p className="paragraph" style={{ lineHeight: '1.8', color: '#374151', marginBottom: '1rem' }}>
          Component hierarchies can become complex quickly, especially in larger applications. Tools
          that provide visual feedback about your component tree can be invaluable during
          development.
        </p>
      </section>

      <section className="deep-dive-section content-section" style={{ marginBottom: '1.5rem' }}>
        <h2 className="section-heading" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>
          The Challenge of Deep Nesting
        </h2>
        <p className="paragraph" style={{ lineHeight: '1.8', color: '#374151', marginBottom: '1rem' }}>
          As applications grow, components can be nested many levels deep. Each level of nesting
          adds complexity and can make it harder to understand the relationships between different
          parts of your UI.
        </p>
        <div
          id="tip-callout"
          className="callout tip-box"
          style={{
            background: '#f3f4f6',
            padding: '1.5rem',
            borderRadius: '4px',
            borderLeft: '4px solid #667eea',
            margin: '1rem 0',
          }}
        >
          <p className="tip-text" style={{ margin: 0, fontStyle: 'italic', color: '#4b5563' }}>
            💡 Tip: Visualizing your component boundaries can help you identify overly complex
            structures and refactoring opportunities.
          </p>
        </div>
      </section>

      <footer className="post-footer" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
        <div className="tags-container tag-list" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            className="tag tag-react"
            style={{
              background: '#dbeafe',
              color: '#1e40af',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
            }}
          >
            React
          </span>
          <span
            className="tag tag-tools"
            style={{
              background: '#fef3c7',
              color: '#92400e',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
            }}
          >
            Developer Tools
          </span>
          <span
            className="tag tag-tutorial"
            style={{
              background: '#d1fae5',
              color: '#065f46',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
            }}
          >
            Tutorial
          </span>
        </div>
      </footer>
    </article>
  )
}

export default BlogPost
