import React, { useEffect } from 'react'
import { useRuioContext } from '../context/RuioContextProvider'
import { applyBorders } from '../utils/applyBorders'

type UtilityIconProps = {
  selector?: string // TODO: stricter typing of either element tag name or selector id/class
}

const UtilityIcon: React.FC<UtilityIconProps> = ({ selector = '#root' }) => {
  const { bordersEnabled, setBordersEnabled, depth } = useRuioContext()

  useEffect(() => {
    const rootElement = document.querySelector(selector)

    if (rootElement) applyBorders(rootElement as HTMLElement, depth, bordersEnabled)
  }, [bordersEnabled, depth])

  return (
    <div
      className="ruio-exclude"
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
