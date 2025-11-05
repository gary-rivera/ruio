import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: '#1f2937',
        color: '#9ca3af',
        padding: '2rem',
        marginTop: '3rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h4 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1rem' }}>DevBlog</h4>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
            Sharing knowledge about modern web development, React, and developer tools.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '0.875rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                About
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                Archives
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1rem' }}>Connect</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '0.875rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                Twitter
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                GitHub
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid #374151',
          paddingTop: '1rem',
          textAlign: 'center',
          fontSize: '0.875rem',
        }}
      >
        © 2025 DevBlog. Built with React and ruio.
      </div>
    </footer>
  )
}

export default Footer
