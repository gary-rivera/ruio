import React from 'react'
import ChildComponent from './ChildComponent'

const ParentComponent: React.FC = () => {
  return (
    <div
      className="ruio-dummy"
      style={{ padding: '20px', background: 'gray', border: '1px solid white' }}
    >
      <h1>Parent Component</h1>
      <p>This is the parent component.</p>
      <p className="ruio-exclude">This should not get styles applied, since its manually exlcuded.</p>
      <ChildComponent />
      <ChildComponent />
      <ChildComponent />
      <button>Click Me</button>
    </div>
  )
}

export default ParentComponent
