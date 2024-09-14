import React, { useEffect } from 'react'
import { useBorderDebugger } from '../context/BorderDebuggerContext'
import { applyBorders } from '../utils/applyBorders'

type UtilityIconProps = {
  selector?: keyof HTMLElementTagNameMap
}

const UtilityIcon: React.FC<UtilityIconProps> = ({ selector = 'body' }) => {
  const { bordersEnabled, setBordersEnabled, depth } = useBorderDebugger()

  useEffect(() => {
    const rootElement = document.querySelector(selector) // Or target a specific root

    if (rootElement) applyBorders(rootElement as HTMLElement, depth, bordersEnabled)
  }, [bordersEnabled, depth])

  return (
    <div
      className="no-border"
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
    >
      🛠️
    </div>
  )
}

export default UtilityIcon
