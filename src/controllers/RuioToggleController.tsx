import React, { forwardRef, useRef, useEffect } from 'react'
import '@styles/RuioToggleController.css'
import RuioLogoIcon from '@assets/RuioLogoIcon'

import { useRuioContext } from '@root/context/RuioContextProvider'
import { applyBorders } from '@utils/applyBorders'

import '@styles/ControlPanel.css'
import SettingsIcon from '@assets/SettingsIcon'
import ToggleElementSelectionModeIcon from '@assets/ToggleElementSelectionModeIcon'

function RuioToggleController() {
  const { ruioEnabled, setRuioEnabled, toggleElementSelectionMode } = useRuioContext()

  return (
    <div
      className="ruio-toggle-logo"
      onClick={() => {
        setRuioEnabled(!ruioEnabled)
        console.log('RuioToggleController clicked', !ruioEnabled)
      }}
    >
      {/* TODO: should this actually remain its own component? may be over complicating things */}
      <RuioLogoIcon />
    </div>
  )
}

export default RuioToggleController
