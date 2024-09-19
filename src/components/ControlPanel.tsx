import React from 'react'
import { useRuioContext } from '@context/RuioContextProvider'

const ControlPanel: React.FC = () => {
  const { depth, setDepth, ruioEnabled, setRuioEnabled, isElementSelectionActive, selectElementMode } =
    useRuioContext()

  const handleDepthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepth(parseInt(event.target.value, 10)) // Adjust depth dynamically
  }

  return (
    <div
      data-testid="control-panel"
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
        <button className="ruio-exclude" onClick={selectElementMode} disabled={!ruioEnabled}>
          Select Element
        </button>
        <button onClick={() => setRuioEnabled(!ruioEnabled)}>
          {ruioEnabled ? 'Disable Borders' : 'Enable Borders'}
        </button>
      </div>
    </div>
  )
}

export default ControlPanel
