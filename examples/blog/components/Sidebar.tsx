import React from 'react'

const Sidebar: React.FC = () => {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Author Card */}
      <div
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#1f2937' }}>
          About the Author
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          />
          <div>
            <div style={{ fontWeight: 'bold', color: '#1f2937' }}>Jane Developer</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Senior Engineer</div>
          </div>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
          Passionate about React, TypeScript, and developer tooling. Writing about web development
          for 5+ years.
        </p>
      </div>

      {/* Related Posts */}
      <div
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#1f2937' }}>
          Related Posts
        </h3>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li
            style={{
              paddingBottom: '1rem',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <a href="#" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
              React Hooks Deep Dive
            </a>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Oct 28, 2025
            </div>
          </li>
          <li
            style={{
              paddingBottom: '1rem',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <a href="#" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
              Building Custom Dev Tools
            </a>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Oct 15, 2025
            </div>
          </li>
          <li>
            <a href="#" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
              TypeScript Best Practices
            </a>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Oct 1, 2025
            </div>
          </li>
        </ul>
      </div>

      {/* Newsletter Signup */}
      <div
        className="ruio-exclude"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1.5rem',
          borderRadius: '8px',
          color: 'white',
        }}
      >
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Stay Updated</h3>
        <p style={{ fontSize: '0.875rem', margin: '0 0 1rem 0', opacity: 0.9 }}>
          Get the latest posts delivered right to your inbox.
        </p>
        <input
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
