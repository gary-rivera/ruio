import React from 'react'
import { useRuioContext } from '@context/RuioContextProvider'

const ControlPanel: React.FC = () => {
  const { depth, setDepth, ruioEnabled, setRuioEnabled, toggleElementSelectionMode } = useRuioContext()

  const handleDepthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepth(parseInt(event.target.value, 10))
  }

  return (
    <div
      data-testid="ruio-control-panel"
      className="ruio-exclude"
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
      <label className="ruio-exclude">
        Depth:
        <input
          className="ruio-exclude"
          type="number"
          value={depth}
          onChange={handleDepthChange}
          min="1"
          max="10"
        />
      </label>

      <div className="ruio-exclude">
        <button className="ruio-exclude" onClick={toggleElementSelectionMode} disabled={!ruioEnabled}>
          Select Element
        </button>
        {/* TODO: remove this button, its redundant with the icon */}
        <button onClick={() => setRuioEnabled(!ruioEnabled)}>
          {ruioEnabled ? 'Disable Borders' : 'Enable Borders'}
        </button>
      </div>
    </div>
  )
}

export default ControlPanel
