import React from 'react'
import RuioWrapper from '../../src/components/RuioWrapper'
import Header from './components/Header'
import BlogPost from './components/BlogPost'
import Sidebar from './components/Sidebar'
import CommentsSection from './components/CommentsSection'
import Footer from './components/Footer'

const App: React.FC = () => {
  return (
    <RuioWrapper>
      <div
        id="app-container"
        className="blog-layout"
        style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#f9fafb' }}
      >
        <Header />

        <main
          id="main-content"
          className="content-grid"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: '2rem',
          }}
        >
          <div
            className="primary-column"
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <BlogPost />
            <CommentsSection />
          </div>

          <Sidebar />
        </main>

        <Footer />
      </div>
    </RuioWrapper>
  )
}

export default App
