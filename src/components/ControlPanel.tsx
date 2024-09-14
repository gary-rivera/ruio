import React from 'react'
import { useBorderDebugger } from '../context/BorderDebuggerContext'

const ControlPanel: React.FC = () => {
  const { depth, setDepth, bordersEnabled, setBordersEnabled, selectElementMode } = useBorderDebugger()

  const handleDepthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepth(parseInt(event.target.value, 10)) // Adjust depth dynamically
  }

  return (
    <div
      className="no-border"
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid black',
      }}
    >
      <label>
        Depth:
        <input
          type="number"
          value={depth}
          onChange={handleDepthChange}
          min="1"
          max="10" // Adjusted to your max depth
        />
      </label>

      <div>
        <button className="no-border" onClick={selectElementMode} disabled={!bordersEnabled}>
          Select Element
        </button>
        <button onClick={() => setBordersEnabled(!bordersEnabled)}>
          {bordersEnabled ? 'Disable Borders' : 'Enable Borders'}
        </button>
      </div>
    </div>
  )
}

export default ControlPanel
