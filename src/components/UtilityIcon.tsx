import React from 'react'
import { useBorderDebugger } from '@context/BorderDebuggerContext'

const UtilityIcon: React.FC = () => {
  const { bordersEnabled, setBordersEnabled } = useBorderDebugger()

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: bordersEnabled ? 'lightgreen' : 'lightcoral',
        padding: '10px',
        cursor: 'pointer',
      }}
      onClick={() => setBordersEnabled(!bordersEnabled)}
      title="Toggle Border Debugger"
    >
      🛠️
    </div>
  )
}

export default UtilityIcon
