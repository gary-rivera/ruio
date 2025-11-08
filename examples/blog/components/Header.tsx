import React from 'react'

const Header: React.FC = () => {
  return (
    <header
      id="site-header"
      className="header gradient-bg"
      style={{
        padding: '1.5rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div className="header-inner container">
        <h1 id="site-title" className="logo" style={{ margin: 0, fontSize: '1.5rem' }}>DevBlog</h1>
        <nav id="main-nav" className="navigation" aria-label="Main navigation">
          <ul className="nav-list" style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
            <li className="nav-item">
              <a href="#" className="nav-link active" style={{ color: 'white', textDecoration: 'none' }}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" style={{ color: 'white', textDecoration: 'none' }}>
                Articles
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" style={{ color: 'white', textDecoration: 'none' }}>
                About
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" style={{ color: 'white', textDecoration: 'none' }}>
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
