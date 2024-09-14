import React from 'react'
import { useBorderDebugger } from '../context/BorderDebuggerContext'

const ControlPanel: React.FC = () => {
  const { depth, setDepth } = useBorderDebugger()

  const handleDepthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepth(parseInt(event.target.value, 10))
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: 'darkgray',
        padding: '10px',
        border: '1px solid black',
      }}
    >
      <label>
        Depth:
        <input type="number" value={depth} onChange={handleDepthChange} min="0" max="3" />
      </label>
    </div>
  )
}

export default ControlPanel
