import React from 'react'

const Welcome: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#667eea', marginBottom: '1rem' }}>Welcome to ruio!</h1>
      <p style={{ lineHeight: '1.8', color: '#4b5563', marginBottom: '1rem' }}>
        This is a minimal Vite + React example showing how to use ruio in your application.
      </p>
      <div
        style={{
          background: '#f3f4f6',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1rem',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1f2937' }}>
          Getting Started
        </h2>
        <ol style={{ lineHeight: '1.8', color: '#4b5563', paddingLeft: '1.5rem' }}>
          <li>Look for the ruio toggle button in the corner</li>
          <li>Click it to enable component visualization</li>
          <li>Hover over elements to see them highlighted</li>
          <li>Click an element to make it the new root</li>
        </ol>
      </div>
      <div
        style={{
          background: '#dbeafe',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #93c5fd',
        }}
      >
        <p style={{ margin: 0, color: '#1e40af' }}>
          💡 <strong>Tip:</strong> Try adjusting the depth to explore nested component structures!
        </p>
      </div>
    </div>
  )
}

export default Welcome
