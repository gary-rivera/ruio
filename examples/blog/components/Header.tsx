import React from 'react'

const Header: React.FC = () => {
  return (
    <header
      style={{
        padding: '1.5rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>DevBlog</h1>
        <nav>
          <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
            <li>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                Home
              </a>
            </li>
            <li>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                Articles
              </a>
            </li>
            <li>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                About
              </a>
            </li>
            <li>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
