import React from 'react'

const GrandChildComponent: React.FC = () => {
  return (
    <div style={{ padding: '20px', background: 'lightgray' }}>
      <h3>Grandchild Component</h3>
      <p>This is the grandchild component, nested inside the child component.</p>
    </div>
  )
}

export default GrandChildComponent
