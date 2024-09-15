import React from 'react'
import ChildComponent from './ChildComponent'

const ParentComponent: React.FC = () => {
  return (
    <div style={{ padding: '20px', background: 'gray' }}>
      <h1>Parent Component</h1>
      <p>This is the parent component.</p>
      <ChildComponent />
      <ChildComponent />
      <ChildComponent />
      <button>Click Me</button>
    </div>
  )
}

export default ParentComponent
