import React, { useEffect } from 'react'
import { useRuioContext } from '../context/RuioContextProvider'
import { applyBorders } from '../utils/applyBorders'
import RuioLogo from './RuioToggleLogo'

type UtilityIconProps = {
  selector?: string // TODO: stricter typing of either element tag name or selector id/class
}

const UtilityIcon: React.FC<UtilityIconProps> = ({ selector = '#root' }) => {
  const { ruioEnabled, setRuioEnabled, depth } = useRuioContext()

  useEffect(() => {
    const rootElement = document.querySelector(selector)

    if (rootElement) applyBorders(rootElement as HTMLElement, depth, ruioEnabled)
  }, [ruioEnabled, depth])

  return (
    <div
      data-testid="ruio-toggle-icon"
      className="ruio-exclude"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '10px',
        cursor: 'pointer',
      }}
      onClick={() => setRuioEnabled(!ruioEnabled)}
    >
      <RuioLogo />
    </div>
  )
}

export default UtilityIcon
