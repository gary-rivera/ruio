import React from 'react'

const Sidebar: React.FC = () => {
  return (
    <aside id="sidebar" className="sidebar-column widget-area" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Author Card */}
      <div
        id="author-card"
        className="widget author-widget card"
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h3 className="widget-title" style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#1f2937' }}>
          About the Author
        </h3>
        <div className="author-info profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div
            className="avatar gradient-bg"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          />
          <div className="author-details">
            <div className="author-name" style={{ fontWeight: 'bold', color: '#1f2937' }}>Jane Developer</div>
            <div className="author-role" style={{ fontSize: '0.875rem', color: '#6b7280' }}>Senior Engineer</div>
          </div>
        </div>
        <p className="author-bio" style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
          Passionate about React, TypeScript, and developer tooling. Writing about web development
          for 5+ years.
        </p>
      </div>

      {/* Related Posts */}
      <div
        id="related-posts"
        className="widget related-posts-widget card"
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h3 className="widget-title" style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#1f2937' }}>
          Related Posts
        </h3>
        <ul className="post-list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li
            className="post-item"
            style={{
              paddingBottom: '1rem',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <a href="#" className="post-link" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
              React Hooks Deep Dive
            </a>
            <div className="post-date" style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Oct 28, 2025
            </div>
          </li>
          <li
            className="post-item"
            style={{
              paddingBottom: '1rem',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <a href="#" className="post-link" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
              Building Custom Dev Tools
            </a>
            <div className="post-date" style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Oct 15, 2025
            </div>
          </li>
          <li className="post-item">
            <a href="#" className="post-link" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
              TypeScript Best Practices
            </a>
            <div className="post-date" style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Oct 1, 2025
            </div>
          </li>
        </ul>
      </div>

      {/* Newsletter Signup */}
      <div
        id="newsletter-widget"
        className="ruio-exclude widget newsletter-widget gradient-bg"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1.5rem',
          borderRadius: '8px',
          color: 'white',
        }}
      >
        <h3 className="widget-title" style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Stay Updated</h3>
        <p className="widget-description" style={{ fontSize: '0.875rem', margin: '0 0 1rem 0', opacity: 0.9 }}>
          Get the latest posts delivered right to your inbox.
        </p>
        <input
          id="email-input"
          className="email-field input-field"
          type="email"
          placeholder="your@email.com"
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: 'none',
            marginBottom: '0.5rem',
          }}
        />
        <button
          id="subscribe-btn"
          className="submit-button cta-button"
          style={{
            width: '100%',
            padding: '0.5rem',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Subscribe
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
