import React from 'react'
import GrandChildComponent from './GrandchildComponent'

const ChildComponent: React.FC = () => {
  return (
    <div
      style={{
        padding: '20px',
        background: 'darkgray',
        borderRadius: '25px',
        border: '1px solid black',
      }}
    >
      <h2>Child Component</h2>
      <p>This is the child component.</p>
      <GrandChildComponent />
      <GrandChildComponent />
    </div>
  )
}

export default ChildComponent
